import { PageHeader } from "@/components/page-header";
import { ModuleCard } from "@/components/module-card";

export default function PracticeSelectionPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Practice" title="Select your practice module" subtitle="Only Word Reaction Test is live in this MVP. The rest of the ISSB modules are staged for later rollout." />

      <section className="grid gap-4 md:grid-cols-2">
        <ModuleCard
          title="Word Reaction Test"
          description="Paste your own words, run realistic timers, and review every response at the end."
          href="/practice/wat"
          active
        />
        <ModuleCard
          title="Situation Response Test"
          description="Timed situational judgement practice tailored for ISSB preparation."
          href="#"
          active={false}
        />
        <ModuleCard
          title="Story Writing Test"
          description="Practice narrative speed, structure, and clarity in a guided workflow."
          href="#"
          active={false}
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
