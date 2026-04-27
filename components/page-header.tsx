export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="space-y-4 py-2 sm:py-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-blue-200 dark:text-blue-200">{eyebrow}</p>
      <h1 className="max-w-4xl text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">{title}</h1>
      <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">{subtitle}</p>
    </section>
  );
}
