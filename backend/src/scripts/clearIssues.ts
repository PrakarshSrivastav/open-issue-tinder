import prisma from "../../prisma/prisma.config";

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
