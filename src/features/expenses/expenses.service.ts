import { expenseFormSchema } from "@/features/expenses/expenses.schema";

export function parseExpenseInput(formData: FormData) {
  return expenseFormSchema.parse({
    id: formData.get("id") || undefined,
    description: formData.get("description"),
    amount: formData.get("amount"),
    estimated_amount: formData.get("estimated_amount") || null,
    due_date: formData.get("due_date"),
    competence_month: formData.get("competence_month") || null,
    fixed_expense_id: formData.get("fixed_expense_id") || null,
    paid_at: formData.get("paid_at") || null,
    category_id: formData.get("category_id"),
    status: formData.get("status"),
    payment_method: formData.get("payment_method") || null,
  });
}

export function getExpenseStatus({
  dueDate,
  paidAt,
  status,
}: {
  dueDate: string;
  paidAt: string | null;
  status: "pending" | "paid" | "late" | "cancelled";
}) {
  if (status === "paid" || paidAt) return "paid";
  if (status === "cancelled") return "cancelled";
  return new Date(dueDate) < new Date() ? "late" : "pending";
}
