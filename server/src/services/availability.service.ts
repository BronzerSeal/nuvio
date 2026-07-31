import { NotFoundError } from "../errors/NotFoundError.js";
import { requireCompanyRole } from "../helpers/requireCompanyRole.js";
import prisma from "../lib/prisma.js";

type getTimeSpansParams = {
  availabilityId: string;
  userId: string;
};

type CreateTimeSpanParams = {
  availabilityId: string;
  userId: string;
  week_day: number;
  start_time: string;
  end_time: string;
  active?: boolean;
};

type UpdateTimeSpanParams = {
  availabilityId: string;
  timeSpanId: string;
  userId: string;
  week_day?: number;
  start_time?: string;
  end_time?: string;
  active?: boolean;
};

type DeleteTimeSpanParams = {
  availabilityId: string;
  timeSpanId: string;
  userId: string;
};

export const getTimeSpans = async ({
  availabilityId,
  userId,
}: getTimeSpansParams) => {
  const availability = await prisma.availability.findUnique({
    where: {
      id: availabilityId,
    },
    select: {
      companyId: true,
    },
  });

  if (!availability) {
    throw new NotFoundError({
      message: "Availability not found",
    });
  }

  // 1. есть ли доступ
  await requireCompanyRole(userId, availability.companyId, [
    "member",
    "admin",
    "owner",
  ]);

  // 2. сами доски
  const timeSpans = await prisma.timeSpan.findMany({
    where: {
      availabilityId,
    },
  });

  return timeSpans.map((t) => ({
    id: t.id,
    week_day: t.weekDay,
    start_time: t.startTime,
    end_time: t.endTime,
    active: t.active,
  }));
};

export const createTimeSpan = async ({
  availabilityId,
  userId,
  week_day,
  start_time,
  end_time,
  active,
}: CreateTimeSpanParams) => {
  const availability = await prisma.availability.findUnique({
    where: {
      id: availabilityId,
    },
    select: {
      companyId: true,
    },
  });

  if (!availability) {
    throw new NotFoundError({
      message: "Availability not found",
    });
  }

  await requireCompanyRole(userId, availability.companyId, [
    "member",
    "admin",
    "owner",
  ]);

  const isActive = active ?? true;
  return prisma.timeSpan.create({
    data: {
      availabilityId,
      weekDay: week_day,
      startTime: start_time,
      endTime: end_time,
      active: isActive,
    },
  });
};

export const updateTimeSpan = async ({
  availabilityId,
  timeSpanId,
  userId,
  week_day,
  start_time,
  end_time,
  active,
}: UpdateTimeSpanParams) => {
  const availability = await prisma.availability.findUnique({
    where: {
      id: availabilityId,
    },
    select: {
      companyId: true,
    },
  });

  if (!availability) {
    throw new NotFoundError({
      message: "Availability not found",
    });
  }

  await requireCompanyRole(userId, availability.companyId, [
    "member",
    "admin",
    "owner",
  ]);

  const timeSpan = await prisma.timeSpan.findUnique({
    where: {
      id: timeSpanId,
    },
    select: {
      availabilityId: true,
    },
  });

  if (!timeSpan || timeSpan.availabilityId !== availabilityId) {
    throw new NotFoundError({
      message: "Time span not found",
    });
  }

  return prisma.timeSpan.update({
    where: {
      id: timeSpanId,
    },
    data: {
      ...(week_day !== undefined && { weekDay: week_day }),
      ...(start_time !== undefined && { startTime: start_time }),
      ...(end_time !== undefined && { endTime: end_time }),
      ...(active !== undefined && { active }),
    },
  });
};

export const deleteTimeSpan = async ({
  availabilityId,
  timeSpanId,
  userId,
}: DeleteTimeSpanParams) => {
  const availability = await prisma.availability.findUnique({
    where: {
      id: availabilityId,
    },
    select: {
      companyId: true,
    },
  });

  if (!availability) {
    throw new NotFoundError({
      message: "Availability not found",
    });
  }

  await requireCompanyRole(userId, availability.companyId, [
    "member",
    "admin",
    "owner",
  ]);

  const timeSpan = await prisma.timeSpan.findFirst({
    where: {
      id: timeSpanId,
      availabilityId,
    },
  });

  if (!timeSpan) {
    throw new NotFoundError({
      message: "Time span not found",
    });
  }

  return prisma.timeSpan.delete({
    where: {
      id: timeSpanId,
    },
  });
};
