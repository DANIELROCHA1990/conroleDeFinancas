import { CurrencyInput } from "@/components/ui/currency-input";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency } from "@/lib/currency/format-currency";
import { requireUser } from "@/features/auth/server/require-user";
import { listCategoryOptions } from "@/features/categories/repositories/category-repository";
import {
  deleteFixedExpenseAction,
  toggleFixedExpenseAction,
  updateGeneratedFixedExpenseAction,
} from "@/features/fixed-expenses/fixed-expenses.actions";
import { FixedExpenseForm } from "@/features/fixed-expenses/components/fixed-expense-form";
import {
  ensureMonthlyFixedExpenseGenerated,
  listFixedExpenses,
  listGeneratedFixedExpenses,
} from "@/features/fixed-expenses/repositories/fixed-expense-repository";
import {
  calculateEstimatedVsRealVariation,
  calculateNextDueDate,
} from "@/features/fixed-expenses/fixed-expenses.service";

export async function FixedExpenseList() {
  const user = await requireUser();
  const [expenses, categories] = await Promise.all([
    listFixedExpenses(),
    listCategoryOptions("expense"),
  ]);
  await Promise.all(expenses.map((expense) => ensureMonthlyFixedExpenseGenerated(expense, user.id)));
  const generatedExpenses = await listGeneratedFixedExpenses();
  const month = new Date();

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Contas fixas"
        title="Recorrencias mensais"
        description="Defina contas recorrentes e ajuste o valor de cada mes sem perder o historico."
      />
      <FixedExpenseForm categories={categories} />
      <div className="grid gap-4 md:grid-cols-2">
        {expenses.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-slate-300">
            Nenhuma conta fixa cadastrada.
          </article>
        ) : null}
        {expenses.map((expense) => (
          <ExpandableCard
            key={expense.id}
            summary={(
              <>
                <h2 className="font-medium">{expense.name}</h2>
                <p className="mt-2 text-sm text-slate-300">
                  {expense.amount_mode === "fixed" ? "Valor fixo" : "Valor variavel"} | Vence dia {expense.due_day}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Valor padrao: {formatCurrency(expense.default_amount)} | {(expense.categories as { name?: string } | null)?.name ?? "Sem categoria"}
                </p>
                {expense.is_active ? (
                  <p className="mt-2 text-sm text-slate-400">
                    Proxima data: {calculateNextDueDate(expense.due_day, month)}
                  </p>
                ) : null}
              </>
            )}
          >
            <div className="space-y-4">
              <FixedExpenseForm categories={categories} expense={expense} />
              <div className="flex gap-3">
                <form action={toggleFixedExpenseAction} className="flex-1">
                  <input type="hidden" name="id" value={expense.id} />
                  <input type="hidden" name="is_active" value={expense.is_active ? "false" : "true"} />
                  <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                    {expense.is_active ? "Inativar" : "Reativar"}
                  </button>
                </form>
                <form action={deleteFixedExpenseAction} className="flex-1">
                  <input type="hidden" name="id" value={expense.id} />
                  <button className="w-full rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          </ExpandableCard>
        ))}
      </div>

      <div className="space-y-4">
        <SectionHeader
          eyebrow="Lancamentos"
          title="Despesas mensais geradas"
          description="Atualize o valor de cada mes conforme a cobranca real e acompanhe a diferenca em relacao ao previsto."
        />
        {generatedExpenses.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-slate-300">
            Nenhuma despesa mensal gerada ainda.
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
                <>
                  <h3 className="font-medium">
                    {expense.description} - {expense.competence_month?.slice(0, 7) ?? "Sem competencia"}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Valor estimado: {formatCurrency(expense.estimated_amount ?? expense.amount)}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Valor real: {formatCurrency(expense.amount)}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Diferenca: {variation >= 0 ? "+" : "-"}{formatCurrency(Math.abs(variation))}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">Status: {expense.status}</p>
                </>
              )}
            >
              <form action={updateGeneratedFixedExpenseAction} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={expense.id} />
                <input type="hidden" name="fixed_expense_id" value={expense.fixed_expense_id ?? ""} />
                <input type="hidden" name="estimated_amount" value={expense.estimated_amount ?? expense.amount} />
                <CurrencyInput name="amount" defaultValue={expense.amount} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required min={0.01} />
                <input type="date" name="due_date" defaultValue={expense.due_date} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
                <select name="status" defaultValue={expense.status} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <option value="pending">Pendente</option>
                  <option value="paid">Paga</option>
                  <option value="late">Atrasada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
                <select name="update_default_amount" defaultValue="false" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <option value="false">Nao atualizar valor padrao</option>
                  <option value="true">Atualizar valor padrao da recorrencia</option>
                </select>
                <button className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950 md:col-span-2">
                  Salvar valor real do mes
                </button>
              </form>
            </ExpandableCard>
          );
        })}
      </div>
    </section>
  );
}
