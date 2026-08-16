import { NotFoundError } from "../errors/NotFoundError.js";
import prisma from "../lib/prisma.js";
import { UpdateUsersQueryDto } from "../validate/user.validation.js";

type userCompaniesParams = {
  limit: number;
  userId: string;
};

type SearchUsersParams = {
  userId: string;
  companyId?: string;
  userNameOrEmail: string;
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

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      urls: true,
    },
  });

  if (!user) {
    throw new NotFoundError({
      message: "User not found",
    });
  }

  return user;
};

export const updateMe = async (
  userId: string,
  userData: UpdateUsersQueryDto,
) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: userData.name,
      email: userData.email,
      bio: userData.bio,
      ...(userData.urls !== undefined && {
        urls: {
          deleteMany: {},
          create: userData.urls.map((url) => ({
            value: url.value,
          })),
        },
      }),
    },
    include: {
      urls: true,
    },
  });

  if (!user) {
    throw new NotFoundError({
      message: "User not found",
    });
  }

  return user;
};
