export function parseCurrencyInput(value: FormDataEntryValue | null | undefined) {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");

  if (!normalized) {
    return value;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : value;
}
