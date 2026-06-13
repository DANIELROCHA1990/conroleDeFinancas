import { z } from "zod";

export const categoryFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(60),
  type: z.enum(["income", "expense", "both"]),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/),
  icon: z.string().trim().min(1).max(30),
  active: z.coerce.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
