import { CurrencyInput } from "@/components/ui/currency-input";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { addReserveTransactionAction } from "@/features/reserves/reserves.actions";

export function ReserveTransactionForm({ reserveId }: { reserveId: string }) {
  return (
    <form action={addReserveTransactionAction} className="app-panel grid gap-4 rounded-[1.5rem] p-4">
      <input type="hidden" name="reserve_id" value={reserveId} />
      <div className="grid gap-3 md:grid-cols-[0.9fr_1fr_1.1fr]">
        <FormField label="Tipo">
          <select name="transaction_type" defaultValue="deposit" className="app-input">
            <option value="deposit">Aporte</option>
            <option value="withdrawal">Retirada</option>
          </select>
        </FormField>
        <FormField label="Valor">
          <CurrencyInput name="amount" placeholder="R$ 0,00" className="app-input" required min={0.01} />
        </FormField>
        <FormField label="Descricao">
          <input name="description" placeholder="Ex.: Transferencia mensal" className="app-input" />
        </FormField>
      </div>
      <SubmitButton pendingLabel="Salvando..." iconName="arrow-right-left" className="ml-auto rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] px-4 py-3 font-medium text-[color:var(--text-main)]">
        Registrar movimentacao
      </SubmitButton>
    </form>
  );
}
