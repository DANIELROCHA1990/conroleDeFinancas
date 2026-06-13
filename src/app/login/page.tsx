import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="glass-card grid w-full max-w-5xl overflow-hidden rounded-[2rem] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden flex-col justify-between bg-[linear-gradient(160deg,rgba(34,197,94,0.22),rgba(8,17,31,0.25))] p-10 lg:flex">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-sky-100">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Sua rotina financeira em um so lugar
          </div>
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-200/70">
              Controle de Financas
            </p>
            <h1 className="max-w-lg text-5xl font-semibold leading-tight">
              Organize contas, entradas, despesas e metas com mais clareza.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-300">
              Acompanhe seu dinheiro com uma visao simples, elegante e pensada para o dia a dia.
            </p>
          </div>
        </section>
        <section className="p-6 sm:p-10">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
