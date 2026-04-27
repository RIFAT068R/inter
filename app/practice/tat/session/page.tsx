"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { useCountdown } from "@/lib/use-countdown";
import { completeTatSession, getCurrentTatSession, saveTatSessionAnswer } from "@/lib/storage";

export default function TatPracticePage() {
  const router = useRouter();
  const [session, setSession] = useState(getCurrentTatSession());
  const [story, setStory] = useState("");

  useEffect(() => {
    if (!session) {
      router.replace("/practice/tat");
      return;
    }

    setStory(session.answers[session.currentIndex]?.story ?? "");
  }, [router, session]);

  const currentImage = useMemo(() => {
    if (!session) {
      return null;
    }

    return session.images[session.currentIndex] ?? null;
  }, [session]);

  const goNext = (submittedStory?: string) => {
    if (!session) {
      return;
    }

    const trimmedStory = (submittedStory ?? story).trim();
    const updated = saveTatSessionAnswer(session.id, session.currentIndex, trimmedStory);

    if (!updated) {
      router.replace("/practice/tat");
      return;
    }

    if (updated.currentIndex >= updated.images.length) {
      completeTatSession(updated.id);
      router.push("/practice/tat/result");
      return;
    }

    setSession(updated);
    setStory(updated.answers[updated.currentIndex]?.story ?? "");
    reset(updated.timerSeconds);
  };

  const { secondsLeft, reset } = useCountdown({
    duration: session?.timerSeconds ?? 240,
    onComplete: () => {
      goNext();
    },
  });

  useEffect(() => {
    if (session) {
      reset(session.timerSeconds);
    }
  }, [reset, session]);

  if (!session || !currentImage) {
    return null;
  }

  const progressPercent = ((session.currentIndex + 1) / session.images.length) * 100;

  return (
    <div className="space-y-14">
      <PageHeader eyebrow="TAT Practice" title="Observe, infer, and write" subtitle="Use the image as a prompt, build a coherent story quickly, and move with the timer." />

      <section className="glass-panel p-6 sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Progress</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Image {session.currentIndex + 1} of {session.images.length}
              </h2>
            </div>
            <div className="countdown-chip">
              <p className="text-lime-acc text-xs uppercase tracking-[0.24em]">Countdown</p>
              <p className="mt-2 text-4xl font-semibold text-white">{secondsLeft}s</p>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[#CEF17B] transition-all" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="subtle-panel overflow-hidden p-4">
            <img src={currentImage.url} alt={currentImage.name} className="h-[320px] w-full rounded-[1.5rem] object-cover sm:h-[420px]" />
          </div>

          <div>
            <label htmlFor="story" className="text-sm font-medium text-white">
              Your Story
            </label>
            <textarea
              id="story"
              autoFocus
              className="soft-input mt-3 min-h-[220px] resize-y"
              placeholder="Write the story suggested by this image"
              value={story}
              onChange={(event) => setStory(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" className="primary-button" onClick={() => goNext()}>
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
