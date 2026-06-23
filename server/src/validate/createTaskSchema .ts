import { TaskPriority } from "../generated/prisma/client.js";
import { z } from "zod";

export const createTaskSchema = z.object({
  boardId: z.string().min(1),
  title: z.string().min(1),

  description: z.string().optional(),

  priority: z.nativeEnum(TaskPriority).optional(),

  assigneeId: z.string().optional(),

  dueDate: z.string().datetime().optional(),
});
