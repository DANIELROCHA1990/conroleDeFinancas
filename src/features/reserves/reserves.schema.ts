import { z } from "zod";

export const reserveFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  objective: z.string().trim().max(300).nullable().optional(),
  target_amount: z.coerce.number().positive(),
  current_amount: z.coerce.number().min(0),
  target_date: z.string().date().nullable().optional(),
  status: z.enum(["active", "paused", "completed"]),
});

export const reserveTransactionSchema = z.object({
  reserve_id: z.string().uuid(),
  transaction_type: z.enum(["deposit", "withdrawal"]),
  amount: z.coerce.number().positive(),
  description: z.string().trim().max(300).nullable().optional(),
});

export type ReserveFormValues = z.infer<typeof reserveFormSchema>;
