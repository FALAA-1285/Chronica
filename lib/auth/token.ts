import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  /** Author id */
  sub: string;
  /** Fingerprint of the password hash: changing the password revokes old sessions. */
  pwd: string;
  /** Author.sessionVersion at login: logging out bumps it and revokes old tokens. */
  ver: number;
  /** Expiry, unix seconds */
  exp: number;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to a random string of at least 32 characters.");
  }
  return secret;
}

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

export function passwordFingerprint(passwordHash: string): string {
  return createHash("sha256").update(passwordHash).digest("base64url").slice(0, 16);
}

export function createSessionToken(authorId: string, passwordHash: string, sessionVersion: number, now = Date.now()): string {
  const payload: SessionPayload = {
    sub: authorId,
    pwd: passwordFingerprint(passwordHash),
    ver: sessionVersion,
    exp: Math.floor(now / 1000) + SESSION_TTL_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

/** Returns the payload if the signature is valid and the token has not expired. */
export function readSessionToken(token: string, now = Date.now()): SessionPayload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = Buffer.from(sign(body));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (typeof payload.sub !== "string" || typeof payload.pwd !== "string" || typeof payload.ver !== "number") return null;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < now) return null;
    return payload;
  } catch {
    return null;
  }
}
