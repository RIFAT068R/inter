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
    <article className="glass-panel p-6 sm:p-8">
      <div>
        <p className="text-xl font-semibold text-white">{title}</p>
        <p className="mt-3 max-w-md line-clamp-1 text-sm text-slate-300">{description}</p>
      </div>

      <div className="mt-8">
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
