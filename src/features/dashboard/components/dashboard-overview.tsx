import { MonthlyBalanceChart } from "@/components/charts/monthly-balance-chart";
import { SpendingByCategoryChart } from "@/components/charts/spending-by-category-chart";
import { SectionHeader } from "@/components/ui/section-header";
import { buildDashboardSummary } from "@/features/dashboard/services/dashboard-service";
import { formatCurrency } from "@/lib/currency/format-currency";

export async function DashboardOverview() {
  const summary = await buildDashboardSummary();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Painel principal"
        title="Visao consolidada"
        description="Acompanhe saldos, gastos e distribuicao das suas financas em um unico lugar."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summary.cards.map((card) => (
          <article key={card.label} className="glass-card rounded-[1.75rem] p-5">
            <p className="text-sm text-slate-300">{card.label}</p>
            <strong className="mt-4 block text-3xl font-semibold">
              {formatCurrency(card.value)}
            </strong>
          </article>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <MonthlyBalanceChart data={summary.monthlyBalance} />
        <SpendingByCategoryChart data={summary.categories} />
      </section>
    </div>
  );
}
