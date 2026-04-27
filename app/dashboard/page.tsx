import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ModuleCard } from "@/components/module-card";

const modules = [
  {
    title: "Answer Analyzer",
    description: "Free local scoring for leadership, confidence, responsibility, decision making, positivity, and practicality.",
    href: "/analyzer",
    active: true,
  },
  {
    title: "Word Reaction Test",
    description: "Timed word prompts with response tracking and quick review.",
    href: "/practice/wat",
    active: true,
  },
  {
    title: "Situation Response Test",
    description: "Scenario-based decision training with timed written responses.",
    href: "/practice/srt",
    active: true,
  },
  {
    title: "Story Writing Test",
    description: "Structured image-to-story practice for clarity and speed.",
    href: "#",
    active: false,
  },
  {
    title: "Perception Test",
    description: "Coming soon with image recall and assessment drills.",
    href: "#",
    active: false,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Dashboard" title="Your training command center" subtitle="Move into the active module, keep your preparation structured, and expand into more ISSB drills as they go live." />

      <section className="glass-panel p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Welcome</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Focused practice beats random repetition.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Start with WAT or SRT, build response speed, then run your answers through the free local analyzer for practical feedback.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/practice/wat" className="primary-button">
              Launch WAT
            </Link>
            <Link href="/practice/srt" className="secondary-button">
              Launch SRT
            </Link>
            <Link href="/analyzer" className="secondary-button">
              Open Analyzer
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <ModuleCard key={module.title} {...module} />
        ))}
      </section>
    </div>
  );
}
