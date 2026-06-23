"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function ExpandableCard({
  summary,
  children,
  defaultExpanded = false,
  expanded,
  onExpandedChange,
  className = "",
}: {
  summary: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
}) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = expanded !== undefined;
  const isExpanded = isControlled ? expanded : internalExpanded;

  function handleToggle() {
    const nextExpanded = !isExpanded;

    if (!isControlled) {
      setInternalExpanded(nextExpanded);
    }

    onExpandedChange?.(nextExpanded);
  }

  return (
    <article className={`glass-card rounded-[1.75rem] p-5 sm:p-6 ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isExpanded}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div className="min-w-0 flex-1">{summary}</div>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-[color:var(--text-muted)] transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {isExpanded ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}
