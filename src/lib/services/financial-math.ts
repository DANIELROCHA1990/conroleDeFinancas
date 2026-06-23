import type { Expense, FixedExpense, Income, Reserve } from "@/types/financial";

function getExpenseValue(expense: Expense) {
  return expense.amount ?? expense.estimatedAmount ?? 0;
}

export function calculateCurrentBalance(
  incomes: Income[],
  expenses: Expense[],
  reserves: Reserve[],
) {
  const received = incomes
    .filter((income) => income.status === "received")
    .reduce((sum, income) => sum + income.amount, 0);
  const paid = expenses
    .filter((expense) => expense.status === "paid")
    .reduce((sum, expense) => sum + getExpenseValue(expense), 0);
  const reserved = reserves.reduce((sum, reserve) => sum + reserve.currentAmount, 0);

  return received - paid + reserved;
}

export function calculateProjectedBalance(
  incomes: Income[],
  expenses: Expense[],
  fixedExpenses: FixedExpense[],
) {
  const expectedIncomes = incomes.reduce((sum, income) => sum + income.amount, 0);
  const expectedExpenses = expenses.reduce((sum, expense) => sum + getExpenseValue(expense), 0);
  const recurring = fixedExpenses.reduce((sum, item) => sum + item.amount, 0);

  return expectedIncomes - expectedExpenses - recurring;
}

export function calculateBudgetUsage({
  limitAmount,
  currentAmount,
}: {
  limitAmount: number;
  currentAmount: number;
}) {
  const ratio = currentAmount / limitAmount;

  if (ratio >= 1) return { level: "exceeded", ratio };
  if (ratio >= 0.9) return { level: "critical", ratio };
  if (ratio >= 0.7) return { level: "warning", ratio };

  return { level: "healthy", ratio };
}
