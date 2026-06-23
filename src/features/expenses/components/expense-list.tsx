import { BadgeCheck, RotateCcw } from "lucide-react";

import { ExpandableCard } from "@/components/ui/expandable-card";
import { ServerActionButtonForm } from "@/components/ui/server-action-button-form";
import { IconActionButton } from "@/components/ui/icon-action-button";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency } from "@/lib/currency/format-currency";
import { listCategoryOptions } from "@/features/categories/repositories/category-repository";
import { ExpenseForm } from "@/features/expenses/components/expense-form";
import { deleteExpenseAction, markExpensePaidAction, updateExpenseStatusAction } from "@/features/expenses/expenses.actions";
import { listExpenses } from "@/features/expenses/repositories/expense-repository";
import { getExpenseStatus } from "@/features/expenses/expenses.service";

function formatIsoDate(value: string | null | undefined) {
  if (!value) {
    return "Nao informado";
  }

  return value.slice(0, 10).split("-").reverse().join("/");
}

export async function ExpenseList() {
  const [expenses, categories] = await Promise.all([
    listExpenses(),
    listCategoryOptions("expense"),
  ]);

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Despesas"
        title="Controle de pagamentos"
        description="Acompanhe despesas avulsas e recorrentes no mesmo lugar com prioridade para leitura, status e rapidez."
      />
      <ExpenseForm categories={categories} />
      <div className="space-y-4">
        {expenses.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-[color:var(--text-muted)]">
            Nenhuma despesa cadastrada.
          </article>
        ) : null}
        {expenses.map((expense) => {
          const statusLabel = getExpenseStatus({
            dueDate: expense.due_date,
            paidAt: expense.paid_at,
            status: expense.status,
          });

          return (
            <ExpandableCard
              key={expense.id}
              summary={(
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold tracking-[-0.03em]">{expense.description}</h2>
                      <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                        {(expense.categories as { name?: string } | null)?.name ?? "Sem categoria"}
                      </p>
                    </div>
                    <strong className="text-2xl tracking-[-0.03em]">{formatCurrency(expense.amount)}</strong>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="app-kpi">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Status</p>
                      <p className="mt-2 text-sm font-semibold">{statusLabel}</p>
                    </div>
                    <div className="app-kpi">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Tipo</p>
                      <p className="mt-2 text-sm font-semibold">
                        {expense.fixed_expense_id ? `Recorrente ${expense.competence_month?.slice(0, 7).split("-").reverse().join("/") ?? ""}` : "Avulsa"}
                      </p>
                    </div>
                    <div className="app-kpi">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Vencimento</p>
                      <p className="mt-2 text-sm font-semibold">{formatIsoDate(expense.due_date)}</p>
                    </div>
                  </div>
                </div>
              )}
            >
              <div className="space-y-4">
                {expense.fixed_expense_id ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="app-kpi">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Competencia</p>
                      <p className="mt-2 text-sm font-semibold">{expense.competence_month?.slice(0, 7).split("-").reverse().join("/") ?? "Sem competencia"}</p>
                    </div>
                    <div className="app-kpi">
                      <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Pagamento</p>
                      <p className="mt-2 text-sm font-semibold">{formatIsoDate(expense.paid_at)}</p>
                    </div>
                  </div>
                ) : (
                  <ExpenseForm categories={categories} expense={expense} />
                )}
                <div className="flex justify-end gap-3">
                  <form action={markExpensePaidAction}>
                    <input type="hidden" name="id" value={expense.id} />
                    <IconActionButton label="Marcar como paga" icon={BadgeCheck} type="submit" tone="primary" />
                  </form>
                  <form action={updateExpenseStatusAction}>
                    <input type="hidden" name="id" value={expense.id} />
                    <input type="hidden" name="status" value={expense.status === "paid" ? "pending" : "paid"} />
                    <IconActionButton label={expense.status === "paid" ? "Voltar para pendente" : "Alternar pagamento"} icon={RotateCcw} type="submit" />
                  </form>
                  <ServerActionButtonForm
                    action={deleteExpenseAction}
                    buttonClassName="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/12 text-rose-700 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] dark:text-rose-200"
                    pendingLabel="Excluindo..."
                    buttonLabel="Excluir despesa"
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
    </section>
  );
}
