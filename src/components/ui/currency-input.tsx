"use client";

import { useId, useState } from "react";
import { formatCurrencyInputValue, toMaskedCurrencyDefaultValue } from "@/lib/currency/format-currency";

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
  const [displayValue, setDisplayValue] = useState(() => toMaskedCurrencyDefaultValue(defaultValue));

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
        setDisplayValue(formatCurrencyInputValue(event.target.value));
      }}
      onBlur={() => {
        if (displayValue && min !== undefined) {
          const digits = displayValue.replace(/\D/g, "");
          const amount = Number(digits) / 100;

          if (amount < min) {
            setDisplayValue(toMaskedCurrencyDefaultValue(min));
          }
        }
      }}
    />
  );
}
