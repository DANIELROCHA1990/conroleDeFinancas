import { z } from "zod";

export const creditCardFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  bank_name: z.string().trim().min(2).max(120),
  limit_amount: z.coerce.number().positive(),
  best_purchase_day: z.coerce.number().int().min(1).max(31).nullable().optional(),
  closing_day: z.coerce.number().int().min(1).max(31),
  due_day: z.coerce.number().int().min(1).max(31),
  last_four_digits: z.string().trim().regex(/^\d{4}$/).nullable().optional(),
  is_active: z.coerce.boolean().default(true),
});

export const creditCardPurchaseFormSchema = z.object({
  id: z.string().uuid().optional(),
  credit_card_id: z.string().uuid(),
  category_id: z.string().uuid(),
  description: z.string().trim().min(2).max(160),
  amount: z.coerce.number().positive(),
  purchased_at: z.string().date(),
  current_installment: z.coerce.number().int().min(1).max(48),
  installment_count: z.coerce.number().int().min(1).max(48),
}).refine((value) => value.current_installment <= value.installment_count, {
  message: "A parcela atual nao pode ser maior que o total de parcelas.",
  path: ["current_installment"],
});

export type CreditCardFormValues = z.infer<typeof creditCardFormSchema>;
export type CreditCardPurchaseFormValues = z.infer<typeof creditCardPurchaseFormSchema>;
