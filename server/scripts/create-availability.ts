import prisma from "../src/lib/prisma";

async function main() {
  const companies = await prisma.company.findMany({
    select: {
      id: true,
    },
  });

  for (const company of companies) {
    await prisma.availability.upsert({
      where: {
        companyId: company.id,
      },
      update: {},
      create: {
        companyId: company.id,
      },
    });
  }

  console.log("Done!");
}

main().finally(async () => {
  await prisma.$disconnect();
});
