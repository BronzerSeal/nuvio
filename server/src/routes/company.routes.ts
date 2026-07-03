import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";
import { requireCompanyRole } from "../helpers/requireCompanyRole.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";

const router = Router();

// POST /company/join-or-create
router.post("/join-or-create", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { companyName: companyNameReq, description, logo } = req.body;
  const companyName = companyNameReq?.trim()?.toLowerCase();

  if (!userId || !companyName || !logo) {
    throw new BadRequestError({
      message: "No data provided",
    });
  }

  const isUniqueCompany = await prisma.company.findUnique({
    where: {
      name: companyName,
    },
  });

  if (!isUniqueCompany) {
    const company = await prisma.company.create({
      data: {
        name: companyName,
        plan: description,
        logo,
      },
    });

    //COMPANY TIMELINE
    await prisma.timeline.create({
      data: {
        companyId: company.id,
      },
    });

    const member = await prisma.companyMember.create({
      data: {
        role: "owner",
        userId,
        companyId: company.id,
      },
    });
    return res.status(200).json(member);
  } else {
    const existingMember = await prisma.companyMember.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId: isUniqueCompany.id,
        },
      },
    });

    if (!existingMember) {
      const member = await prisma.companyMember.create({
        data: {
          role: "member",
          userId,
          companyId: isUniqueCompany.id,
        },
      });
      return res.status(200).json(member);
    }

    throw new BadRequestError({
      statusCode: 409,
      message: "User already in company",
    });
  }
});

// GET /company/user-companies
router.get("/user-companies", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  const companies = await prisma.company.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  });

  return res.status(200).json(companies);
});

// GET /company/:companyId/memberships
router.get("/:companyId/memberships", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { companyId } = req.params as { companyId: string | undefined };

  const { limit = "10", cursorId } = req.query as {
    limit?: string;
    cursorId?: string;
  };

  const hasAccess = await prisma.company.findFirst({
    where: {
      id: companyId,
      members: {
        some: { userId },
      },
    },
  });

  if (!hasAccess) {
    throw new ForbiddenError({
      message: "No access",
    });
  }

  const take = Number(limit);

  const memberships = await prisma.companyMember.findMany({
    where: {
      companyId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          id: true,
        },
      },
    },
    take: take + 1,

    cursor: cursorId ? { id: cursorId } : undefined,

    orderBy: {
      id: "desc",
    },
  });

  const hasNextPage = memberships.length > take;

  const data = hasNextPage ? memberships.slice(0, -1) : memberships;

  const lastItem = data[data.length - 1];

  return res.status(200).json({
    data,
    nextCursor: lastItem ? lastItem.id : null,
    hasNextPage,
  });
});

//POST /company/:companyId/memberships
router.post("/:companyId/memberships", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { companyId } = req.params as { companyId: string | undefined };
  const { memberId, memberRole = "member" } = req.body as {
    memberId: string | undefined;
    memberRole: "member" | "admin" | "owner";
  };

  if (!memberId || !companyId)
    throw new BadRequestError({
      message: "No data provided",
    });

  await requireCompanyRole(userId, companyId, ["owner", "admin"]);

  const existingMember = await prisma.companyMember.findFirst({
    where: {
      companyId,
      userId: memberId,
    },
  });

  if (existingMember) {
    throw new BadRequestError({
      statusCode: 409,
      message: "User is already a member",
    });
  }

  const newMember = await prisma.companyMember.create({
    data: {
      role: memberRole,
      userId: memberId,
      companyId,
    },
  });

  return res.status(201).json(newMember);
});

//DELETE /company/:companyId/memberships
router.delete("/:companyId/memberships", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { companyId } = req.params as { companyId: string | undefined };
  const { memberId } = req.query as { memberId: string | undefined };

  if (!memberId || !companyId) {
    throw new BadRequestError({
      message: "No data provided",
    });
  }

  await requireCompanyRole(userId, companyId, ["owner", "admin"]);

  if (memberId === userId) {
    throw new BadRequestError({
      message: "You cannot remove yourself",
    });
  }

  const delMember = await prisma.companyMember.delete({
    where: {
      userId_companyId: {
        userId: memberId,
        companyId,
      },
    },
  });

  return res.status(200).json(delMember);
});

//GET /company/:companyId/timeline
router.get("/:companyId/timeline", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { companyId } = req.params as { companyId: string | undefined };

  if (!companyId) {
    throw new BadRequestError({
      message: "No Company id",
    });
  }

  await requireCompanyRole(userId, companyId, ["owner", "admin", "member"]);

  const timeline = await prisma.timeline.findUnique({
    where: { companyId },
  });

  if (!timeline) {
    throw new NotFoundError({
      message: "Timeline not found",
    });
  }

  return res.status(200).json(timeline);
});

export default router;
