import Link from "next/link";
import { GlassCard } from "@/components/glass-card";

export function ModuleCard({
  title,
  description,
  href,
  active,
}: {
  title: string;
  description: string;
  href: string;
  active: boolean;
}) {
  return (
    <GlassCard className="flex min-h-[240px] flex-col transition-all duration-300 hover:scale-[1.02]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CEF17B]/10 text-[#CEF17B] shadow-[0_0_22px_rgba(206,241,123,0.08)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 17l5-5 3 3 6-6" />
          <path d="M18 14v4H4V6h4" />
        </svg>
      </div>

      <div className="mt-8">
        <p className="text-xl font-semibold text-white">{title}</p>
        <p className="mt-3 max-w-[24ch] text-sm leading-6 text-slate-300">{description}</p>
      </div>

      <div className="mt-auto pt-8">
        {active ? (
          <Link href={href} className="primary-button">
            Open Module
          </Link>
        ) : (
          <span className="secondary-button cursor-not-allowed opacity-70">Coming Soon</span>
        )}
      </div>
    </GlassCard>
  );
}
