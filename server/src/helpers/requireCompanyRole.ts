import prisma from "../lib/prisma.js";

type Roles = "member" | "admin" | "owner";

export async function requireCompanyRole(
  userId: string,
  companyId: string,
  roles: Roles[],
) {
  const member = await prisma.companyMember.findFirst({
    where: {
      userId,
      companyId,
    },
  });

  if (!member || !roles.includes(member.role)) {
    throw new Error("NO_ACCESS");
  }

  return member;
}
