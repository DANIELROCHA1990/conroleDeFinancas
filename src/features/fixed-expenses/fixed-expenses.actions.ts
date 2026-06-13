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
import { updateGeneratedFixedExpense } from "@/features/expenses/repositories/expense-repository";

export async function saveFixedExpenseAction(formData: FormData) {
  const user = await requireUser();
  const values = parseFixedExpenseInput(formData);
  let targetId = values.id;

  if (values.id) {
    await updateFixedExpense(values.id, user.id, values);
  } else {
    const created = await createFixedExpense({ ...values, user_id: user.id });
    targetId = created.id;
  }

  const fixedExpenses = await listFixedExpenses();
  const target = fixedExpenses.find((item) => item.id === targetId);
  if (target) {
    await ensureMonthlyFixedExpenseGenerated(target, user.id);
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
  await updateGeneratedFixedExpense(String(formData.get("id")), user.id, {
    amount: Number(formData.get("amount")),
    estimated_amount: Number(formData.get("estimated_amount")),
    due_date: String(formData.get("due_date")),
    status: String(formData.get("status")) as "pending" | "paid" | "late" | "cancelled",
    update_default_amount: String(formData.get("update_default_amount")) === "true",
    fixed_expense_id: formData.get("fixed_expense_id") ? String(formData.get("fixed_expense_id")) : null,
  });
  revalidatePath("/contas-fixas");
  revalidatePath("/dashboard");
}
