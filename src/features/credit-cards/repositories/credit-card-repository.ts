import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CreditCardFormValues, CreditCardPurchaseFormValues } from "@/features/credit-cards/credit-cards.schema";
import { buildPurchaseInstallments } from "@/features/credit-cards/credit-cards.service";

export type CreditCardListItem = {
  id: string;
  name: string;
  bank_name: string;
  limit_amount: number;
  best_purchase_day: number | null;
  closing_day: number;
  due_day: number;
  last_four_digits: string | null;
  is_active: boolean;
};

export type CreditCardPurchaseListItem = {
  id: string;
  credit_card_id: string;
  category_id: string | null;
  description: string;
  amount: number;
  purchased_at: string;
  installment_count: number;
  status: "open" | "posted" | "cancelled";
  credit_cards: { name: string } | null;
  categories: { name: string } | null;
};

export async function listCreditCards() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("credit_cards")
    .select("id, name, bank_name, limit_amount, best_purchase_day, closing_day, due_day, last_four_digits, is_active")
    .is("deleted_at", null)
    .order("name");

  if (error) {
    throw new Error(`Falha ao listar cartoes: ${error.message}`);
  }

  return (data ?? []) as CreditCardListItem[];
}

export async function listCreditCardPurchases() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("credit_card_purchases")
    .select("id, credit_card_id, category_id, description, amount, purchased_at, installment_count, status, credit_cards(name), categories(name)")
    .is("deleted_at", null)
    .order("purchased_at", { ascending: false });

  if (error) {
    throw new Error(`Falha ao listar compras do cartao: ${error.message}`);
  }

  return (data ?? []) as CreditCardPurchaseListItem[];
}

export async function listPurchaseInstallments(purchaseId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("credit_card_installments")
    .select("id, installment_number, total_installments, amount, competency_month, status")
    .eq("purchase_id", purchaseId)
    .order("installment_number");

  if (error) {
    throw new Error(`Falha ao listar parcelas: ${error.message}`);
  }

  return data ?? [];
}

export async function createCreditCard(payload: CreditCardFormValues & { user_id: string }) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("credit_cards").insert(payload);

  if (error) {
    throw new Error(`Falha ao criar cartao: ${error.message}`);
  }
}

export async function updateCreditCard(id: string, userId: string, payload: Partial<CreditCardFormValues>) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("credit_cards").update(payload).eq("id", id).eq("user_id", userId);

  if (error) {
    throw new Error(`Falha ao atualizar cartao: ${error.message}`);
  }
}

export async function softDeleteCreditCard(id: string, userId: string) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("credit_cards")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Falha ao excluir cartao: ${error.message}`);
  }
}

export async function createCreditCardPurchase(payload: CreditCardPurchaseFormValues & { user_id: string }) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("credit_card_purchases")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Falha ao criar compra do cartao: ${error?.message ?? "sem id retornado"}`);
  }

  const installments = buildPurchaseInstallments({
    amount: payload.amount,
    installmentCount: payload.installment_count,
    purchasedAt: payload.purchased_at,
  }).map((item) => ({
    ...item,
    purchase_id: data.id,
    user_id: payload.user_id,
  }));

  const { error: installmentsError } = await supabase.from("credit_card_installments").insert(installments);
  if (installmentsError) {
    throw new Error(`Falha ao criar parcelas do cartao: ${installmentsError.message}`);
  }
}

export async function softDeleteCreditCardPurchase(id: string, userId: string) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("credit_card_purchases")
    .update({ deleted_at: new Date().toISOString(), status: "cancelled" })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Falha ao excluir compra do cartao: ${error.message}`);
  }
}
