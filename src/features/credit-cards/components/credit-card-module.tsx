import { CreditCard } from "lucide-react";

import { ExpandableCard } from "@/components/ui/expandable-card";
import { ServerActionButtonForm } from "@/components/ui/server-action-button-form";
import { SectionHeader } from "@/components/ui/section-header";
import { listCategoryOptions } from "@/features/categories/repositories/category-repository";
import { deleteCreditCardAction } from "@/features/credit-cards/credit-cards.actions";
import { CreditCardForm } from "@/features/credit-cards/components/credit-card-form";
import { CreditCardPurchaseForm } from "@/features/credit-cards/components/credit-card-purchase-form";
import { RecentPurchasesList } from "@/features/credit-cards/components/recent-purchases-list";
import {
  calculateCurrentInvoiceAmount,
} from "@/features/credit-cards/credit-cards.service";
import {
  listCreditCards,
  listCreditCardPurchases,
  listPurchaseInstallmentsByPurchaseIds,
} from "@/features/credit-cards/repositories/credit-card-repository";
import { formatCurrency } from "@/lib/currency/format-currency";

export async function CreditCardModule() {
  const [cards, purchasesRaw, categories] = await Promise.all([
    listCreditCards(),
    listCreditCardPurchases(),
    listCategoryOptions("expense"),
  ]);
  const purchases = [...purchasesRaw].sort((left, right) => left.purchased_at.localeCompare(right.purchased_at));
  const installmentsByPurchase = await listPurchaseInstallmentsByPurchaseIds(purchases.map((purchase) => purchase.id));
  const todayIso = new Date().toISOString().slice(0, 10);
  const currentMonthKey = todayIso.slice(0, 7);

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Cartoes"
        title="Limites, faturas e parcelas"
        description="Cadastre cartoes, acompanhe compras parceladas e visualize compromissos futuros com melhor leitura e menos round-trips."
      />
      <CreditCardForm />
      <div className="grid gap-4 xl:grid-cols-2">
        {cards.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-[color:var(--text-muted)]">
            Nenhum cartao cadastrado.
          </article>
        ) : null}
        {cards.map((card) => {
          const cardPurchases = purchases.filter((purchase) => purchase.credit_card_id === card.id);
          const cardOpenInstallments = cardPurchases.flatMap((purchase) =>
            (installmentsByPurchase.get(purchase.id) ?? []).filter((installment) => installment.status !== "paid"),
          );
          const cardFutureInstallments = cardOpenInstallments.filter(
            (installment) => installment.competency_month >= todayIso,
          );
          const currentInvoiceAmount = cardPurchases.reduce((sum, purchase) => {
            const dueDay = purchase.credit_cards?.due_day ?? card.due_day;
            const closingDay = purchase.credit_cards?.closing_day ?? card.closing_day;

            return sum + calculateCurrentInvoiceAmount({
              amount: purchase.amount,
              installmentCount: purchase.installment_count,
              purchasedAt: purchase.purchased_at,
              closingDay,
              dueDay,
              competenceMonth: currentMonthKey,
            });
          }, 0);
          const openInstallmentsAmount = cardFutureInstallments.reduce((sum, installment) => sum + installment.amount, 0);
          const remainingLimit = Math.max(card.limit_amount - openInstallmentsAmount, 0);

          return (
            <ExpandableCard
              key={card.id}
              summary={(
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold tracking-[-0.03em]">{card.name}</h2>
                    <span className="app-chip text-xs">{card.is_active ? "Ativo" : "Inativo"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-5">
                    <div className="app-kpi min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Banco</p>
                      <p className="mt-2 text-sm font-semibold break-words">{card.bank_name}</p>
                    </div>
                    <div className="app-kpi min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Limite</p>
                      <p className="mt-2 text-sm font-semibold break-words">{formatCurrency(card.limit_amount)}</p>
                    </div>
                    <div className="app-kpi min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Limite restante</p>
                      <p className="mt-2 text-sm font-semibold break-words">{formatCurrency(remainingLimit)}</p>
                    </div>
                    <div className="app-kpi min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Fatura atual</p>
                      <p className="mt-2 text-sm font-semibold break-words">{formatCurrency(currentInvoiceAmount)}</p>
                    </div>
                    <div className="app-kpi min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Ciclo</p>
                      <p className="mt-2 text-sm font-semibold break-words">Fecha {card.closing_day} • vence {card.due_day}</p>
                    </div>
                  </div>
                </div>
              )}
            >
              <div className="space-y-4">
                <CreditCardForm card={card} />
                <div className="flex justify-end gap-3">
                  <ServerActionButtonForm
                    action={deleteCreditCardAction}
                    buttonClassName="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/12 text-rose-700 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] dark:text-rose-200"
                    pendingLabel="Excluindo..."
                    buttonLabel="Excluir cartao"
                    iconName="trash"
                  >
                    <input type="hidden" name="id" value={card.id} />
                  </ServerActionButtonForm>
                </div>
              </div>
            </ExpandableCard>
          );
        })}
      </div>
      <article className="glass-card rounded-[1.75rem] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.03em]">Nova compra parcelada</h3>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">Cadastre a compra uma vez e deixe o parcelamento organizado automaticamente.</p>
          </div>
          <CreditCard className="h-5 w-5 text-[color:var(--accent-strong)]" />
        </div>
        <div className="mt-4">
          <CreditCardPurchaseForm cards={cards} categories={categories} />
        </div>
      </article>
      <RecentPurchasesList purchases={purchases} />
    </section>
  );
}
