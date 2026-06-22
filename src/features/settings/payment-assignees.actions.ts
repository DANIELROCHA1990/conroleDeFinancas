"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/features/auth/server/require-user";
import { parsePaymentAssigneeInput } from "@/features/settings/payment-assignees.service";
import {
  createPaymentAssignee,
  softDeletePaymentAssignee,
  updatePaymentAssignee,
} from "@/features/settings/repositories/payment-assignee-repository";

export async function savePaymentAssigneeAction(formData: FormData) {
  const user = await requireUser();
  const values = parsePaymentAssigneeInput(formData);

  if (values.id) {
    await updatePaymentAssignee(values.id, user.id, values);
  } else {
    await createPaymentAssignee({ ...values, user_id: user.id });
  }

  revalidatePath("/configuracoes");
  revalidatePath("/contas-fixas");
  revalidatePath("/dashboard");
}

export async function togglePaymentAssigneeAction(formData: FormData) {
  const user = await requireUser();
  await updatePaymentAssignee(String(formData.get("id")), user.id, {
    active: String(formData.get("active")) === "true",
  });
  revalidatePath("/configuracoes");
  revalidatePath("/contas-fixas");
  revalidatePath("/dashboard");
}

export async function deletePaymentAssigneeAction(formData: FormData) {
  const user = await requireUser();
  await softDeletePaymentAssignee(String(formData.get("id")), user.id);
  revalidatePath("/configuracoes");
  revalidatePath("/contas-fixas");
  revalidatePath("/dashboard");
}
