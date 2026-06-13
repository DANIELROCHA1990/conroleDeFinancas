import { calculateBudgetUsage, calculateCurrentBalance, calculateProjectedBalance } from "@/lib/services/financial-math";
import { getDashboardData } from "@/features/dashboard/repositories/dashboard-repository";
import { getEffectiveExpenseAmount } from "@/features/fixed-expenses/fixed-expenses.service";

export async function buildDashboardSummary() {
  const data = await getDashboardData();
  const incomes = data.incomes ?? [];
  const expenses = data.expenses ?? [];
  const reserves = data.reserves ?? [];
  const categories = data.categories ?? [];
  const installments = data.installments ?? [];

  const currentBalance = calculateCurrentBalance(
    incomes.map((item) => ({
      id: crypto.randomUUID(),
      description: "",
      amount: item.amount,
      status: item.status,
    })),
    expenses.map((item) => ({
      id: crypto.randomUUID(),
      description: "",
      amount: item.amount,
      estimatedAmount: item.estimated_amount,
      status: item.status,
      categoryId: item.category_id ?? "",
    })),
    reserves.map((item) => ({
      id: crypto.randomUUID(),
      name: item.name,
      targetAmount: item.target_amount,
      currentAmount: item.current_amount,
    })),
  );
  const projectedBalance = calculateProjectedBalance(
    incomes.map((item) => ({
      id: crypto.randomUUID(),
      description: "",
      amount: item.amount,
      status: item.status,
    })),
    expenses.map((item) => ({
      id: crypto.randomUUID(),
      description: "",
      amount: item.amount,
      estimatedAmount: item.estimated_amount,
      status: item.status,
      categoryId: item.category_id ?? "",
    })),
    [],
  );
  const totalCardUsage = installments
    .filter((item) => item.status !== "paid")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalReserved = reserves.reduce((sum, reserve) => sum + reserve.current_amount, 0);
  const totalExpenses = expenses.reduce(
    (sum, item) => sum + getEffectiveExpenseAmount({ amount: item.amount, estimatedAmount: item.estimated_amount }),
    0,
  );
  const totalIncomes = incomes.reduce((sum, item) => sum + item.amount, 0);
  const monthlyKeys = Array.from(
    new Set([
      ...incomes.map((item) => item.received_on.slice(0, 7)),
      ...expenses.map((item) => item.due_date.slice(0, 7)),
    ]),
  ).sort();

  return {
    cards: [
      { label: "Saldo atual", value: currentBalance },
      { label: "Entradas do mes", value: totalIncomes },
      { label: "Despesas do mes", value: totalExpenses },
      { label: "Total reservado", value: totalReserved },
      { label: "Uso de cartoes", value: totalCardUsage },
      { label: "Saldo projetado", value: projectedBalance },
    ],
    categories: categories.map((category) => ({
      name: category.name,
      value: expenses
        .filter((expense) => expense.category_id === category.id)
        .reduce((sum, expense) => sum + getEffectiveExpenseAmount({ amount: expense.amount, estimatedAmount: expense.estimated_amount }), 0),
    })),
    monthlyBalance: monthlyKeys.map((month) => ({
      month,
      balance:
        incomes.filter((item) => item.received_on.startsWith(month)).reduce((sum, item) => sum + item.amount, 0) -
        expenses
          .filter((item) => item.due_date.startsWith(month))
          .reduce((sum, item) => sum + getEffectiveExpenseAmount({ amount: item.amount, estimatedAmount: item.estimated_amount }), 0),
    })),
    alerts: calculateBudgetUsage({
      limitAmount: 5000,
      currentAmount: totalExpenses,
    }),
  };
}
