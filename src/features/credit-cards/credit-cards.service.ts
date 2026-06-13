import { addMonths, startOfMonth } from "date-fns";

import { creditCardFormSchema, creditCardPurchaseFormSchema } from "@/features/credit-cards/credit-cards.schema";
import { calculateInstallments } from "@/lib/services/installment-service";

export function parseCreditCardInput(formData: FormData) {
  return creditCardFormSchema.parse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    bank_name: formData.get("bank_name"),
    limit_amount: formData.get("limit_amount"),
    best_purchase_day: formData.get("best_purchase_day") || null,
    closing_day: formData.get("closing_day"),
    due_day: formData.get("due_day"),
    last_four_digits: formData.get("last_four_digits") || null,
    is_active: formData.get("is_active") === "true",
  });
}

export function parseCreditCardPurchaseInput(formData: FormData) {
  return creditCardPurchaseFormSchema.parse({
    id: formData.get("id") || undefined,
    credit_card_id: formData.get("credit_card_id"),
    category_id: formData.get("category_id"),
    description: formData.get("description"),
    amount: formData.get("amount"),
    purchased_at: formData.get("purchased_at"),
    installment_count: formData.get("installment_count"),
    status: formData.get("status"),
  });
}

export function buildPurchaseInstallments({
  amount,
  installmentCount,
  purchasedAt,
}: {
  amount: number;
  installmentCount: number;
  purchasedAt: string;
}) {
  const baseDate = startOfMonth(new Date(`${purchasedAt}T00:00:00Z`));

  return calculateInstallments(amount, installmentCount).map((installment, index) => ({
    installment_number: installment.installmentNumber,
    total_installments: installment.totalInstallments,
    amount: installment.amount,
    competency_month: addMonths(baseDate, index).toISOString().slice(0, 10),
    status: "open" as const,
  }));
}
