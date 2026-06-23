import { startOfDay } from "date-fns";

import { creditCardFormSchema, creditCardPurchaseFormSchema } from "@/features/credit-cards/credit-cards.schema";
import { parseCurrencyInput } from "@/lib/currency/parse-currency";
import { calculateInstallments } from "@/lib/services/installment-service";

export function parseCreditCardInput(formData: FormData) {
  return creditCardFormSchema.parse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    bank_name: formData.get("bank_name"),
    limit_amount: parseCurrencyInput(formData.get("limit_amount")),
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
    amount: parseCurrencyInput(formData.get("amount")),
    purchased_at: formData.get("purchased_at"),
    current_installment: formData.get("current_installment"),
    installment_count: formData.get("installment_count"),
  });
}

export function resolveCreditCardPurchaseStatus({
  currentInstallment,
  installmentCount,
  purchasedAt,
  closingDay,
  dueDay,
  referenceDate = new Date(),
}: {
  currentInstallment: number;
  installmentCount: number;
  purchasedAt: string;
  closingDay: number;
  dueDay: number;
  referenceDate?: Date;
}) {
  return countRemainingInstallments({
    currentInstallment,
    installmentCount,
    purchasedAt,
    closingDay,
    dueDay,
    referenceDate,
  }) === 0
    ? "posted" as const
    : "open" as const;
}

function clampDueDay(targetDate: Date, dueDay: number) {
  const daysInMonth = new Date(
    Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth() + 1, 0),
  ).getUTCDate();

  return Math.min(dueDay, daysInMonth);
}

function addUtcMonths(date: Date, months: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
}

export function getFirstInstallmentDueDate({
  purchasedAt,
  closingDay,
  dueDay,
}: {
  purchasedAt: string;
  closingDay: number;
  dueDay: number;
}) {
  const purchaseDate = new Date(`${purchasedAt}T00:00:00Z`);
  const firstInstallmentMonth = purchaseDate.getUTCDate() > closingDay
    ? addUtcMonths(new Date(Date.UTC(purchaseDate.getUTCFullYear(), purchaseDate.getUTCMonth(), 1)), 1)
    : new Date(Date.UTC(purchaseDate.getUTCFullYear(), purchaseDate.getUTCMonth(), 1));

  return new Date(
    Date.UTC(
      firstInstallmentMonth.getUTCFullYear(),
      firstInstallmentMonth.getUTCMonth(),
      clampDueDay(firstInstallmentMonth, dueDay),
    ),
  );
}

export function getInstallmentDueDate({
  purchasedAt,
  closingDay,
  dueDay,
  installmentNumber,
}: {
  purchasedAt: string;
  closingDay: number;
  dueDay: number;
  installmentNumber: number;
}) {
  const firstDueDate = getFirstInstallmentDueDate({ purchasedAt, closingDay, dueDay });
  const targetMonth = addUtcMonths(
    new Date(Date.UTC(firstDueDate.getUTCFullYear(), firstDueDate.getUTCMonth(), 1)),
    installmentNumber - 1,
  );

  return new Date(
    Date.UTC(
      targetMonth.getUTCFullYear(),
      targetMonth.getUTCMonth(),
      clampDueDay(targetMonth, dueDay),
    ),
  );
}

export function listRemainingInstallmentNumbers({
  currentInstallment: _currentInstallment,
  installmentCount,
  purchasedAt,
  closingDay,
  dueDay,
  referenceDate = new Date(),
}: {
  currentInstallment: number;
  installmentCount: number;
  purchasedAt: string;
  closingDay: number;
  dueDay: number;
  referenceDate?: Date;
}) {
  void _currentInstallment;
  const normalizedReferenceDate = startOfDay(referenceDate);

  return Array.from(
    { length: Math.max(installmentCount, 0) },
    (_, index) => index + 1,
  ).filter((installmentNumber) => {
    const installmentDueDate = getInstallmentDueDate({
      purchasedAt,
      closingDay,
      dueDay,
      installmentNumber,
    });

    return installmentDueDate >= normalizedReferenceDate;
  });
}

export function countRemainingInstallments(input: {
  currentInstallment: number;
  installmentCount: number;
  purchasedAt: string;
  closingDay: number;
  dueDay: number;
  referenceDate?: Date;
}) {
  return listRemainingInstallmentNumbers(input).length;
}

export function calculateCurrentInvoiceAmount({
  amount,
  installmentCount,
  purchasedAt,
  closingDay,
  dueDay,
  competenceMonth,
}: {
  amount: number;
  installmentCount: number;
  purchasedAt: string;
  closingDay: number;
  dueDay: number;
  competenceMonth: string;
}) {
  return calculateInstallments(amount, installmentCount)
    .filter((installment) => {
      const dueDate = getInstallmentDueDate({
        purchasedAt,
        closingDay,
        dueDay,
        installmentNumber: installment.installmentNumber,
      });

      return dueDate.toISOString().slice(0, 7) === competenceMonth;
    })
    .reduce((sum, installment) => sum + installment.amount, 0);
}

export function buildPurchaseInstallments({
  amount,
  currentInstallment,
  installmentCount,
  purchasedAt,
  closingDay,
  dueDay,
}: {
  amount: number;
  currentInstallment: number;
  installmentCount: number;
  purchasedAt: string;
  closingDay: number;
  dueDay: number;
}) {
  const remainingInstallmentNumbers = listRemainingInstallmentNumbers({
    currentInstallment,
    installmentCount,
    purchasedAt,
    closingDay,
    dueDay,
  });

  return calculateInstallments(amount, installmentCount)
    .filter((installment) => remainingInstallmentNumbers.includes(installment.installmentNumber))
    .map((installment) => ({
      installment_number: installment.installmentNumber,
      total_installments: installment.totalInstallments,
      amount: installment.amount,
      competency_month: getInstallmentDueDate({
        purchasedAt,
        closingDay,
        dueDay,
        installmentNumber: installment.installmentNumber,
      }).toISOString().slice(0, 10),
      status: "open" as const,
    }));
}

export function buildPurchaseInstallmentTimeline({
  amount,
  currentInstallment: _currentInstallment,
  installmentCount,
  purchasedAt,
  closingDay,
  dueDay,
  referenceDate = new Date(),
}: {
  amount: number;
  currentInstallment: number;
  installmentCount: number;
  purchasedAt: string;
  closingDay: number;
  dueDay: number;
  referenceDate?: Date;
}) {
  void _currentInstallment;
  const normalizedReferenceDate = startOfDay(referenceDate);

  return calculateInstallments(amount, installmentCount).map((installment) => {
    const dueDate = getInstallmentDueDate({
      purchasedAt,
      closingDay,
      dueDay,
      installmentNumber: installment.installmentNumber,
    });

    return {
      installment_number: installment.installmentNumber,
      total_installments: installment.totalInstallments,
      amount: installment.amount,
      competency_month: dueDate.toISOString().slice(0, 10),
      status: dueDate < normalizedReferenceDate ? "paid" as const : "open" as const,
    };
  });
}
