import { CurrencyInput } from "@/components/ui/currency-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { saveCreditCardPurchaseAction } from "@/features/credit-cards/credit-cards.actions";
import type { CreditCardListItem } from "@/features/credit-cards/repositories/credit-card-repository";

type CategoryOption = { id: string; name: string; type: string };

export function CreditCardPurchaseForm({
  cards,
  categories,
}: {
  cards: CreditCardListItem[];
  categories: CategoryOption[];
}) {
  return (
    <form action={saveCreditCardPurchaseAction} className="grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <select name="credit_card_id" defaultValue="" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required>
          <option value="" disabled>Cartao</option>
          {cards.filter((card) => card.is_active).map((card) => (
            <option key={card.id} value={card.id}>{card.name}</option>
          ))}
        </select>
        <select name="category_id" defaultValue="" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required>
          <option value="" disabled>Categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <input name="description" placeholder="Descricao da compra" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:col-span-2" required />
        <CurrencyInput name="amount" placeholder="Valor total" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required min={0.01} />
        <input name="purchased_at" type="date" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <input name="installment_count" type="number" min="1" max="48" defaultValue="1" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <select name="status" defaultValue="open" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <option value="open">Aberta</option>
          <option value="posted">Lancada</option>
          <option value="cancelled">Cancelada</option>
        </select>
      </div>
      <SubmitButton pendingLabel="Salvando..." className="rounded-2xl bg-white/10 px-4 py-3 font-medium">
        Criar compra parcelada
      </SubmitButton>
    </form>
  );
}
