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
    <form action={saveCategoryAction} className="grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <input
          name="name"
          defaultValue={category?.name}
          placeholder="Nome da categoria"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          required
        />
        <select
          name="type"
          defaultValue={category?.type ?? "expense"}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <option value="income">Entrada</option>
          <option value="expense">Despesa</option>
          <option value="both">Ambos</option>
        </select>
        <input
          name="color"
          type="color"
          defaultValue={category?.color ?? "#4ADE80"}
          className="h-12 rounded-2xl border border-white/10 bg-white/5 px-2 py-2"
        />
        <input
          name="icon"
          defaultValue={category?.icon}
          placeholder="Icone"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          required
        />
      </div>
      <input type="hidden" name="active" value={category?.active ? "true" : "true"} />
      <SubmitButton
        pendingLabel="Salvando..."
        className="rounded-2xl bg-emerald-400 px-4 py-3 font-medium text-slate-950"
      >
        {category ? "Salvar alteracoes" : "Criar categoria"}
      </SubmitButton>
    </form>
  );
}
