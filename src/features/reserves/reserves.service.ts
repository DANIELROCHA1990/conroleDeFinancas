import { reserveFormSchema, reserveTransactionSchema } from "@/features/reserves/reserves.schema";

export function parseReserveInput(formData: FormData) {
  return reserveFormSchema.parse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    objective: formData.get("objective") || null,
    target_amount: formData.get("target_amount"),
    current_amount: formData.get("current_amount"),
    target_date: formData.get("target_date") || null,
    status: formData.get("status"),
  });
}

export function parseReserveTransactionInput(formData: FormData) {
  return reserveTransactionSchema.parse({
    reserve_id: formData.get("reserve_id"),
    transaction_type: formData.get("transaction_type"),
    amount: formData.get("amount"),
    description: formData.get("description") || null,
  });
}

export function applyReserveTransaction(currentAmount: number, type: "deposit" | "withdrawal", amount: number) {
  const nextAmount = type === "deposit" ? currentAmount + amount : currentAmount - amount;

  if (nextAmount < 0) {
    throw new Error("Reserva nao pode ficar negativa.");
  }

  return nextAmount;
}
