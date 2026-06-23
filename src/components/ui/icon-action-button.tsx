import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type SharedProps = {
  label: string;
  icon: LucideIcon;
  tone?: "primary" | "neutral" | "danger";
  className?: string;
  children?: ReactNode;
};

function getToneClasses(tone: "primary" | "neutral" | "danger") {
  if (tone === "danger") {
    return "border-rose-500/25 bg-rose-500/12 text-rose-700 dark:text-rose-200";
  }

  if (tone === "primary") {
    return "border-[color:var(--border-strong)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]";
  }

  return "border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] text-[color:var(--text-main)]";
}

export function IconActionButton({
  label,
  icon: Icon,
  tone = "neutral",
  className = "",
  ...props
}: SharedProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const buttonType = props.type ?? "button";

  return (
    <button
      type={buttonType}
      aria-label={label}
      title={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-strong)] ${getToneClasses(tone)} ${className}`}
      {...props}
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </button>
  );
}

export function IconActionLink({
  href,
  label,
  icon: Icon,
  tone = "neutral",
  className = "",
}: SharedProps & { href: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent-strong)] ${getToneClasses(tone)} ${className}`}
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </Link>
  );
}
