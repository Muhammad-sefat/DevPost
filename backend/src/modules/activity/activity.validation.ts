import { z } from "zod";

export const getActivityByDateSchema = z.object({
  params: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  }),
});

export const getMonthlyActivitySchema = z.object({
  query: z.object({
    year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number").optional(),
    month: z.string().regex(/^(0?[1-9]|1[0-2])$/, "Month must be a number between 1 and 12").optional(),
  }),
});
