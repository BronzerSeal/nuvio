import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";

const router = Router();

// POST /board/new-board
router.post("/new-board", authMiddleware, async (req, res) => {
  const { name, companyId } = req.body;

  if (!name || !companyId) {
    return res.status(400).json({ message: "No data provided" });
  }

  try {
    const member = await prisma.companyMember.findUnique({
      where: {
        userId_companyId: {
          userId: req.user.id,
          companyId,
        },
      },
    });

    if (!member) {
      return res.status(403).json({ message: "No access to company" });
    }

    const board = await prisma.board.create({
      data: {
        name,
        companyId,
      },
    });

    res.status(200).json(board);
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
});

// GET /board/company/:companyId
router.get("/company/:companyId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { companyId } = req.params as { companyId: string | undefined };

    if (!companyId) {
      return res.status(400).json({ message: "No companyId" });
    }

    // 1. есть ли доступ
    const member = await prisma.companyMember.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (!member) {
      return res.status(403).json({ message: "No access to company" });
    }

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
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
});

//GET /board/:companyId/boards/:boardId
router.get("/:companyId/boards/:boardId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { boardId, companyId } = req.params as {
      boardId: string | undefined;
      companyId: string | undefined;
    };

    if (!boardId || !companyId) {
      return res.status(400).json({ message: "Missing params" });
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
      return res.status(404).json({
        message: "Board not found or access denied",
      });
    }

    return res.status(200).json(board);
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
});

//GET /:boardId/tasks
router.get("/:boardId/tasks", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { boardId } = req.params as { boardId: string | undefined };

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
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
});

export default router;
