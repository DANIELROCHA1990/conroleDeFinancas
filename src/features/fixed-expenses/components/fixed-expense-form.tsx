import { Coins, Repeat } from "lucide-react";

import { CurrencyInput } from "@/components/ui/currency-input";
import { FormField } from "@/components/ui/form-field";
import { MaskedDateInput } from "@/components/ui/masked-date-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { saveFixedExpenseAction } from "@/features/fixed-expenses/fixed-expenses.actions";
import { FixedExpenseAssignmentFields } from "@/features/fixed-expenses/components/fixed-expense-assignment-fields";
import { formatMonthInputValue } from "@/features/fixed-expenses/fixed-expenses.service";
import type { FixedExpenseListItem } from "@/features/fixed-expenses/repositories/fixed-expense-repository";

type CategoryOption = { id: string; name: string; type: string };
type PaymentAssigneeOption = { id: string; name: string; active: boolean };

export function FixedExpenseForm({
  categories,
  expense,
  assignees,
}: {
  categories: CategoryOption[];
  expense?: FixedExpenseListItem;
  assignees: PaymentAssigneeOption[];
}) {
  const isVariable = expense?.amount_mode === "variable";

  return (
    <form action={saveFixedExpenseAction} className="app-panel grid gap-4 rounded-[1.5rem] p-4 sm:p-5">
      {expense ? <input type="hidden" name="id" value={expense.id} /> : null}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-[color:var(--text-main)]">
            {expense ? "Editar conta recorrente" : "Nova conta recorrente"}
          </h2>
        </div>
        <div className="app-chip text-xs">
          <Repeat className="h-3.5 w-3.5" />
          <span>{isVariable ? "Valor variavel" : "Valor fixo"}</span>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Nome da conta" hint="Use um nome claro para localizar rapidamente.">
          <input name="name" defaultValue={expense?.name} placeholder="Ex.: Internet residencial" className="app-input" required />
        </FormField>
        <FormField label="Tipo de valor" hint="Escolha se a conta muda de valor mes a mes.">
          <select name="amount_mode" defaultValue={expense?.amount_mode ?? "fixed"} className="app-input">
            <option value="fixed">Valor fixo</option>
            <option value="variable">Valor variavel</option>
          </select>
        </FormField>
        <FormField label="Valor" hint={isVariable ? "Informe uma base de referencia para os proximos meses." : "Informe o valor recorrente esperado."}>
          <CurrencyInput name="default_amount" defaultValue={expense?.default_amount} placeholder="R$ 0,00" className="app-input" required min={0.01} />
        </FormField>
        <FormField label="Dia do vencimento" hint="Dia em que a conta normalmente vence.">
          <input name="due_day" type="number" min="1" max="31" defaultValue={expense?.due_day} placeholder="Ex.: 10" className="app-input" required />
        </FormField>
        <FormField label="Competencia inicial" hint="Formato mm/aaaa. A recorrencia comeca a partir deste mes.">
          <MaskedDateInput
            name="start_competence_month"
            mode="month"
            defaultValue={formatMonthInputValue(expense?.start_competence_month)}
            placeholder="mm/aaaa"
            className="app-input"
            required
          />
        </FormField>
        <FormField label="Aviso antecipado" hint="Quantidade de dias antes do vencimento.">
          <input name="notify_before_days" type="number" min="0" max="30" defaultValue={expense?.notify_before_days ?? 3} placeholder="Ex.: 3" className="app-input" required />
        </FormField>
        <FixedExpenseAssignmentFields
          assignees={assignees}
          defaultAssignmentMode={expense?.assignment_mode ?? "single"}
          defaultAssigneeId={expense?.assignee_id ?? null}
        />
        <FormField label="Categoria" hint="Agrupa a conta nos relatorios e no dashboard." className="md:col-span-2">
          <select name="category_id" defaultValue={expense?.category_id ?? ""} className="app-input" required>
            <option value="" disabled>Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </FormField>
      </div>
      <div className="grid gap-2 rounded-[1.25rem] border border-[color:var(--border-soft)] bg-[color:var(--accent-soft)] p-3 text-sm text-[color:var(--accent-strong)]">
        <p className="inline-flex items-center gap-2 font-medium">
          <Coins className="h-4 w-4" />
          {isVariable ? "Contas variaveis pedem revisao mensal do valor real." : "Contas fixas geram lancamentos consistentes e previsiveis."}
        </p>
        <p>
          {isVariable
            ? "Depois da geracao mensal, ajuste o valor cobrado no proprio lancamento do mes."
            : "A competencia inicial evita geracao retroativa indevida e organiza o historico."}
        </p>
      </div>
      <input type="hidden" name="is_active" value={expense?.is_active === false ? "false" : "true"} />
      <div className="flex justify-end">
        <SubmitButton
          pendingLabel="Salvando..."
          iconName="check"
          className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5"
        >
          {expense ? "Salvar conta" : "Criar conta"}
        </SubmitButton>
      </div>
    </form>
  );
}
