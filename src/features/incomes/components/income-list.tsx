import { CircleCheckBig } from "lucide-react";

import { ExpandableCard } from "@/components/ui/expandable-card";
import { ServerActionButtonForm } from "@/components/ui/server-action-button-form";
import { IconActionButton } from "@/components/ui/icon-action-button";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency } from "@/lib/currency/format-currency";
import { listCategoryOptions } from "@/features/categories/repositories/category-repository";
import { IncomeForm } from "@/features/incomes/components/income-form";
import { deleteIncomeAction, markIncomeReceivedAction } from "@/features/incomes/incomes.actions";
import { listIncomes } from "@/features/incomes/repositories/income-repository";

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
        description="Visualize entradas previstas e recebidas com menos ruído e acoes mais objetivas."
      />
      <IncomeForm categories={categories} />
      <div className="space-y-4">
        {incomes.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-[color:var(--text-muted)]">
            Nenhuma entrada cadastrada.
          </article>
        ) : null}
        {incomes.map((income) => (
          <ExpandableCard
            key={income.id}
            summary={(
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold tracking-[-0.03em]">{income.description}</h2>
                    <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                      {(income.categories as { name?: string } | null)?.name ?? "Sem categoria"}
                    </p>
                  </div>
                  <strong className="text-2xl tracking-[-0.03em]">{formatCurrency(income.amount)}</strong>
                </div>
                <div className="app-chip text-xs">{income.status === "received" ? "Recebida" : "Prevista"}</div>
              </div>
            )}
          >
            <div className="space-y-4">
              <IncomeForm categories={categories} income={income} />
              <div className="flex justify-end gap-3">
                <form action={markIncomeReceivedAction}>
                  <input type="hidden" name="id" value={income.id} />
                  <IconActionButton label="Marcar como recebida" icon={CircleCheckBig} type="submit" tone="primary" />
                </form>
                <ServerActionButtonForm
                  action={deleteIncomeAction}
                  buttonClassName="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/12 text-rose-700 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] dark:text-rose-200"
                  pendingLabel="Excluindo..."
                  buttonLabel="Excluir entrada"
                  iconName="trash"
                >
                  <input type="hidden" name="id" value={income.id} />
                </ServerActionButtonForm>
              </div>
            </div>
          </ExpandableCard>
        ))}
      </div>
    </section>
  );
}
