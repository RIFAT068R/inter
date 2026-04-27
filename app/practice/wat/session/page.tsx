"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
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

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="WAT Practice" title="Stay sharp and keep moving" subtitle="Answer instinctively before the timer ends. The next word appears automatically when time runs out." />

      <section className="glass-panel p-8 sm:p-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Progress</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Word {session.currentIndex + 1} of {session.words.length}
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

          <div className="subtle-panel flex min-h-[220px] items-center justify-center text-center">
            <p className="text-4xl font-semibold uppercase tracking-[0.18em] text-white sm:text-5xl">{currentWord}</p>
          </div>

          <div>
            <label htmlFor="answer" className="text-sm font-medium text-white">
              Your Response
            </label>
            <input
              id="answer"
              autoFocus
              className="soft-input mt-3"
              placeholder="Type your response here"
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
