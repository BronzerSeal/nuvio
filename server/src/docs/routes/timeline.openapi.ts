import { z } from "zod";
import { registry } from "../registry.js";
import { TaskType } from "../../generated/prisma/client.js";
import "../../lib/openapi.js";

import {
  createTimelineRowParamsSchema,
  createTimelineRowSchema,
  createTimelineTaskParamsSchema,
  createTimelineTaskSchema,
  deleteTimelineRowsParamsSchema,
  deleteTimelineRowsSchema,
  deleteTimelineTasksParamsSchema,
  deleteTimelineTasksSchema,
  getTimelineRowsParamsSchema,
  getTimelineTasksParamsSchema,
  updateTimelineTaskParamsSchema,
  updateTimelineTaskSchema,
} from "../../validate/timeline.validation.js";

const timelineRowResponseSchema = z
  .object({
    id: z.string(),
    timelineId: z.string(),
    label: z.string(),
    capacity: z.number().int(),
  })
  .meta({
    id: "TimelineRowResponse",
    description: "Timeline row payload",
  });

const timelineRowsResponseSchema = z.array(timelineRowResponseSchema).meta({
  id: "TimelineRowsResponse",
  description: "List of timeline rows",
});

const timelineTaskResponseSchema = z
  .object({
    id: z.string(),
    rowId: z.string(),
    startTime: z.string(),
    duration: z.number().int().positive(),
    title: z.string(),
    type: z.nativeEnum(TaskType),
    attendees: z.number().int().min(0),
  })
  .meta({
    id: "TimelineTaskResponse",
    description: "Timeline task payload",
  });

const timelineTasksResponseSchema = z.array(timelineTaskResponseSchema).meta({
  id: "TimelineTasksResponse",
  description: "List of timeline tasks",
});

registry.register("CreateTimelineRowParamsDto", createTimelineRowParamsSchema);
registry.register("CreateTimelineRowDto", createTimelineRowSchema);
registry.register(
  "DeleteTimelineRowsParamsDto",
  deleteTimelineRowsParamsSchema,
);
registry.register("DeleteTimelineRowsDto", deleteTimelineRowsSchema);
registry.register("GetTimelineRowsParamsDto", getTimelineRowsParamsSchema);
registry.register(
  "CreateTimelineTaskParamsDto",
  createTimelineTaskParamsSchema,
);
registry.register("CreateTimelineTaskDto", createTimelineTaskSchema);
registry.register("GetTimelineTasksParamsDto", getTimelineTasksParamsSchema);
registry.register(
  "UpdateTimelineTaskParamsDto",
  updateTimelineTaskParamsSchema,
);
registry.register("UpdateTimelineTaskDto", updateTimelineTaskSchema);
registry.register(
  "DeleteTimelineTasksParamsDto",
  deleteTimelineTasksParamsSchema,
);
registry.register("DeleteTimelineTasksDto", deleteTimelineTasksSchema);
registry.register("TimelineRowResponse", timelineRowResponseSchema);
registry.register("TimelineRowsResponse", timelineRowsResponseSchema);
registry.register("TimelineTaskResponse", timelineTaskResponseSchema);
registry.register("TimelineTasksResponse", timelineTasksResponseSchema);

registry.registerPath({
  method: "post",
  path: "/api/timeline/{timelineId}/rows",
  tags: ["Timeline"],

  request: {
    params: createTimelineRowParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: createTimelineRowSchema,
        },
      },
    },
  },

  responses: {
    201: {
      description: "Timeline row created",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/TimelineRowResponse",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/timeline/{timelineId}/rows",
  tags: ["Timeline"],

  request: {
    params: deleteTimelineRowsParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: deleteTimelineRowsSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Timeline rows deleted",
      content: {
        "application/json": {
          schema: {
            type: "number",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/timeline/{timelineId}/rows",
  tags: ["Timeline"],

  request: {
    params: getTimelineRowsParamsSchema,
  },

  responses: {
    200: {
      description: "Timeline rows fetched",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/TimelineRowsResponse",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/timeline/{timelineId}/rows/{rowId}/tasks",
  tags: ["Timeline"],

  request: {
    params: createTimelineTaskParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: createTimelineTaskSchema,
        },
      },
    },
  },

  responses: {
    201: {
      description: "Timeline task created",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/TimelineTaskResponse",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/timeline/{timelineId}/tasks",
  tags: ["Timeline"],

  request: {
    params: getTimelineTasksParamsSchema,
  },

  responses: {
    200: {
      description: "Timeline tasks fetched",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/TimelineTasksResponse",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/timeline/{timelineId}/tasks/{taskId}",
  tags: ["Timeline"],

  request: {
    params: updateTimelineTaskParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: updateTimelineTaskSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Timeline task updated",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/TimelineTaskResponse",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/timeline/{timelineId}/tasks",
  tags: ["Timeline"],

  request: {
    params: deleteTimelineTasksParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: deleteTimelineTasksSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Timeline tasks deleted",
      content: {
        "application/json": {
          schema: {
            type: "number",
          },
        },
      },
    },
  },
});
