import { describe, expect, it } from "vitest";

import { buildPurchaseInstallmentTimeline } from "@/features/credit-cards/credit-cards.service";

describe("buildPurchaseInstallmentTimeline", () => {
  it("marca como quitada a parcela cuja competencia ja passou no calendario", () => {
    const timeline = buildPurchaseInstallmentTimeline({
      amount: 99.8,
      currentInstallment: 1,
      installmentCount: 2,
      purchasedAt: "2026-05-25",
      closingDay: 5,
      dueDay: 15,
      referenceDate: new Date("2026-06-22T00:00:00Z"),
    });

    expect(timeline[0]).toMatchObject({
      installment_number: 1,
      competency_month: "2026-06-15",
      status: "paid",
    });
    expect(timeline[1]).toMatchObject({
      installment_number: 2,
      competency_month: "2026-07-15",
      status: "open",
    });
  });

  it("mantem parcela unica do mes vigente como quitada apos o vencimento", () => {
    const timeline = buildPurchaseInstallmentTimeline({
      amount: 64.9,
      currentInstallment: 1,
      installmentCount: 1,
      purchasedAt: "2026-05-14",
      closingDay: 5,
      dueDay: 15,
      referenceDate: new Date("2026-06-22T00:00:00Z"),
    });

    expect(timeline[0]).toMatchObject({
      installment_number: 1,
      competency_month: "2026-06-15",
      status: "paid",
    });
  });

  it("nao marca parcelas futuras como pagas quando current_installment estiver adiantado no cadastro", () => {
    const timeline = buildPurchaseInstallmentTimeline({
      amount: 238.8,
      currentInstallment: 6,
      installmentCount: 12,
      purchasedAt: "2026-05-10",
      closingDay: 5,
      dueDay: 15,
      referenceDate: new Date("2026-06-22T00:00:00Z"),
    });

    expect(timeline[0]?.status).toBe("paid");
    expect(timeline[1]?.status).toBe("open");
    expect(timeline[5]?.status).toBe("open");
  });
});
