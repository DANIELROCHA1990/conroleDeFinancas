"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/features/auth/server/require-user";
import { parseIncomeInput } from "@/features/incomes/incomes.service";
import { createIncome, softDeleteIncome, updateIncome } from "@/features/incomes/repositories/income-repository";

export async function saveIncomeAction(formData: FormData) {
  const user = await requireUser();
  const values = parseIncomeInput(formData);

  if (values.id) {
    await updateIncome(values.id, user.id, values);
  } else {
    await createIncome({ ...values, user_id: user.id });
  }

  revalidatePath("/entradas");
  revalidatePath("/dashboard");
}

export async function deleteIncomeAction(formData: FormData) {
  const user = await requireUser();
  await softDeleteIncome(String(formData.get("id")), user.id);
  revalidatePath("/entradas");
  revalidatePath("/dashboard");
}

export async function markIncomeReceivedAction(formData: FormData) {
  const user = await requireUser();
  await updateIncome(String(formData.get("id")), user.id, { status: "received" });
  revalidatePath("/entradas");
  revalidatePath("/dashboard");
}
