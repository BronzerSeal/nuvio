import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";

const router = Router();

// POST /company/join-or-create
router.post("/join-or-create", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { companyName: companyNameReq } = req.body;
  const companyName = companyNameReq?.trim()?.toLowerCase();

  if (!userId || !companyName) {
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

export default router;
