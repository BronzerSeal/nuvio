import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";

const router = Router();

// POST /board/new-board
router.post("/new-board", authMiddleware, async (req: any, res) => {
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

    res.json(board);
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
});

// GET /board/company/:companyId
router.get("/company/:companyId", authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { companyId } = req.params;

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

    return res.json(boards);
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
});

export default router;
