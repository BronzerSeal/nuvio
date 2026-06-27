import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireCompanyRole } from "../helpers/requireCompanyRole.js";
import prisma from "../lib/prisma.js";

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

    return res.status(201).json(newRow);
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

export default router;
