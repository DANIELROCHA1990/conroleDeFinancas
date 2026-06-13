import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2).max(60),
  type: z.enum(["income", "expense", "both"]),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/),
  icon: z.string().min(1).max(30),
  active: z.boolean(),
});
