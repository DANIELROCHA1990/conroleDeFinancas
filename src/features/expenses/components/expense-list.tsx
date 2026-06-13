import { ExpandableCard } from "@/components/ui/expandable-card";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency } from "@/lib/currency/format-currency";
import { listCategoryOptions } from "@/features/categories/repositories/category-repository";
import { ExpenseForm } from "@/features/expenses/components/expense-form";
import { deleteExpenseAction, markExpensePaidAction } from "@/features/expenses/expenses.actions";
import { listExpenses } from "@/features/expenses/repositories/expense-repository";
import { getExpenseStatus } from "@/features/expenses/expenses.service";

export async function ExpenseList() {
  const [expenses, categories] = await Promise.all([
    listExpenses(),
    listCategoryOptions("expense"),
  ]);

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Despesas avulsas"
        title="Pagamentos pontuais"
        description="Registre pagamentos do dia a dia e acompanhe vencimentos, atrasos e quitacoes."
      />
      <ExpenseForm categories={categories} />
      <div className="space-y-4">
        {expenses.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-slate-300">
            Nenhuma despesa cadastrada.
          </article>
        ) : null}
        {expenses.map((expense) => (
          <ExpandableCard
            key={expense.id}
            summary={(
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-medium">{expense.description}</h2>
                  <p className="text-sm text-slate-300">
                    {getExpenseStatus({
                      dueDate: expense.due_date,
                      paidAt: expense.paid_at,
                      status: expense.status,
                    })} • {(expense.categories as { name?: string } | null)?.name ?? "Sem categoria"}
                  </p>
                </div>
                <strong>{formatCurrency(expense.amount)}</strong>
              </div>
            )}
          >
            <div className="space-y-4">
              <ExpenseForm categories={categories} expense={expense} />
              <div className="flex gap-3">
                <form action={markExpensePaidAction} className="flex-1">
                  <input type="hidden" name="id" value={expense.id} />
                  <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                    Marcar como paga
                  </button>
                </form>
                <form action={deleteExpenseAction} className="flex-1">
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
    </section>
  );
}
