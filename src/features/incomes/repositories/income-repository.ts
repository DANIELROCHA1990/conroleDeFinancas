import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { IncomeFormValues } from "@/features/incomes/incomes.schema";

export type IncomeListItem = {
  id: string;
  description: string;
  amount: number;
  received_on: string;
  status: "received" | "expected";
  category_id: string | null;
  categories: { name: string } | null;
};

export async function listIncomes() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("incomes")
    .select("id, description, amount, received_on, status, category_id, categories(name)")
    .is("deleted_at", null)
    .order("received_on", { ascending: false });

  if (error) {
    throw new Error(`Falha ao listar entradas: ${error.message}`);
  }

  return (data ?? []) as IncomeListItem[];
}

export async function createIncome(payload: {
  user_id: string;
  description: string;
  amount: number;
  received_on: string;
  category_id: string;
  status: "received" | "expected";
}) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("incomes").insert(payload);

  if (error) {
    throw new Error(`Falha ao criar entrada: ${error.message}`);
  }
}

export async function updateIncome(id: string, userId: string, payload: Partial<IncomeFormValues>) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("incomes").update(payload).eq("id", id).eq("user_id", userId);

  if (error) {
    throw new Error(`Falha ao atualizar entrada: ${error.message}`);
  }
}

export async function softDeleteIncome(id: string, userId: string) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("incomes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Falha ao excluir entrada: ${error.message}`);
  }
}
