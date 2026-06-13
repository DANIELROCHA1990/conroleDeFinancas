import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency } from "@/lib/currency/format-currency";
import { listCategoryOptions } from "@/features/categories/repositories/category-repository";
import { CreditCardForm } from "@/features/credit-cards/components/credit-card-form";
import { CreditCardPurchaseForm } from "@/features/credit-cards/components/credit-card-purchase-form";
import { deleteCreditCardAction, deleteCreditCardPurchaseAction } from "@/features/credit-cards/credit-cards.actions";
import {
  listCreditCards,
  listCreditCardPurchases,
  listPurchaseInstallments,
} from "@/features/credit-cards/repositories/credit-card-repository";

export async function CreditCardModule() {
  const [cards, purchases, categories] = await Promise.all([
    listCreditCards(),
    listCreditCardPurchases(),
    listCategoryOptions("expense"),
  ]);
  const purchasesWithInstallments = await Promise.all(
    purchases.map(async (purchase) => ({
      purchase,
      installments: await listPurchaseInstallments(purchase.id),
    })),
  );

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Cartoes"
        title="Limites, faturas e parcelas"
        description="Cadastre seus cartoes, acompanhe compras parceladas e visualize compromissos futuros."
      />
      <CreditCardForm />
      <div className="grid gap-4 xl:grid-cols-2">
        {cards.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-slate-300">
            Nenhum cartao cadastrado.
          </article>
        ) : null}
        {cards.map((card) => (
          <article key={card.id} className="glass-card rounded-[1.5rem] p-5">
            <h2 className="text-lg font-medium">{card.name}</h2>
            <p className="mt-2 text-sm text-slate-300">
              Banco: {card.bank_name} | Limite: {formatCurrency(card.limit_amount)}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Fecha dia {card.closing_day} | Vence dia {card.due_day}
            </p>
            <div className="mt-4">
              <CreditCardForm card={card} />
            </div>
            <form action={deleteCreditCardAction} className="mt-4">
              <input type="hidden" name="id" value={card.id} />
              <button className="w-full rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                Excluir
              </button>
            </form>
          </article>
        ))}
      </div>
      <article className="glass-card rounded-[1.5rem] p-5">
        <h3 className="text-lg font-medium">Nova compra parcelada</h3>
        <div className="mt-4">
          <CreditCardPurchaseForm cards={cards} categories={categories} />
        </div>
      </article>
      <article className="glass-card rounded-[1.5rem] p-5">
        <h3 className="text-lg font-medium">Compras recentes</h3>
        <div className="mt-4 space-y-3">
          {purchasesWithInstallments.length === 0 ? <p className="text-sm text-slate-300">Nenhuma compra registrada.</p> : null}
          {purchasesWithInstallments.map(({ purchase, installments }) => (
            <div key={purchase.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span>{purchase.description}</span>
                <strong>{formatCurrency(purchase.amount)}</strong>
              </div>
              <p className="mt-2 text-slate-300">
                {(purchase.credit_cards as { name?: string } | null)?.name ?? "Sem cartao"} | {purchase.installment_count}x
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {installments.map((item) => (
                  <span key={item.id} className="rounded-full bg-white/8 px-3 py-2 text-xs">
                    {item.installment_number}/{item.total_installments}: {formatCurrency(item.amount)}
                  </span>
                ))}
              </div>
              <form action={deleteCreditCardPurchaseAction} className="mt-3">
                <input type="hidden" name="id" value={purchase.id} />
                <button className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-rose-200">
                  Excluir compra
                </button>
              </form>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
