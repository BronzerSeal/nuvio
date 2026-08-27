import prisma from "../src/lib/prisma";

const firstNames = [
  "Alex",
  "Emma",
  "Daniel",
  "Sophia",
  "Michael",
  "Olivia",
  "James",
  "Isabella",
  "William",
  "Mia",
  "Noah",
  "Charlotte",
  "Lucas",
  "Amelia",
  "Henry",
  "Evelyn",
  "Benjamin",
  "Harper",
  "Jack",
  "Ella",
];

const lastNames = [
  "Johnson",
  "Wilson",
  "Smith",
  "Brown",
  "Davis",
  "Miller",
  "Taylor",
  "Anderson",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Thompson",
  "Garcia",
  "Martinez",
  "Robinson",
  "Clark",
  "Lewis",
  "Walker",
];

const jobs = [
  "Frontend Developer",
  "Product Designer",
  "Backend Developer",
  "Project Manager",
  "Software Engineer",
  "UI/UX Designer",
  "Full Stack Developer",
  "QA Engineer",
  "DevOps Engineer",
  "Marketing Manager",
];

const USERS_COUNT = 20;

const mockUsers = Array.from({ length: USERS_COUNT }, (_, index) => {
  const firstName = firstNames[index];
  const lastName = lastNames[index];

  return {
    id: `mock-user-${index + 1}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@mock.com`,
    image: `https://i.pravatar.cc/150?img=${index + 1}`,
    bio: jobs[index % jobs.length],
  };
});

async function main() {
  const companies = await prisma.company.findMany({
    select: {
      id: true,
    },
  });

  if (!companies.length) {
    console.log("No companies found.");
    return;
  }

  for (const [index, mockUser] of mockUsers.entries()) {
    const user = await prisma.user.upsert({
      where: {
        email: mockUser.email,
      },
      update: {
        name: mockUser.name,
        image: mockUser.image,
        bio: mockUser.bio,
      },
      create: mockUser,
    });

    for (const company of companies) {
      await prisma.companyMember.upsert({
        where: {
          userId_companyId: {
            userId: user.id,
            companyId: company.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          companyId: company.id,
          role: index === 0 ? "owner" : "member",
        },
      });
    }
  }

  console.log(
    `Created/updated ${mockUsers.length} users for ${companies.length} companies.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// npx tsx scripts/bd-users.ts
