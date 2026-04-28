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

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6 lg:px-8">
      <div className="top-nav mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl px-4 sm:px-5 lg:px-6">
        <Link href="/" className="min-w-0 leading-none">
          <span className="block truncate text-lg font-bold text-white">NextLeader</span>
          <span className="mt-1 block truncate text-[10px] uppercase tracking-[0.22em] text-slate-400/65">Train Like the Next Leader</span>
        </Link>

        <nav className="hidden items-center justify-center gap-5 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "relative text-sm font-medium text-white transition-all duration-300 ease-out before:absolute before:-bottom-[3px] before:left-1/2 before:h-1 before:w-1 before:-translate-x-1/2 before:rounded-full before:bg-nl-accent before:shadow-[0_0_12px_rgba(206,241,123,0.9)] after:absolute after:-bottom-[11px] after:left-1/2 after:h-[2px] after:w-10 after:-translate-x-1/2 after:rounded-full after:bg-nl-accent after:shadow-[0_0_18px_rgba(206,241,123,0.9)]"
                    : "text-sm font-medium text-nl-textMuted transition-all duration-300 ease-out hover:text-nl-accent"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
