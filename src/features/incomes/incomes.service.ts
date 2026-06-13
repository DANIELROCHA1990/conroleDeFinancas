import { incomeFormSchema } from "@/features/incomes/incomes.schema";
import { parseCurrencyInput } from "@/lib/currency/parse-currency";

export function parseIncomeInput(formData: FormData) {
  return incomeFormSchema.parse({
    id: formData.get("id") || undefined,
    description: formData.get("description"),
    amount: parseCurrencyInput(formData.get("amount")),
    received_on: formData.get("received_on"),
    category_id: formData.get("category_id"),
    status: formData.get("status"),
  });
}
