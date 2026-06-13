import { z } from "zod";

export const expenseSchema = z.object({
  description: z.string().min(3).max(120),
  amount: z.number().positive(),
  status: z.enum(["pending", "paid", "late", "cancelled"]),
  categoryId: z.string().uuid().or(z.string().min(1)),
});
