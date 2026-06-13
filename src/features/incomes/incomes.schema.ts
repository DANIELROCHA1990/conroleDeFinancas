import { z } from "zod";

export const incomeFormSchema = z.object({
  id: z.string().uuid().optional(),
  description: z.string().trim().min(3).max(120),
  amount: z.coerce.number().positive(),
  received_on: z.string().min(1),
  category_id: z.string().uuid(),
  status: z.enum(["received", "expected"]),
});

export type IncomeFormValues = z.infer<typeof incomeFormSchema>;
