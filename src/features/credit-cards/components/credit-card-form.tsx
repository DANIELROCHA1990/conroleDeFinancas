import { CurrencyInput } from "@/components/ui/currency-input";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { saveCreditCardAction } from "@/features/credit-cards/credit-cards.actions";
import type { CreditCardListItem } from "@/features/credit-cards/repositories/credit-card-repository";

export function CreditCardForm({ card }: { card?: CreditCardListItem }) {
  return (
    <form action={saveCreditCardAction} className="app-panel grid gap-4 rounded-[1.5rem] p-4 sm:p-5">
      {card ? <input type="hidden" name="id" value={card.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Nome do cartao">
          <input name="name" defaultValue={card?.name} placeholder="Ex.: Cartao principal" className="app-input" required />
        </FormField>
        <FormField label="Banco">
          <input name="bank_name" defaultValue={card?.bank_name} placeholder="Ex.: Banco X" className="app-input" required />
        </FormField>
        <FormField label="Limite">
          <CurrencyInput name="limit_amount" defaultValue={card?.limit_amount} placeholder="R$ 0,00" className="app-input" required min={0.01} />
        </FormField>
        <FormField label="Ultimos 4 digitos">
          <input name="last_four_digits" inputMode="numeric" maxLength={4} defaultValue={card?.last_four_digits ?? ""} placeholder="1234" className="app-input" />
        </FormField>
        <FormField label="Melhor dia de compra">
          <input name="best_purchase_day" type="number" min="1" max="31" defaultValue={card?.best_purchase_day ?? ""} placeholder="Ex.: 5" className="app-input" />
        </FormField>
        <FormField label="Dia de fechamento">
          <input name="closing_day" type="number" min="1" max="31" defaultValue={card?.closing_day} placeholder="Ex.: 20" className="app-input" required />
        </FormField>
        <FormField label="Dia de vencimento" className="md:col-span-2">
          <input name="due_day" type="number" min="1" max="31" defaultValue={card?.due_day} placeholder="Ex.: 28" className="app-input" required />
        </FormField>
      </div>
      <input type="hidden" name="is_active" value={card?.is_active === false ? "false" : "true"} />
      <SubmitButton pendingLabel="Salvando..." iconName="check" className="ml-auto rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950">
        {card ? "Salvar cartao" : "Criar cartao"}
      </SubmitButton>
    </form>
  );
}
