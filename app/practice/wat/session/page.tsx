"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useCountdown } from "@/lib/use-countdown";
import { completeWatSession, getCurrentWatSession, saveWatSessionAnswer } from "@/lib/storage";

export default function WatPracticePage() {
  const router = useRouter();
  const [session, setSession] = useState(getCurrentWatSession());
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (!session) {
      router.replace("/practice/wat");
      return;
    }

    setAnswer(session.answers[session.currentIndex]?.answer ?? "");
  }, [router, session]);

  const currentWord = useMemo(() => {
    if (!session) {
      return null;
    }

    return session.words[session.currentIndex] ?? null;
  }, [session]);

  const goNext = (submittedAnswer?: string) => {
    if (!session) {
      return;
    }

    const trimmedAnswer = (submittedAnswer ?? answer).trim();
    const updated = saveWatSessionAnswer(session.id, session.currentIndex, trimmedAnswer);

    if (!updated) {
      router.replace("/practice/wat");
      return;
    }

    if (updated.currentIndex >= updated.words.length) {
      completeWatSession(updated.id);
      router.push("/practice/wat/result");
      return;
    }

    setSession(updated);
    setAnswer(updated.answers[updated.currentIndex]?.answer ?? "");
    reset(updated.timerSeconds);
  };

  const { secondsLeft, reset } = useCountdown({
    duration: session?.timerSeconds ?? 15,
    onComplete: () => {
      goNext();
    },
  });

  useEffect(() => {
    if (session) {
      reset(session.timerSeconds);
    }
  }, [reset, session]);

  if (!session || !currentWord) {
    return null;
  }

  const progressPercent = ((session.currentIndex + 1) / session.words.length) * 100;
  const timerState = getTimerState(secondsLeft, session.timerSeconds);
  const actionLabel = session.currentIndex + 1 === session.words.length ? "Submit" : "Next";

  return (
    <div className="focus-shell">
      <div className="focus-inner">
        <div className="focus-topbar">
          <div>
            <p className="focus-progress">Word {session.currentIndex + 1} of {session.words.length}</p>
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
            <p className="text-5xl font-semibold uppercase tracking-[0.18em] text-white sm:text-6xl">{currentWord}</p>
            <div className="w-full max-w-2xl">
              <Input
                id="answer"
                autoFocus
                className="h-14 text-center text-lg"
                placeholder="Type your response"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    goNext();
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="focus-actions">
          <Button variant="ghost" onClick={() => router.push("/practice/wat")}>Exit</Button>
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

  if (secondsLeft <= Math.max(6, Math.ceil(duration * 0.35))) {
    return { className: "focus-timer-warn" };
  }

  return { className: "focus-timer-safe" };
}
