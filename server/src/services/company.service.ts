import { BadRequestError } from "../errors/BadRequestError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { CompanyRoles } from "../generated/prisma/enums.js";
import { requireCompanyRole } from "../helpers/requireCompanyRole.js";
import prisma from "../lib/prisma.js";

type JoinOrCreateParams = {
  companyName: string;
  description?: string;
  logo: string;
  userId: string;
};

type GetCompanyMembersParams = {
  userId: string;
  companyId: string;
  limit: number;
  cursorId?: string;
};

type CreateMembershipParams = {
  userId: string;
  companyId: string;
  memberId: string;
  memberRole: CompanyRoles;
};

type DeleteMemberParams = {
  userId: string;
  companyId: string;
  memberId: string;
};

type GetTimelineParams = {
  userId: string;
  companyId: string;
};

type GetAvailabilityParams = {
  userId: string;
  companyId: string;
};

type GetTasksParams = {
  userId: string;
  companyId: string;
  limit: number;
  cursorId?: string;
};

type GetTasksCountParams = {
  userId: string;
  companyId: string;
};

export const joinOrCreate = async ({
  companyName,
  description,
  logo,
  userId,
}: JoinOrCreateParams) => {
  const isUniqueCompany = await prisma.company.findUnique({
    where: {
      name: companyName,
    },
  });

  if (!isUniqueCompany) {
    const company = await prisma.company.create({
      data: {
        name: companyName,
        plan: description,
        logo,
      },
    });

    //COMPANY TIMELINE && AVAILABILITY && CHAT
    await prisma.timeline.create({
      data: {
        companyId: company.id,
      },
    });

    await prisma.availability.create({
      data: {
        companyId: company.id,
      },
    });

    await prisma.chat.create({
      data: {
        companyId: company.id,
      },
    });

    return prisma.companyMember.create({
      data: {
        role: "owner",
        userId,
        companyId: company.id,
      },
    });
  } else {
    const existingMember = await prisma.companyMember.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId: isUniqueCompany.id,
        },
      },
    });

    if (!existingMember) {
      return prisma.companyMember.create({
        data: {
          role: "member",
          userId,
          companyId: isUniqueCompany.id,
        },
      });
    }

    throw new BadRequestError({
      statusCode: 409,
      message: "User already in company",
    });
  }
};

export const userCompanies = async (userId: string) => {
  return prisma.company.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  });
};

export const getCompanyMembers = async ({
  userId,
  companyId,
  limit,
  cursorId,
}: GetCompanyMembersParams) => {
  const hasAccess = await prisma.company.findFirst({
    where: {
      id: companyId,
      members: {
        some: { userId },
      },
    },
  });

  if (!hasAccess) {
    throw new ForbiddenError({
      message: "No access",
    });
  }

  const take = Number(limit);

  const memberships = await prisma.companyMember.findMany({
    where: {
      companyId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          id: true,
          bio: true,
        },
      },
    },
    take: take + 1,

    cursor: cursorId ? { id: cursorId } : undefined,

    orderBy: {
      id: "desc",
    },
  });

  const hasNextPage = memberships.length > take;

  const data = hasNextPage ? memberships.slice(0, -1) : memberships;

  const lastItem = data[data.length - 1];

  return {
    data,
    nextCursor: lastItem ? lastItem.id : null,
    hasNextPage,
  };
};

export const createMembership = async ({
  userId,
  companyId,
  memberId,
  memberRole,
}: CreateMembershipParams) => {
  await requireCompanyRole(userId, companyId, ["owner", "admin"]);

  const existingMember = await prisma.companyMember.findFirst({
    where: {
      companyId,
      userId: memberId,
    },
  });

  if (existingMember) {
    throw new BadRequestError({
      statusCode: 409,
      message: "User is already a member",
    });
  }

  return prisma.companyMember.create({
    data: {
      role: memberRole,
      userId: memberId,
      companyId,
    },
  });
};

export const deleteMember = async ({
  userId,
  companyId,
  memberId,
}: DeleteMemberParams) => {
  await requireCompanyRole(userId, companyId, ["owner", "admin"]);

  if (memberId === userId) {
    throw new BadRequestError({
      message: "You cannot remove yourself",
    });
  }

  return prisma.companyMember.delete({
    where: {
      userId_companyId: {
        userId: memberId,
        companyId,
      },
    },
  });
};

export const getTimeline = async ({ userId, companyId }: GetTimelineParams) => {
  await requireCompanyRole(userId, companyId, ["owner", "admin", "member"]);

  const timeline = await prisma.timeline.findUnique({
    where: { companyId },
  });

  if (!timeline) {
    throw new NotFoundError({
      message: "Timeline not found",
    });
  }

  return timeline;
};

export const getAvailability = async ({
  userId,
  companyId,
}: GetAvailabilityParams) => {
  await requireCompanyRole(userId, companyId, ["owner", "admin", "member"]);

  const availability = await prisma.availability.findUnique({
    where: { companyId },
  });

  if (!availability) {
    throw new NotFoundError({
      message: "Availability not found",
    });
  }

  return availability;
};

export const getTasks = async ({
  userId,
  companyId,
  limit,
  cursorId,
}: GetTasksParams) => {
  await requireCompanyRole(userId, companyId, ["owner", "admin", "member"]);

  const take = Number.isFinite(Number(limit)) ? Number(limit) : 50;

  const tasks = await prisma.task.findMany({
    where: {
      board: {
        companyId,
      },
    },

    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      board: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    take: take + 1,

    cursor: cursorId ? { id: cursorId } : undefined,

    orderBy: {
      id: "desc",
    },
  });

  const hasNextPage = tasks.length > take;

  const data = hasNextPage ? tasks.slice(0, -1) : tasks;

  const lastItem = data[data.length - 1];

  return {
    data,
    nextCursor: lastItem ? lastItem.id : null,
    hasNextPage,
  };
};

export const getTasksCount = async ({
  userId,
  companyId,
}: GetTasksCountParams) => {
  await requireCompanyRole(userId, companyId, ["owner", "admin", "member"]);

  return prisma.task.count({
    where: {
      board: {
        companyId,
      },
    },
  });
};
