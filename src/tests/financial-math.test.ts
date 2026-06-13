import { describe, expect, it } from "vitest";

import { calculateBudgetUsage, calculateCurrentBalance, calculateProjectedBalance } from "@/lib/services/financial-math";

describe("financial math", () => {
  it("calcula saldo atual considerando reservas", () => {
    expect(
      calculateCurrentBalance(
        [
          { id: "1", description: "Salario", amount: 5000, status: "received" },
        ],
        [
          { id: "2", description: "Aluguel", amount: 1000, estimatedAmount: 1000, status: "paid", categoryId: "c1" },
        ],
        [{ id: "3", name: "Reserva", targetAmount: 10000, currentAmount: 500 }],
      ),
    ).toBe(3500);
  });

  it("dashboard usa valor estimado quando o valor real ainda nao foi informado", () => {
    expect(
      calculateProjectedBalance(
        [{ id: "1", description: "Salario", amount: 5000, status: "expected" }],
        [{ id: "2", description: "Energia", amount: 350, estimatedAmount: 350, status: "pending", categoryId: "c1" }],
        [],
      ),
    ).toBe(4650);
  });

  it("dashboard usa valor real quando preenchido", () => {
    expect(
      calculateProjectedBalance(
        [{ id: "1", description: "Salario", amount: 5000, status: "expected" }],
        [{ id: "2", description: "Energia", amount: 412.75, estimatedAmount: 350, status: "pending", categoryId: "c1" }],
        [],
      ),
    ).toBe(4587.25);
  });

  it("classifica limite acima de 90%", () => {
    expect(calculateBudgetUsage({ limitAmount: 1000, currentAmount: 920 }).level).toBe(
      "critical",
    );
  });
});
