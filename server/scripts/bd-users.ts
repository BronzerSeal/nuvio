import prisma from "../src/lib/prisma";

const mockUsers = [
  {
    id: "mock-user-1",
    name: "Alex Johnson",
    email: "alex.johnson@mock.com",
    image: "https://i.pravatar.cc/150?img=1",
    bio: "Frontend Developer",
  },
  {
    id: "mock-user-2",
    name: "Emma Wilson",
    email: "emma.wilson@mock.com",
    image: "https://i.pravatar.cc/150?img=2",
    bio: "Product Designer",
  },
  {
    id: "mock-user-3",
    name: "Daniel Smith",
    email: "daniel.smith@mock.com",
    image: "https://i.pravatar.cc/150?img=3",
    bio: "Backend Developer",
  },
  {
    id: "mock-user-4",
    name: "Sophia Brown",
    email: "sophia.brown@mock.com",
    image: "https://i.pravatar.cc/150?img=4",
    bio: "Project Manager",
  },
  {
    id: "mock-user-5",
    name: "Michael Davis",
    email: "michael.davis@mock.com",
    image: "https://i.pravatar.cc/150?img=5",
    bio: "Software Engineer",
  },
  {
    id: "mock-user-6",
    name: "Olivia Miller",
    email: "olivia.miller@mock.com",
    image: "https://i.pravatar.cc/150?img=6",
    bio: "UI/UX Designer",
  },
  {
    id: "mock-user-7",
    name: "James Taylor",
    email: "james.taylor@mock.com",
    image: "https://i.pravatar.cc/150?img=7",
    bio: "Full Stack Developer",
  },
  {
    id: "mock-user-8",
    name: "Isabella Anderson",
    email: "isabella.anderson@mock.com",
    image: "https://i.pravatar.cc/150?img=8",
    bio: "QA Engineer",
  },
  {
    id: "mock-user-9",
    name: "William Thomas",
    email: "william.thomas@mock.com",
    image: "https://i.pravatar.cc/150?img=9",
    bio: "DevOps Engineer",
  },
  {
    id: "mock-user-10",
    name: "Mia Jackson",
    email: "mia.jackson@mock.com",
    image: "https://i.pravatar.cc/150?img=10",
    bio: "Marketing Manager",
  },
];

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
