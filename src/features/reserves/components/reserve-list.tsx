import { ExpandableCard } from "@/components/ui/expandable-card";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency } from "@/lib/currency/format-currency";
import { deleteReserveAction } from "@/features/reserves/reserves.actions";
import { ReserveForm } from "@/features/reserves/components/reserve-form";
import { ReserveTransactionForm } from "@/features/reserves/components/reserve-transaction-form";
import { listReserveTransactions, listReserves } from "@/features/reserves/repositories/reserve-repository";

export async function ReserveList() {
  const reserves = await listReserves();
  const reservesWithTransactions = await Promise.all(
    reserves.map(async (reserve) => ({
      reserve,
      transactions: await listReserveTransactions(reserve.id),
    })),
  );

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Reservas"
        title="Patrimonio separado do saldo disponivel"
        description="Separe valores por objetivo e acompanhe aportes, retiradas e progresso de cada reserva."
      />
      <ReserveForm />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reservesWithTransactions.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-slate-300">
            Nenhuma reserva cadastrada.
          </article>
        ) : null}
        {reservesWithTransactions.map(({ reserve, transactions }) => (
          <ExpandableCard
            key={reserve.id}
            summary={(
              <>
                <h2 className="font-medium">{reserve.name}</h2>
                <p className="mt-3 text-sm text-slate-300">
                  Meta: {formatCurrency(reserve.target_amount)}
                </p>
                <strong className="mt-4 block text-2xl">
                  {formatCurrency(reserve.current_amount)}
                </strong>
                <p className="mt-2 text-sm text-slate-300">
                  Status: {reserve.status} | {reserve.objective ?? "Sem objetivo detalhado"}
                </p>
              </>
            )}
          >
            <div className="space-y-4">
              <ReserveForm reserve={reserve} />
              <ReserveTransactionForm reserveId={reserve.id} />
              <div className="space-y-2 text-sm text-slate-300">
                {transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <span>{transaction.transaction_type === "deposit" ? "Aporte" : "Retirada"}</span>
                    <strong>{formatCurrency(transaction.amount)}</strong>
                  </div>
                ))}
                {transactions.length === 0 ? <p>Nenhuma movimentacao ainda.</p> : null}
              </div>
              <form action={deleteReserveAction}>
                <input type="hidden" name="id" value={reserve.id} />
                <button className="w-full rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  Excluir
                </button>
              </form>
            </div>
          </ExpandableCard>
        ))}
      </div>
    </section>
  );
}
