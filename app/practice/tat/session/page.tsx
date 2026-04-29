"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Textarea } from "@/components/textarea";
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
  const timerState = getTimerState(secondsLeft, session.timerSeconds);
  const actionLabel = session.currentIndex + 1 === session.images.length ? "Submit" : "Next";

  return (
    <div className="focus-shell">
      <div className="focus-inner">
        <div className="focus-topbar">
          <div>
            <p className="focus-progress">Image {session.currentIndex + 1} of {session.images.length}</p>
            <div className="mt-4 h-2 w-40 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#CEF17B] transition-all duration-300 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <div className={`focus-timer ${timerState.className}`}>
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">Countdown</p>
            <p className="mt-2 text-5xl font-semibold">{secondsLeft}s</p>
          </div>
        </div>

        <div className="focus-surface">
          <div className="focus-stage">
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl">
              <img src={currentImage.url} alt={currentImage.name} className="h-[360px] w-full object-cover sm:h-[460px]" />
            </div>
            <div className="w-full max-w-3xl">
              <Textarea
                id="story"
                autoFocus
                className="min-h-[220px] text-base"
                placeholder="Write the story suggested by this image"
                value={story}
                onChange={(event) => setStory(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="focus-actions">
          <Button variant="ghost" onClick={() => router.push("/practice/tat")}>Exit</Button>
          <div className="focus-actions-end">
            <Button onClick={() => goNext()}>{actionLabel}</Button>
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

  if (secondsLeft <= Math.max(20, Math.ceil(duration * 0.25))) {
    return { className: "focus-timer-warn" };
  }

  return { className: "focus-timer-safe" };
}
