import Link from "next/link";

const features = [
  {
    title: "Timed Practice",
    description: "Exam-style countdowns that force fast, disciplined thinking under pressure.",
  },
  {
    title: "Custom Question Sets",
    description: "Paste your own words and build focused drills around your weak areas.",
  },
  {
    title: "Result Review",
    description: "Track completions, skipped prompts, and answer quality after every session.",
  },
  {
    title: "Free Forever MVP",
    description: "A fast local-first practice experience with zero paid backend dependencies.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden py-6 sm:py-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[460px] max-w-5xl rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.22),rgba(139,92,246,0.14),transparent_68%)] blur-3xl" />
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.36em] text-blue-200">NextLeader</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.02] text-white sm:text-5xl lg:text-6xl">
              Train Like the Next Leader.
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Practice ISSB psychological tests with real timers, clear tracking, and focused feedback.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/practice" className="primary-button">
                Start Practice
              </Link>
              <Link href="/practice/wat?demo=1" className="secondary-button">
                Try WAT Demo
              </Link>
            </div>
          </div>

          <div className="glass-panel p-7 sm:p-8 lg:p-9">
            <p className="section-kicker">Mission Profile</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Train with structure, not guesswork.</h2>
            <div className="mt-8 space-y-5">
              {[
                ["Real timers", "Stay sharp under real exam-style countdown pressure."],
                ["Local privacy", "Your sessions remain stored only in your browser."],
                ["Fast review", "See what you completed, skipped, and how you responded."],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-blue-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_14px_rgba(96,165,250,0.8)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <article key={feature.title} className="glass-panel p-6">
            <p className="text-lg font-semibold text-white">{feature.title}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{feature.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
