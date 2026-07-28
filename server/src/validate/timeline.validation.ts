import { z } from "zod";
import { TaskType } from "../generated/prisma/enums.js";

export const createTimelineRowParamsSchema = z.object({
  timelineId: z.string(),
});

export const createTimelineRowSchema = z.object({
  rowName: z.string().trim().min(1),
});

export const deleteTimelineRowsParamsSchema = z.object({
  timelineId: z.string(),
});

export const deleteTimelineRowsSchema = z.object({
  rowIds: z.array(z.string()).min(1, "Select at least one row"),
});

export const getTimelineRowsParamsSchema = z.object({
  timelineId: z.string(),
});

export const createTimelineTaskParamsSchema = z.object({
  timelineId: z.string(),
  rowId: z.string(),
});

export const createTimelineTaskSchema = z.object({
  startTime: z.string(),
  duration: z.number().int().positive(),
  title: z.string().trim().min(1),
  type: z.nativeEnum(TaskType),
  attendees: z.number().int().min(0),
});

export const getTimelineTasksParamsSchema = z.object({
  timelineId: z.string(),
});

export const updateTimelineTaskParamsSchema = z.object({
  timelineId: z.string(),
  taskId: z.string(),
});

export const updateTimelineTaskSchema = z.object({
  startTime: z.string().optional(),
  rowId: z.string().optional(),
});

export const deleteTimelineTasksParamsSchema = z.object({
  timelineId: z.string(),
});

export const deleteTimelineTasksSchema = z.object({
  taskIds: z.array(z.string()).min(1, "Select at least one task"),
});

export type CreateTimelineRowParamsDto = z.infer<
  typeof createTimelineRowParamsSchema
>;

export type CreateTimelineRowDto = z.infer<typeof createTimelineRowSchema>;

export type DeleteTimelineRowsParamsDto = z.infer<
  typeof deleteTimelineRowsParamsSchema
>;

export type DeleteTimelineRowsDto = z.infer<typeof deleteTimelineRowsSchema>;

export type GetTimelineRowsParamsDto = z.infer<
  typeof getTimelineRowsParamsSchema
>;

export type CreateTimelineTaskParamsDto = z.infer<
  typeof createTimelineTaskParamsSchema
>;

export type CreateTimelineTaskDto = z.infer<typeof createTimelineTaskSchema>;

export type GetTimelineTasksParamsDto = z.infer<
  typeof getTimelineTasksParamsSchema
>;

export type UpdateTimelineTaskParamsDto = z.infer<
  typeof updateTimelineTaskParamsSchema
>;

export type UpdateTimelineTaskDto = z.infer<typeof updateTimelineTaskSchema>;

export type DeleteTimelineTasksParamsDto = z.infer<
  typeof deleteTimelineTasksParamsSchema
>;

export type DeleteTimelineTasksDto = z.infer<typeof deleteTimelineTasksSchema>;
