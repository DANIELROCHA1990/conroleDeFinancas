import { getSupabaseServerClient } from "@/lib/supabase/server";
import { applyReserveTransaction } from "@/features/reserves/reserves.service";
import type { ReserveFormValues } from "@/features/reserves/reserves.schema";

export type ReserveListItem = {
  id: string;
  name: string;
  objective: string | null;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  status: "active" | "paused" | "completed";
};

export async function listReserves() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("reserves")
    .select("id, name, objective, target_amount, current_amount, target_date, status")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Falha ao listar reservas: ${error.message}`);
  }

  return (data ?? []) as ReserveListItem[];
}

export async function listReserveTransactions(reserveId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("reserve_transactions")
    .select("id, transaction_type, amount, description, created_at")
    .eq("reserve_id", reserveId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Falha ao listar movimentacoes da reserva: ${error.message}`);
  }

  return data ?? [];
}

export async function listReserveTransactionsByReserveIds(reserveIds: string[]) {
  if (reserveIds.length === 0) {
    return new Map<string, Awaited<ReturnType<typeof listReserveTransactions>>>();
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("reserve_transactions")
    .select("id, reserve_id, transaction_type, amount, description, created_at")
    .in("reserve_id", reserveIds)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Falha ao listar movimentacoes das reservas: ${error.message}`);
  }

  const transactionsByReserve = new Map<string, Array<(typeof data)[number]>>();

  for (const transaction of data ?? []) {
    const reserveTransactions = transactionsByReserve.get(transaction.reserve_id) ?? [];
    reserveTransactions.push(transaction);
    transactionsByReserve.set(transaction.reserve_id, reserveTransactions);
  }

  return transactionsByReserve;
}

export async function createReserve(payload: ReserveFormValues & { user_id: string }) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("reserves").insert(payload);

  if (error) {
    throw new Error(`Falha ao criar reserva: ${error.message}`);
  }
}

export async function updateReserve(id: string, userId: string, payload: Partial<ReserveFormValues>) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("reserves").update(payload).eq("id", id).eq("user_id", userId);

  if (error) {
    throw new Error(`Falha ao atualizar reserva: ${error.message}`);
  }
}

export async function deleteReserve(id: string, userId: string) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("reserves").delete().eq("id", id).eq("user_id", userId);

  if (error) {
    throw new Error(`Falha ao excluir reserva: ${error.message}`);
  }
}

export async function createReserveTransaction(payload: {
  reserve_id: string;
  transaction_type: "deposit" | "withdrawal";
  amount: number;
  description?: string | null;
  user_id: string;
}) {
  const supabase = await getSupabaseServerClient();
  const { data: reserve, error: reserveError } = await supabase
    .from("reserves")
    .select("id, current_amount")
    .eq("id", payload.reserve_id)
    .eq("user_id", payload.user_id)
    .single();

  if (reserveError || !reserve) {
    throw new Error(`Falha ao carregar reserva: ${reserveError?.message ?? "nao encontrada"}`);
  }

  const nextAmount = applyReserveTransaction(reserve.current_amount, payload.transaction_type, payload.amount);

  const { error: txError } = await supabase.from("reserve_transactions").insert(payload);
  if (txError) {
    throw new Error(`Falha ao registrar movimentacao da reserva: ${txError.message}`);
  }

  const { error: updateError } = await supabase
    .from("reserves")
    .update({ current_amount: nextAmount })
    .eq("id", payload.reserve_id)
    .eq("user_id", payload.user_id);

  if (updateError) {
    throw new Error(`Falha ao atualizar saldo da reserva: ${updateError.message}`);
  }
}
