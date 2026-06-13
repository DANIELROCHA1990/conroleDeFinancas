import { SubmitButton } from "@/components/ui/submit-button";
import { saveExpenseAction } from "@/features/expenses/expenses.actions";
import type { ExpenseListItem } from "@/features/expenses/repositories/expense-repository";

type CategoryOption = { id: string; name: string; type: string };

export function ExpenseForm({
  categories,
  expense,
}: {
  categories: CategoryOption[];
  expense?: ExpenseListItem;
}) {
  return (
    <form action={saveExpenseAction} className="grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
      {expense ? <input type="hidden" name="id" value={expense.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <input name="description" defaultValue={expense?.description} placeholder="Descricao" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <input name="amount" type="number" step="0.01" min="0.01" defaultValue={expense?.amount} placeholder="Valor" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <input name="due_date" type="date" defaultValue={expense?.due_date} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <input name="paid_at" type="date" defaultValue={expense?.paid_at ?? ""} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
        <select name="category_id" defaultValue={expense?.category_id ?? ""} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required>
          <option value="" disabled>Categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select name="status" defaultValue={expense?.status ?? "pending"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <option value="pending">Pendente</option>
          <option value="paid">Paga</option>
          <option value="late">Atrasada</option>
          <option value="cancelled">Cancelada</option>
        </select>
        <input name="payment_method" defaultValue={expense?.payment_method ?? ""} placeholder="Forma de pagamento" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:col-span-2" />
      </div>
      <SubmitButton pendingLabel="Salvando..." className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950">
        {expense ? "Salvar despesa" : "Criar despesa"}
      </SubmitButton>
    </form>
  );
}
