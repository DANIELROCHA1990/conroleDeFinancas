import { describe, expect, it } from "vitest";

import { canHardDeleteCategory } from "@/features/categories/categories.service";

describe("canHardDeleteCategory", () => {
  it("bloqueia exclusao definitiva quando ha uso vinculado", () => {
    expect(
      canHardDeleteCategory({
        incomes: 1,
        expenses: 0,
        fixedExpenses: 0,
      }),
    ).toBe(false);
  });
});
