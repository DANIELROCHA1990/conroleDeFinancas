"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function ExpandableCard({
  summary,
  children,
  defaultExpanded = false,
  className = "",
}: {
  summary: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <article className={`glass-card rounded-[1.5rem] p-5 ${className}`}>
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div className="min-w-0 flex-1">{summary}</div>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {expanded ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}
