import { calculateBudgetUsage, calculateCurrentBalance, calculateProjectedBalance } from "@/lib/services/financial-math";
import { getDashboardData } from "@/features/dashboard/repositories/dashboard-repository";
import { getCompetenceMonth } from "@/features/fixed-expenses/fixed-expenses.service";
import { listAllocationMonths, listMonthlyRepasses } from "@/features/fixed-expenses/repositories/fixed-expense-allocation-repository";
import { getEffectiveExpenseAmount } from "@/features/fixed-expenses/fixed-expenses.service";

export async function buildDashboardSummary(selectedMonth?: string) {
  const data = await getDashboardData();
  const allocationMonths = await listAllocationMonths();
  const incomes = data.incomes ?? [];
  const expenses = data.expenses ?? [];
  const reserves = data.reserves ?? [];
  const categories = data.categories ?? [];
  const installments = data.installments ?? [];
  const currentMonth = getCompetenceMonth(new Date());
  const currentMonthKey = currentMonth.slice(0, 7);
  const repasseMonth = selectedMonth ?? allocationMonths[0] ?? currentMonth;
  const monthlyRepasses = await listMonthlyRepasses(repasseMonth);
  const currentMonthIncomes = incomes.filter((item) => item.received_on.startsWith(currentMonthKey));
  const currentMonthExpenses = expenses.filter((item) => item.due_date.startsWith(currentMonthKey));
  const currentMonthInstallments = installments.filter((item) => item.competency_month.startsWith(currentMonthKey));

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
    currentMonthIncomes.map((item) => ({
      id: crypto.randomUUID(),
      description: "",
      amount: item.amount,
      status: item.status,
    })),
    currentMonthExpenses.map((item) => ({
      id: crypto.randomUUID(),
      description: "",
      amount: item.amount,
      estimatedAmount: item.estimated_amount,
      status: item.status,
      categoryId: item.category_id ?? "",
    })),
    [],
  );
  const totalCardUsage = currentMonthInstallments
    .filter((item) => item.status !== "paid")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalReserved = reserves.reduce((sum, reserve) => sum + reserve.current_amount, 0);
  const totalExpenses = currentMonthExpenses.reduce(
    (sum, item) => sum + getEffectiveExpenseAmount({ amount: item.amount, estimatedAmount: item.estimated_amount }),
    0,
  );
  const totalIncomes = currentMonthIncomes.reduce((sum, item) => sum + item.amount, 0);
  const receivedIncomes = currentMonthIncomes.filter((item) => item.status === "received").reduce((sum, item) => sum + item.amount, 0);
  const expectedIncomes = currentMonthIncomes.filter((item) => item.status === "expected").reduce((sum, item) => sum + item.amount, 0);
  const paidExpenses = currentMonthExpenses
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + getEffectiveExpenseAmount({ amount: item.amount, estimatedAmount: item.estimated_amount }), 0);
  const pendingExpenses = currentMonthExpenses
    .filter((item) => item.status !== "paid")
    .reduce((sum, item) => sum + getEffectiveExpenseAmount({ amount: item.amount, estimatedAmount: item.estimated_amount }), 0);
  const activeReserves = reserves.filter((item) => item.current_amount > 0).length;
  const openInstallments = currentMonthInstallments.filter((item) => item.status !== "paid");
  const monthlyKeys = Array.from(
    new Set([
      ...incomes.map((item) => item.received_on.slice(0, 7)),
      ...expenses.map((item) => item.due_date.slice(0, 7)),
    ]),
  ).sort();

  return {
    cards: [
      {
        label: "Saldo atual",
        value: currentBalance,
        description: "Resultado do que ja entrou e saiu, considerando o panorama atual das entradas, despesas e reservas.",
        details: [
          { label: "Entradas registradas", value: totalIncomes.toFixed(2) },
          { label: "Despesas consideradas", value: totalExpenses.toFixed(2) },
          { label: "Total reservado", value: totalReserved.toFixed(2) },
        ],
      },
      {
        label: "Entradas do mes",
        value: totalIncomes,
        description: "Soma de todas as entradas visiveis no periodo atual, separando o que ja foi recebido do que ainda esta previsto.",
        details: [
          { label: "Recebidas", value: receivedIncomes.toFixed(2) },
          { label: "Previstas", value: expectedIncomes.toFixed(2) },
          { label: "Quantidade de entradas", value: String(incomes.length) },
        ],
      },
      {
        label: "Despesas do mes",
        value: totalExpenses,
        description: "Soma das despesas do periodo usando o valor real quando preenchido e o estimado quando ainda nao houve ajuste.",
        details: [
          { label: "Pagas", value: paidExpenses.toFixed(2) },
          { label: "Pendentes/atrasadas", value: pendingExpenses.toFixed(2) },
          { label: "Quantidade de despesas", value: String(expenses.length) },
        ],
      },
      {
        label: "Total reservado",
        value: totalReserved,
        description: "Total atualmente acumulado nas reservas cadastradas.",
        details: [
          { label: "Reservas com saldo", value: String(activeReserves) },
          { label: "Quantidade de reservas", value: String(reserves.length) },
          { label: "Saldo consolidado", value: totalReserved.toFixed(2) },
        ],
      },
      {
        label: "Uso de cartoes",
        value: totalCardUsage,
        description: "Total em aberto nas parcelas de cartao ainda nao quitadas.",
        details: [
          { label: "Parcelas em aberto", value: String(openInstallments.length) },
          { label: "Parcelas totais", value: String(installments.length) },
          { label: "Compromisso em aberto", value: totalCardUsage.toFixed(2) },
        ],
      },
      {
        label: "Saldo projetado",
        value: projectedBalance,
        description: "Estimativa do saldo considerando entradas previstas e despesas ainda nao liquidadas.",
        details: [
          { label: "Saldo atual", value: currentBalance.toFixed(2) },
          { label: "Entradas previstas", value: expectedIncomes.toFixed(2) },
          { label: "Despesas pendentes", value: pendingExpenses.toFixed(2) },
        ],
      },
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
    repasseMonth,
    repasseMonths: allocationMonths.length > 0 ? allocationMonths : [currentMonth],
    monthlyRepasses: monthlyRepasses.totalsByAssignee,
    monthlyRepassBreakdown: monthlyRepasses.breakdownByFixedExpense,
    monthlyRepassGrandTotal: monthlyRepasses.grandTotal,
  };
}
