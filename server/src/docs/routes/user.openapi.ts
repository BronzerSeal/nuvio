import { z } from "zod";
import { registry } from "../registry.js";
import "../../lib/openapi.js";

import {
  getUserCompaniesQuerySchema,
  searchUsersQuerySchema,
} from "../../validate/user.validation.js";

const userCompanyResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    logo: z.string(),
    plan: z.string().nullable().optional(),
    createdAt: z.string().datetime(),
  })
  .meta({
    id: "UserCompanyResponse",
    description: "Company belonging to the current user",
  });

const userCompaniesResponseSchema = z.array(userCompanyResponseSchema).meta({
  id: "UserCompaniesResponse",
  description: "List of companies for the current user",
});

const searchedUserResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    image: z.string().nullable().optional(),
    memberships: z.array(
      z.object({
        companyId: z.string(),
      }),
    ),
  })
  .meta({
    id: "SearchedUserResponse",
    description: "User found by name or email",
  });

const searchedUsersResponseSchema = z.array(searchedUserResponseSchema).meta({
  id: "SearchedUsersResponse",
  description: "List of users matching the search query",
});

registry.register("GetUserCompaniesQueryDto", getUserCompaniesQuerySchema);
registry.register("SearchUsersQueryDto", searchUsersQuerySchema);
registry.register("UserCompanyResponse", userCompanyResponseSchema);
registry.register("UserCompaniesResponse", userCompaniesResponseSchema);
registry.register("SearchedUserResponse", searchedUserResponseSchema);
registry.register("SearchedUsersResponse", searchedUsersResponseSchema);

registry.registerPath({
  method: "get",
  path: "/api/user/me/companies",
  tags: ["Users"],

  request: {
    query: getUserCompaniesQuerySchema,
  },

  responses: {
    200: {
      description: "User companies fetched",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UserCompaniesResponse",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/user",
  tags: ["Users"],

  request: {
    query: searchUsersQuerySchema,
  },

  responses: {
    200: {
      description: "Users searched",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/SearchedUsersResponse",
          },
        },
      },
    },
  },
});
