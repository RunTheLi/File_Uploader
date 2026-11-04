//test-db.js

const prisma = require("./db/prisma");

async function main() {
  await prisma.$connect();

  console.log("Successfully connected to PostgreSQL!");

  const users = await prisma.user.findMany();

  console.log("Users:", users);
}

main()
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
