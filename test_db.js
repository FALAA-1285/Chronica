const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const dbUrl = new URL(process.env.DATABASE_URL || "mysql://root:@localhost:3306/myblog");

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username || "root",
  password: dbUrl.password || "",
  database: dbUrl.pathname.substring(1),
  connectionLimit: 10,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Checking database authors...");
  const authors = await prisma.author.findMany();
  console.log("Authors in database:", JSON.stringify(authors, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
