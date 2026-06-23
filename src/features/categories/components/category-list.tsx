import { Power } from "lucide-react";

import { ExpandableCard } from "@/components/ui/expandable-card";
import { ServerActionButtonForm } from "@/components/ui/server-action-button-form";
import { IconActionButton } from "@/components/ui/icon-action-button";
import { SectionHeader } from "@/components/ui/section-header";
import {
  deleteCategoryAction,
  toggleCategoryAction,
} from "@/features/categories/categories.actions";
import { CategoryForm } from "@/features/categories/components/category-form";
import { listCategories } from "@/features/categories/repositories/category-repository";

function getCategoryTypeLabel(type: "income" | "expense" | "both") {
  if (type === "income") {
    return "Entrada";
  }

  if (type === "both") {
    return "Entrada e despesa";
  }

  return "Despesa";
}

export async function CategoryList() {
  const categories = await listCategories();

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Categorias"
        title="Organize suas categorias"
        description="Crie, edite e reorganize categorias com leitura rapida, identidade visual clara e acoes compactas."
      />
      <CategoryForm />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-[color:var(--text-muted)]">
            Nenhuma categoria cadastrada ainda.
          </article>
        ) : null}
        {categories.map((category) => (
          <ExpandableCard
            key={category.id}
            summary={(
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold tracking-[-0.03em]">{category.name}</h2>
                  <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: category.color }} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="app-kpi">
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Tipo</p>
                    <p className="mt-2 text-sm font-semibold">{getCategoryTypeLabel(category.type)}</p>
                  </div>
                  <div className="app-kpi">
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">Status</p>
                    <p className="mt-2 text-sm font-semibold">{category.active ? "Ativa" : "Inativa"}</p>
                  </div>
                </div>
              </div>
            )}
          >
            <div className="space-y-4">
              <CategoryForm category={category} />
              <div className="flex justify-end gap-3">
                <form action={toggleCategoryAction}>
                  <input type="hidden" name="id" value={category.id} />
                  <input type="hidden" name="active" value={category.active ? "false" : "true"} />
                  <IconActionButton label={category.active ? "Inativar categoria" : "Reativar categoria"} icon={Power} type="submit" />
                </form>
                <ServerActionButtonForm
                  action={deleteCategoryAction}
                  buttonClassName="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/12 text-rose-700 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] dark:text-rose-200"
                  pendingLabel="Excluindo..."
                  buttonLabel="Excluir categoria"
                  iconName="trash"
                >
                  <input type="hidden" name="id" value={category.id} />
                </ServerActionButtonForm>
              </div>
            </div>
          </ExpandableCard>
        ))}
      </div>
    </section>
  );
}
