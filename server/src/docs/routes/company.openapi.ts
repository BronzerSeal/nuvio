import { z } from "zod";
import { registry } from "../registry.js";
import { CompanyRoles } from "../../generated/prisma/client.js";
import "../../lib/openapi.js";

import {
  createMembershipParamsSchema,
  createMembershipSchema,
  deleteMemberParamsSchema,
  deleteMemberQuerySchema,
  getCompanyMembersParamsSchema,
  getCompanyMembersQuerySchema,
  getTimelineParamsSchema,
  joinOrCreateSchema,
} from "../../validate/company.validation.js";

const companyMembershipUserSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    image: z.string().nullable().optional(),
  })
  .meta({
    id: "CompanyMembershipUser",
    description: "Company member user profile",
  });

const companyMembershipResponseSchema = z
  .object({
    id: z.string(),
    role: z.nativeEnum(CompanyRoles),
    userId: z.string(),
    companyId: z.string(),
    createdAt: z.string().datetime(),
    user: companyMembershipUserSchema,
  })
  .meta({
    id: "CompanyMembershipResponse",
    description: "Company membership entry",
  });

const companyMembersListResponseSchema = z
  .object({
    data: z.array(companyMembershipResponseSchema),
    nextCursor: z.string().nullable(),
    hasNextPage: z.boolean(),
  })
  .meta({
    id: "CompanyMembersListResponse",
    description: "Paginated company members list",
  });

const companyTimelineResponseSchema = z
  .object({
    id: z.string(),
    companyId: z.string(),
  })
  .meta({
    id: "CompanyTimelineResponse",
    description: "Company timeline payload",
  });

registry.register("JoinOrCreateDto", joinOrCreateSchema);
registry.register("GetCompanyMembersParamsDto", getCompanyMembersParamsSchema);
registry.register("GetCompanyMembersQueryDto", getCompanyMembersQuerySchema);
registry.register("CreateMembershipParamsDto", createMembershipParamsSchema);
registry.register("CreateMembershipDto", createMembershipSchema);
registry.register("DeleteMemberParamsDto", deleteMemberParamsSchema);
registry.register("DeleteMemberQueryDto", deleteMemberQuerySchema);
registry.register("GetTimelineParamsDto", getTimelineParamsSchema);
registry.register("CompanyMembershipResponse", companyMembershipResponseSchema);
registry.register(
  "CompanyMembersListResponse",
  companyMembersListResponseSchema,
);
registry.register("CompanyTimelineResponse", companyTimelineResponseSchema);

registry.registerPath({
  method: "post",
  path: "/api/company/join-or-create",
  tags: ["Companies"],

  request: {
    body: {
      content: {
        "application/json": {
          schema: joinOrCreateSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Company membership created or joined",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CompanyMembershipResponse",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/company/{companyId}/memberships",
  tags: ["Companies"],

  request: {
    params: getCompanyMembersParamsSchema,
    query: getCompanyMembersQuerySchema,
  },

  responses: {
    200: {
      description: "Company members fetched",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CompanyMembersListResponse",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/company/{companyId}/memberships",
  tags: ["Companies"],

  request: {
    params: createMembershipParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: createMembershipSchema,
        },
      },
    },
  },

  responses: {
    201: {
      description: "Membership created",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CompanyMembershipResponse",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/company/{companyId}/memberships",
  tags: ["Companies"],

  request: {
    params: deleteMemberParamsSchema,
    query: deleteMemberQuerySchema,
  },

  responses: {
    200: {
      description: "Membership removed",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CompanyMembershipResponse",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/company/{companyId}/timeline",
  tags: ["Companies"],

  request: {
    params: getTimelineParamsSchema,
  },

  responses: {
    200: {
      description: "Timeline fetched",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CompanyTimelineResponse",
          },
        },
      },
    },
  },
});
