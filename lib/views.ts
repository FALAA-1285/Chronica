import { rateLimit } from "@/lib/rate-limit";

// Crawlers, link previews and monitoring tools: their hits are not readers.
const BOT_PATTERN = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|curl|wget|python|headless|lighthouse|monitor/i;

export function isBot(userAgent: string | null): boolean {
  return !userAgent || BOT_PATTERN.test(userAgent);
}

/**
 * Whether this page view should increment Post.views: humans only, and at most
 * once per visitor per article per day (refreshes don't inflate "Popular").
 */
export function shouldCountView(postId: string, visitor: string, userAgent: string | null, now = Date.now()): boolean {
  if (isBot(userAgent)) return false;
  return rateLimit(`view:${postId}:${visitor}`, 1, 24 * 60 * 60 * 1000, now).ok;
}
