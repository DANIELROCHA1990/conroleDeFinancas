import { cache } from "react";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CategoryFormValues } from "@/features/categories/categories.schema";
import type { Database } from "@/types/supabase";

export const listCategories = cache(async () => {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, type, color, icon, active")
    .is("deleted_at", null)
    .order("name");

  if (error) {
    throw new Error(`Falha ao carregar categorias: ${error.message}`);
  }

  return data;
});

export async function listCategoryOptions(type?: "income" | "expense") {
  const supabase = await getSupabaseServerClient();
  let query = supabase
    .from("categories")
    .select("id, name, type")
    .eq("active", true)
    .is("deleted_at", null)
    .order("name");

  if (type) {
    query = query.or(`type.eq.${type},type.eq.both`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Falha ao carregar opcoes de categoria: ${error.message}`);
  }

  return data;
}

export async function createCategory(
  payload: Database["public"]["Tables"]["categories"]["Insert"],
) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("categories").insert(payload);

  if (error) {
    throw new Error(`Falha ao criar categoria: ${error.message}`);
  }
}

export async function updateCategory(
  id: string,
  userId: string,
  payload: Partial<CategoryFormValues>,
) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("categories")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Falha ao atualizar categoria: ${error.message}`);
  }
}

export async function softDeleteCategory(id: string, userId: string) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("categories")
    .update({ deleted_at: new Date().toISOString(), active: false })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Falha ao excluir categoria: ${error.message}`);
  }
}

export async function countCategoryUsage(categoryId: string) {
  const supabase = await getSupabaseServerClient();
  const [incomes, expenses, fixedExpenses] = await Promise.all([
    supabase.from("incomes").select("id", { count: "exact", head: true }).eq("category_id", categoryId),
    supabase.from("expenses").select("id", { count: "exact", head: true }).eq("category_id", categoryId),
    supabase.from("fixed_expenses").select("id", { count: "exact", head: true }).eq("category_id", categoryId),
  ]);

  for (const result of [incomes, expenses, fixedExpenses]) {
    if (result.error) {
      throw new Error(`Falha ao contar uso da categoria: ${result.error.message}`);
    }
  }

  return {
    incomes: incomes.count ?? 0,
    expenses: expenses.count ?? 0,
    fixedExpenses: fixedExpenses.count ?? 0,
  };
}
