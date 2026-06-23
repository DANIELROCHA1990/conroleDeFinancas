"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency } from "@/lib/currency/format-currency";

type DashboardCardDetail = {
  label: string;
  value: string;
};

type DashboardCard = {
  label: string;
  value: number;
  description: string;
  details: DashboardCardDetail[];
};

export function DashboardCards({ cards }: { cards: DashboardCard[] }) {
  const [selectedCard, setSelectedCard] = useState<DashboardCard | null>(null);

  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => setSelectedCard(card)}
            className="text-left"
          >
            <StatCard
              label={card.label}
              value={formatCurrency(card.value)}
              description={card.description}
            />
          </button>
        ))}
      </section>

      {selectedCard ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="glass-card w-full max-w-2xl rounded-[1.75rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[color:var(--text-muted)]">{selectedCard.label}</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[color:var(--text-main)]">{formatCurrency(selectedCard.value)}</h2>
                <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">{selectedCard.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] p-2 text-[color:var(--text-main)]"
                aria-label="Fechar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {selectedCard.details.map((detail) => (
                <div key={detail.label} className="flex items-center justify-between rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] px-4 py-3 text-sm">
                  <span className="text-[color:var(--text-muted)]">{detail.label}</span>
                  <strong className="text-[color:var(--text-main)]">{detail.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
