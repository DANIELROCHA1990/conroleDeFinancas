import { CurrencyInput } from "@/components/ui/currency-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { saveReserveAction } from "@/features/reserves/reserves.actions";
import type { ReserveListItem } from "@/features/reserves/repositories/reserve-repository";

export function ReserveForm({ reserve }: { reserve?: ReserveListItem }) {
  return (
    <form action={saveReserveAction} className="grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
      {reserve ? <input type="hidden" name="id" value={reserve.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <input name="name" defaultValue={reserve?.name} placeholder="Nome da reserva" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <input name="objective" defaultValue={reserve?.objective ?? ""} placeholder="Objetivo" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
        <CurrencyInput name="target_amount" defaultValue={reserve?.target_amount} placeholder="Valor alvo" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required min={0.01} />
        <CurrencyInput name="current_amount" defaultValue={reserve?.current_amount ?? 0} placeholder="Valor atual" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required min={0} />
        <input name="target_date" type="date" defaultValue={reserve?.target_date ?? ""} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
        <select name="status" defaultValue={reserve?.status ?? "active"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <option value="active">Ativa</option>
          <option value="paused">Pausada</option>
          <option value="completed">Concluida</option>
        </select>
      </div>
      <SubmitButton pendingLabel="Salvando..." className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950">
        {reserve ? "Salvar reserva" : "Criar reserva"}
      </SubmitButton>
    </form>
  );
}
