import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// Format: scrypt$N$r$p$<salt base64url>$<hash base64url>
const N = 16384;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;

function derive(password: string, salt: Buffer, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, options, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

export function isPasswordHash(value: string): boolean {
  return value.startsWith("scrypt$") && value.split("$").length === 6;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, { N, r: R, p: P });
  return ["scrypt", N, R, P, salt.toString("base64url"), key.toString("base64url")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (!isPasswordHash(stored)) return false;
  const [, n, r, p, saltB64, hashB64] = stored.split("$");
  const expected = Buffer.from(hashB64, "base64url");
  const actual = await derive(password, Buffer.from(saltB64, "base64url"), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
