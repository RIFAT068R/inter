import Link from "next/link";
import { PageHeader } from "@/components/page-header";

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
    <div className="space-y-10">
      <PageHeader eyebrow="NextLeader" title="Train Like the Next Leader" subtitle="Practice ISSB psychological tests with real exam-style timers, answer tracking, and smart feedback." />

      <section className="glass-panel overflow-hidden p-8 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
              Train Like the Next Leader
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Elite ISSB practice in a focused, premium workspace.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Build speed, clarity, and consistency with realistic timed drills designed for disciplined preparation.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/practice" className="primary-button">
                Start Practice
              </Link>
              <Link href="/practice/wat?demo=1" className="secondary-button">
                Try WAT Demo
              </Link>
            </div>
          </div>

          <div className="glass-panel grid gap-4 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Mission Profile</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Train with structure, not guesswork.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                ["Real Timers", "15-second WAT flow that mirrors exam pressure."],
                ["Local Privacy", "Your progress stays in localStorage on your device."],
                ["Fast Review", "See what you completed, skipped, and how much you wrote."],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-medium text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p>
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
