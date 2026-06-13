import { ExpandableCard } from "@/components/ui/expandable-card";
import { SectionHeader } from "@/components/ui/section-header";
import {
  deleteCategoryAction,
  toggleCategoryAction,
} from "@/features/categories/categories.actions";
import { CategoryForm } from "@/features/categories/components/category-form";
import { listCategories } from "@/features/categories/repositories/category-repository";

export async function CategoryList() {
  const categories = await listCategories();

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Categorias"
        title="Organize suas categorias"
        description="Crie, edite e organize suas categorias para acompanhar melhor entradas e despesas."
      />
      <CategoryForm />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.length === 0 ? (
          <article className="glass-card rounded-[1.5rem] p-5 text-sm text-slate-300">
            Nenhuma categoria cadastrada ainda.
          </article>
        ) : null}
        {categories.map((category) => (
          <ExpandableCard
            key={category.id}
            summary={(
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">{category.name}</h2>
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  Tipo: {category.type} • Status: {category.active ? "ativo" : "inativo"}
                </p>
              </>
            )}
          >
            <div className="space-y-4">
              <CategoryForm category={category} />
              <div className="flex gap-3">
                <form action={toggleCategoryAction} className="flex-1">
                  <input type="hidden" name="id" value={category.id} />
                  <input type="hidden" name="active" value={category.active ? "false" : "true"} />
                  <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                    {category.active ? "Inativar" : "Reativar"}
                  </button>
                </form>
                <form action={deleteCategoryAction} className="flex-1">
                  <input type="hidden" name="id" value={category.id} />
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
