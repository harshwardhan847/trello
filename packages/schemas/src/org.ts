import { z } from "zod";

export const orgSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  description: z.string().max(1000).optional(),
});

export type CreateOrganizationInput = z.infer<typeof orgSchema>;
