import { describe, expect, it } from "vitest";

import { applyReserveTransaction } from "@/features/reserves/reserves.service";

describe("applyReserveTransaction", () => {
  it("soma aportes", () => {
    expect(applyReserveTransaction(100, "deposit", 50)).toBe(150);
  });

  it("bloqueia retirada que deixaria valor negativo", () => {
    expect(() => applyReserveTransaction(100, "withdrawal", 150)).toThrow(
      "Reserva nao pode ficar negativa.",
    );
  });
});
