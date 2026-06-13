import { describe, expect, it } from "vitest";

import {
  calculateEstimatedVsRealVariation,
  calculateNextDueDate,
  generateRecurringExpenseFromFixedExpense,
  shouldGenerateMonthlyExpense,
} from "@/features/fixed-expenses/fixed-expenses.service";

describe("fixed expense recurring rules", () => {
  it("conta fixa de valor fixo gera despesa com valor padrao", () => {
    const expense = generateRecurringExpenseFromFixedExpense({
      fixedExpenseId: "11111111-1111-1111-1111-111111111111",
      userId: "22222222-2222-2222-2222-222222222222",
      categoryId: "33333333-3333-3333-3333-333333333333",
      name: "Aluguel",
      defaultAmount: 1800,
      dueDay: 5,
      month: new Date("2026-06-01T00:00:00Z"),
    });

    expect(expense.amount).toBe(1800);
    expect(expense.estimated_amount).toBe(1800);
    expect(expense.competence_month).toBe("2026-06-01");
  });

  it("conta fixa de valor variavel gera despesa com valor estimado", () => {
    const expense = generateRecurringExpenseFromFixedExpense({
      fixedExpenseId: "11111111-1111-1111-1111-111111111111",
      userId: "22222222-2222-2222-2222-222222222222",
      categoryId: "33333333-3333-3333-3333-333333333333",
      name: "Energia",
      defaultAmount: 350,
      dueDay: 10,
      month: new Date("2026-06-01T00:00:00Z"),
    });

    expect(expense.amount).toBe(350);
    expect(expense.estimated_amount).toBe(350);
  });

  it("nao gera duas despesas para a mesma conta fixa e mes", () => {
    expect(shouldGenerateMonthlyExpense(0)).toBe(true);
    expect(shouldGenerateMonthlyExpense(1)).toBe(false);
  });

  it("calcula a proxima data de vencimento", () => {
    expect(calculateNextDueDate(12, new Date("2026-06-01T00:00:00Z"))).toBe("2026-06-12");
  });

  it("calcula variacao entre valor estimado e real", () => {
    expect(calculateEstimatedVsRealVariation({ estimatedAmount: 350, realAmount: 412.75 })).toBe(62.75);
  });

  it("alterar valor real da despesa mensal nao altera a regra recorrente", () => {
    const recurringRule = { defaultAmount: 350 };
    const expense = generateRecurringExpenseFromFixedExpense({
      fixedExpenseId: "11111111-1111-1111-1111-111111111111",
      userId: "22222222-2222-2222-2222-222222222222",
      categoryId: "33333333-3333-3333-3333-333333333333",
      name: "Energia",
      defaultAmount: recurringRule.defaultAmount,
      dueDay: 10,
      month: new Date("2026-06-01T00:00:00Z"),
    });

    expense.amount = 412.75;

    expect(recurringRule.defaultAmount).toBe(350);
    expect(expense.amount).toBe(412.75);
  });
});
