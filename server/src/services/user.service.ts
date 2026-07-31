import prisma from "../lib/prisma.js";

type userCompaniesParams = {
  limit: number;
  userId: string;
};

export const userCompanies = async ({ limit, userId }: userCompaniesParams) => {
  const LIMIT = Math.min(Number(limit) || 5, 50);

  return prisma.company.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    take: LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });
};

type SearchUsersParams = {
  userId: string;
  companyId?: string;
  userNameOrEmail: string;
};

export const searchUsers = async ({
  userId,
  companyId,
  userNameOrEmail,
}: SearchUsersParams) => {
  return prisma.user.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              name: {
                contains: userNameOrEmail,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: userNameOrEmail,
                mode: "insensitive",
              },
            },
          ],
        },
        {
          id: {
            not: userId,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      memberships: {
        where: {
          companyId,
        },
        select: {
          companyId: true,
        },
      },
    },
  });
};
