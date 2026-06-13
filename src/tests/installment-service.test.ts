import { describe, expect, it } from "vitest";

import { calculateInstallments } from "@/lib/services/installment-service";

describe("calculateInstallments", () => {
  it("fecha exatamente o valor total", () => {
    const result = calculateInstallments(1234.56, 6);
    const total = result.reduce((sum, item) => sum + item.amount, 0);

    expect(total).toBe(1234.56);
    expect(result[0]?.amount).toBe(205.76);
  });
});
