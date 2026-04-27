import { PageHeader } from "@/components/page-header";
import { ModuleCard } from "@/components/module-card";

export default function PracticeSelectionPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Practice" title="Select your practice module" subtitle="Word Reaction Test, Situation Response Test, Thematic Apperception Test, and the free Answer Analyzer are live." />

      <section className="grid gap-4 md:grid-cols-2">
        <ModuleCard
          title="Word Reaction Test"
          description="Paste your own words, run realistic timers, and review every response at the end."
          href="/practice/wat"
          active
        />
        <ModuleCard
          title="Answer Analyzer"
          description="Paste answers or import your latest WAT result for free rule-based leadership feedback."
          href="/analyzer"
          active
        />
        <ModuleCard
          title="Situation Response Test"
          description="Timed situational judgement practice tailored for ISSB preparation."
          href="/practice/srt"
          active
        />
        <ModuleCard
          title="Thematic Apperception Test"
          description="Upload images, write timed stories, and review them locally with no backend storage."
          href="/practice/tat"
          active
        />
        <ModuleCard
          title="Perception Test"
          description="Image recall and perception training will be added in the next release cycle."
          href="#"
          active={false}
        />
      </section>
    </div>
  );
}
