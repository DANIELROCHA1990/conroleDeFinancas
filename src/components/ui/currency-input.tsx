"use client";

import { useId, useState } from "react";

function formatCurrencyValue(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  const amount = Number(digits) / 100;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

function toMaskedDefaultValue(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function CurrencyInput({
  name,
  defaultValue,
  placeholder,
  className,
  required,
  min,
}: {
  name: string;
  defaultValue?: number | null;
  placeholder?: string;
  className?: string;
  required?: boolean;
  min?: number;
}) {
  const inputId = useId();
  const [displayValue, setDisplayValue] = useState(() => toMaskedDefaultValue(defaultValue));

  return (
    <input
      id={inputId}
      name={name}
      inputMode="decimal"
      autoComplete="off"
      value={displayValue}
      placeholder={placeholder}
      className={className}
      required={required}
      aria-label={placeholder ?? name}
      onChange={(event) => {
        setDisplayValue(formatCurrencyValue(event.target.value));
      }}
      onBlur={() => {
        if (displayValue && min !== undefined) {
          const digits = displayValue.replace(/\D/g, "");
          const amount = Number(digits) / 100;

          if (amount < min) {
            setDisplayValue(toMaskedDefaultValue(min));
          }
        }
      }}
    />
  );
}
