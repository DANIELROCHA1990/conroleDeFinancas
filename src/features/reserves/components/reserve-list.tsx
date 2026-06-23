import { Goal, PiggyBank } from "lucide-react";

import { ExpandableCard } from "@/components/ui/expandable-card";
import { ServerActionButtonForm } from "@/components/ui/server-action-button-form";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency } from "@/lib/currency/format-currency";
import { deleteReserveAction } from "@/features/reserves/reserves.actions";
import { ReserveForm } from "@/features/reserves/components/reserve-form";
import { ReserveTransactionForm } from "@/features/reserves/components/reserve-transaction-form";
import { listReserveTransactionsByReserveIds, listReserves } from "@/features/reserves/repositories/reserve-repository";

export async function ReserveList() {
  const reserves = await listReserves();
  const transactionsByReserve = await listReserveTransactionsByReserveIds(reserves.map((reserve) => reserve.id));

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Reservas"
        title="Patrimonio separado do saldo disponivel"
        description="Separe valores por objetivo e acompanhe aportes, retiradas e progresso com menos cliques e leitura mais clara."
      />
      <ReserveForm />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reserves.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-[color:var(--text-muted)]">
            Nenhuma reserva cadastrada.
          </article>
        ) : null}
        {reserves.map((reserve) => {
          const transactions = transactionsByReserve.get(reserve.id) ?? [];

          return (
            <ExpandableCard
              key={reserve.id}
              summary={(
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold tracking-[-0.03em]">{reserve.name}</h2>
                    <span className="app-chip text-xs">{reserve.status}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="app-kpi">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Valor atual</p>
                      <p className="mt-2 text-sm font-semibold">{formatCurrency(reserve.current_amount)}</p>
                    </div>
                    <div className="app-kpi">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Meta</p>
                      <p className="mt-2 text-sm font-semibold">{formatCurrency(reserve.target_amount)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[color:var(--text-muted)]">{reserve.objective ?? "Sem objetivo detalhado"}</p>
                </div>
              )}
            >
              <div className="space-y-4">
                <ReserveForm reserve={reserve} />
                <ReserveTransactionForm reserveId={reserve.id} />
                <div className="space-y-2 text-sm text-[color:var(--text-muted)]">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between rounded-[1rem] border border-[color:var(--border-soft)] px-3 py-2">
                      <span>{transaction.transaction_type === "deposit" ? "Aporte" : "Retirada"}</span>
                      <strong className="text-[color:var(--text-main)]">{formatCurrency(transaction.amount)}</strong>
                    </div>
                  ))}
                  {transactions.length === 0 ? <p>Nenhuma movimentacao ainda.</p> : null}
                </div>
                <div className="flex justify-end gap-3">
                  <span className="app-chip text-xs">
                    {reserve.status === "completed" ? <Goal className="h-3.5 w-3.5" /> : <PiggyBank className="h-3.5 w-3.5" />}
                    {reserve.status === "completed" ? "Meta concluida" : "Reserva em andamento"}
                  </span>
                  <ServerActionButtonForm
                    action={deleteReserveAction}
                    buttonClassName="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/12 text-rose-700 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] dark:text-rose-200"
                    pendingLabel="Excluindo..."
                    buttonLabel="Excluir reserva"
                    iconName="trash"
                  >
                    <input type="hidden" name="id" value={reserve.id} />
                  </ServerActionButtonForm>
                </div>
              </div>
            </ExpandableCard>
          );
        })}
      </div>
    </section>
  );
}
