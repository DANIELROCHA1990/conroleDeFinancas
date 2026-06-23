import { FormField } from "@/components/ui/form-field";
import { LucideIconPicker } from "@/components/ui/lucide-icon-picker";
import { saveCategoryAction } from "@/features/categories/categories.actions";
import { SubmitButton } from "@/components/ui/submit-button";

type CategoryRecord = {
  id: string;
  name: string;
  type: "income" | "expense" | "both";
  color: string;
  icon: string;
  active: boolean;
};

export function CategoryForm({ category }: { category?: CategoryRecord }) {
  return (
    <form action={saveCategoryAction} className="app-panel grid gap-4 rounded-[1.5rem] p-4 sm:p-5">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Nome da categoria">
          <input
            name="name"
            defaultValue={category?.name}
            placeholder="Ex.: Moradia"
            className="app-input"
            required
          />
        </FormField>
        <FormField label="Tipo">
          <select
            name="type"
            defaultValue={category?.type ?? "expense"}
            className="app-input"
          >
            <option value="income">Entrada</option>
            <option value="expense">Despesa</option>
            <option value="both">Entrada e despesa</option>
          </select>
        </FormField>
        <FormField label="Cor" hint="Ajuda a reconhecer a categoria mais rapido.">
          <input
            name="color"
            type="color"
            defaultValue={category?.color ?? "#4ADE80"}
            className="h-12 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] px-2 py-2"
          />
        </FormField>
        <FormField label="Icone" hint="Use um simbolo facil de identificar.">
          <LucideIconPicker name="icon" defaultValue={category?.icon} />
        </FormField>
      </div>
      <input type="hidden" name="active" value={category?.active ? "true" : "true"} />
      <SubmitButton
        pendingLabel="Salvando..."
        iconName="check"
        className="ml-auto rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950"
      >
        {category ? "Salvar alteracoes" : "Criar categoria"}
      </SubmitButton>
    </form>
  );
}
