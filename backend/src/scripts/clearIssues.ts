import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function clearIssues() {
  await prisma.issue.deleteMany({});
  console.log("All issues deleted.");
}

clearIssues()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
