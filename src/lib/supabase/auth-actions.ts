"use server";

import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type AuthResult = {
  error?: string;
};

export async function signInWithPassword(
  _previousState: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Nao foi possivel autenticar. Verifique e-mail e senha." };
  }

  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await getSupabaseServerClient();

  await supabase.auth.signOut();
  redirect("/login");
}
