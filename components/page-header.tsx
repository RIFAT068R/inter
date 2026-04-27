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
    <section className="space-y-3 py-4">
      <p className="text-sm uppercase tracking-[0.28em] text-blue-200 dark:text-blue-200">{eyebrow}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{title}</h1>
      <p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{subtitle}</p>
    </section>
  );
}
