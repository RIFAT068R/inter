"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Textarea } from "@/components/textarea";
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

  const timerState = getTimerState(secondsLeft, currentDuration);

  return (
    <div className="focus-shell">
      <div className="focus-inner">
        <div className="focus-topbar">
          <div>
            <p className="focus-progress">{phaseMeta.label}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Picture Perception and Description Test</h2>
          </div>
          <div className={`focus-timer ${timerState.className}`}>
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">Countdown</p>
            <p className="mt-2 text-5xl font-semibold">{secondsLeft}s</p>
          </div>
        </div>

        <div className="focus-surface">
          <div className="focus-stage">
            {phase === "viewing" ? (
              <div className="w-full max-w-4xl overflow-hidden rounded-2xl">
                <img src={session.image.url} alt={session.image.name} className="h-[380px] w-full object-cover sm:h-[500px]" />
              </div>
            ) : (
              <div className="max-w-3xl rounded-2xl bg-[#CEF17B]/5 px-6 py-5 text-center">
                <p className="text-lime-acc text-sm uppercase tracking-[0.24em]">Image Hidden</p>
                <p className="mt-3 text-base leading-7 text-slate-300">Write from memory now. This simulates the real shift from observation to response under pressure.</p>
              </div>
            )}

            <div className="w-full max-w-3xl">
              <Textarea
                id="ppdt-story"
                autoFocus={phase === "writing"}
                disabled={phase === "viewing"}
                className="min-h-[240px] text-base disabled:cursor-not-allowed disabled:opacity-60"
                placeholder={phase === "viewing" ? "Writing unlocks after the viewing phase ends." : "Write the story from memory here"}
                value={story}
                onChange={(event) => setStory(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="focus-actions">
          <Button variant="ghost" onClick={() => router.push("/practice/ppdt")}>Exit</Button>
          <div className="focus-actions-end">
            {phase === "viewing" ? <Button variant="secondary" onClick={() => setPhase("writing")}>Next</Button> : null}
            {phase === "writing" ? <Button onClick={handlePhaseComplete}>Submit</Button> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimerState(secondsLeft: number, duration: number) {
  if (secondsLeft <= 3) {
    return { className: "focus-timer-danger focus-timer-pulse" };
  }

  if (secondsLeft <= 5) {
    return { className: "focus-timer-warn focus-timer-pulse" };
  }

  if (secondsLeft <= Math.max(8, Math.ceil(duration * 0.25))) {
    return { className: "focus-timer-warn" };
  }

  return { className: "focus-timer-safe" };
}
