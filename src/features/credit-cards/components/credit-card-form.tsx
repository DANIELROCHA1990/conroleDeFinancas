import { CurrencyInput } from "@/components/ui/currency-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { saveCreditCardAction } from "@/features/credit-cards/credit-cards.actions";
import type { CreditCardListItem } from "@/features/credit-cards/repositories/credit-card-repository";

export function CreditCardForm({ card }: { card?: CreditCardListItem }) {
  return (
    <form action={saveCreditCardAction} className="grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
      {card ? <input type="hidden" name="id" value={card.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <input name="name" defaultValue={card?.name} placeholder="Nome do cartao" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <input name="bank_name" defaultValue={card?.bank_name} placeholder="Banco" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <CurrencyInput name="limit_amount" defaultValue={card?.limit_amount} placeholder="Limite" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required min={0.01} />
        <input name="last_four_digits" inputMode="numeric" maxLength={4} defaultValue={card?.last_four_digits ?? ""} placeholder="Ultimos 4 digitos" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
        <input name="best_purchase_day" type="number" min="1" max="31" defaultValue={card?.best_purchase_day ?? ""} placeholder="Melhor dia de compra" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
        <input name="closing_day" type="number" min="1" max="31" defaultValue={card?.closing_day} placeholder="Dia de fechamento" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <input name="due_day" type="number" min="1" max="31" defaultValue={card?.due_day} placeholder="Dia de vencimento" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
      </div>
      <input type="hidden" name="is_active" value={card?.is_active === false ? "false" : "true"} />
      <SubmitButton pendingLabel="Salvando..." className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950">
        {card ? "Salvar cartao" : "Criar cartao"}
      </SubmitButton>
    </form>
  );
}
