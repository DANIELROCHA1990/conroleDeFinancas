"use client";

import type { ReactNode } from "react";

type FormFieldProps = {
  htmlFor?: string;
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export function FormField({
  htmlFor,
  label,
  hint,
  className = "",
  children,
}: FormFieldProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`flex min-w-0 flex-col gap-2 rounded-[1.25rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] p-3 shadow-[var(--shadow-soft)] ${className}`}
    >
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
        {label}
      </span>
      {children}
      {hint ? <span className="text-xs leading-5 text-[color:var(--text-subtle)]">{hint}</span> : null}
    </label>
  );
}
