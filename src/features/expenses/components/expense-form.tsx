import { CurrencyInput } from "@/components/ui/currency-input";
import { FormField } from "@/components/ui/form-field";
import { MaskedDateInput } from "@/components/ui/masked-date-input";
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
    <form action={saveExpenseAction} className="app-panel grid gap-4 rounded-[1.5rem] p-4 sm:p-5">
      {expense ? <input type="hidden" name="id" value={expense.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Descricao">
          <input name="description" defaultValue={expense?.description} placeholder="Ex.: Mercado do mes" className="app-input" required />
        </FormField>
        <FormField label="Valor">
          <CurrencyInput name="amount" defaultValue={expense?.amount} placeholder="R$ 0,00" className="app-input" required min={0.01} />
        </FormField>
        <FormField label="Vencimento" hint="Formato dd/mm/aaaa.">
          <MaskedDateInput name="due_date" mode="date" defaultValue={expense?.due_date} className="app-input" placeholder="dd/mm/aaaa" required />
        </FormField>
        <FormField label="Pagamento" hint="Preencha apenas quando a despesa ja foi paga.">
          <MaskedDateInput name="paid_at" mode="date" defaultValue={expense?.paid_at ?? ""} className="app-input" placeholder="dd/mm/aaaa" />
        </FormField>
        <FormField label="Categoria">
          <select name="category_id" defaultValue={expense?.category_id ?? ""} className="app-input" required>
            <option value="" disabled>Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Status">
          <select name="status" defaultValue={expense?.status ?? "pending"} className="app-input">
            <option value="pending">Pendente</option>
            <option value="paid">Paga</option>
            <option value="late">Atrasada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </FormField>
        <FormField label="Forma de pagamento" className="md:col-span-2">
          <input name="payment_method" defaultValue={expense?.payment_method ?? ""} placeholder="Ex.: Pix, boleto, debito" className="app-input" />
        </FormField>
      </div>
      <SubmitButton pendingLabel="Salvando..." iconName="check" className="ml-auto rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950">
        {expense ? "Salvar despesa" : "Criar despesa"}
      </SubmitButton>
    </form>
  );
}
