import { z } from "zod";

export const paymentAssigneeFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(80),
  active: z.coerce.boolean().default(true),
});

export type PaymentAssigneeFormValues = z.infer<typeof paymentAssigneeFormSchema>;
