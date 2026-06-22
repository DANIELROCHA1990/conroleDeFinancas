"use client";

import { Bell, ChevronLeft, ChevronRight, CreditCard, Landmark, LayoutDashboard, LogOut, PiggyBank, Settings, Tags, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { MobileNav, type MobileNavIconName } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { signOut } from "@/lib/supabase/auth-actions";

const navItems: Array<{
  href: string;
  label: string;
  icon: typeof Bell;
  iconName: MobileNavIconName;
}> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, iconName: "dashboard" },
  { href: "/categorias", label: "Categorias", icon: Tags, iconName: "tags" },
  { href: "/entradas", label: "Entradas", icon: Landmark, iconName: "landmark" },
  { href: "/despesas", label: "Despesas", icon: Wallet, iconName: "wallet" },
  { href: "/contas-fixas", label: "Contas fixas", icon: Bell, iconName: "bell" },
  { href: "/cartoes", label: "Cartoes", icon: CreditCard, iconName: "credit-card" },
  { href: "/reservas", label: "Reservas", icon: PiggyBank, iconName: "piggy-bank" },
  { href: "/relatorios", label: "Relatorios", icon: LayoutDashboard, iconName: "dashboard" },
  { href: "/configuracoes", label: "Configuracoes", icon: Settings, iconName: "settings" },
];

const STORAGE_KEY = "finance-sidebar-collapsed";

export function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(STORAGE_KEY) === "true";
  });

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <aside
        className={`glass-card hidden self-start rounded-[2rem] p-4 lg:sticky lg:top-4 lg:flex lg:h-[calc(100vh-2rem)] lg:flex-col ${
          collapsed ? "lg:w-20" : "lg:w-52"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className={collapsed ? "hidden" : "block"}>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
              Controle de Financas
            </p>
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            className="rounded-2xl border border-slate-200 bg-white/80 p-2 text-slate-700 transition hover:bg-slate-50"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-1.5">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center rounded-2xl px-3 py-2 text-sm transition ${
                  active
                    ? "bg-emerald-100 text-emerald-900"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                } ${collapsed ? "justify-center" : "gap-3"}`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-emerald-700" : "text-slate-500"}`} />
                {collapsed ? null : <span className="truncate text-[12px]">{label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-3">
          <ThemeToggle collapsed={collapsed} />
        </div>
        <form action={signOut}>
          <button
            type="submit"
            aria-label="Sair"
            title="Sair"
            className={`mt-3 w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-800 ${
              collapsed ? "flex justify-center" : "flex items-center gap-3"
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {collapsed ? null : <span>Sair</span>}
          </button>
        </form>
      </aside>
      <div className="flex min-h-screen min-w-0 flex-1 flex-col gap-6 pb-24 lg:pb-6">
        {children}
      </div>
      <MobileNav
        items={navItems.map(({ href, label, iconName }) => ({
          href,
          label,
          iconName,
        }))}
      />
    </div>
  );
}
