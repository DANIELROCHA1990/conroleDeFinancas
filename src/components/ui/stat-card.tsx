import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  description,
  accent,
}: {
  label: string;
  value: ReactNode;
  description?: string;
  accent?: ReactNode;
}) {
  return (
    <div className="glass-card rounded-[1.75rem] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[color:var(--text-muted)]">{label}</p>
          <div className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--text-main)]">
            {value}
          </div>
          {description ? <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">{description}</p> : null}
        </div>
        {accent}
      </div>
    </div>
  );
}
