"use client";

import { Navbar } from "@/components/navbar";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFocusRoute = /^\/practice\/(wat|srt|tat|ppdt)\/session$/.test(pathname);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      {!isFocusRoute ? <Navbar /> : null}
      <div className={isFocusRoute ? "relative mx-auto flex min-h-screen w-full max-w-none flex-col px-0 py-0" : "relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-8 pt-24 sm:pt-28"}>
        <main className="page-enter flex-1">{children}</main>
      </div>
    </div>
  );
}
