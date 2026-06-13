import Link from "next/link";

import { SectionHeader } from "@/components/ui/section-header";
import { buildReportsSummary } from "@/features/reports/reports.service";
import { formatCurrency } from "@/lib/currency/format-currency";

export async function ReportsPanel() {
  const summary = await buildReportsSummary();
  const cards = [
    { title: "Entradas por mes", items: summary.incomesByMonth },
    { title: "Despesas por mes", items: summary.expensesByMonth },
    { title: "Evolucao das reservas", items: summary.reservesEvolution },
    { title: "Parcelas futuras", items: summary.futureInstallments },
  ];

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Relatorios"
        title="Analise interativa"
        description="Veja a evolucao das suas financas por periodo, categoria e principais movimentos."
      />
      <div>
        <Link href="/api/reports/pdf" target="_blank" className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          Abrir resumo em PDF
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((report) => (
          <article key={report.title} className="glass-card rounded-[1.5rem] p-5">
            <h2 className="font-medium">{report.title}</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              {report.items.map((item) => (
                <div key={item.month} className="flex items-center justify-between">
                  <span>{item.month}</span>
                  <strong>{formatCurrency(item.total)}</strong>
                </div>
              ))}
            </div>
          </article>
        ))}
        <article className="glass-card rounded-[1.5rem] p-5">
          <h2 className="font-medium">Gastos por categoria</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            {summary.spendingByCategory.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span>{item.name}</span>
                <strong>{formatCurrency(item.value)}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
