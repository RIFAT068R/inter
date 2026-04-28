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
    title: "Thematic Apperception Test",
    description: "Timed image-to-story writing with temporary browser-only uploads.",
    href: "/practice/tat",
    active: true,
  },
  {
    title: "Picture Perception and Description Test",
    description: "Two-phase image viewing and memory-based story writing under timed pressure.",
    href: "/practice/ppdt",
    active: true,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-16">
      <PageHeader eyebrow="Dashboard" title="Your training command center" subtitle="Move into the active module, keep your preparation structured, and expand into more ISSB drills as they go live." />

      <section className="glass-panel p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="type-label">Welcome</p>
            <h2 className="type-heading-l mt-3 text-white">Focused practice beats random repetition.</h2>
            <p className="type-body mt-3 max-w-xl leading-6">
              Start with WAT, SRT, TAT, or PPDT, build response speed, then run your answers through the free local analyzer for practical feedback.
            </p>
          </div>
          <div>
            <Link href="/practice" className="primary-button">
              Open Practice Modules
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => (
          <ModuleCard key={module.title} {...module} />
        ))}
      </section>
    </div>
  );
}
