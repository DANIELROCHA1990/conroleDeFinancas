import { CurrencyInput } from "@/components/ui/currency-input";
import { FormField } from "@/components/ui/form-field";
import { MaskedDateInput } from "@/components/ui/masked-date-input";
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
    <form action={saveIncomeAction} className="app-panel grid gap-4 rounded-[1.5rem] p-4 sm:p-5">
      {income ? <input type="hidden" name="id" value={income.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Descricao">
          <input name="description" defaultValue={income?.description} placeholder="Ex.: Salario" className="app-input" required />
        </FormField>
        <FormField label="Valor">
          <CurrencyInput name="amount" defaultValue={income?.amount} placeholder="R$ 0,00" className="app-input" required min={0.01} />
        </FormField>
        <FormField label="Recebimento" hint="Formato dd/mm/aaaa.">
          <MaskedDateInput name="received_on" mode="date" defaultValue={income?.received_on} className="app-input" placeholder="dd/mm/aaaa" required />
        </FormField>
        <FormField label="Categoria">
          <select name="category_id" defaultValue={income?.category_id ?? ""} className="app-input" required>
            <option value="" disabled>Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Status" className="md:col-span-2">
          <select name="status" defaultValue={income?.status ?? "expected"} className="app-input">
            <option value="expected">Prevista</option>
            <option value="received">Recebida</option>
          </select>
        </FormField>
      </div>
      <SubmitButton pendingLabel="Salvando..." iconName="check" className="ml-auto rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950">
        {income ? "Salvar entrada" : "Criar entrada"}
      </SubmitButton>
    </form>
  );
}
