import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";

const router = Router();

// GET user/me/companies
router.get("/me/companies", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "no userId" });
    }

    const limit = Math.min(Number(req.query.limit) || 5, 50);

    const companies = await prisma.company.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(companies);
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
});

export default router;
