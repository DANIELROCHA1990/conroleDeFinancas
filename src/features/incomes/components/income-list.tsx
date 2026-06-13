import { deleteIncomeAction, markIncomeReceivedAction } from "@/features/incomes/incomes.actions";
import { IncomeForm } from "@/features/incomes/components/income-form";
import { listCategoryOptions } from "@/features/categories/repositories/category-repository";
import { listIncomes } from "@/features/incomes/repositories/income-repository";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency } from "@/lib/currency/format-currency";

export async function IncomeList() {
  const [incomes, categories] = await Promise.all([
    listIncomes(),
    listCategoryOptions("income"),
  ]);

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Entradas"
        title="Recebimentos"
        description="Acompanhe valores recebidos e previstos para visualizar melhor seu fluxo financeiro."
      />
      <IncomeForm categories={categories} />
      <div className="space-y-4">
        {incomes.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-slate-300">
            Nenhuma entrada cadastrada.
          </article>
        ) : null}
        {incomes.map((income) => (
          <article key={income.id} className="glass-card space-y-4 rounded-[1.5rem] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium">{income.description}</h2>
                <p className="text-sm text-slate-300">
                  {income.status} • {(income.categories as { name?: string } | null)?.name ?? "Sem categoria"}
                </p>
              </div>
              <strong className="text-xl">{formatCurrency(income.amount)}</strong>
            </div>
            <IncomeForm categories={categories} income={income} />
            <div className="flex gap-3">
              <form action={markIncomeReceivedAction} className="flex-1">
                <input type="hidden" name="id" value={income.id} />
                <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  Marcar como recebida
                </button>
              </form>
              <form action={deleteIncomeAction} className="flex-1">
                <input type="hidden" name="id" value={income.id} />
                <button className="w-full rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  Excluir
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
