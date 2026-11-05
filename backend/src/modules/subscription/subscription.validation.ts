import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  planId: z.enum(["basic", "growth", "pro"], {
    errorMap: () => ({ message: "Invalid plan ID. Choose 'basic', 'growth', or 'pro'." }),
  }),
});

export const verifySessionSchema = z.object({
  sessionId: z.string({
    required_error: "Stripe checkout session ID is required",
  }).min(1, "Session ID cannot be empty"),
});

