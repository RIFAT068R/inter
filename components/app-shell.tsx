"use client";

import { Navbar } from "@/components/navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <Navbar />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-4 pb-6 pt-24 sm:px-6 sm:pb-8 sm:pt-28 lg:px-8 lg:pb-10 lg:pt-28">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
