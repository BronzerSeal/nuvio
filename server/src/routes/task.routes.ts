import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";
import { createTaskSchema } from "../validate/createTaskSchema.js";
import { io } from "../server.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { requireCompanyRole } from "../helpers/requireCompanyRole.js";

const router = Router();

// POST /task/new-task
router.post("/new-task", authMiddleware, async (req, res) => {
  const parsed = createTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new BadRequestError({
      message: "Invalid data",
      context: { errors: parsed.error.flatten() },
    });
  }

  const { boardId, title, priority, description, assigneeId, dueDate } =
    parsed.data;

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

  await requireCompanyRole(req.user.id, board.companyId, [
    "member",
    "admin",
    "owner",
  ]);

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

  if (!taskId) {
    throw new BadRequestError({
      message: "Task id is required",
    });
  }

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

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(status !== undefined && { status }),
      ...(position !== undefined && { position }),
    },
  });

  io.to(boardId).emit("board-updated");

  return res.status(200).json(updated);
});

export default router;
