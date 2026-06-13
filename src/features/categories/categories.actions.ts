"use server";

import { revalidatePath } from "next/cache";

import { parseCategoryInput, mapCategoryInsert, canHardDeleteCategory } from "@/features/categories/categories.service";
import {
  countCategoryUsage,
  createCategory,
  softDeleteCategory,
  updateCategory,
} from "@/features/categories/repositories/category-repository";
import { requireUser } from "@/features/auth/server/require-user";

export async function saveCategoryAction(formData: FormData) {
  const user = await requireUser();
  const values = parseCategoryInput(formData);

  if (values.id) {
    await updateCategory(values.id, user.id, values);
  } else {
    await createCategory(mapCategoryInsert(values, user.id));
  }

  revalidatePath("/categorias");
  revalidatePath("/dashboard");
}

export async function toggleCategoryAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  const active = String(formData.get("active")) === "true";

  await updateCategory(id, user.id, { active });
  revalidatePath("/categorias");
}

export async function deleteCategoryAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id"));
  const usage = await countCategoryUsage(id);

  if (!canHardDeleteCategory(usage)) {
    await updateCategory(id, user.id, { active: false });
  } else {
    await softDeleteCategory(id, user.id);
  }

  revalidatePath("/categorias");
  revalidatePath("/dashboard");
}
