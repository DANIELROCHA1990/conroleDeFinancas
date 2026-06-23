import { MonthlyRepassChart } from "@/components/charts/monthly-repass-chart";
import { MonthlyBalanceChart } from "@/components/charts/monthly-balance-chart";
import { SpendingByCategoryChart } from "@/components/charts/spending-by-category-chart";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { DashboardCards } from "@/features/dashboard/components/dashboard-cards";
import { buildDashboardSummary } from "@/features/dashboard/services/dashboard-service";
import { formatCurrency } from "@/lib/currency/format-currency";

function formatCompetenceMonthLabel(value: string) {
  const date = new Date(`${value.slice(0, 7)}-01T00:00:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function DashboardOverview({ selectedMonth }: { selectedMonth?: string }) {
  const summary = await buildDashboardSummary(selectedMonth);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Painel principal"
        title="Visao consolidada"
        description="Acompanhe saldos, gastos e distribuicao das suas financas em um unico lugar."
      />
      <DashboardCards
        cards={summary.cards.map((card) => ({
          ...card,
          details: card.details.map((detail) => ({
            ...detail,
            value: detail.label.toLowerCase().includes("quantidade") || detail.label.toLowerCase().includes("parcelas")
              ? detail.value
              : formatCurrency(Number(detail.value)),
          })),
        }))}
      />
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <MonthlyBalanceChart data={summary.monthlyBalance} />
        <SpendingByCategoryChart data={summary.categories} />
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="glass-card rounded-[1.75rem] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.03em]">Repasse mensal</h2>
                <p className="mt-1 text-sm text-[color:var(--text-muted)]">Resumo das contas fixas por responsavel na competencia selecionada.</p>
              </div>
              <form method="get">
                <select name="month" defaultValue={summary.repasseMonth} className="app-input">
                  {summary.repasseMonths.map((month) => (
                    <option key={month} value={month}>{formatCompetenceMonthLabel(month)}</option>
                  ))}
                </select>
              </form>
            </div>
          </div>
          <MonthlyRepassChart data={summary.monthlyRepasses} />
        </div>
        <article className="glass-card rounded-[1.75rem] p-5">
          <h3 className="text-lg font-semibold tracking-[-0.03em]">Detalhamento do repasse</h3>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">{formatCompetenceMonthLabel(summary.repasseMonth)}</p>
          <div className="mt-4 space-y-3">
            {summary.monthlyRepassBreakdown.length === 0 ? (
              <p className="text-sm text-[color:var(--text-muted)]">Nenhum repasse calculado para este mes.</p>
            ) : null}
            {summary.monthlyRepassBreakdown.map((item) => (
              <div key={item.fixedExpenseId} className="rounded-[1.25rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] p-4">
                <StatCard label={item.fixedExpenseName} value={formatCurrency(item.totalAmount)} description="Valor total distribuido na competencia selecionada." />
                <div className="mt-4 space-y-2">
                  {item.allocations.map((allocation) => (
                    <div key={`${item.fixedExpenseId}-${allocation.assigneeName}`} className="flex items-center justify-between text-sm">
                      <span className="text-[color:var(--text-muted)]">{allocation.assigneeName}</span>
                      <strong>{formatCurrency(allocation.amount)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {summary.monthlyRepassBreakdown.length > 0 ? (
              <div className="flex items-center justify-between border-t border-[color:var(--border-soft)] pt-4 text-sm">
                <span className="text-[color:var(--text-muted)]">Total consolidado do repasse</span>
                <strong>{formatCurrency(summary.monthlyRepassGrandTotal)}</strong>
              </div>
            ) : null}
          </div>
        </article>
      </section>
    </div>
  );
}
