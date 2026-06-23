import { Power, RefreshCcw, WalletCards } from "lucide-react";

import { CurrencyInput } from "@/components/ui/currency-input";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { FormField } from "@/components/ui/form-field";
import { IconActionButton } from "@/components/ui/icon-action-button";
import { MaskedDateInput } from "@/components/ui/masked-date-input";
import { ServerActionButtonForm } from "@/components/ui/server-action-button-form";
import { SectionHeader } from "@/components/ui/section-header";
import { SubmitButton } from "@/components/ui/submit-button";
import { formatCurrency } from "@/lib/currency/format-currency";
import { requireUser } from "@/features/auth/server/require-user";
import { listCategoryOptions } from "@/features/categories/repositories/category-repository";
import {
  deleteFixedExpenseAction,
  syncFixedExpensesAction,
  toggleFixedExpenseAction,
  updateGeneratedFixedExpenseAssignmentAction,
  updateGeneratedFixedExpenseAction,
} from "@/features/fixed-expenses/fixed-expenses.actions";
import { FixedExpenseForm } from "@/features/fixed-expenses/components/fixed-expense-form";
import {
  listFixedExpenses,
  listGeneratedFixedExpenses,
} from "@/features/fixed-expenses/repositories/fixed-expense-repository";
import { listActivePaymentAssignees } from "@/features/settings/repositories/payment-assignee-repository";
import {
  calculateEstimatedVsRealVariation,
  calculateNextDueDate,
  resolveNextScheduledCompetenceMonth,
} from "@/features/fixed-expenses/fixed-expenses.service";

function formatIsoDate(value: string) {
  return value.split("-").reverse().join("/");
}

