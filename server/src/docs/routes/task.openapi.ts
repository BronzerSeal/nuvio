import { registry } from "../registry.js";

import {
  createTaskSchema,
  taskResponseSchema,
  taskWithAssigneeResponseSchema,
  updateTaskParamsSchema,
  updateTaskSchema,
} from "../../validate/task.validation.js";

registry.register("CreateTaskDto", createTaskSchema);
registry.register("UpdateTaskParamsDto", updateTaskParamsSchema);
registry.register("UpdateTaskDto", updateTaskSchema);
registry.register("TaskResponse", taskResponseSchema);
registry.register("TaskWithAssigneeResponse", taskWithAssigneeResponseSchema);

registry.registerPath({
  method: "post",
  path: "/api/task/new-task",
  tags: ["Tasks"],

  request: {
    body: {
      content: {
        "application/json": {
          schema: createTaskSchema,
        },
      },
    },
  },

  responses: {
    201: {
      description: "Task created",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/TaskWithAssigneeResponse",
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/task/{taskId}",
  tags: ["Tasks"],

  request: {
    params: updateTaskParamsSchema,

    body: {
      content: {
        "application/json": {
          schema: updateTaskSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Task updated",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/TaskResponse",
          },
        },
      },
    },
  },
});
