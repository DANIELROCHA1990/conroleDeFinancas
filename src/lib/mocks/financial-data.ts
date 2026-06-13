import type { Category, CreditCard, Expense, FixedExpense, Income, Purchase, Reserve } from "@/types/financial";

export const sampleCategories: Category[] = [
  { id: "cat-1", name: "Moradia", type: "expense", color: "#38bdf8", icon: "home", active: true },
  { id: "cat-2", name: "Alimentacao", type: "expense", color: "#fb7185", icon: "utensils", active: true },
  { id: "cat-3", name: "Salario", type: "income", color: "#4ade80", icon: "briefcase", active: true },
];

export const sampleIncomes: Income[] = [
  { id: "inc-1", description: "Salario", amount: 8200, status: "received" },
  { id: "inc-2", description: "Freelance", amount: 1400, status: "expected" },
];

export const sampleExpenses: Expense[] = [
  { id: "exp-1", description: "Supermercado", amount: 780, status: "paid", categoryId: "cat-2" },
  { id: "exp-2", description: "Energia", amount: 230, status: "pending", categoryId: "cat-1" },
  { id: "exp-3", description: "Internet", amount: 140, status: "paid", categoryId: "cat-1" },
];

export const sampleFixedExpenses: FixedExpense[] = [
  { id: "fix-1", name: "Aluguel", amount: 1800, dueDay: 5 },
  { id: "fix-2", name: "Plataformas", amount: 320, dueDay: 12 },
];

export const sampleCreditCards: CreditCard[] = [
  { id: "card-1", name: "Corporate Black", bank: "Banco Atlas", limit: 12000, currentUsage: 4800 },
  { id: "card-2", name: "Pessoal Visa", bank: "Banco Norte", limit: 7000, currentUsage: 1900 },
];

export const samplePurchases: Purchase[] = [
  { id: "pur-1", description: "Notebook", amount: 5400 },
  { id: "pur-2", description: "Passagem", amount: 1800 },
];

export const sampleReserves: Reserve[] = [
  { id: "res-1", name: "Emergencia", targetAmount: 30000, currentAmount: 11200 },
  { id: "res-2", name: "Viagem", targetAmount: 12000, currentAmount: 4300 },
];
