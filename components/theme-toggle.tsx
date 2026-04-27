"use client";

import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" onClick={toggleTheme} className="secondary-button min-w-28">
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
