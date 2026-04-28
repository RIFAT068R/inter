"use client";

import { Navbar } from "@/components/navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <Navbar />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-8 pt-24 sm:pt-28">
        <main className="page-enter flex-1">{children}</main>
      </div>
    </div>
  );
}
