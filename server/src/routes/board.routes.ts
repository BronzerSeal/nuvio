import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";
import { requireCompanyRole } from "../helpers/requireCompanyRole.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

const router = Router();

// POST /board/new-board
router.post("/new-board", authMiddleware, async (req, res) => {
  const { name, companyId } = req.body;

  if (!name || !companyId) {
    throw new BadRequestError({
      message: "No data provided",
    });
  }

  await requireCompanyRole(req.user.id, companyId, [
    "member",
    "admin",
    "owner",
  ]);

  const board = await prisma.board.create({
    data: {
      name,
      companyId,
    },
  });

  return res.status(201).json(board);
});

// GET /board/company/:companyId
router.get("/company/:companyId", authMiddleware, async (req, res) => {
  const { companyId } = req.params as { companyId: string | undefined };

  if (!companyId) {
    throw new BadRequestError({
      message: "No companyId",
    });
  }

  // 1. есть ли доступ
  await requireCompanyRole(req.user.id, companyId, [
    "member",
    "admin",
    "owner",
  ]);

  // 2. сами доски
  const boards = await prisma.board.findMany({
    where: {
      companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json(boards);
});

//GET /board/:companyId/boards/:boardId
router.get("/:companyId/boards/:boardId", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { boardId, companyId } = req.params as {
    boardId: string | undefined;
    companyId: string | undefined;
  };

  if (!boardId || !companyId) {
    throw new BadRequestError({
      message: "Missing params",
    });
  }

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

  return res.status(200).json(board);
});

// DELETE /board/:boardId
router.delete("/:boardId", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { boardId } = req.params as {
    boardId: string | undefined;
  };

  if (!boardId) {
    throw new BadRequestError({
      message: "No boardId provided",
    });
  }

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

  return res.status(200).json({
    message: "Board deleted successfully",
  });
});

//GET /board/:boardId/tasks
router.get("/:boardId/tasks", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { boardId } = req.params as { boardId: string | undefined };

  if (!boardId) {
    throw new BadRequestError({
      message: "No boardId provided",
    });
  }

  const tasks = await prisma.task.findMany({
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

  return res.status(200).json(tasks);
});

export default router;
