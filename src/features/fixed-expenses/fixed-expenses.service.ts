import { fixedExpenseFormSchema } from "@/features/fixed-expenses/fixed-expenses.schema";

export function parseFixedExpenseInput(formData: FormData) {
  return fixedExpenseFormSchema.parse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    amount_mode: formData.get("amount_mode"),
    default_amount: formData.get("default_amount"),
    due_day: formData.get("due_day"),
    notify_before_days: formData.get("notify_before_days"),
    category_id: formData.get("category_id"),
    is_active: formData.get("is_active") === "true",
  });
}

export function calculateNextDueDate(dueDay: number, month: Date) {
  return new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), dueDay))
    .toISOString()
    .slice(0, 10);
}

export function getCompetenceMonth(month: Date) {
  return new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 10);
}

export function generateRecurringExpenseFromFixedExpense({
  fixedExpenseId,
  userId,
  categoryId,
  name,
  defaultAmount,
  dueDay,
  month,
}: {
  fixedExpenseId: string;
  userId: string;
  categoryId: string;
  name: string;
  defaultAmount: number;
  dueDay: number;
  month: Date;
}) {
  const competenceMonth = getCompetenceMonth(month);
  const dueDate = calculateNextDueDate(dueDay, month);

  return {
    user_id: userId,
    fixed_expense_id: fixedExpenseId,
    category_id: categoryId,
    description: name,
    amount: defaultAmount,
    estimated_amount: defaultAmount,
    due_date: dueDate,
    competence_month: competenceMonth,
    status: "pending" as const,
    payment_method: null,
  };
}

export function shouldGenerateMonthlyExpense(existingCount: number) {
  return existingCount === 0;
}

export function calculateEstimatedVsRealVariation({
  estimatedAmount,
  realAmount,
}: {
  estimatedAmount: number;
  realAmount: number | null;
}) {
  if (realAmount === null) {
    return 0;
  }

  return Number((realAmount - estimatedAmount).toFixed(2));
}

export function getEffectiveExpenseAmount({
  amount,
  estimatedAmount,
}: {
  amount: number | null;
  estimatedAmount: number | null;
}) {
  return amount ?? estimatedAmount ?? 0;
}
