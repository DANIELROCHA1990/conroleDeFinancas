import { getSupabaseServerClient } from "@/lib/supabase/server";

import { getCompetenceMonth } from "@/features/fixed-expenses/fixed-expenses.service";
import { listActivePaymentAssignees } from "@/features/settings/repositories/payment-assignee-repository";

type FixedExpenseAssignment = {
  id: string;
  name: string;
  assignment_mode?: "single" | "all";
  assignee_id?: string | null;
};

export type FixedExpenseMonthlyAllocation = {
  id: string;
  fixed_expense_id: string;
  expense_id: string;
  assignee_id: string | null;
  assignee_name: string;
  amount: number;
  competence_month: string;
};

export type MonthlyRepassSummary = {
  totalsByAssignee: Array<{ name: string; value: number }>;
  breakdownByFixedExpense: Array<{
    fixedExpenseId: string;
    fixedExpenseName: string;
    totalAmount: number;
    allocations: Array<{ assigneeName: string; amount: number }>;
  }>;
  grandTotal: number;
};

function splitAmountInCents(amount: number, assigneeCount: number) {
  const totalCents = Math.round(amount * 100);
  const base = Math.floor(totalCents / assigneeCount);
  const remainder = totalCents % assigneeCount;

  return Array.from({ length: assigneeCount }, (_, index) => (base + (index < remainder ? 1 : 0)) / 100);
}

export async function replaceMonthlyAllocationsForExpense({
  userId,
  fixedExpense,
  expenseId,
  competenceMonth,
  amount,
  overrideAssignmentMode,
  overrideAssigneeId,
}: {
  userId: string;
  fixedExpense: FixedExpenseAssignment;
  expenseId: string;
  competenceMonth: string;
  amount: number;
  overrideAssignmentMode?: "single" | "all";
  overrideAssigneeId?: string | null;
}) {
  const supabase = await getSupabaseServerClient();
  const activeAssignees = await listActivePaymentAssignees();
  const assignmentMode = overrideAssignmentMode ?? fixedExpense.assignment_mode ?? "single";
  const assigneeId = overrideAssigneeId === undefined ? fixedExpense.assignee_id ?? null : overrideAssigneeId;

  const selectedAssignee = activeAssignees.find((item) => item.id === assigneeId);
  const targetAssignees =
    assignmentMode === "single" && selectedAssignee
      ? [selectedAssignee]
      : activeAssignees;

  if (targetAssignees.length === 0) {
    throw new Error("Cadastre ao menos um responsavel ativo para gerar o repasse mensal.");
  }

  const amounts = splitAmountInCents(amount, targetAssignees.length);

  const deleteResult = await supabase
    .from("fixed_expense_monthly_allocations")
    .delete()
    .eq("user_id", userId)
    .eq("expense_id", expenseId);

  if (deleteResult.error) {
    throw new Error(`Falha ao limpar rateio mensal: ${deleteResult.error.message}`);
  }

  const insertResult = await supabase.from("fixed_expense_monthly_allocations").insert(
    targetAssignees.map((item, index) => ({
      user_id: userId,
      fixed_expense_id: fixedExpense.id,
      expense_id: expenseId,
      assignee_id: item.id,
      assignee_name: item.name,
      amount: amounts[index] ?? 0,
      competence_month: competenceMonth,
    })),
  );

  if (insertResult.error) {
    throw new Error(`Falha ao salvar rateio mensal: ${insertResult.error.message}`);
  }
}

export async function syncCurrentMonthlyAllocationForFixedExpense({
  userId,
  fixedExpense,
}: {
  userId: string;
  fixedExpense: FixedExpenseAssignment;
}) {
  const supabase = await getSupabaseServerClient();
  const competenceMonth = getCompetenceMonth(new Date());
  const expenseResult = await supabase
    .from("expenses")
    .select("id, amount, estimated_amount, competence_month")
    .eq("user_id", userId)
    .eq("fixed_expense_id", fixedExpense.id)
    .eq("competence_month", competenceMonth)
    .is("deleted_at", null)
    .maybeSingle();

  if (expenseResult.error || !expenseResult.data) {
    return;
  }

  await replaceMonthlyAllocationsForExpense({
    userId,
    fixedExpense,
    expenseId: expenseResult.data.id,
    competenceMonth: expenseResult.data.competence_month ?? competenceMonth,
    amount: expenseResult.data.amount ?? expenseResult.data.estimated_amount ?? 0,
  });
}

export async function listAllocationMonths() {
  const supabase = await getSupabaseServerClient();
  const result = await supabase
    .from("fixed_expense_monthly_allocations")
    .select("competence_month")
    .order("competence_month", { ascending: false });

  if (result.error) {
    throw new Error(`Falha ao listar meses de repasse: ${result.error.message}`);
  }

  return Array.from(new Set((result.data ?? []).map((item) => item.competence_month)));
}

export async function listMonthlyRepasses(competenceMonth: string): Promise<MonthlyRepassSummary> {
  const supabase = await getSupabaseServerClient();
  const fixedExpensesResult = await supabase
    .from("fixed_expenses")
    .select("id, name")
    .is("deleted_at", null);

  if (fixedExpensesResult.error) {
    throw new Error(`Falha ao listar contas fixas para o repasse: ${fixedExpensesResult.error.message}`);
  }

  const fixedExpenseIds = (fixedExpensesResult.data ?? []).map((item) => item.id);
  const fixedExpenseNameById = new Map((fixedExpensesResult.data ?? []).map((item) => [item.id, item.name]));

  if (fixedExpenseIds.length === 0) {
    return {
      totalsByAssignee: [],
      breakdownByFixedExpense: [],
      grandTotal: 0,
    };
  }

  const result = await supabase
    .from("fixed_expense_monthly_allocations")
    .select("fixed_expense_id, assignee_name, amount")
    .eq("competence_month", competenceMonth)
    .in("fixed_expense_id", fixedExpenseIds);

  if (result.error) {
    throw new Error(`Falha ao listar repasses do mes: ${result.error.message}`);
  }

  const totals = new Map<string, number>();
  const perExpense = new Map<string, Array<{ assigneeName: string; amount: number }>>();

  for (const item of result.data ?? []) {
    totals.set(item.assignee_name, Number(((totals.get(item.assignee_name) ?? 0) + item.amount).toFixed(2)));
    perExpense.set(item.fixed_expense_id, [
      ...(perExpense.get(item.fixed_expense_id) ?? []),
      { assigneeName: item.assignee_name, amount: item.amount },
    ]);
  }

  const totalsByAssignee = Array.from(totals.entries()).map(([name, amount]) => ({ name, value: amount }));
  const breakdownByFixedExpense = Array.from(perExpense.entries()).map(([fixedExpenseId, allocations]) => ({
    fixedExpenseId,
    fixedExpenseName: fixedExpenseNameById.get(fixedExpenseId) ?? "Conta sem nome",
    totalAmount: Number(allocations.reduce((sum, item) => sum + item.amount, 0).toFixed(2)),
    allocations,
  }));
  const grandTotal = Number(totalsByAssignee.reduce((sum, item) => sum + item.value, 0).toFixed(2));

  return {
    totalsByAssignee,
    breakdownByFixedExpense,
    grandTotal,
  };
}
