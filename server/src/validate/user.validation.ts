import { z } from "zod";

export const getUserCompaniesQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(5),
});

export const searchUsersQuerySchema = z.object({
  companyId: z.string(),

  userNameOrEmail: z.string().trim().min(1, "User name or email is required"),
});

export type GetUserCompaniesQueryDto = z.infer<
  typeof getUserCompaniesQuerySchema
>;

export type SearchUsersQueryDto = z.infer<typeof searchUsersQuerySchema>;
