import { getSupabaseServerClient } from "@/lib/supabase/server";

import type { PaymentAssigneeFormValues } from "@/features/settings/payment-assignees.schema";

export type PaymentAssignee = {
  id: string;
  user_id: string;
  name: string;
  active: boolean;
  deleted_at: string | null;
};

export async function listPaymentAssignees() {
  const supabase = await getSupabaseServerClient();
  const result = await supabase
    .from("payment_assignees")
    .select("id, user_id, name, active, deleted_at")
    .is("deleted_at", null)
    .order("name");

  if (result.error) {
    throw new Error(`Falha ao listar responsaveis: ${result.error.message}`);
  }

  return (result.data ?? []) as PaymentAssignee[];
}

export async function listActivePaymentAssignees() {
  const supabase = await getSupabaseServerClient();
  const result = await supabase
    .from("payment_assignees")
    .select("id, user_id, name, active, deleted_at")
    .is("deleted_at", null)
    .eq("active", true)
    .order("name");

  if (result.error) {
    throw new Error(`Falha ao listar responsaveis ativos: ${result.error.message}`);
  }

  return (result.data ?? []) as PaymentAssignee[];
}

export async function createPaymentAssignee(payload: { user_id: string; name: string; active: boolean }) {
  const supabase = await getSupabaseServerClient();
  const result = await supabase
    .from("payment_assignees")
    .insert(payload)
    .select("id, user_id, name, active, deleted_at")
    .single();

  if (result.error) {
    throw new Error(`Falha ao criar responsavel: ${result.error.message}`);
  }

  return result.data as PaymentAssignee;
}

export async function updatePaymentAssignee(id: string, userId: string, payload: Partial<PaymentAssigneeFormValues>) {
  const supabase = await getSupabaseServerClient();
  const result = await supabase.from("payment_assignees").update(payload).eq("id", id).eq("user_id", userId);

  if (result.error) {
    throw new Error(`Falha ao atualizar responsavel: ${result.error.message}`);
  }
}

export async function softDeletePaymentAssignee(id: string, userId: string) {
  const supabase = await getSupabaseServerClient();
  const result = await supabase
    .from("payment_assignees")
    .update({ active: false, deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId);

  if (result.error) {
    throw new Error(`Falha ao excluir responsavel: ${result.error.message}`);
  }
}
