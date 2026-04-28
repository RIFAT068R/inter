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
    <section className="space-y-4 py-16">
      <p className="type-label">{eyebrow}</p>
      <h1 className="type-heading-xl max-w-4xl text-slate-900 dark:text-white">{title}</h1>
      <p className="type-body max-w-2xl leading-7">{subtitle}</p>
    </section>
  );
}
