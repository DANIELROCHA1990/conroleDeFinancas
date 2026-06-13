import { z } from "zod";

export const incomeSchema = z.object({
  description: z.string().min(3).max(120),
  amount: z.number().positive(),
  status: z.enum(["received", "expected"]),
});
