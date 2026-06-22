"use client";

import { X } from "lucide-react";
import { useState } from "react";

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
            className="glass-card rounded-[1.75rem] p-5 text-left transition-transform duration-200 hover:-translate-y-0.5"
          >
            <p className="text-sm text-slate-300">{card.label}</p>
            <strong className="mt-4 block text-3xl font-semibold">
              {formatCurrency(card.value)}
            </strong>
          </button>
        ))}
      </section>

      {selectedCard ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="glass-card w-full max-w-2xl rounded-[1.75rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-300">{selectedCard.label}</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(selectedCard.value)}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{selectedCard.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="rounded-full border border-white/10 bg-white/40 p-2 text-slate-600"
                aria-label="Fechar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {selectedCard.details.map((detail) => (
                <div key={detail.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/30 px-4 py-3 text-sm">
                  <span className="text-slate-600">{detail.label}</span>
                  <strong className="text-slate-900">{detail.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
