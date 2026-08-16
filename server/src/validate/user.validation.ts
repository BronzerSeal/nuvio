import { z } from "zod";

export const getUserCompaniesQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(5),
});

export const searchUsersQuerySchema = z.object({
  companyId: z.string(),

  userNameOrEmail: z.string().trim().min(1, "User name or email is required"),
});

export const updateUsersQuerySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  bio: z.string().max(200),
  urls: z.array(
    z.object({
      value: z.string().url(),
    }),
  ),
});

export type GetUserCompaniesQueryDto = z.infer<
  typeof getUserCompaniesQuerySchema
>;

export type SearchUsersQueryDto = z.infer<typeof searchUsersQuerySchema>;
export type UpdateUsersQueryDto = z.infer<typeof updateUsersQuerySchema>;
