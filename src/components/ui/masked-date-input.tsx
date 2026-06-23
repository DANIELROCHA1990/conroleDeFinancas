"use client";

import { useId, useState } from "react";

type MaskedDateInputProps = {
  name: string;
  mode: "date" | "month";
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatDisplayValue(value: string, mode: "date" | "month") {
  const digits = normalizeDigits(value);

  if (mode === "month") {
    if (digits.length <= 2) {
      return digits;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2, 6)}`;
  }

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

function toDisplayValue(value: string | null | undefined, mode: "date" | "month") {
  if (!value) {
    return "";
  }

  if (mode === "month") {
    const [year = "", month = ""] = value.slice(0, 7).split("-");
    return year && month ? `${month}/${year}` : "";
  }

  const [year = "", month = "", day = ""] = value.slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : "";
}

function toNormalizedValue(value: string, mode: "date" | "month") {
  const digits = normalizeDigits(value);

  if (mode === "month") {
    if (digits.length !== 6) {
      return "";
    }

    const month = digits.slice(0, 2);
    const year = digits.slice(2, 6);
    return `${year}-${month}`;
  }

  if (digits.length !== 8) {
    return "";
  }

  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return `${year}-${month}-${day}`;
}

export function MaskedDateInput({
  name,
  mode,
  defaultValue,
  placeholder,
  required,
  className,
}: MaskedDateInputProps) {
  const inputId = useId();
  const [displayValue, setDisplayValue] = useState(() => toDisplayValue(defaultValue, mode));
  const [normalizedValue, setNormalizedValue] = useState(() => toNormalizedValue(toDisplayValue(defaultValue, mode), mode));

  return (
    <>
      <input
        id={inputId}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={displayValue}
        placeholder={placeholder}
        className={className}
        onChange={(event) => {
          const nextDisplay = formatDisplayValue(event.target.value, mode);
          setDisplayValue(nextDisplay);
          setNormalizedValue(toNormalizedValue(nextDisplay, mode));
        }}
        aria-label={placeholder ?? name}
      />
      <input name={name} type="hidden" value={normalizedValue} required={required} />
    </>
  );
}
