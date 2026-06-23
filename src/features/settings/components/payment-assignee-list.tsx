import { Power } from "lucide-react";

import { ExpandableCard } from "@/components/ui/expandable-card";
import { ServerActionButtonForm } from "@/components/ui/server-action-button-form";
import { IconActionButton } from "@/components/ui/icon-action-button";
import { SectionHeader } from "@/components/ui/section-header";
import { deletePaymentAssigneeAction, togglePaymentAssigneeAction } from "@/features/settings/payment-assignees.actions";
import { PaymentAssigneeForm } from "@/features/settings/components/payment-assignee-form";
import { listPaymentAssignees } from "@/features/settings/repositories/payment-assignee-repository";

export async function PaymentAssigneeList() {
  const assignees = await listPaymentAssignees();

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Responsaveis"
        title="Repasse de contas fixas"
        description="Cadastre responsaveis com uma interface mais objetiva e consistente com o restante do sistema."
      />
      <PaymentAssigneeForm />
      <div className="grid gap-4 md:grid-cols-2">
        {assignees.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-[color:var(--text-muted)]">
            Nenhum responsavel cadastrado ainda.
          </article>
        ) : null}
        {assignees.map((assignee) => (
          <ExpandableCard
            key={assignee.id}
            summary={(
              <div className="space-y-4">
                <h2 className="text-lg font-semibold tracking-[-0.03em]">{assignee.name}</h2>
                <div className="app-chip text-xs">{assignee.active ? "Ativo" : "Inativo"}</div>
              </div>
            )}
          >
            <div className="space-y-4">
              <PaymentAssigneeForm assignee={assignee} />
              <div className="flex justify-end gap-3">
                <form action={togglePaymentAssigneeAction}>
                  <input type="hidden" name="id" value={assignee.id} />
                  <input type="hidden" name="active" value={assignee.active ? "false" : "true"} />
                  <IconActionButton label={assignee.active ? "Inativar responsavel" : "Reativar responsavel"} icon={Power} type="submit" />
                </form>
                <ServerActionButtonForm
                  action={deletePaymentAssigneeAction}
                  buttonClassName="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/12 text-rose-700 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] dark:text-rose-200"
                  pendingLabel="Excluindo..."
                  buttonLabel="Excluir responsavel"
                  iconName="trash"
                >
                  <input type="hidden" name="id" value={assignee.id} />
                </ServerActionButtonForm>
              </div>
            </div>
          </ExpandableCard>
        ))}
      </div>
    </section>
  );
}
