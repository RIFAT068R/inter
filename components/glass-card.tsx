import type { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border border-[rgba(206,241,123,0.15)] bg-[rgba(8,71,52,0.45)] p-6 shadow-glass backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
