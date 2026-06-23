import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { savePaymentAssigneeAction } from "@/features/settings/payment-assignees.actions";
import type { PaymentAssignee } from "@/features/settings/repositories/payment-assignee-repository";

export function PaymentAssigneeForm({ assignee }: { assignee?: PaymentAssignee }) {
  return (
    <form action={savePaymentAssigneeAction} className="app-panel grid gap-4 rounded-[1.5rem] p-4 sm:p-5">
      {assignee ? <input type="hidden" name="id" value={assignee.id} /> : null}
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <FormField label="Nome do responsavel">
          <input
            name="name"
            defaultValue={assignee?.name}
            placeholder="Ex.: Daniel"
            className="app-input"
            required
          />
        </FormField>
        <SubmitButton pendingLabel="Salvando..." iconName="check" className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950">
          {assignee ? "Salvar responsavel" : "Criar responsavel"}
        </SubmitButton>
      </div>
      <input type="hidden" name="active" value={assignee?.active === false ? "false" : "true"} />
    </form>
  );
}
