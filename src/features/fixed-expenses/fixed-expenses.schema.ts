import { z } from "zod";

export const fixedExpenseFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  amount_mode: z.enum(["fixed", "variable"]),
  default_amount: z.coerce.number().positive(),
  due_day: z.coerce.number().int().min(1).max(31),
  notify_before_days: z.coerce.number().int().min(0).max(30),
  category_id: z.string().uuid(),
  start_competence_month: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  assignment_mode: z.enum(["single", "all"]),
  assignee_id: z.string().uuid().nullable().optional(),
  is_active: z.coerce.boolean().default(true),
});

export type FixedExpenseFormValues = z.infer<typeof fixedExpenseFormSchema>;
