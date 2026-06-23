"use client";

import { Bell, ChevronLeft, ChevronRight, CreditCard, Landmark, LayoutDashboard, LogOut, PiggyBank, Settings, Tags, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

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

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot() {
  return false;
}

export function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggleSidebar() {
    const next = !collapsed;
    window.localStorage.setItem(STORAGE_KEY, String(next));
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: String(next) }));
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-4 px-3 py-3 sm:px-5 sm:py-5 lg:px-8">
      <aside
        className={`glass-card hidden self-start rounded-[2rem] p-4 lg:sticky lg:top-4 lg:flex lg:h-[calc(100vh-2rem)] lg:flex-col ${
          collapsed ? "lg:w-20" : "lg:w-52"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className={collapsed ? "hidden" : "block"}>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--text-subtle)]">
              Controle Financeiro
            </p>
            <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[color:var(--text-main)]">Painel</p>
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            className="rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] p-2 text-[color:var(--text-main)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
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
                className={`flex items-center rounded-2xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-emerald-100 text-emerald-900"
                    : "text-[color:var(--text-muted)] hover:bg-[color:var(--surface-raised)] hover:text-[color:var(--text-main)]"
                } ${collapsed ? "justify-center" : "gap-3"}`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-emerald-700" : "text-[color:var(--text-subtle)]"}`} />
                {collapsed ? null : <span className="truncate text-[12px] font-medium">{label}</span>}
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
            className={`mt-3 w-full rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] px-3 py-2 text-sm text-[color:var(--text-main)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] ${
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
