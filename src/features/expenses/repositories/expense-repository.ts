import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ExpenseFormValues } from "@/features/expenses/expenses.schema";

function isMissingColumnError(message: string) {
  return message.includes("does not exist");
}

export type ExpenseListItem = {
  id: string;
  description: string;
  amount: number;
  estimated_amount: number | null;
  due_date: string;
  competence_month: string | null;
  fixed_expense_id: string | null;
  paid_at: string | null;
  status: "pending" | "paid" | "late" | "cancelled";
  payment_method: string | null;
  category_id: string | null;
  categories: { name: string } | null;
};

export async function listExpenses() {
  const supabase = await getSupabaseServerClient();
  const result = await supabase
    .from("expenses")
    .select("id, description, amount, estimated_amount, due_date, competence_month, fixed_expense_id, paid_at, status, payment_method, category_id, categories(name)")
    .is("deleted_at", null)
    .order("due_date", { ascending: false });

  if (result.error && isMissingColumnError(result.error.message)) {
    const fallback = await supabase
      .from("expenses")
      .select("id, description, amount, due_date, paid_at, status, payment_method, category_id, categories(name)")
      .is("deleted_at", null)
      .order("due_date", { ascending: false });

    if (fallback.error) {
      throw new Error(`Falha ao listar despesas: ${fallback.error.message}`);
    }

    return (fallback.data ?? []).map((item) => {
      const expense = item as Omit<ExpenseListItem, "estimated_amount" | "competence_month" | "fixed_expense_id">;

      return {
        ...expense,
        estimated_amount: null,
        competence_month: null,
        fixed_expense_id: null,
      };
    }) as ExpenseListItem[];
  }

  if (result.error) {
    throw new Error(`Falha ao listar despesas: ${result.error.message}`);
  }

  return (result.data ?? []) as ExpenseListItem[];
}

export async function createExpense(payload: {
  user_id: string;
  description: string;
  amount: number;
  estimated_amount?: number | null;
  due_date: string;
  competence_month?: string | null;
  fixed_expense_id?: string | null;
  paid_at?: string | null;
  category_id: string;
  status: "pending" | "paid" | "late" | "cancelled";
  payment_method?: string | null;
}) {
  const supabase = await getSupabaseServerClient();
  const result = await supabase.from("expenses").insert(payload);

  if (result.error && isMissingColumnError(result.error.message)) {
    const legacyPayload = {
      user_id: payload.user_id,
      description: payload.description,
      amount: payload.amount,
      due_date: payload.due_date,
      paid_at: payload.paid_at,
      category_id: payload.category_id,
      status: payload.status,
      payment_method: payload.payment_method,
    };
    const fallback = await supabase.from("expenses").insert(legacyPayload);

    if (fallback.error) {
      throw new Error(`Falha ao criar despesa: ${fallback.error.message}`);
    }

    return;
  }

  if (result.error) {
    throw new Error(`Falha ao criar despesa: ${result.error.message}`);
  }
}

export async function updateExpense(id: string, userId: string, payload: Partial<ExpenseFormValues>) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("expenses").update(payload).eq("id", id).eq("user_id", userId);

  if (error) {
    throw new Error(`Falha ao atualizar despesa: ${error.message}`);
  }
}

export async function updateGeneratedFixedExpense(id: string, userId: string, payload: {
  amount?: number;
  estimated_amount?: number | null;
  due_date?: string;
  status?: "pending" | "paid" | "late" | "cancelled";
  update_default_amount?: boolean;
  fixed_expense_id?: string | null;
}) {
  const supabase = await getSupabaseServerClient();
  const { update_default_amount, fixed_expense_id, ...expensePayload } = payload;
  const result = await supabase.from("expenses").update(expensePayload).eq("id", id).eq("user_id", userId);

  if (result.error && isMissingColumnError(result.error.message)) {
    return;
  }

  if (result.error) {
    throw new Error(`Falha ao atualizar despesa mensal recorrente: ${result.error.message}`);
  }

  if (update_default_amount && fixed_expense_id && typeof payload.amount === "number") {
    const { error: fixedError } = await supabase
      .from("fixed_expenses")
      .update({ default_amount: payload.amount })
      .eq("id", fixed_expense_id)
      .eq("user_id", userId);

    if (fixedError) {
      throw new Error(`Falha ao atualizar valor padrao da conta fixa: ${fixedError.message}`);
    }
  }
}

export async function softDeleteExpense(id: string, userId: string) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("expenses")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Falha ao excluir despesa: ${error.message}`);
  }
}
