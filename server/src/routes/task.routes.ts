import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";
import { createTaskSchema } from "../validate/createTaskSchema .js";
import { io } from "../server.js";

const router = Router();

// POST /task/new-task
router.post("/new-task", authMiddleware, async (req, res) => {
  const parsed = createTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: parsed.error.flatten(),
    });
  }

  const { boardId, title, priority, description, assigneeId, dueDate } =
    parsed.data;

  try {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        company: true,
      },
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const membership = await prisma.companyMember.findUnique({
      where: {
        userId_companyId: {
          userId: req.user.id,
          companyId: board.companyId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({ message: "No access" });
    }

    const task = await prisma.task.create({
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

    io.to(boardId).emit("board-updated");

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${error}`,
    });
  }
});

// PATCH /task/:taskId
router.patch("/:taskId", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params as { taskId: string | undefined };
  const { boardId, status, position } = req.body as {
    boardId: string;
    status?: "backlog" | "inProgress" | "done";
    position?: number;
  };

  try {
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
      return res.status(403).json({ message: "No access or task not found" });
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(status !== undefined && { status }),
        ...(position !== undefined && { position }),
      },
    });

    io.to(boardId).emit("board-updated");

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${error}`,
    });
  }
});

export default router;
