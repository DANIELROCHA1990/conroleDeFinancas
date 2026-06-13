import { z } from "zod";

export const expenseFormSchema = z.object({
  id: z.string().uuid().optional(),
  description: z.string().trim().min(3).max(120),
  amount: z.coerce.number().positive(),
  estimated_amount: z.coerce.number().positive().optional().nullable(),
  due_date: z.string().min(1),
  competence_month: z.string().optional().nullable(),
  fixed_expense_id: z.string().uuid().optional().nullable(),
  paid_at: z.string().optional().nullable(),
  category_id: z.string().uuid(),
  status: z.enum(["pending", "paid", "late", "cancelled"]),
  payment_method: z.string().trim().max(40).optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
