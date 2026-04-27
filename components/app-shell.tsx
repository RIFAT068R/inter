"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/practice", label: "Select Practice" },
  { href: "/practice/wat", label: "WAT Setup" },
  { href: "/analyzer", label: "Analyzer" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="glass-panel sticky top-4 z-30 mb-6 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex flex-col">
                <span className="text-lg font-semibold text-white">NextLeader</span>
                <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Train Like the Next Leader</span>
              </Link>
              <div className="lg:hidden">
                <ThemeToggle />
              </div>
            </div>

            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={isActive ? "rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white" : "rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 pb-8">{children}</main>
      </div>
    </div>
  );
}
