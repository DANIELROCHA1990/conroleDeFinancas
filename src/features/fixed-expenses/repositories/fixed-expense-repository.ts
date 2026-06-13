import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { FixedExpenseFormValues } from "@/features/fixed-expenses/fixed-expenses.schema";
import {
  generateRecurringExpenseFromFixedExpense,
  getCompetenceMonth,
  shouldGenerateMonthlyExpense,
} from "@/features/fixed-expenses/fixed-expenses.service";

function isMissingColumnError(message: string) {
  return message.includes("does not exist");
}

export type FixedExpenseListItem = {
  id: string;
  name: string;
  amount_mode: "fixed" | "variable";
  default_amount: number;
  due_day: number;
  notify_before_days: number;
  is_active: boolean;
  category_id: string | null;
  categories: { name: string } | null;
};

export type FixedExpenseGeneratedExpense = {
  id: string;
  fixed_expense_id: string | null;
  description: string;
  amount: number;
  estimated_amount: number | null;
  due_date: string;
  competence_month: string | null;
  status: "pending" | "paid" | "late" | "cancelled";
};

export async function listFixedExpenses() {
  const supabase = await getSupabaseServerClient();
  const result = await supabase
    .from("fixed_expenses")
    .select("id, name, amount_mode, default_amount, due_day, notify_before_days, is_active, category_id, categories(name)")
    .is("deleted_at", null)
    .order("due_day");

  if (result.error && isMissingColumnError(result.error.message)) {
    const fallback = await supabase
      .from("fixed_expenses")
      .select("id, name, default_amount, due_day, notify_before_days, is_active, category_id, categories(name)")
      .is("deleted_at", null)
      .order("due_day");

    if (fallback.error) {
      throw new Error(`Falha ao listar contas fixas: ${fallback.error.message}`);
    }

    return (fallback.data ?? []).map((item) => {
      const fixedExpense = item as Omit<FixedExpenseListItem, "amount_mode">;

      return {
        ...fixedExpense,
        amount_mode: "fixed" as const,
      };
    }) as FixedExpenseListItem[];
  }

  if (result.error) {
    throw new Error(`Falha ao listar contas fixas: ${result.error.message}`);
  }

  return (result.data ?? []) as FixedExpenseListItem[];
}

export async function listGeneratedFixedExpenses() {
  const supabase = await getSupabaseServerClient();
  const result = await supabase
    .from("expenses")
    .select("id, fixed_expense_id, description, amount, estimated_amount, due_date, competence_month, status")
    .not("fixed_expense_id", "is", null)
    .is("deleted_at", null)
    .order("competence_month", { ascending: false });

  if (result.error && isMissingColumnError(result.error.message)) {
    return [];
  }

  if (result.error) {
    throw new Error(`Falha ao listar despesas mensais geradas: ${result.error.message}`);
  }

  return (result.data ?? []) as FixedExpenseGeneratedExpense[];
}

export async function createFixedExpense(payload: {
  user_id: string;
  name: string;
  amount_mode: "fixed" | "variable";
  default_amount: number;
  due_day: number;
  notify_before_days: number;
  category_id: string;
  is_active: boolean;
}) {
  const supabase = await getSupabaseServerClient();
  const result = await supabase
    .from("fixed_expenses")
    .insert(payload)
    .select("id, name, amount_mode, default_amount, due_day, notify_before_days, is_active, category_id, categories(name)")
    .single();

  if (result.error && isMissingColumnError(result.error.message)) {
    const legacyPayload = {
      user_id: payload.user_id,
      name: payload.name,
      default_amount: payload.default_amount,
      due_day: payload.due_day,
      notify_before_days: payload.notify_before_days,
      category_id: payload.category_id,
      is_active: payload.is_active,
    };
    const fallback = await supabase
      .from("fixed_expenses")
      .insert(legacyPayload)
      .select("id, name, default_amount, due_day, notify_before_days, is_active, category_id, categories(name)")
      .single();

    if (fallback.error) {
      throw new Error(`Falha ao criar conta fixa: ${fallback.error.message}`);
    }

    return {
      ...(fallback.data as Omit<FixedExpenseListItem, "amount_mode">),
      amount_mode: "fixed" as const,
    } as FixedExpenseListItem;
  }

  if (result.error) {
    throw new Error(`Falha ao criar conta fixa: ${result.error.message}`);
  }

  return result.data as FixedExpenseListItem;
}

export async function updateFixedExpense(id: string, userId: string, payload: Partial<FixedExpenseFormValues>) {
  const supabase = await getSupabaseServerClient();
  const result = await supabase.from("fixed_expenses").update(payload).eq("id", id).eq("user_id", userId);

  if (result.error && isMissingColumnError(result.error.message)) {
    const legacyPayload = {
      id: payload.id,
      name: payload.name,
      default_amount: payload.default_amount,
      due_day: payload.due_day,
      notify_before_days: payload.notify_before_days,
      category_id: payload.category_id,
      is_active: payload.is_active,
    };
    const fallback = await supabase.from("fixed_expenses").update(legacyPayload).eq("id", id).eq("user_id", userId);

    if (fallback.error) {
      throw new Error(`Falha ao atualizar conta fixa: ${fallback.error.message}`);
    }

    return;
  }

  if (result.error) {
    throw new Error(`Falha ao atualizar conta fixa: ${result.error.message}`);
  }
}

export async function softDeleteFixedExpense(id: string, userId: string) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("fixed_expenses")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Falha ao excluir conta fixa: ${error.message}`);
  }
}

export async function ensureMonthlyFixedExpenseGenerated(fixedExpense: FixedExpenseListItem, userId: string, month = new Date()) {
  if (!fixedExpense.is_active || !fixedExpense.category_id) {
    return;
  }

  const supabase = await getSupabaseServerClient();
  const competenceMonth = getCompetenceMonth(month);
  const countResult = await supabase
    .from("expenses")
    .select("id", { head: true, count: "exact" })
    .eq("user_id", userId)
    .eq("fixed_expense_id", fixedExpense.id)
    .eq("competence_month", competenceMonth)
    .is("deleted_at", null);

  if (countResult.error && isMissingColumnError(countResult.error.message)) {
    return;
  }

  if (countResult.error) {
    throw new Error(`Falha ao verificar duplicidade da conta fixa: ${countResult.error.message}`);
  }

  if (!shouldGenerateMonthlyExpense(countResult.count ?? 0)) {
    return;
  }

  const payload = generateRecurringExpenseFromFixedExpense({
    fixedExpenseId: fixedExpense.id,
    userId,
    categoryId: fixedExpense.category_id,
    name: fixedExpense.name,
    defaultAmount: fixedExpense.default_amount,
    dueDay: fixedExpense.due_day,
    month,
  });

  const insertResult = await supabase.from("expenses").insert(payload);

  if (insertResult.error && isMissingColumnError(insertResult.error.message)) {
    return;
  }

  if (insertResult.error) {
    throw new Error(`Falha ao gerar despesa mensal da conta fixa: ${insertResult.error.message}`);
  }
}
