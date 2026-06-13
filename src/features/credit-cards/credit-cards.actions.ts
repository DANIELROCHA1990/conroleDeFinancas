"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/features/auth/server/require-user";
import { parseCreditCardInput, parseCreditCardPurchaseInput } from "@/features/credit-cards/credit-cards.service";
import {
  createCreditCard,
  createCreditCardPurchase,
  softDeleteCreditCard,
  softDeleteCreditCardPurchase,
  updateCreditCard,
} from "@/features/credit-cards/repositories/credit-card-repository";

export async function saveCreditCardAction(formData: FormData) {
  const user = await requireUser();
  const values = parseCreditCardInput(formData);

  if (values.id) {
    await updateCreditCard(values.id, user.id, values);
  } else {
    await createCreditCard({ ...values, user_id: user.id });
  }

  revalidatePath("/cartoes");
  revalidatePath("/dashboard");
}

export async function deleteCreditCardAction(formData: FormData) {
  const user = await requireUser();
  await softDeleteCreditCard(String(formData.get("id")), user.id);
  revalidatePath("/cartoes");
  revalidatePath("/dashboard");
}

export async function saveCreditCardPurchaseAction(formData: FormData) {
  const user = await requireUser();
  const values = parseCreditCardPurchaseInput(formData);
  await createCreditCardPurchase({ ...values, user_id: user.id });
  revalidatePath("/cartoes");
  revalidatePath("/dashboard");
}

export async function deleteCreditCardPurchaseAction(formData: FormData) {
  const user = await requireUser();
  await softDeleteCreditCardPurchase(String(formData.get("id")), user.id);
  revalidatePath("/cartoes");
  revalidatePath("/dashboard");
}
