// In-memory fixed-window limiter. Good enough for a single Node process;
// a multi-instance deployment needs a shared store (e.g. Redis).
const buckets = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 10_000) pruneExpired(now);
    return { ok: true, retryAfterSeconds: 0 };
  }
  bucket.count += 1;
  return {
    ok: bucket.count <= limit,
    retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
  };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Best-effort client IP. Never trust it on its own: clients can send their own
 * X-Forwarded-For, so every limit that matters also has an IP-independent
 * backstop (see enforceLimits callers).
 *
 * - TRUST_PROXY=1 (behind nginx/Apache that sets `X-Real-IP $remote_addr`):
 *   X-Real-IP is used, because the proxy overwrites whatever the client sent.
 * - Otherwise the right-most X-Forwarded-For entry is used: a proxy that
 *   appends ($proxy_add_x_forwarded_for) puts the real peer address there,
 *   whereas the left-most entry is always client-controlled.
 */
export function clientIp(source: Request | Headers, trustProxy = process.env.TRUST_PROXY === "1"): string {
  const headers = source instanceof Headers ? source : source.headers;
  if (trustProxy) {
    const real = headers.get("x-real-ip")?.trim();
    if (real) return real;
  }
  const hops = (headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((hop) => hop.trim())
    .filter(Boolean);
  return hops.at(-1) || "unknown";
}

export interface LimitRule {
  key: string;
  limit: number;
  windowMs: number;
}

/**
 * Applies several limits at once (e.g. per IP + per target + site-wide) and
 * returns the first one that is exceeded, so spoofing the IP alone is not
 * enough to get around them.
 */
export function enforceLimits(rules: LimitRule[], now = Date.now()): RateLimitResult {
  let blocked: RateLimitResult | null = null;
  for (const rule of rules) {
    const result = rateLimit(rule.key, rule.limit, rule.windowMs, now);
    if (!result.ok && (!blocked || result.retryAfterSeconds > blocked.retryAfterSeconds)) blocked = result;
  }
  return blocked ?? { ok: true, retryAfterSeconds: 0 };
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

/** Central place for every public limit, so they are easy to review and tune. */
export const LIMITS = {
  login: (ip: string, email: string): LimitRule[] => [
    { key: `login:ip:${ip}:${email}`, limit: 5, windowMs: 15 * MINUTE },
    // IP-independent: caps password guessing even with a spoofed IP.
    { key: `login:email:${email}`, limit: 10, windowMs: 15 * MINUTE },
  ],
  contact: (ip: string): LimitRule[] => [
    { key: `contact:ip:${ip}`, limit: 5, windowMs: HOUR },
    { key: "contact:all", limit: 30, windowMs: HOUR },
  ],
  comment: (ip: string, slug: string): LimitRule[] => [
    { key: `comment:ip:${ip}`, limit: 5, windowMs: 10 * MINUTE },
    { key: `comment:post:${slug}`, limit: 20, windowMs: 10 * MINUTE },
    { key: "comment:all", limit: 60, windowMs: 10 * MINUTE },
  ],
  like: (ip: string, slug: string): LimitRule[] => [
    { key: `like:ip:${ip}:${slug}`, limit: 1, windowMs: 24 * HOUR },
    { key: `like:post:${slug}`, limit: 100, windowMs: HOUR },
  ],
};
