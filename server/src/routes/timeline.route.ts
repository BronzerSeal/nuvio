import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireCompanyRole } from "../helpers/requireCompanyRole.js";
import prisma from "../lib/prisma.js";
import { io } from "../server.js";

const router = Router();

//POST /timeline/:timelineId/rows
router.post("/:timelineId/rows", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { timelineId } = req.params as { timelineId: string | undefined };
  const { rowName } = req.body as { rowName: string | undefined };

  if (!rowName || !timelineId)
    return res.status(400).json({ message: "no data provided" });

  try {
    const timeline = await prisma.timeline.findUnique({
      where: { id: timelineId },
      select: { companyId: true },
    });

    if (!timeline) {
      return res.status(404).json({ message: "timeline not found" });
    }

    try {
      await requireCompanyRole(userId, timeline.companyId, ["owner", "admin"]);
    } catch {
      return res.status(403).json({
        message: "no access",
      });
    }

    const existingRow = await prisma.timelineRow.findFirst({
      where: {
        timelineId,
        label: rowName,
      },
    });

    if (existingRow) {
      return res.status(409).json({
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
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
});

// DELETE /timeline/:timelineId/rows
router.delete("/:timelineId/rows", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { timelineId } = req.params as { timelineId?: string };
  const { rowIds } = req.body as { rowIds?: string[] };

  if (!timelineId || !rowIds || !rowIds.length) {
    return res.status(400).json({ message: "no data provided" });
  }

  try {
    const timeline = await prisma.timeline.findUnique({
      where: { id: timelineId },
      select: { companyId: true },
    });

    if (!timeline) {
      return res.status(404).json({ message: "timeline not found" });
    }

    try {
      await requireCompanyRole(userId, timeline.companyId, ["owner", "admin"]);
    } catch {
      return res.status(403).json({
        message: "no access",
      });
    }

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
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
});

// GET /timeline/:timelineId/rows
router.get("/:timelineId/rows", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { timelineId } = req.params as { timelineId: string | undefined };

  if (!timelineId) return res.status(400).json({ message: "no data provided" });
  try {
    const timeline = await prisma.timeline.findUnique({
      where: { id: timelineId },
      select: { companyId: true },
    });

    if (!timeline) {
      return res.status(404).json({ message: "timeline not found" });
    }

    try {
      await requireCompanyRole(userId, timeline.companyId, [
        "owner",
        "admin",
        "member",
      ]);
    } catch {
      return res.status(403).json({
        message: "no access",
      });
    }

    const rows = await prisma.timelineRow.findMany({
      where: {
        timelineId,
      },
    });

    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
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

    if (!rowId || !timelineId)
      return res.status(400).json({ message: "no data provided" });

    if (
      !startTime ||
      title == null ||
      type == null ||
      duration == null ||
      attendees == null
    )
      return res.status(400).json({ message: "no body provided" });

    try {
      const timeline = await prisma.timeline.findUnique({
        where: { id: timelineId },
        select: { companyId: true },
      });

      if (!timeline) {
        return res.status(404).json({ message: "timeline not found" });
      }

      try {
        await requireCompanyRole(userId, timeline.companyId, [
          "owner",
          "admin",
          "member",
        ]);
      } catch {
        return res.status(403).json({
          message: "no access",
        });
      }

      const row = await prisma.timelineRow.findUnique({
        where: { id: rowId },
        select: {
          timelineId: true,
        },
      });

      if (!row || row.timelineId !== timelineId) {
        return res.status(404).json({
          message: "row not found",
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
    } catch (error) {
      return res.status(500).json({
        message: `Server Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  },
);

//GET /timeline/:timelineId/tasks
router.get("/:timelineId/tasks", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { timelineId } = req.params as { timelineId: string | undefined };

  if (!timelineId) return res.status(400).json({ message: "no data provided" });

  try {
    const timeline = await prisma.timeline.findUnique({
      where: { id: timelineId },
      select: { companyId: true },
    });

    if (!timeline) {
      return res.status(404).json({ message: "timeline not found" });
    }

    try {
      await requireCompanyRole(userId, timeline.companyId, [
        "owner",
        "admin",
        "member",
      ]);
    } catch {
      return res.status(403).json({
        message: "no access",
      });
    }

    const tasks = await prisma.timelineTask.findMany({
      where: {
        row: {
          timelineId,
        },
      },
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
    return res.status(400).json({ message: "no data provided" });
  }

  try {
    const timeline = await prisma.timeline.findUnique({
      where: { id: timelineId },
      select: { companyId: true },
    });

    if (!timeline) {
      return res.status(404).json({ message: "timeline not found" });
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
      return res.status(404).json({ message: "task not found" });
    }

    if (task.row.timelineId !== timelineId) {
      return res.status(403).json({ message: "invalid timeline access" });
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
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
});

//DELETE /timeline/:timelineId/tasks
router.delete("/:timelineId/tasks", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { timelineId } = req.params as { timelineId?: string };
  const { taskIds } = req.body as { taskIds?: string[] };

  if (!timelineId || !taskIds || !taskIds.length) {
    return res.status(400).json({ message: "no data provided" });
  }

  try {
    const timeline = await prisma.timeline.findUnique({
      where: { id: timelineId },
      select: { companyId: true },
    });

    if (!timeline) {
      return res.status(404).json({ message: "timeline not found" });
    }

    try {
      await requireCompanyRole(userId, timeline.companyId, ["owner", "admin"]);
    } catch {
      return res.status(403).json({
        message: "no access",
      });
    }

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
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
});

export default router;
