import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
