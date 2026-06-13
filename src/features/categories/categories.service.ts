import { categoryFormSchema } from "@/features/categories/categories.schema";
import type { Database } from "@/types/supabase";

export function parseCategoryInput(formData: FormData) {
  return categoryFormSchema.parse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    type: formData.get("type"),
    color: formData.get("color"),
    icon: formData.get("icon"),
    active: formData.get("active") === "true",
  });
}

export function canHardDeleteCategory(usage: {
  incomes: number;
  expenses: number;
  fixedExpenses: number;
}) {
  return usage.incomes + usage.expenses + usage.fixedExpenses === 0;
}

export function mapCategoryInsert(
  values: ReturnType<typeof categoryFormSchema.parse>,
  userId: string,
): Database["public"]["Tables"]["categories"]["Insert"] {
  return {
    user_id: userId,
    name: values.name,
    type: values.type,
    color: values.color,
    icon: values.icon,
    active: values.active,
  };
}
