"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/features/auth/server/require-user";
import { parseExpenseInput } from "@/features/expenses/expenses.service";
import { createExpense, softDeleteExpense, updateExpense } from "@/features/expenses/repositories/expense-repository";

export async function saveExpenseAction(formData: FormData) {
  const user = await requireUser();
  const values = parseExpenseInput(formData);

  if (values.id) {
    await updateExpense(values.id, user.id, values);
  } else {
    await createExpense({ ...values, user_id: user.id });
  }

  revalidatePath("/despesas");
  revalidatePath("/dashboard");
}

export async function deleteExpenseAction(formData: FormData) {
  const user = await requireUser();
  await softDeleteExpense(String(formData.get("id")), user.id);
  revalidatePath("/despesas");
  revalidatePath("/dashboard");
}

export async function markExpensePaidAction(formData: FormData) {
  const user = await requireUser();
  await updateExpense(String(formData.get("id")), user.id, {
    status: "paid",
    paid_at: new Date().toISOString().slice(0, 10),
  });
  revalidatePath("/despesas");
  revalidatePath("/dashboard");
}

export async function updateExpenseStatusAction(formData: FormData) {
  const user = await requireUser();
  const status = String(formData.get("status")) as "pending" | "paid" | "late" | "cancelled";

  await updateExpense(String(formData.get("id")), user.id, {
    status,
    paid_at: status === "paid" ? new Date().toISOString().slice(0, 10) : null,
  });

  revalidatePath("/despesas");
  revalidatePath("/dashboard");
}
