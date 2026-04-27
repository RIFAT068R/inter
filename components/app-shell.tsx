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
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="top-nav sticky top-4 z-30 mb-8 h-16 rounded-[24px] border-b border-white/10 bg-white/5 px-4 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:bg-white/5 sm:px-5 lg:px-6">
          <div className="mx-auto flex h-full items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Link href="/" className="min-w-0 leading-none">
                <span className="block truncate text-lg font-bold text-white">NextLeader</span>
                <span className="mt-1 block truncate text-[10px] uppercase tracking-[0.22em] text-slate-400/75">Train Like the Next Leader</span>
              </Link>
              <div className="lg:hidden">
                <ThemeToggle />
              </div>
            </div>

            <nav className="hidden items-center justify-center gap-5 md:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={isActive ? "relative text-sm font-medium text-white after:absolute after:-bottom-2 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rounded-full after:bg-[#CEF17B] after:shadow-[0_0_18px_rgba(206,241,123,0.8)]" : "text-sm font-medium text-slate-400 transition hover:text-white"}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 pb-10">{children}</main>
      </div>
    </div>
  );
}
