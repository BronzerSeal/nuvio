import { ConflictError } from "../errors/ConflictError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { TaskType } from "../generated/prisma/enums.js";
import { requireCompanyRole } from "../helpers/requireCompanyRole.js";
import prisma from "../lib/prisma.js";

type CreateTimelineRowParams = {
  userId: string;
  timelineId: string;
  rowName: string;
};

type DeleteRowsParams = {
  userId: string;
  timelineId: string;
  rowIds: string[];
};

type GetTimelineRowsParams = {
  userId: string;
  timelineId: string;
};

type CreateTimelineTaskParams = {
  userId: string;
  timelineId: string;
  rowId: string;
  startTime: string;
  duration: number;
  title: string;
  type: TaskType;
  attendees: number;
};

type GetTimelineTasksParams = {
  userId: string;
  timelineId: string;
};

type UpdateTimelineTaskParams = {
  userId: string;
  timelineId: string;
  taskId: string;
  startTime?: string;
  rowId?: string;
};

type DeleteTimelineTasksParams = {
  userId: string;
  timelineId: string;
  taskIds: string[];
};

export const createRow = async ({
  userId,
  timelineId,
  rowName,
}: CreateTimelineRowParams) => {
  const timeline = await prisma.timeline.findUnique({
    where: { id: timelineId },
    select: { companyId: true },
  });

  if (!timeline) {
    throw new NotFoundError({
      message: "Timeline not found",
    });
  }

  await requireCompanyRole(userId, timeline.companyId, ["owner", "admin"]);

  const existingRow = await prisma.timelineRow.findFirst({
    where: {
      timelineId,
      label: rowName,
    },
  });

  if (existingRow) {
    throw new ConflictError({
      message: "row already created",
    });
  }

  return prisma.timelineRow.create({
    data: {
      timelineId,
      label: rowName,
      capacity: 0,
    },
  });
};

export const deleteRows = async ({
  userId,
  timelineId,
  rowIds,
}: DeleteRowsParams) => {
  const timeline = await prisma.timeline.findUnique({
    where: { id: timelineId },
    select: { companyId: true },
  });

  if (!timeline) {
    throw new NotFoundError({
      message: "Timeline not found",
    });
  }

  await requireCompanyRole(userId, timeline.companyId, ["owner", "admin"]);

  const deleted = await prisma.timelineRow.deleteMany({
    where: {
      id: { in: rowIds },
      timelineId,
    },
  });

  return deleted.count;
};

export const getRows = async ({
  userId,
  timelineId,
}: GetTimelineRowsParams) => {
  const timeline = await prisma.timeline.findUnique({
    where: { id: timelineId },
    select: { companyId: true },
  });

  if (!timeline) {
    throw new NotFoundError({
      message: "Timeline not found",
    });
  }

  await requireCompanyRole(userId, timeline.companyId, [
    "owner",
    "admin",
    "member",
  ]);

  return prisma.timelineRow.findMany({
    where: {
      timelineId,
    },
  });
};

export const createTask = async ({
  userId,
  timelineId,
  rowId,
  startTime,
  duration,
  title,
  type,
  attendees,
}: CreateTimelineTaskParams) => {
  const timeline = await prisma.timeline.findUnique({
    where: { id: timelineId },
    select: { companyId: true },
  });

  if (!timeline) {
    throw new NotFoundError({
      message: "Timeline not found",
    });
  }

  await requireCompanyRole(userId, timeline.companyId, [
    "owner",
    "admin",
    "member",
  ]);

  const row = await prisma.timelineRow.findUnique({
    where: { id: rowId },
    select: {
      timelineId: true,
    },
  });

  if (!row || row.timelineId !== timelineId) {
    throw new NotFoundError({
      message: "Row not found",
    });
  }

  return prisma.timelineTask.create({
    data: {
      rowId,
      startTime,
      duration,
      title,
      type,
      attendees,
    },
  });
};

export const getTasks = async ({
  userId,
  timelineId,
}: GetTimelineTasksParams) => {
  const timeline = await prisma.timeline.findUnique({
    where: { id: timelineId },
    select: { companyId: true },
  });

  if (!timeline) {
    throw new NotFoundError({
      message: "Timeline not found",
    });
  }

  await requireCompanyRole(userId, timeline.companyId, [
    "owner",
    "admin",
    "member",
  ]);

  return prisma.timelineTask.findMany({
    where: {
      row: {
        timelineId,
      },
    },
  });
};

export const updateTask = async ({
  userId,
  timelineId,
  taskId,
  startTime,
  rowId,
}: UpdateTimelineTaskParams) => {
  const timeline = await prisma.timeline.findUnique({
    where: { id: timelineId },
    select: { companyId: true },
  });

  if (!timeline) {
    throw new NotFoundError({
      message: "Timeline not found",
    });
  }

  await requireCompanyRole(userId, timeline.companyId, [
    "owner",
    "admin",
    "member",
  ]);

  const task = await prisma.timelineTask.findUnique({
    where: { id: taskId },
    include: { row: true },
  });

  if (!task) {
    throw new NotFoundError({
      message: "Task not found",
    });
  }

  if (task.row.timelineId !== timelineId) {
    throw new ForbiddenError({
      message: "Invalid timeline access",
    });
  }

  return prisma.timelineTask.update({
    where: { id: taskId },
    data: {
      ...(startTime && { startTime }),
      ...(rowId && { rowId }),
    },
  });
};

export const deleteTasks = async ({
  userId,
  timelineId,
  taskIds,
}: DeleteTimelineTasksParams) => {
  const timeline = await prisma.timeline.findUnique({
    where: { id: timelineId },
    select: { companyId: true },
  });

  if (!timeline) {
    throw new NotFoundError({
      message: "Timeline not found",
    });
  }

  await requireCompanyRole(userId, timeline.companyId, ["owner", "admin"]);

  const deleted = await prisma.timelineTask.deleteMany({
    where: {
      id: { in: taskIds },
      row: {
        timelineId,
      },
    },
  });

  return deleted.count;
};
