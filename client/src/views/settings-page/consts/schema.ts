import { z } from "zod";

export const profileFormSchema = z.object({
  name: z
    .string("Please enter your username.")
    .min(2, "Username must be at least 2 characters.")
    .max(30, "Username must not be longer than 30 characters."),
  email: z.email({
    error: (iss) =>
      iss.input === undefined
        ? "Please select an email to display."
        : undefined,
  }),
  bio: z.string().max(160),
  urls: z.array(
    z.object({
      value: z.url("Please enter a valid URL."),
    }),
  ),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
