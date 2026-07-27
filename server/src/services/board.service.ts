import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { requireCompanyRole } from "../helpers/requireCompanyRole.js";
import prisma from "../lib/prisma.js";

type CreateBoardParams = {
  userId: string;
  companyId: string;
  name: string;
};

type GetAllBoardsParams = {
  userId: string;
  companyId: string;
};

type GetBoardParams = {
  userId: string;
  companyId: string;
  boardId: string;
};

type deleteBoardParams = {
  userId: string;
  boardId: string;
};

type BoardTasksParams = {
  userId: string;
  boardId: string;
};

export const createBoard = async ({
  userId,
  companyId,
  name,
}: CreateBoardParams) => {
  await requireCompanyRole(userId, companyId, ["member", "admin", "owner"]);

  return prisma.board.create({
    data: {
      name,
      companyId,
    },
  });
};

export const getAllBoards = async ({
  userId,
  companyId,
}: GetAllBoardsParams) => {
  // 1. есть ли доступ
  await requireCompanyRole(userId, companyId, ["member", "admin", "owner"]);

  // 2. сами доски
  return prisma.board.findMany({
    where: {
      companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getBoard = async ({
  userId,
  companyId,
  boardId,
}: GetBoardParams) => {
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      companyId: companyId,
      company: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
  });

  if (!board) {
    throw new NotFoundError({
      message: "Board not found or access denied",
    });
  }

  return board;
};

export const deleteBoard = async ({ boardId, userId }: deleteBoardParams) => {
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
    select: {
      id: true,
      companyId: true,
    },
  });

  if (!board) {
    throw new BadRequestError({
      message: "Board not found",
    });
  }

  await requireCompanyRole(userId, board.companyId, ["owner", "admin"]);

  await prisma.board.delete({
    where: {
      id: boardId,
    },
  });
};

export const boardTasks = async ({ boardId, userId }: BoardTasksParams) => {
  return prisma.task.findMany({
    where: {
      boardId,
      board: {
        company: {
          members: {
            some: { userId },
          },
        },
      },
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
    orderBy: [{ status: "asc" }, { position: "asc" }],
  });
};
