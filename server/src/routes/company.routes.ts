import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";

const router = Router();

// POST /company/join-or-create
router.post("/join-or-create", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { companyName: companyNameReq, description, logo } = req.body;
  const companyName = companyNameReq?.trim()?.toLowerCase();

  if (!userId || !companyName || !logo) {
    return res.status(400).json({ message: "No data provided" });
  }

  try {
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

      return res.status(409).json({ message: `user already in company` });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
});

// GET /company/user-companies
router.get("/user-companies", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: "No data provided" });
  }

  try {
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
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
});

// GET /company/:companyId/memberships
router.get("/:companyId/memberships", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { companyId } = req.params as { companyId: string | undefined };

  const { limit = "10", cursorId } = req.query as {
    limit?: string;
    cursorId?: string;
  };

  try {
    const hasAccess = await prisma.company.findFirst({
      where: {
        id: companyId,
        members: {
          some: { userId },
        },
      },
    });

    if (!hasAccess) {
      return res.status(403).json({ message: "No access" });
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
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
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
    return res.status(409).json({ message: "no data provided" });

  try {
    const member = await prisma.companyMember.findFirst({
      where: {
        user: {
          id: userId,
        },
        company: {
          id: companyId,
        },
      },
    });

    if (!member || member.role === "member") {
      return res.status(403).json({ message: "no access" });
    }

    const existingMember = await prisma.companyMember.findFirst({
      where: {
        companyId,
        userId: memberId,
      },
    });

    if (existingMember) {
      return res.status(400).json({
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
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
});

//DELETE /company/:companyId/memberships
router.delete("/:companyId/memberships", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { companyId } = req.params as { companyId: string | undefined };
  const { memberId } = req.query as { memberId: string | undefined };

  if (!memberId || !companyId)
    return res.status(409).json({ message: "no data provided" });

  try {
    const member = await prisma.companyMember.findFirst({
      where: {
        user: {
          id: userId,
        },
        company: {
          id: companyId,
        },
      },
    });

    if (!member || member.role === "member") {
      return res.status(403).json({ message: "no access" });
    }

    if (memberId === userId) {
      return res.status(400).json({
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
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
});

export default router;
