import { TaskPriority, TaskStatus } from "../generated/prisma/client.js";
import { z } from "zod";
import "../lib/openapi.js";

export const createTaskSchema = z
  .object({
    boardId: z.string().min(1).meta({
      description: "Board id",
      example: "cms20gw1t000dwkuosjitjn6o",
    }),

    title: z.string().min(1).meta({
      description: "Task title",
      example: "Learn JavaScript",
    }),

    description: z.string().optional().meta({
      description: "Task description",
      example: "Watch lesson about closures",
    }),

    priority: z.nativeEnum(TaskPriority).optional().meta({
      description: "Task priority",
      example: TaskPriority.low,
    }),

    assigneeId: z.string().optional().meta({
      description: "Assigned user id",
    }),

    dueDate: z.string().datetime().optional().meta({
      description: "Task due date",
      example: "2026-07-27T10:01:33.658Z",
    }),
  })
  .meta({
    id: "CreateTaskDto",
    description: "Create task payload",
  });

//update
export const updateTaskParamsSchema = z
  .object({
    taskId: z.string().min(1),
  })
  .meta({
    id: "UpdateTaskParamsDto",
  });

export const updateTaskSchema = z
  .object({
    boardId: z.string(),

    status: z.nativeEnum(TaskStatus).optional(),

    position: z.number().optional(),
  })
  .meta({
    id: "UpdateTaskDto",
  });
export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskParamsDto = z.infer<typeof updateTaskParamsSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;

export const taskResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  priority: z.nativeEnum(TaskPriority),
  status: z.nativeEnum(TaskStatus),
  position: z.number(),
  boardId: z.string(),
  assigneeId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const taskWithAssigneeResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  priority: z.nativeEnum(TaskPriority),
  status: z.nativeEnum(TaskStatus),
  position: z.number(),
  boardId: z.string(),
  assigneeId: z.string().nullable(),
  dueDate: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  assignee: z
    .object({
      id: z.string(),
      name: z.string().nullable(),
      image: z.string().nullable(),
    })
    .nullable(),
});
