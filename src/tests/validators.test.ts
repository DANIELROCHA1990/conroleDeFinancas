import { describe, expect, it } from "vitest";

import { categorySchema } from "@/lib/validators/category-schema";

describe("categorySchema", () => {
  it("aceita payload valido", () => {
    const result = categorySchema.safeParse({
      name: "Moradia",
      type: "expense",
      color: "#38BDF8",
      icon: "home",
      active: true,
    });

    expect(result.success).toBe(true);
  });
});
