import Link from "next/link";

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
    <article className="glass-panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-semibold text-white">{title}</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
        </div>
        <span className={active ? "rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300" : "rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300"}>
          {active ? "Active" : "Coming Soon"}
        </span>
      </div>

      <div className="mt-6">
        {active ? (
          <Link href={href} className="primary-button">
            Open Module
          </Link>
        ) : (
          <span className="secondary-button cursor-not-allowed opacity-70">Coming Soon</span>
        )}
      </div>
    </article>
  );
}
