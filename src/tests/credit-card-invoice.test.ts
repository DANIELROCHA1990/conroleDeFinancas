import { describe, expect, it } from "vitest";

import { calculateCurrentInvoiceAmount } from "@/features/credit-cards/credit-cards.service";

describe("calculateCurrentInvoiceAmount", () => {
  it("mantem a parcela do mes vigente mesmo quando current_installment esta adiantado no cadastro", () => {
    expect(
      calculateCurrentInvoiceAmount({
        amount: 238.8,
        installmentCount: 12,
        purchasedAt: "2026-05-10",
        closingDay: 5,
        dueDay: 15,
        competenceMonth: "2026-06",
      }),
    ).toBe(19.9);

    expect(
      calculateCurrentInvoiceAmount({
        amount: 286.8,
        installmentCount: 12,
        purchasedAt: "2026-05-10",
        closingDay: 5,
        dueDay: 15,
        competenceMonth: "2026-06",
      }),
    ).toBe(23.9);
  });

  it("soma apenas as parcelas cuja competencia cai no mes informado", () => {
    expect(
      calculateCurrentInvoiceAmount({
        amount: 231,
        installmentCount: 2,
        purchasedAt: "2026-05-11",
        closingDay: 5,
        dueDay: 15,
        competenceMonth: "2026-06",
      }),
    ).toBe(115.5);

    expect(
      calculateCurrentInvoiceAmount({
        amount: 231,
        installmentCount: 2,
        purchasedAt: "2026-05-11",
        closingDay: 5,
        dueDay: 15,
        competenceMonth: "2026-07",
      }),
    ).toBe(115.5);
  });
});
