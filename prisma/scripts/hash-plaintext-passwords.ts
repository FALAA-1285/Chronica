/**
 * One-off data migration: replaces any plaintext Author.password with a scrypt
 * hash. Idempotent — already-hashed rows are skipped. Existing logins keep
 * working because the password itself does not change.
 *
 *   npm run db:hash-passwords
 */
import "dotenv/config";
import { prisma } from "@/lib/db";
import { hashPassword, isPasswordHash } from "@/lib/auth/password";

async function main() {
  const authors = await prisma.author.findMany({ select: { id: true, password: true } });
  let migrated = 0;
  for (const author of authors) {
    if (isPasswordHash(author.password)) continue;
    await prisma.author.update({ where: { id: author.id }, data: { password: await hashPassword(author.password) } });
    migrated++;
  }
  console.log(`Hashed ${migrated} of ${authors.length} author password(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
