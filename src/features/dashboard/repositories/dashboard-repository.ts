import { getSupabaseServerClient } from "@/lib/supabase/server";

function isMissingColumnError(message: string) {
  return message.includes("does not exist");
}

export async function getDashboardData() {
  const supabase = await getSupabaseServerClient();

  const [incomesResult, expensesResultRaw, reservesResult, cardsResult, categoriesResult, fixedExpensesResult, installmentsResult] =
    await Promise.all([
      supabase.from("incomes").select("amount, status, received_on").is("deleted_at", null),
      supabase.from("expenses").select("amount, estimated_amount, fixed_expense_id, status, category_id, due_date").is("deleted_at", null),
      supabase.from("reserves").select("current_amount, target_amount, name, created_at"),
      supabase.from("credit_cards").select("limit_amount, name, due_day").is("deleted_at", null),
      supabase.from("categories").select("id, name").is("deleted_at", null),
      supabase.from("fixed_expenses").select("default_amount, due_day, is_active").is("deleted_at", null),
      supabase.from("credit_card_installments").select("amount, competency_month, status"),
    ]);

  const expensesResult =
    expensesResultRaw.error && isMissingColumnError(expensesResultRaw.error.message)
      ? await supabase.from("expenses").select("amount, status, category_id, due_date").is("deleted_at", null)
      : expensesResultRaw;

  for (const result of [
    incomesResult,
    expensesResult,
    reservesResult,
    cardsResult,
    categoriesResult,
    fixedExpensesResult,
    installmentsResult,
  ]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  return {
    incomes: incomesResult.data,
    expenses: (expensesResult.data ?? []).map((item) => {
      const expense = item as {
        amount: number;
        status: "pending" | "paid" | "late" | "cancelled";
        category_id: string | null;
        due_date: string;
        estimated_amount?: number | null;
        fixed_expense_id?: string | null;
      };

      return {
        amount: expense.amount,
        status: expense.status,
        category_id: expense.category_id,
        due_date: expense.due_date,
        estimated_amount: expense.estimated_amount ?? null,
        fixed_expense_id: expense.fixed_expense_id ?? null,
      };
    }),
    reserves: reservesResult.data,
    cards: cardsResult.data,
    categories: categoriesResult.data,
    fixedExpenses: fixedExpensesResult.data,
    installments: installmentsResult.data,
  };
}
