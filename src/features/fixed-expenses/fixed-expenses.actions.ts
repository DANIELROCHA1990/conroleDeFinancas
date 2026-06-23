"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/features/auth/server/require-user";
import { parseFixedExpenseInput } from "@/features/fixed-expenses/fixed-expenses.service";
import {
  createFixedExpense,
  ensureMonthlyFixedExpenseGenerated,
  listFixedExpenses,
  softDeleteFixedExpense,
  updateFixedExpense,
} from "@/features/fixed-expenses/repositories/fixed-expense-repository";
import {
  replaceMonthlyAllocationsForExpense,
  syncCurrentMonthlyAllocationForFixedExpense,
} from "@/features/fixed-expenses/repositories/fixed-expense-allocation-repository";
import { listActivePaymentAssignees } from "@/features/settings/repositories/payment-assignee-repository";
import { updateGeneratedFixedExpense } from "@/features/expenses/repositories/expense-repository";
import { parseCurrencyInput } from "@/lib/currency/parse-currency";

export async function saveFixedExpenseAction(formData: FormData) {
  const user = await requireUser();
  const values = parseFixedExpenseInput(formData);
  const assignees = await listActivePaymentAssignees();

  if (assignees.length === 0) {
    throw new Error("Cadastre ao menos um responsavel ativo em Configuracoes antes de criar uma conta fixa.");
  }

  if (values.assignment_mode === "all" && assignees.length < 2) {
    throw new Error("A opcao Todos so pode ser usada quando houver mais de um responsavel ativo.");
  }
  let targetId = values.id;

  if (values.id) {
    await updateFixedExpense(values.id, user.id, values);
  } else {
    const created = await createFixedExpense({ ...values, user_id: user.id, assignee_id: values.assignee_id ?? null });
    targetId = created.id;
  }

  const fixedExpenses = await listFixedExpenses();
  const target = fixedExpenses.find((item) => item.id === targetId);
  if (target) {
    await ensureMonthlyFixedExpenseGenerated(target, user.id);
    if (!values.id) {
      await syncCurrentMonthlyAllocationForFixedExpense({ userId: user.id, fixedExpense: target });
    }
  }

  revalidatePath("/contas-fixas");
  revalidatePath("/dashboard");
}

export async function toggleFixedExpenseAction(formData: FormData) {
  const user = await requireUser();
  await updateFixedExpense(String(formData.get("id")), user.id, {
    is_active: String(formData.get("is_active")) === "true",
  });
  revalidatePath("/contas-fixas");
  revalidatePath("/dashboard");
}

export async function deleteFixedExpenseAction(formData: FormData) {
  const user = await requireUser();
  await softDeleteFixedExpense(String(formData.get("id")), user.id);
  revalidatePath("/contas-fixas");
  revalidatePath("/dashboard");
}

export async function updateGeneratedFixedExpenseAction(formData: FormData) {
  const user = await requireUser();
  const expenseId = String(formData.get("id"));
  const fixedExpenseId = formData.get("fixed_expense_id") ? String(formData.get("fixed_expense_id")) : null;
  const amount = Number(parseCurrencyInput(formData.get("amount")));
  const estimatedAmount = Number(parseCurrencyInput(formData.get("estimated_amount")));

  await updateGeneratedFixedExpense(String(formData.get("id")), user.id, {
    amount,
    estimated_amount: estimatedAmount,
    due_date: String(formData.get("due_date")),
    status: String(formData.get("status")) as "pending" | "paid" | "late" | "cancelled",
    update_default_amount: String(formData.get("update_default_amount")) === "true",
    fixed_expense_id: fixedExpenseId,
  });

  if (fixedExpenseId) {
    const fixedExpenses = await listFixedExpenses();
    const target = fixedExpenses.find((item) => item.id === fixedExpenseId);

    if (target) {
      await replaceMonthlyAllocationsForExpense({
        userId: user.id,
        fixedExpense: target,
        expenseId,
        competenceMonth: String(formData.get("competence_month")),
        amount: amount ?? estimatedAmount,
      });
    }
  }

  revalidatePath("/contas-fixas");
  revalidatePath("/dashboard");
}

export async function updateGeneratedFixedExpenseAssignmentAction(formData: FormData) {
  const user = await requireUser();
  const fixedExpenseId = String(formData.get("fixed_expense_id"));
  const expenseId = String(formData.get("expense_id"));
  const assignmentMode = String(formData.get("assignment_mode")) as "single" | "all";
  const assigneeId = formData.get("assignee_id") ? String(formData.get("assignee_id")) : null;
  const amount = Number(parseCurrencyInput(formData.get("amount")));
  const competenceMonth = String(formData.get("competence_month"));
  const assignees = await listActivePaymentAssignees();

  if (assignmentMode === "all" && assignees.length < 2) {
    throw new Error("A opcao Todos so pode ser usada quando houver mais de um responsavel ativo.");
  }

  const fixedExpenses = await listFixedExpenses();
  const target = fixedExpenses.find((item) => item.id === fixedExpenseId);

  if (!target) {
    throw new Error("Conta fixa nao encontrada para ajustar atribuicao.");
  }

  await replaceMonthlyAllocationsForExpense({
    userId: user.id,
    fixedExpense: target,
    expenseId,
    competenceMonth,
    amount,
    overrideAssignmentMode: assignmentMode,
    overrideAssigneeId: assigneeId,
  });

  revalidatePath("/contas-fixas");
  revalidatePath("/dashboard");
}

export async function syncFixedExpensesAction() {
  const user = await requireUser();
  const fixedExpenses = await listFixedExpenses();

  await Promise.all(
    fixedExpenses.map((expense) => ensureMonthlyFixedExpenseGenerated(expense, user.id)),
  );

  revalidatePath("/contas-fixas");
  revalidatePath("/dashboard");
}
