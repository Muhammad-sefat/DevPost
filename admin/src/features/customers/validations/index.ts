import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  plan: z.enum(["free", "pro", "enterprise"]),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
