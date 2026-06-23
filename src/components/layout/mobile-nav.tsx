"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronUp,
  Bell,
  CreditCard,
  Landmark,
  LayoutDashboard,
  PiggyBank,
  Settings,
  Tags,
  Wallet,
} from "lucide-react";

const iconMap = {
  bell: Bell,
  "credit-card": CreditCard,
  dashboard: LayoutDashboard,
  landmark: Landmark,
  "piggy-bank": PiggyBank,
  settings: Settings,
  tags: Tags,
  wallet: Wallet,
} as const;

export type MobileNavIconName = keyof typeof iconMap;

export function MobileNav({
  items,
}: {
  items: Array<{
    href: string;
    label: string;
    iconName: MobileNavIconName;
  }>;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const primaryItems = items.filter(({ href }) =>
    ["/dashboard", "/entradas", "/despesas", "/contas-fixas"].includes(href),
  );
  const overflowItems = items.filter(
    ({ href }) => !primaryItems.some((item) => item.href === href),
  );

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 lg:hidden">
      {expanded ? (
        <div className="glass-card mb-3 grid grid-cols-2 gap-2 rounded-[1.75rem] p-3">
          {overflowItems.map(({ href, iconName, label }) => {
            const active = pathname === href;
            const Icon = iconMap[iconName];

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setExpanded(false)}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm ${
                  active ? "bg-emerald-100 text-emerald-900" : "text-[color:var(--text-muted)]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      ) : null}
      <nav className="glass-card grid grid-cols-5 gap-1 rounded-[1.75rem] p-2">
        {primaryItems.map(({ href, iconName, label }) => {
          const active = pathname === href;
          const Icon = iconMap[iconName];

          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-0 flex-col items-center gap-1.5 rounded-2xl px-2 py-2 text-center text-[10px] leading-tight ${
                active ? "bg-emerald-100 text-emerald-900" : "text-[color:var(--text-muted)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="line-clamp-2">{label}</span>
            </Link>
          );
        })}
        {overflowItems.length > 0 ? (
          <button
            type="button"
            aria-label={expanded ? "Ocultar modulos" : "Mostrar mais modulos"}
            onClick={() => setExpanded((current) => !current)}
            className={`flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-2 text-center text-[10px] leading-tight ${
              expanded ? "bg-emerald-100 text-emerald-900" : "text-[color:var(--text-muted)]"
            }`}
          >
            <ChevronUp
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
            <span className="line-clamp-2">Mais</span>
          </button>
        ) : null}
      </nav>
    </div>
  );
}
