import { paymentAssigneeFormSchema } from "@/features/settings/payment-assignees.schema";

export function parsePaymentAssigneeInput(formData: FormData) {
  return paymentAssigneeFormSchema.parse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    active: formData.get("active") !== "false",
  });
}
