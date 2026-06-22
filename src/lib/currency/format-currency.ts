const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(value: number) {
  return brlFormatter.format(value);
}

export function formatCurrencyInputValue(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return formatCurrency(Number(digits) / 100);
}

export function toMaskedCurrencyDefaultValue(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "";
  }

  return formatCurrency(value);
}
