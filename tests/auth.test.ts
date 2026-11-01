import { beforeAll, describe, expect, it } from "vitest";
import { hashPassword, isPasswordHash, verifyPassword } from "@/lib/auth/password";
import { createSessionToken, passwordFingerprint, readSessionToken, SESSION_TTL_SECONDS } from "@/lib/auth/token";

beforeAll(() => {
  process.env.SESSION_SECRET = "test-secret-that-is-long-enough-for-hmac-signing";
});

describe("password hashing", () => {
  it("never stores the plaintext and verifies the right password", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(hash).not.toContain("correct horse");
    expect(isPasswordHash(hash)).toBe(true);
    await expect(verifyPassword("correct horse battery staple", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong password", hash)).resolves.toBe(false);
  });

  it("salts every hash", async () => {
    expect(await hashPassword("same")).not.toBe(await hashPassword("same"));
  });

  it("rejects legacy plaintext values instead of comparing them", async () => {
    expect(isPasswordHash("password123")).toBe(false);
    await expect(verifyPassword("password123", "password123")).resolves.toBe(false);
  });
});

describe("session token", () => {
  const hash = "scrypt$16384$8$1$salt$hash";

  it("round-trips a valid token", () => {
    const payload = readSessionToken(createSessionToken("author-1", hash));
    expect(payload?.sub).toBe("author-1");
    expect(payload?.pwd).toBe(passwordFingerprint(hash));
  });

  it("rejects a tampered payload", () => {
    const [, signature] = createSessionToken("author-1", hash).split(".");
    const forged = Buffer.from(JSON.stringify({ sub: "attacker", pwd: "x", exp: 9_999_999_999 })).toString("base64url");
    expect(readSessionToken(`${forged}.${signature}`)).toBeNull();
  });

  it("rejects garbage and expired tokens", () => {
    expect(readSessionToken("not-a-token")).toBeNull();
    const issuedAt = Date.now();
    const token = createSessionToken("author-1", hash, issuedAt);
    expect(readSessionToken(token, issuedAt + (SESSION_TTL_SECONDS + 1) * 1000)).toBeNull();
  });

  it("changes fingerprint when the password changes (revokes old sessions)", () => {
    expect(passwordFingerprint(hash)).not.toBe(passwordFingerprint(`${hash}x`));
  });

  it("refuses to sign without a strong secret", () => {
    const original = process.env.SESSION_SECRET;
    process.env.SESSION_SECRET = "short";
    expect(() => createSessionToken("a", hash)).toThrow(/SESSION_SECRET/);
    process.env.SESSION_SECRET = original;
  });
});
