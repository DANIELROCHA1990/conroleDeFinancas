import { SubmitButton } from "@/components/ui/submit-button";
import { saveIncomeAction } from "@/features/incomes/incomes.actions";
import type { IncomeListItem } from "@/features/incomes/repositories/income-repository";

type CategoryOption = { id: string; name: string; type: string };

export function IncomeForm({
  categories,
  income,
}: {
  categories: CategoryOption[];
  income?: IncomeListItem;
}) {
  return (
    <form action={saveIncomeAction} className="grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
      {income ? <input type="hidden" name="id" value={income.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <input name="description" defaultValue={income?.description} placeholder="Descricao" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <input name="amount" type="number" step="0.01" min="0.01" defaultValue={income?.amount} placeholder="Valor" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <input name="received_on" type="date" defaultValue={income?.received_on} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required />
        <select name="category_id" defaultValue={income?.category_id ?? ""} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" required>
          <option value="" disabled>Categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select name="status" defaultValue={income?.status ?? "expected"} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <option value="expected">Prevista</option>
          <option value="received">Recebida</option>
        </select>
      </div>
      <SubmitButton pendingLabel="Salvando..." className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950">
        {income ? "Salvar entrada" : "Criar entrada"}
      </SubmitButton>
    </form>
  );
}
