"use client";

import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle-button flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 backdrop-blur-md transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#CEF17B]/30"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 0 0 13ZM12 1.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm0 17.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75ZM4.4 4.4a.75.75 0 0 1 1.06 0l1.42 1.42a.75.75 0 1 1-1.06 1.06L4.4 5.46a.75.75 0 0 1 0-1.06Zm12.72 12.72a.75.75 0 0 1 1.06 0l1.42 1.42a.75.75 0 0 1-1.06 1.06l-1.42-1.42a.75.75 0 0 1 0-1.06ZM1.75 12a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2A.75.75 0 0 1 1.75 12Zm17.75 0a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75ZM5.82 17.12a.75.75 0 0 1 1.06 1.06L5.46 19.6a.75.75 0 1 1-1.06-1.06l1.42-1.42Zm12.36-12.36a.75.75 0 1 1 1.06 1.06l-1.42 1.42a.75.75 0 0 1-1.06-1.06l1.42-1.42Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="M14.7 2.2a.75.75 0 0 1 .78.95 8.5 8.5 0 0 0 10.37 10.37.75.75 0 0 1 .95.78A10.5 10.5 0 1 1 14.7 2.2Z" transform="translate(-3 -1)" />
        </svg>
      )}
    </button>
  );
}
