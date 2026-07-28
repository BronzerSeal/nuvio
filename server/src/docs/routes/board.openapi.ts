import { z } from "zod";
import { registry } from "../registry.js";
import { TaskPriority, TaskStatus } from "../../generated/prisma/client.js";
import "../../lib/openapi.js";

import {
  boardTasks,
  createBoardSchema,
  deleteBoard,
  getAllBoards,
  getBoard,
} from "../../validate/board.validation.js";

const boardResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    companyId: z.string(),
    createdAt: z.string().datetime(),
  })
  .meta({
    id: "BoardResponse",
    description: "Board payload",
  });

const boardListResponseSchema = z.array(boardResponseSchema).meta({
  id: "BoardListResponse",
  description: "List of boards",
});

const boardAssigneeSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    image: z.string().nullable().optional(),
  })
  .meta({
    id: "BoardAssigneeResponse",
    description: "Board task assignee",
  });

const boardTaskResponseSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    priority: z.nativeEnum(TaskPriority),
    status: z.nativeEnum(TaskStatus),
    position: z.number(),
    dueDate: z.string().datetime().nullable().optional(),
    createdAt: z.string().datetime(),
    boardId: z.string(),
    assigneeId: z.string().nullable(),
    assignee: boardAssigneeSchema.nullable().optional(),
  })
  .meta({
    id: "BoardTaskResponse",
    description: "Task returned for a board",
  });

const boardTasksResponseSchema = z.array(boardTaskResponseSchema).meta({
  id: "BoardTasksResponse",
  description: "List of tasks for a board",
});

registry.register("CreateBoardDto", createBoardSchema);
registry.register("GetAllBoardsParamsDto", getAllBoards);
registry.register("GetBoardParamsDto", getBoard);
registry.register("DeleteBoardParamsDto", deleteBoard);
registry.register("BoardTasksParamsDto", boardTasks);
registry.register("BoardResponse", boardResponseSchema);
registry.register("BoardListResponse", boardListResponseSchema);
registry.register("BoardTaskResponse", boardTaskResponseSchema);
registry.register("BoardTasksResponse", boardTasksResponseSchema);

registry.registerPath({
  method: "post",
  path: "/api/board/new-board",
  tags: ["Boards"],

  request: {
    body: {
      content: {
        "application/json": {
          schema: createBoardSchema,
        },
      },
    },
  },

  responses: {
    201: {
      description: "Board created",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/BoardResponse",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/board/company/{companyId}",
  tags: ["Boards"],

  request: {
    params: getAllBoards,
  },

  responses: {
    200: {
      description: "Boards fetched",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/BoardListResponse",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/board/{companyId}/boards/{boardId}",
  tags: ["Boards"],

  request: {
    params: getBoard,
  },

  responses: {
    200: {
      description: "Board fetched",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/BoardResponse",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/board/{boardId}",
  tags: ["Boards"],

  request: {
    params: deleteBoard,
  },

  responses: {
    204: {
      description: "Board deleted",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/board/{boardId}/tasks",
  tags: ["Boards"],

  request: {
    params: boardTasks,
  },

  responses: {
    200: {
      description: "Board tasks fetched",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/BoardTasksResponse",
          },
        },
      },
    },
  },
});
