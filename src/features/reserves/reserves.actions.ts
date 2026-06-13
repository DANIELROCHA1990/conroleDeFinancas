"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/features/auth/server/require-user";
import { parseReserveInput, parseReserveTransactionInput } from "@/features/reserves/reserves.service";
import {
  createReserve,
  createReserveTransaction,
  deleteReserve,
  updateReserve,
} from "@/features/reserves/repositories/reserve-repository";

export async function saveReserveAction(formData: FormData) {
  const user = await requireUser();
  const values = parseReserveInput(formData);

  if (values.id) {
    await updateReserve(values.id, user.id, values);
  } else {
    await createReserve({ ...values, user_id: user.id });
  }

  revalidatePath("/reservas");
  revalidatePath("/dashboard");
}

export async function deleteReserveAction(formData: FormData) {
  const user = await requireUser();
  await deleteReserve(String(formData.get("id")), user.id);
  revalidatePath("/reservas");
  revalidatePath("/dashboard");
}

export async function addReserveTransactionAction(formData: FormData) {
  const user = await requireUser();
  const values = parseReserveTransactionInput(formData);
  await createReserveTransaction({ ...values, user_id: user.id });
  revalidatePath("/reservas");
  revalidatePath("/dashboard");
}
