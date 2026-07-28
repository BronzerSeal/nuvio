import { z } from "zod";
import { CompanyRoles } from "../generated/prisma/client.js";

export const joinOrCreateSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required"),
  description: z.string().optional(),
  logo: z.string(),
});

export const getCompanyMembersParamsSchema = z.object({
  companyId: z.string(),
});
export const getCompanyMembersQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  cursorId: z.string().optional(),
});

export const createMembershipParamsSchema = z.object({
  companyId: z.string(),
});
export const createMembershipSchema = z.object({
  memberId: z.string(),
  memberRole: z.nativeEnum(CompanyRoles).default(CompanyRoles.member),
});

export const deleteMemberParamsSchema = z.object({
  companyId: z.string(),
});
export const deleteMemberQuerySchema = z.object({
  memberId: z.string(),
});

export const getTimelineParamsSchema = z.object({
  companyId: z.string(),
});

export type JoinOrCreateDto = z.infer<typeof joinOrCreateSchema>;

export type GetCompanyMembersParamsDto = z.infer<
  typeof getCompanyMembersParamsSchema
>;

export type GetCompanyMembersQueryDto = z.infer<
  typeof getCompanyMembersQuerySchema
>;

export type CreateMembershipParamsDto = z.infer<
  typeof createMembershipParamsSchema
>;
export type CreateMembershipDto = z.infer<typeof createMembershipSchema>;

export type DeleteMemberParamsDto = z.infer<typeof deleteMemberParamsSchema>;

export type DeleteMemberQueryDto = z.infer<typeof deleteMemberQuerySchema>;

export type GetTimelineParamsDto = z.infer<typeof getTimelineParamsSchema>;