export async function FixedExpenseList() {
  await requireUser();

  const [expenses, categories, assignees, generatedExpenses] = await Promise.all([
    listFixedExpenses(),
    listCategoryOptions("expense"),
    listActivePaymentAssignees(),
    listGeneratedFixedExpenses(),
  ]);

  const now = new Date();

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          eyebrow="Contas fixas"
          title="Recorrencias mensais"
          description="Cadastre contas recorrentes com leitura rapida, formularios claros e ajuste mensal sem perder o historico."
        />
        <form action={syncFixedExpensesAction} className="self-start lg:self-auto">
          <IconActionButton label="Sincronizar lancamentos mensais" icon={RefreshCcw} tone="primary" type="submit" />
        </form>
      </div>

      <FixedExpenseForm categories={categories} assignees={assignees} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {expenses.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-[color:var(--text-muted)]">
            Nenhuma conta fixa cadastrada.
          </article>
        ) : null}
        {assignees.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-rose-200">
            Cadastre ao menos um responsavel ativo em Configuracoes para criar contas fixas com repasse.
          </article>
        ) : null}
        {expenses.map((expense) => {
          const nextCompetenceMonth = resolveNextScheduledCompetenceMonth({
            startCompetenceMonth: expense.start_competence_month,
            referenceDate: now,
          });
          const nextReferenceMonth = new Date(`${nextCompetenceMonth}T00:00:00Z`);
          return (
            <ExpandableCard
              key={expense.id}
              summary={(
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="line-clamp-2 break-words text-base font-semibold leading-6 tracking-[-0.03em] sm:text-lg">
                        {expense.name}
                      </h2>
                      <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                        {expense.amount_mode === "fixed" ? "Valor fixo" : "Valor variavel"} - Vence no dia {expense.due_day}
                      </p>
                    </div>
                    <span className="app-chip shrink-0 text-xs">
                      <WalletCards className="h-3.5 w-3.5" />
                      {expense.is_active ? "Ativa" : "Inativa"}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="app-kpi">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Valor base</p>
                      <p className="mt-2 text-sm font-semibold">{formatCurrency(expense.default_amount)}</p>
                    </div>
                    <div className="app-kpi">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Proximo vencimento</p>
                      <p className="mt-2 text-sm font-semibold">{formatIsoDate(calculateNextDueDate(expense.due_day, nextReferenceMonth))}</p>
                    </div>
                  </div>
                </div>
              )}
            >
              <div className="space-y-4">
                <FixedExpenseForm categories={categories} assignees={assignees} expense={expense} />
                <div className="flex justify-end gap-3">
                  <form action={toggleFixedExpenseAction}>
                    <input type="hidden" name="id" value={expense.id} />
                    <input type="hidden" name="is_active" value={expense.is_active ? "false" : "true"} />
                    <IconActionButton
                      label={expense.is_active ? "Inativar conta" : "Reativar conta"}
                      icon={Power}
                      tone="neutral"
                      type="submit"
                    />
                  </form>
                  <ServerActionButtonForm
                    action={deleteFixedExpenseAction}
                    buttonClassName="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/12 text-rose-700 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] dark:text-rose-200"
                    pendingLabel="Excluindo..."
                    buttonLabel="Excluir conta"
                    iconName="trash"
                  >
                    <input type="hidden" name="id" value={expense.id} />
                  </ServerActionButtonForm>
                </div>
              </div>
            </ExpandableCard>
          );
        })}
      </div>

      <div className="space-y-4">
        <SectionHeader
          eyebrow="Lancamentos"
          title="Despesas mensais geradas"
          description="Atualize valores reais, vencimentos e responsaveis com menos atrito e melhor leitura em telas grandes e pequenas."
        />
        {generatedExpenses.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-[color:var(--text-muted)]">
            Nenhuma despesa mensal gerada ainda. Use o icone de sincronizacao para atualizar os lancamentos.
          </article>
        ) : null}
        {generatedExpenses.map((expense) => {
          const variation = calculateEstimatedVsRealVariation({
            estimatedAmount: expense.estimated_amount ?? expense.amount,
            realAmount: expense.amount,
          });

          return (
            <ExpandableCard
              key={expense.id}
              summary={(
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold tracking-[-0.03em]">
                        {expense.description}
                      </h3>
                      <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                        Competencia {expense.competence_month?.slice(0, 7).split("-").reverse().join("/") ?? "nao informada"}
                      </p>
                    </div>
                    <span className="app-chip text-xs">{expense.status}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="app-kpi">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Previsto</p>
                      <p className="mt-2 text-sm font-semibold">{formatCurrency(expense.estimated_amount ?? expense.amount)}</p>
                    </div>
                    <div className="app-kpi">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Real</p>
                      <p className="mt-2 text-sm font-semibold">{formatCurrency(expense.amount)}</p>
                    </div>
                    <div className="app-kpi">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Diferenca</p>
                      <p className="mt-2 text-sm font-semibold">{variation >= 0 ? "+" : "-"}{formatCurrency(Math.abs(variation))}</p>
                    </div>
                  </div>
                </div>
              )}
            >
              <div className="grid gap-4 xl:grid-cols-2">
                <form action={updateGeneratedFixedExpenseAction} className="app-panel grid gap-3 rounded-[1.5rem] p-4">
                  <input type="hidden" name="id" value={expense.id} />
                  <input type="hidden" name="fixed_expense_id" value={expense.fixed_expense_id ?? ""} />
                  <input type="hidden" name="competence_month" value={expense.competence_month ?? ""} />
                  <input type="hidden" name="estimated_amount" value={formatCurrency(expense.estimated_amount ?? expense.amount)} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <FormField label="Valor real" hint="Valor efetivamente cobrado no mes.">
                      <CurrencyInput name="amount" defaultValue={expense.amount} className="app-input" required min={0.01} />
                    </FormField>
                    <FormField label="Vencimento" hint="Formato dd/mm/aaaa.">
                      <MaskedDateInput name="due_date" mode="date" defaultValue={expense.due_date} className="app-input" placeholder="dd/mm/aaaa" required />
                    </FormField>
                    <FormField label="Status" hint="Atualiza a situacao atual do lancamento.">
                      <select name="status" defaultValue={expense.status} className="app-input">
                        <option value="pending">Pendente</option>
                        <option value="paid">Paga</option>
                        <option value="late">Atrasada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    </FormField>
                    <FormField label="Valor padrao" hint="Permite refletir este valor como nova base da recorrencia.">
                      <select name="update_default_amount" defaultValue="false" className="app-input">
                        <option value="false">Nao atualizar</option>
                        <option value="true">Atualizar valor padrao</option>
                      </select>
                    </FormField>
                  </div>
                  <div className="flex justify-end">
                    <SubmitButton
                      pendingLabel="Salvando..."
                      iconName="check"
                      className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950 transition hover:-translate-y-0.5"
                    >
                      Salvar ajustes
                    </SubmitButton>
                  </div>
                </form>
                <form action={updateGeneratedFixedExpenseAssignmentAction} className="app-panel grid gap-3 rounded-[1.5rem] p-4">
                  <input type="hidden" name="expense_id" value={expense.id} />
                  <input type="hidden" name="fixed_expense_id" value={expense.fixed_expense_id ?? ""} />
                  <input type="hidden" name="competence_month" value={expense.competence_month ?? ""} />
                  <input type="hidden" name="amount" value={expense.amount} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <FormField label="Modo de atribuicao" hint="Escolha entre um responsavel ou todos.">
                      <select name="assignment_mode" defaultValue="single" className="app-input">
                        <option value="single">Responsavel individual</option>
                        {assignees.length > 1 ? <option value="all">Todos os responsaveis</option> : null}
                      </select>
                    </FormField>
                    <FormField label="Responsavel" hint="Usado quando a atribuicao for individual.">
                      <select name="assignee_id" defaultValue={assignees[0]?.id ?? ""} className="app-input">
                        {assignees.map((assignee) => (
                          <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                  <div className="flex justify-end">
                    <SubmitButton
                      pendingLabel="Salvando..."
                      iconName="user-round-cog"
                      className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] px-4 py-3 font-medium text-[color:var(--text-main)] transition hover:-translate-y-0.5"
                    >
                      Salvar responsavel
                    </SubmitButton>
                  </div>
                </form>
              </div>
            </ExpandableCard>
          );
        })}
      </div>
    </section>
  );
}
