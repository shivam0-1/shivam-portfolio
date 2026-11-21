"use client";

import { Icon } from "@/components/ui/Icon";

// The theme lives on <html data-theme>, set before paint by the layout script.
// CSS decides which icon shows, so there is no flash or hydration mismatch.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage blocked (private mode): the theme still applies for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className={`grid size-10 place-items-center rounded-full border border-line-strong text-muted transition-colors duration-500 hover:border-text hover:text-text ${className}`}
    >
      <Icon name="sun" className="icon-sun size-4" />
      <Icon name="moon" className="icon-moon size-4" />
    </button>
  );
}
