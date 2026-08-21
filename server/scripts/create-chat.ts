import prisma from "../src/lib/prisma";

async function main() {
  const companies = await prisma.company.findMany({
    select: {
      id: true,
    },
  });

  for (const company of companies) {
    await prisma.chat.upsert({
      where: {
        companyId: company.id,
      },
      update: {},
      create: {
        companyId: company.id,
      },
    });
  }

  console.log("Chats seeded!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
