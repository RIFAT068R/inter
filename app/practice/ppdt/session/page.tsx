"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { useCountdown } from "@/lib/use-countdown";
import { completePpdtSession, getCurrentPpdtSession, savePpdtStory } from "@/lib/storage";

type Phase = "viewing" | "writing";

export default function PpdtPracticePage() {
  const router = useRouter();
  const [session, setSession] = useState(getCurrentPpdtSession());
  const [story, setStory] = useState("");
  const [phase, setPhase] = useState<Phase>("viewing");

  useEffect(() => {
    if (!session) {
      router.replace("/practice/ppdt");
      return;
    }

    setStory(session.story ?? "");
  }, [router, session]);

  const currentDuration = phase === "viewing" ? session?.viewingTimeSeconds ?? 30 : session?.writingTimeSeconds ?? 240;

  const handlePhaseComplete = () => {
    if (!session) {
      return;
    }

    if (phase === "viewing") {
      setPhase("writing");
      return;
    }

    const updated = savePpdtStory(session.id, story.trim());

    if (!updated) {
      router.replace("/practice/ppdt");
      return;
    }

    completePpdtSession(updated.id);
    router.push("/practice/ppdt/result");
  };

  const { secondsLeft, reset } = useCountdown({
    duration: currentDuration,
    onComplete: handlePhaseComplete,
  });

  useEffect(() => {
    if (session) {
      reset(phase === "viewing" ? session.viewingTimeSeconds : session.writingTimeSeconds);
    }
  }, [phase, reset, session]);

  const phaseMeta = useMemo(
    () =>
      phase === "viewing"
        ? {
            label: "Step 1 of 2",
            title: "Observe the picture only",
            subtitle: "Memorize the scene, mood, and possible events. Writing will unlock after the viewing countdown ends.",
          }
        : {
            label: "Step 2 of 2",
            title: "Write from memory under pressure",
            subtitle: "The image is now hidden. Build your story from recall before the writing timer expires.",
          },
    [phase],
  );

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="PPDT Practice" title={phaseMeta.title} subtitle={phaseMeta.subtitle} />

      <section className="glass-panel p-8 sm:p-10 transition-all duration-500">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{phaseMeta.label}</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Picture Perception and Description Test</h2>
            </div>
            <div className="countdown-chip">
              <p className="text-lime-acc text-xs uppercase tracking-[0.24em]">Countdown</p>
              <p className="mt-2 text-4xl font-semibold text-white">{secondsLeft}s</p>
            </div>
          </div>

          {phase === "viewing" ? (
            <div className="subtle-panel overflow-hidden p-4 transition-all duration-500">
              <img src={session.image.url} alt={session.image.name} className="h-[340px] w-full rounded-[1.5rem] object-cover sm:h-[460px]" />
            </div>
          ) : (
            <div className="subtle-panel bg-[#CEF17B]/5 transition-all duration-500">
              <p className="text-lime-acc text-sm uppercase tracking-[0.24em]">Image Hidden</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">Write from memory now. This phase simulates the real transition from observation to response.</p>
            </div>
          )}

          <div>
            <label htmlFor="ppdt-story" className="text-sm font-medium text-white">
              Your Story
            </label>
            <textarea
              id="ppdt-story"
              autoFocus={phase === "writing"}
              disabled={phase === "viewing"}
              className="soft-input mt-3 min-h-[240px] resize-y disabled:cursor-not-allowed disabled:opacity-60"
              placeholder={phase === "viewing" ? "Writing unlocks after the viewing phase ends." : "Write the story from memory here"}
              value={story}
              onChange={(event) => setStory(event.target.value)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
