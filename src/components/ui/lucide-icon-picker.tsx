"use client";

import {
  Banknote,
  Briefcase,
  Car,
  CreditCard,
  Dumbbell,
  ForkKnife,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  PiggyBank,
  Plane,
  Receipt,
  Shirt,
  ShoppingBag,
  Smartphone,
  Tag,
  TrendingUp,
  Truck,
  Utensils,
  Wallet,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

const availableIcons = [
  { name: "banknote", icon: Banknote },
  { name: "briefcase", icon: Briefcase },
  { name: "car", icon: Car },
  { name: "credit-card", icon: CreditCard },
  { name: "dumbbell", icon: Dumbbell },
  { name: "fork-knife", icon: ForkKnife },
  { name: "graduation-cap", icon: GraduationCap },
  { name: "heart-pulse", icon: HeartPulse },
  { name: "home", icon: Home },
  { name: "laptop", icon: Laptop },
  { name: "piggy-bank", icon: PiggyBank },
  { name: "plane", icon: Plane },
  { name: "receipt", icon: Receipt },
  { name: "shirt", icon: Shirt },
  { name: "shopping-bag", icon: ShoppingBag },
  { name: "smartphone", icon: Smartphone },
  { name: "tag", icon: Tag },
  { name: "trending-up", icon: TrendingUp },
  { name: "truck", icon: Truck },
  { name: "utensils", icon: Utensils },
  { name: "wallet", icon: Wallet },
  { name: "wifi", icon: Wifi },
] as const satisfies Array<{ name: string; icon: LucideIcon }>;

function findIcon(name?: string | null) {
  return availableIcons.find((item) => item.name === name) ?? availableIcons[0];
}

export function LucideIconPicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const initialIcon = findIcon(defaultValue);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon.name);
  const [query, setQuery] = useState("");
  const SelectedIcon = findIcon(selectedIcon).icon;

  const filteredIcons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return availableIcons;
    }

    return availableIcons.filter((item) => item.name.includes(normalizedQuery));
  }, [query]);

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={selectedIcon} />
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
          <SelectedIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-slate-500">ICONE SELECIONADO</p>
          <p className="truncate text-sm font-medium text-slate-900">{selectedIcon}</p>
        </div>
      </div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value.toLowerCase())}
        placeholder="BUSCAR ICONE"
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
      />
      <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-2">
        {filteredIcons.map(({ name: iconName, icon: Icon }) => {
          const active = iconName === selectedIcon;

          return (
            <button
              key={iconName}
              type="button"
              onClick={() => setSelectedIcon(iconName)}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${
                active
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-white/60 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{iconName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
