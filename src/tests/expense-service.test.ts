import { describe, expect, it } from "vitest";

import { getExpenseStatus } from "@/features/expenses/expenses.service";

describe("getExpenseStatus", () => {
  it("marca como atrasada quando venceu e nao foi paga", () => {
    expect(
      getExpenseStatus({
        dueDate: "2025-01-01",
        paidAt: null,
        status: "pending",
      }),
    ).toBe("late");
  });
});
