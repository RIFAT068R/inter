"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6 lg:px-8">
      <div className="top-nav mx-auto max-w-6xl rounded-2xl px-4 sm:px-5 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="min-w-0 leading-none">
            <span className="block truncate text-base font-bold text-white sm:text-lg">NextLeader</span>
            <span className="mt-1 block truncate text-[9px] uppercase tracking-[0.2em] text-slate-400/60 sm:text-[10px]">Train Like the Next Leader</span>
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

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setIsOpen((value) => !value)}
              className="theme-toggle-button flex h-11 w-11 items-center justify-center md:hidden"
            >
              <span className="relative h-4 w-5">
                <span className={`absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current transition-all duration-300 ease-out ${isOpen ? "top-[7px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-[7px] h-[2px] w-5 rounded-full bg-current transition-all duration-300 ease-out ${isOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`absolute left-0 top-[14px] h-[2px] w-5 rounded-full bg-current transition-all duration-300 ease-out ${isOpen ? "top-[7px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${isOpen ? "max-h-80 pb-4 opacity-100" : "max-h-0 pb-0 opacity-0"}`}>
          <nav className="grid gap-2 border-t border-white/5 pt-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? "rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-white" : "rounded-xl px-4 py-3 text-sm font-medium text-nl-textMuted transition-all duration-300 ease-out hover:bg-white/5 hover:text-nl-accent"}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
