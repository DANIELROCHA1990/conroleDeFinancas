import { SubmitButton } from "@/components/ui/submit-button";
import { addReserveTransactionAction } from "@/features/reserves/reserves.actions";

export function ReserveTransactionForm({ reserveId }: { reserveId: string }) {
  return (
    <form action={addReserveTransactionAction} className="grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
      <input type="hidden" name="reserve_id" value={reserveId} />
      <div className="grid gap-3 md:grid-cols-[0.9fr_1fr_1.1fr]">
        <select name="transaction_type" defaultValue="deposit" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <option value="deposit">Aporte</option>
          <option value="withdrawal">Retirada</option>
        </select>
        <input name="amount" type="number" step="0.01" min="0.01" placeholder="Valor" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <input name="description" placeholder="Descricao" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
      </div>
      <SubmitButton pendingLabel="Salvando..." className="rounded-2xl bg-white/10 px-4 py-3 font-medium">
        Registrar movimentacao
      </SubmitButton>
    </form>
  );
}
