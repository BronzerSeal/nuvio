import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";
import { BadRequestError } from "../errors/BadRequestError.js";

const router = Router();

// GET user/me/companies
router.get("/me/companies", authMiddleware, async (req, res) => {
  const userId = req.user.id;

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
});

//GET user/
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { companyId } = req.query as { companyId: string | undefined };

  const { userNameOrEmail } = req.query as { userNameOrEmail?: string };

  if (!userNameOrEmail?.trim()) {
    throw new BadRequestError({
      message: "No data provided",
    });
  }

  const users = await prisma.user.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              name: {
                contains: userNameOrEmail,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: userNameOrEmail,
                mode: "insensitive",
              },
            },
          ],
        },
        {
          id: {
            not: userId,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      memberships: {
        where: {
          companyId,
        },
        select: {
          companyId: true,
        },
      },
    },
  });

  return res.status(200).json(
    users.map((u) => ({
      ...u,
      isMember: u.memberships.length > 0,
      memberships: u.memberships.map((m) => m.companyId),
    })),
  );
});

export default router;
