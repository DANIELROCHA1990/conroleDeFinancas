import { eachMonthOfInterval, endOfMonth, format, startOfMonth, subMonths } from "date-fns";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function buildReportsSummary() {
  const supabase = await getSupabaseServerClient();
  const interval = {
    start: startOfMonth(subMonths(new Date(), 5)),
    end: endOfMonth(new Date()),
  };

  const [incomesResult, expensesResult, reservesResult, installmentsResult] = await Promise.all([
    supabase.from("incomes").select("amount, received_on, status").is("deleted_at", null),
    supabase.from("expenses").select("amount, due_date, status, categories(name)").is("deleted_at", null),
    supabase.from("reserves").select("current_amount, created_at"),
    supabase.from("credit_card_installments").select("amount, competency_month, status"),
  ]);

  for (const result of [incomesResult, expensesResult, reservesResult, installmentsResult]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  const months = eachMonthOfInterval(interval).map((month) => ({
    key: format(month, "yyyy-MM"),
    label: format(month, "MMM/yy"),
  }));
  const incomes = (incomesResult.data ?? []) as Array<{ amount: number; received_on: string; status: string }>;
  const expenses = (expensesResult.data ?? []) as Array<{
    amount: number;
    due_date: string;
    status: string;
    categories: { name?: string } | null;
  }>;
  const reserves = (reservesResult.data ?? []) as Array<{ current_amount: number; created_at: string }>;
  const installments = (installmentsResult.data ?? []) as Array<{ amount: number; competency_month: string; status: string }>;

  return {
    incomesByMonth: months.map(({ key, label }) => ({
      month: label,
      total: incomes
        .filter((item) => item.received_on.startsWith(key))
        .reduce((sum, item) => sum + item.amount, 0),
    })),
    expensesByMonth: months.map(({ key, label }) => ({
      month: label,
      total: expenses
        .filter((item) => item.due_date.startsWith(key))
        .reduce((sum, item) => sum + item.amount, 0),
    })),
    spendingByCategory: Object.values(
      expenses.reduce<Record<string, { name: string; value: number }>>((acc, item) => {
        const name = item.categories?.name ?? "Sem categoria";
        acc[name] ??= { name, value: 0 };
        acc[name].value += item.amount;
        return acc;
      }, {}),
    ),
    reservesEvolution: months.map(({ key, label }) => ({
      month: label,
      total: reserves
        .filter((item) => item.created_at.startsWith(key))
        .reduce((sum, item) => sum + item.current_amount, 0),
    })),
    futureInstallments: months.map(({ key, label }) => ({
      month: label,
      total: installments
        .filter((item) => item.competency_month.startsWith(key))
        .reduce((sum, item) => sum + item.amount, 0),
    })),
  };
}
