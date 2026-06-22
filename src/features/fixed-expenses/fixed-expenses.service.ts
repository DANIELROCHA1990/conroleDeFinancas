import { fixedExpenseFormSchema } from "@/features/fixed-expenses/fixed-expenses.schema";
import { parseCurrencyInput } from "@/lib/currency/parse-currency";

export function parseFixedExpenseInput(formData: FormData) {
  return fixedExpenseFormSchema.parse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    amount_mode: formData.get("amount_mode"),
    default_amount: parseCurrencyInput(formData.get("default_amount")),
    due_day: formData.get("due_day"),
    notify_before_days: formData.get("notify_before_days"),
    category_id: formData.get("category_id"),
    start_competence_month: normalizeMonthInputValue(String(formData.get("start_competence_month"))),
    assignment_mode: formData.get("assignment_mode"),
    assignee_id: formData.get("assignee_id") ? String(formData.get("assignee_id")) : null,
    is_active: formData.get("is_active") === "true",
  });
}

export function calculateNextDueDate(dueDay: number, month: Date) {
  return new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), dueDay))
    .toISOString()
    .slice(0, 10);
}

export function addMonths(date: Date, months: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
}

export function parseCompetenceMonth(value: string) {
  return new Date(`${value.slice(0, 10)}T00:00:00Z`);
}

export function getCompetenceMonth(month: Date) {
  return new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 10);
}

export function getNextMonthStart() {
  return addMonths(new Date(), 1);
}

export function formatMonthInputValue(value: string | Date | null | undefined) {
  if (!value) {
    return getCompetenceMonth(getNextMonthStart()).slice(0, 7);
  }

  const month = typeof value === "string" ? value : getCompetenceMonth(value);
  return month.slice(0, 7);
}

export function normalizeMonthInputValue(value: string) {
  return `${value}-01`;
}

export function listCompetenceMonthsBetween(startMonth: string, endMonth: string) {
  const months: string[] = [];
  let cursor = parseCompetenceMonth(startMonth);
  const finalMonth = parseCompetenceMonth(endMonth);

  while (cursor <= finalMonth) {
    months.push(getCompetenceMonth(cursor));
    cursor = addMonths(cursor, 1);
  }

  return months;
}

export function compareCompetenceMonth(a: string, b: string) {
  return parseCompetenceMonth(a).getTime() - parseCompetenceMonth(b).getTime();
}

export function resolveNextMissingCompetenceMonth({
  startCompetenceMonth,
  generatedMonths,
  referenceMonth = getCompetenceMonth(new Date()),
}: {
  startCompetenceMonth: string;
  generatedMonths: string[];
  referenceMonth?: string;
}) {
  const firstRelevantMonth = compareCompetenceMonth(startCompetenceMonth, referenceMonth) > 0
    ? startCompetenceMonth
    : referenceMonth;
  let cursor = parseCompetenceMonth(firstRelevantMonth);
  const generatedSet = new Set(generatedMonths);

  while (generatedSet.has(getCompetenceMonth(cursor))) {
    cursor = addMonths(cursor, 1);
  }

  return getCompetenceMonth(cursor);
}

export function resolveNextScheduledCompetenceMonth({
  startCompetenceMonth,
  referenceDate = new Date(),
}: {
  startCompetenceMonth: string;
  referenceDate?: Date;
}) {
  const nextCalendarMonth = getCompetenceMonth(addMonths(referenceDate, 1));
  return compareCompetenceMonth(startCompetenceMonth, nextCalendarMonth) > 0
    ? startCompetenceMonth
    : nextCalendarMonth;
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
