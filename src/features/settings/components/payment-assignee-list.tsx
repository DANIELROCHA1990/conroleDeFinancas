import { ExpandableCard } from "@/components/ui/expandable-card";
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
        description="Cadastre quem pode receber a atribuicao das contas fixas e mantenha o historico mensal para auditoria."
      />
      <PaymentAssigneeForm />
      <div className="grid gap-4 md:grid-cols-2">
        {assignees.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-slate-300">
            Nenhum responsavel cadastrado ainda.
          </article>
        ) : null}
        {assignees.map((assignee) => (
          <ExpandableCard
            key={assignee.id}
            summary={(
              <>
                <h2 className="font-medium">{assignee.name}</h2>
                <p className="mt-2 text-sm text-slate-300">Status: {assignee.active ? "ativo" : "inativo"}</p>
              </>
            )}
          >
            <div className="space-y-4">
              <PaymentAssigneeForm assignee={assignee} />
              <div className="flex gap-3">
                <form action={togglePaymentAssigneeAction} className="flex-1">
                  <input type="hidden" name="id" value={assignee.id} />
                  <input type="hidden" name="active" value={assignee.active ? "false" : "true"} />
                  <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                    {assignee.active ? "Inativar" : "Reativar"}
                  </button>
                </form>
                <form action={deletePaymentAssigneeAction} className="flex-1">
                  <input type="hidden" name="id" value={assignee.id} />
                  <button className="w-full rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          </ExpandableCard>
        ))}
      </div>
    </section>
  );
}
