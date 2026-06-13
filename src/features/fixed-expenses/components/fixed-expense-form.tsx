import { CurrencyInput } from "@/components/ui/currency-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { saveFixedExpenseAction } from "@/features/fixed-expenses/fixed-expenses.actions";
import type { FixedExpenseListItem } from "@/features/fixed-expenses/repositories/fixed-expense-repository";

type CategoryOption = { id: string; name: string; type: string };

export function FixedExpenseForm({
  categories,
  expense,
}: {
  categories: CategoryOption[];
  expense?: FixedExpenseListItem;
}) {
  return (
    <form action={saveFixedExpenseAction} className="grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
      {expense ? <input type="hidden" name="id" value={expense.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <input name="name" defaultValue={expense?.name} placeholder="Nome da conta" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <select name="amount_mode" defaultValue={expense?.amount_mode ?? "fixed"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <option value="fixed">Tipo de valor: Fixo</option>
          <option value="variable">Tipo de valor: Variavel</option>
        </select>
        <CurrencyInput name="default_amount" defaultValue={expense?.default_amount} placeholder={expense?.amount_mode === "variable" ? "Valor estimado mensal" : "Valor mensal"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required min={0.01} />
        <input name="due_day" type="number" min="1" max="31" defaultValue={expense?.due_day} placeholder="Dia de vencimento" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <input name="notify_before_days" type="number" min="0" max="30" defaultValue={expense?.notify_before_days ?? 3} placeholder="Avisar com quantos dias" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <select name="category_id" defaultValue={expense?.category_id ?? ""} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:col-span-2" required>
          <option value="" disabled>Categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <input type="hidden" name="is_active" value={expense?.is_active === false ? "false" : "true"} />
      <SubmitButton pendingLabel="Salvando..." className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950">
        {expense ? "Salvar conta fixa" : "Criar conta fixa"}
      </SubmitButton>
    </form>
  );
}
