import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireCompanyRole } from "../helpers/requireCompanyRole.js";
import prisma from "../lib/prisma.js";
import { io } from "../server.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ConflictError } from "../errors/ConflictError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";

const router = Router();

//POST /timeline/:timelineId/rows
router.post("/:timelineId/rows", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { timelineId } = req.params as { timelineId: string | undefined };
  const { rowName } = req.body as { rowName: string | undefined };

  if (!rowName || !timelineId) {
    throw new BadRequestError({
      message: "No data provided",
    });
  }

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

  const newRow = await prisma.timelineRow.create({
    data: {
      timelineId,
      label: rowName,
      capacity: 0,
    },
  });

  io.to(timelineId).emit("timeline-row-updated");

  return res.status(201).json(newRow);
});

// DELETE /timeline/:timelineId/rows
router.delete("/:timelineId/rows", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { timelineId } = req.params as { timelineId?: string };
  const { rowIds } = req.body as { rowIds?: string[] };

  if (!timelineId || !rowIds || !rowIds.length) {
    throw new BadRequestError({
      message: "No data provided",
    });
  }

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

  io.to(timelineId).emit("timeline-row-updated");

  return res.status(200).json({
    deletedCount: deleted.count,
  });
});

// GET /timeline/:timelineId/rows
router.get("/:timelineId/rows", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { timelineId } = req.params as { timelineId: string | undefined };

  if (!timelineId) {
    throw new BadRequestError({
      message: "No timeline ID provided",
    });
  }

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

  const rows = await prisma.timelineRow.findMany({
    where: {
      timelineId,
    },
  });

  return res.status(200).json(rows);
});

//TASKS

//POST /timeline/:timelineId/rows/:rowId/tasks
router.post(
  "/:timelineId/rows/:rowId/tasks",
  authMiddleware,
  async (req, res) => {
    const userId = req.user.id;
    const { timelineId, rowId } = req.params as {
      timelineId: string | undefined;
      rowId: string | undefined;
    };
    const { startTime, duration, title, type, attendees } = req.body as {
      startTime: string | undefined;
      duration: number | undefined;
      title: string | undefined;
      type: "meeting" | "workshop" | "break" | "review" | undefined;
      attendees: number | undefined;
    };

    if (!rowId || !timelineId) {
      throw new BadRequestError({
        message: "No data provided",
      });
    }

    if (
      !startTime ||
      title == null ||
      type == null ||
      duration == null ||
      attendees == null
    )
      throw new BadRequestError({
        message: "No body provided",
      });

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

    const newTask = await prisma.timelineTask.create({
      data: {
        rowId,
        startTime,
        duration,
        title,
        type,
        attendees,
      },
    });

    io.to(timelineId).emit("timeline-task-updated");

    return res.status(201).json(newTask);
  },
);

//GET /timeline/:timelineId/tasks
router.get("/:timelineId/tasks", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { timelineId } = req.params as { timelineId: string | undefined };

  if (!timelineId) {
    throw new BadRequestError({
      message: "No timeline ID provided",
    });
  }

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

  const tasks = await prisma.timelineTask.findMany({
    where: {
      row: {
        timelineId,
      },
    },
  });

  return res.status(200).json(tasks);
});

//PATCH /timeline/:timelineId/tasks/:taskId
router.patch("/:timelineId/tasks/:taskId", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  const { timelineId, taskId } = req.params as {
    timelineId: string | undefined;
    taskId: string | undefined;
  };
  const { startTime, rowId } = req.body as {
    startTime?: string;
    rowId?: string;
  };

  if (!timelineId || !taskId) {
    throw new BadRequestError({
      message: "No timeline ID or task ID provided",
    });
  }

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

  const updated = await prisma.timelineTask.update({
    where: { id: taskId },
    data: {
      ...(startTime && { startTime }),
      ...(rowId && { rowId }),
    },
  });

  io.to(timelineId).emit("timeline-task-updated");

  return res.status(200).json(updated);
});

//DELETE /timeline/:timelineId/tasks
router.delete("/:timelineId/tasks", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { timelineId } = req.params as { timelineId?: string };
  const { taskIds } = req.body as { taskIds?: string[] };

  if (!timelineId || !taskIds || !taskIds.length) {
    throw new BadRequestError({
      message: "No timeline ID or task IDs provided",
    });
  }

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

  io.to(timelineId).emit("timeline-task-updated");

  return res.status(200).json({
    deletedCount: deleted.count,
  });
});

export default router;
