import prisma from "../lib/prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { requireCompanyRole } from "../helpers/requireCompanyRole.js";
import { TaskPriority, TaskStatus } from "../generated/prisma/client.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";

type CreateTaskParams = {
  userId: string;
  boardId: string;
  title: string;
  priority?: TaskPriority;
  description?: string;
  assigneeId?: string;
  dueDate?: string;
};

type UpdateTaskParams = {
  userId: string;
  taskId: string;
  boardId: string;
  position?: number;
  status?: TaskStatus;
};

const createTask = async ({
  userId,
  boardId,
  title,
  priority,
  description,
  assigneeId,
  dueDate,
}: CreateTaskParams) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      company: true,
    },
  });

  if (!board) {
    throw new NotFoundError({
      message: "Board not found",
    });
  }

  await requireCompanyRole(userId, board.companyId, [
    "member",
    "admin",
    "owner",
  ]);

  return prisma.task.create({
    data: {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      boardId,
      assigneeId: assigneeId || null,
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
};

const updateTask = async ({
  taskId,
  boardId,
  userId,
  position,
  status,
}: UpdateTaskParams) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      boardId,
      board: {
        company: {
          members: {
            some: { userId },
          },
        },
      },
    },
  });

  if (!task) {
    throw new ForbiddenError({
      message: "No access or task not found",
    });
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(status !== undefined && { status }),
      ...(position !== undefined && { position }),
    },
  });
};

export const taskService = {
  createTask,
  updateTask,
};
