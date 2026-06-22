import { SubmitButton } from "@/components/ui/submit-button";
import { savePaymentAssigneeAction } from "@/features/settings/payment-assignees.actions";
import type { PaymentAssignee } from "@/features/settings/repositories/payment-assignee-repository";

export function PaymentAssigneeForm({ assignee }: { assignee?: PaymentAssignee }) {
  return (
    <form action={savePaymentAssigneeAction} className="grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
      {assignee ? <input type="hidden" name="id" value={assignee.id} /> : null}
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          name="name"
          defaultValue={assignee?.name}
          placeholder="Nome do responsavel"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          required
        />
        <SubmitButton pendingLabel="Salvando..." className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950">
          {assignee ? "Salvar responsavel" : "Criar responsavel"}
        </SubmitButton>
      </div>
      <input type="hidden" name="active" value={assignee?.active === false ? "false" : "true"} />
    </form>
  );
}
