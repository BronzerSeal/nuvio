import { z } from "zod";

export const getTimeSpansSchema = z.object({
  availabilityId: z.string(),
});

export const createTimeSpanParamsSchema = z.object({
  availabilityId: z.string().cuid(),
});
export const createTimeSpanBodySchema = z.object({
  week_day: z.number().int().min(0).max(6),

  start_time: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Invalid time format. Expected HH:mm",
    ),

  end_time: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Invalid time format. Expected HH:mm",
    ),

  active: z.boolean().default(true),
});

export const updateTimeSpanParamsSchema = z.object({
  availabilityId: z.string().min(1),
  timeSpanId: z.string().min(1),
});
export const updateTimeSpanBodySchema = z
  .object({
    week_day: z.number().int().min(0).max(6).optional(),
    start_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .optional(),
    end_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .optional(),
    active: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.week_day !== undefined ||
      data.start_time !== undefined ||
      data.end_time !== undefined ||
      data.active !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export const deleteTimeSpanParamsSchema = z.object({
  availabilityId: z.string().min(1),
  timeSpanId: z.string().min(1),
});

export type getTimeSpansDto = z.infer<typeof getTimeSpansSchema>;
export type createTimeSpanParamsDto = z.infer<
  typeof createTimeSpanParamsSchema
>;
export type createTimeSpanBodyDto = z.infer<typeof createTimeSpanBodySchema>;
export type UpdateTimeSpanParamsDto = z.infer<
  typeof updateTimeSpanParamsSchema
>;
export type UpdateTimeSpanBodyDto = z.infer<typeof updateTimeSpanBodySchema>;
export type DeleteTimeSpanParamsDto = z.infer<
  typeof deleteTimeSpanParamsSchema
>;
