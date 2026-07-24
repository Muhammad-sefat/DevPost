import { z } from "zod";

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .optional(),
  avatarUrl: z.string().url("Invalid URL format").optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

