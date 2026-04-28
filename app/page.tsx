import Link from "next/link";

const features = [
  {
    title: "Timed Practice",
    description: "Exam-style countdowns for fast, disciplined thinking.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="8" />
      </svg>
    ),
  },
  {
    title: "Custom Question Sets",
    description: "Build focused drills from your own practice prompts.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M8 6h8M8 10h8M8 14h5" />
        <path d="M6 3h9l3 3v15H6z" />
      </svg>
    ),
  },
  {
    title: "Result Review",
    description: "Review completions, skips, and answer quality quickly.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M4 17l5-5 3 3 6-6" />
        <path d="M18 14v4H4V6h4" />
      </svg>
    ),
  },
  {
    title: "Free Forever MVP",
    description: "Local-first practice with zero paid backend dependence.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden py-8 sm:py-12">
        <div className="pointer-events-none absolute left-0 top-8 -z-10 h-[360px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(206,241,123,0.14),transparent_72%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[8%] top-8 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(206,241,123,0.18)_0%,rgba(115,163,78,0.1)_38%,rgba(4,27,20,0)_72%)] blur-2xl" />
        <div className="pointer-events-none absolute right-[14%] top-20 -z-10 h-[420px] w-[420px] rounded-full border border-[#CEF17B]/20 bg-[radial-gradient(circle_at_35%_35%,rgba(206,241,123,0.22),rgba(8,71,52,0.08)_42%,rgba(4,27,20,0)_70%)] shadow-[0_0_80px_rgba(206,241,123,0.12)]" />

        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8 pt-4">
            <p className="type-label">NextLeader</p>
            <h1 className="type-heading-xl max-w-3xl leading-[1.02] text-white lg:text-[5.25rem]">
              <span className="block">Train Like the</span>
              <span className="text-lime-acc block">Next Leader</span>
            </h1>
            <p className="type-body max-w-xl leading-8 sm:text-lg">
              Practice ISSB psychological tests with real timers, clear tracking, and focused feedback.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/practice" className="primary-button">
                Start Practice
              </Link>
              <Link
                href="/practice/wat?demo=1"
                className="inline-flex items-center justify-center rounded-xl border border-[#CEF17B]/20 bg-transparent px-5 py-2.5 text-sm font-medium text-[#E6FFF3] transition hover:bg-[#CEF17B]/6 hover:shadow-[0_10px_24px_rgba(206,241,123,0.12)] focus:outline-none focus:ring-2 focus:ring-[#CEF17B]/30"
              >
                Try WAT Demo
              </Link>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#CEF17B]/10 text-[#CEF17B]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="7" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M12 5v2M19 12h-2" />
                </svg>
              </div>
              <p className="type-label">Mission Profile</p>
            </div>
            <h2 className="type-heading-l mt-6 leading-tight text-white sm:text-[2rem]">Train with structure, not guesswork.</h2>
            <div className="mt-8 space-y-6">
              {[
                ["Real timers", "Stay sharp under real exam-style countdown pressure."],
                ["Local privacy", "Your sessions remain stored only in your browser."],
                ["Fast review", "See what you completed, skipped, and how you responded."],
              ].map(([title, desc], index) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#CEF17B]/8 text-[#CEF17B]">
                    {index === 0 ? (
                      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M12 6v6l4 2" />
                        <circle cx="12" cy="12" r="8" />
                      </svg>
                    ) : index === 1 ? (
                      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M12 3l7 4v5c0 4.5-2.9 7.7-7 9-4.1-1.3-7-4.5-7-9V7l7-4Z" />
                        <path d="M9.5 12.5l1.7 1.7 3.5-4" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M4 17l5-5 3 3 6-6" />
                        <path d="M18 14v4H4V6h4" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="glass-panel flex min-h-[252px] flex-col p-6 transition duration-300 hover:scale-[1.02] hover:border-[#CEF17B]/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CEF17B]/10 text-[#CEF17B] shadow-[0_0_22px_rgba(206,241,123,0.08)]">
              {feature.icon}
            </div>
            <p className="mt-8 text-xl font-semibold text-white">{feature.title}</p>
            <p className="mt-3 max-w-[22ch] text-sm leading-6 text-slate-300">{feature.description}</p>
            <div className="mt-auto pt-8 text-[#CEF17B]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
