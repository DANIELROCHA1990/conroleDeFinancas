export type Category = {
  id: string;
  name: string;
  type: "income" | "expense" | "both";
  color: string;
  icon: string;
  active: boolean;
};

export type Income = {
  id: string;
  description: string;
  amount: number;
  status: "received" | "expected";
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  estimatedAmount?: number | null;
  status: "pending" | "paid" | "late" | "cancelled";
  categoryId: string;
};

export type FixedExpense = {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  amountMode?: "fixed" | "variable";
};

export type CreditCard = {
  id: string;
  name: string;
  bank: string;
  limit: number;
  currentUsage: number;
};

export type Purchase = {
  id: string;
  description: string;
  amount: number;
};

export type Reserve = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
};
