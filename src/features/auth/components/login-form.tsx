"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginInput } from "@/features/auth/validators/login-schema";
import { signInWithPassword } from "@/lib/supabase/auth-actions";

const initialState = {
  error: "",
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInWithPassword, initialState);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <form className="space-y-6" action={formAction}>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
          Acesso seguro
        </p>
        <h2 className="text-3xl font-semibold">Entrar</h2>
        <p className="text-sm leading-7 text-slate-300">
          Entre para acessar seus lancamentos, reservas, cartoes e relatorios.
        </p>
      </div>
      <label className="block space-y-2">
        <span className="text-sm text-slate-200">E-mail</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none ring-0"
          type="email"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <span className="text-sm text-rose-300">
            {form.formState.errors.email.message}
          </span>
        ) : null}
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-slate-200">Senha</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none ring-0"
          type="password"
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <span className="text-sm text-rose-300">
            {form.formState.errors.password.message}
          </span>
        ) : null}
      </label>
      {state?.error ? <p className="text-sm text-rose-300">{state.error}</p> : null}
      <button
        className="w-full rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-emerald-300"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
