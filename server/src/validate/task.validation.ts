import { TaskPriority, TaskStatus } from "../generated/prisma/client.js";
import { z } from "zod";

export const createTaskSchema = z.object({
  boardId: z.string().min(1),
  title: z.string().min(1),

  description: z.string().optional(),

  priority: z.nativeEnum(TaskPriority).optional(),

  assigneeId: z.string().optional(),

  dueDate: z.string().datetime().optional(),
});
export type CreateTaskDto = z.infer<typeof createTaskSchema>;

//update
export const updateTaskParamsSchema = z.object({
  taskId: z.string().min(1),
});
export type UpdateTaskParamsDto = z.infer<typeof updateTaskParamsSchema>;

export const updateTaskSchema = z.object({
  boardId: z.string(),
  status: z.nativeEnum(TaskStatus).optional(),
  position: z.number().optional(),
});
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
