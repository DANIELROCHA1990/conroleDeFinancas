import { CurrencyInput } from "@/components/ui/currency-input";
import { FormField } from "@/components/ui/form-field";
import { MaskedDateInput } from "@/components/ui/masked-date-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { saveReserveAction } from "@/features/reserves/reserves.actions";
import type { ReserveListItem } from "@/features/reserves/repositories/reserve-repository";

export function ReserveForm({ reserve }: { reserve?: ReserveListItem }) {
  return (
    <form action={saveReserveAction} className="app-panel grid gap-4 rounded-[1.5rem] p-4 sm:p-5">
      {reserve ? <input type="hidden" name="id" value={reserve.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Nome da reserva">
          <input name="name" defaultValue={reserve?.name} placeholder="Ex.: Viagem" className="app-input" required />
        </FormField>
        <FormField label="Objetivo">
          <input name="objective" defaultValue={reserve?.objective ?? ""} placeholder="Ex.: Guardar para ferias" className="app-input" />
        </FormField>
        <FormField label="Valor alvo">
          <CurrencyInput name="target_amount" defaultValue={reserve?.target_amount} placeholder="R$ 0,00" className="app-input" required min={0.01} />
        </FormField>
        <FormField label="Valor atual">
          <CurrencyInput name="current_amount" defaultValue={reserve?.current_amount ?? 0} placeholder="R$ 0,00" className="app-input" required min={0} />
        </FormField>
        <FormField label="Data alvo" hint="Formato dd/mm/aaaa.">
          <MaskedDateInput name="target_date" mode="date" defaultValue={reserve?.target_date ?? ""} className="app-input" placeholder="dd/mm/aaaa" />
        </FormField>
        <FormField label="Status">
          <select name="status" defaultValue={reserve?.status ?? "active"} className="app-input">
            <option value="active">Ativa</option>
            <option value="paused">Pausada</option>
            <option value="completed">Concluida</option>
          </select>
        </FormField>
      </div>
      <SubmitButton pendingLabel="Salvando..." iconName="check" className="ml-auto rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950">
        {reserve ? "Salvar reserva" : "Criar reserva"}
      </SubmitButton>
    </form>
  );
}
