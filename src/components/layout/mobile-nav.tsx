"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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

  return (
    <nav className="glass-card fixed inset-x-4 bottom-4 z-50 flex rounded-[1.75rem] p-2 lg:hidden">
      {items.slice(0, 5).map(({ href, iconName, label }) => {
        const active = pathname === href;
        const Icon = iconMap[iconName];

        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-2 rounded-2xl px-3 py-2 text-[11px] ${
              active ? "bg-emerald-100 text-emerald-900" : "text-slate-600"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
