"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "finance-theme";

function applyTheme(theme: "light" | "dark") {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.body.classList.toggle("dark", isDark);
}

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    applyTheme(theme);
  }, [mounted, theme]);

  function toggleTheme() {
    setTheme((current) => {
      const nextTheme = current === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
      return nextTheme;
    });
  }

  const isDark = theme === "dark";
  const buttonLabel = mounted ? (isDark ? "Tema claro" : "Tema escuro") : "Tema";
  const ariaLabel = mounted ? (isDark ? "Ativar tema claro" : "Ativar tema escuro") : "Alternar tema";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      title={buttonLabel}
      className={`w-full rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-raised)] px-3 py-2 text-sm text-[color:var(--text-main)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] ${
        collapsed ? "flex justify-center" : "flex items-center gap-3"
      }`}
    >
      {mounted && isDark ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
      {collapsed ? null : <span>{buttonLabel}</span>}
    </button>
  );
}
