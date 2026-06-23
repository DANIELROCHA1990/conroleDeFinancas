"use client";

import { ChevronsDown, ChevronsUp } from "lucide-react";
import { useState } from "react";

import { ExpandableCard } from "@/components/ui/expandable-card";
import { ServerActionButtonForm } from "@/components/ui/server-action-button-form";
import { deleteCreditCardPurchaseAction } from "@/features/credit-cards/credit-cards.actions";
import {
  buildPurchaseInstallmentTimeline,
  countRemainingInstallments,
} from "@/features/credit-cards/credit-cards.service";
import type { CreditCardPurchaseListItem } from "@/features/credit-cards/repositories/credit-card-repository";
import { formatCurrency } from "@/lib/currency/format-currency";

function formatIsoDate(value: string) {
  return value.slice(0, 10).split("-").reverse().join("/");
}

function formatShortIsoDate(value: string) {
  return `${value.slice(8, 10)}/${value.slice(5, 7)}`;
}

export function RecentPurchasesList({ purchases }: { purchases: CreditCardPurchaseListItem[] }) {
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>({});

  function setAllExpanded(expanded: boolean) {
    setExpandedState(Object.fromEntries(purchases.map((purchase) => [purchase.id, expanded])));
  }

  return (
    <article className="glass-card rounded-[1.75rem] p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-[-0.03em]">Compras recentes</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAllExpanded(true)}
            aria-label="Expandir todas as compras"
            title="Expandir todas"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] text-[color:var(--text-main)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
          >
            <ChevronsDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setAllExpanded(false)}
            aria-label="Recolher todas as compras"
            title="Recolher todas"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] text-[color:var(--text-main)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
          >
            <ChevronsUp className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {purchases.length === 0 ? <p className="text-sm text-[color:var(--text-muted)]">Nenhuma compra registrada.</p> : null}
        {purchases.map((purchase) => {
          const dueDay = purchase.credit_cards?.due_day ?? 1;
          const closingDay = purchase.credit_cards?.closing_day ?? dueDay;
          const remainingInstallments = countRemainingInstallments({
            currentInstallment: purchase.current_installment,
            installmentCount: purchase.installment_count,
            purchasedAt: purchase.purchased_at,
            closingDay,
            dueDay,
          });
          const installments = buildPurchaseInstallmentTimeline({
            amount: purchase.amount,
            currentInstallment: purchase.current_installment,
            installmentCount: purchase.installment_count,
            purchasedAt: purchase.purchased_at,
            closingDay,
            dueDay,
          });

          return (
            <ExpandableCard
              key={purchase.id}
              expanded={expandedState[purchase.id] ?? false}
              onExpandedChange={(expanded) => setExpandedState((current) => ({ ...current, [purchase.id]: expanded }))}
              className="border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] shadow-none"
              summary={(
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold">{purchase.description}</h4>
                      <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                        {(purchase.credit_cards as { name?: string } | null)?.name ?? "Sem cartao"} •{" "}
                        {remainingInstallments === 0 ? "Sem parcelas futuras" : `${remainingInstallments} parcela(s) restante(s)`} •{" "}
                        {formatIsoDate(purchase.purchased_at)}
                      </p>
                    </div>
                    <strong>{formatCurrency(purchase.amount)}</strong>
                  </div>
                </div>
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 text-sm">
                <div className="min-w-0 flex-1">
                  {installments.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {installments.map((item) => (
                        <span
                          key={`${purchase.id}-${item.installment_number}`}
                          className={`rounded-full border px-3 py-2 text-xs ${
                            item.status === "paid"
                              ? "border-emerald-500/30 bg-emerald-500/12 text-emerald-200"
                              : "border-[color:var(--border-soft)] bg-[color:var(--surface)]"
                          }`}
                        >
                          {formatShortIsoDate(item.competency_month)} • {item.installment_number}/{item.total_installments}: {formatCurrency(item.amount)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[color:var(--text-muted)]">Nao ha parcelas para esta compra.</p>
                  )}
                </div>
                <div className="shrink-0">
                  <ServerActionButtonForm
                    action={deleteCreditCardPurchaseAction}
                    buttonClassName="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/12 text-rose-700 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] dark:text-rose-200"
                    pendingLabel="Excluindo..."
                    buttonLabel="Excluir compra"
                    iconName="trash"
                  >
                    <input type="hidden" name="id" value={purchase.id} />
                  </ServerActionButtonForm>
                </div>
              </div>
            </ExpandableCard>
          );
        })}
      </div>
    </article>
  );
}
