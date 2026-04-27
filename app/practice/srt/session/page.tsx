"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { useCountdown } from "@/lib/use-countdown";
import { completeSrtSession, getCurrentSrtSession, saveSrtSessionAnswer } from "@/lib/storage";

export default function SrtPracticePage() {
  const router = useRouter();
  const [session, setSession] = useState(getCurrentSrtSession());
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (!session) {
      router.replace("/practice/srt");
      return;
    }

    setResponse(session.answers[session.currentIndex]?.response ?? "");
  }, [router, session]);

  const currentSituation = useMemo(() => {
    if (!session) {
      return null;
    }

    return session.situations[session.currentIndex] ?? null;
  }, [session]);

  const goNext = (submittedResponse?: string) => {
    if (!session) {
      return;
    }

    const trimmedResponse = (submittedResponse ?? response).trim();
    const updated = saveSrtSessionAnswer(session.id, session.currentIndex, trimmedResponse);

    if (!updated) {
      router.replace("/practice/srt");
      return;
    }

    if (updated.currentIndex >= updated.situations.length) {
      completeSrtSession(updated.id);
      router.push("/practice/srt/result");
      return;
    }

    setSession(updated);
    setResponse(updated.answers[updated.currentIndex]?.response ?? "");
    reset(updated.timerSeconds);
  };

  const { secondsLeft, reset } = useCountdown({
    duration: session?.timerSeconds ?? 30,
    onComplete: () => {
      goNext();
    },
  });

  useEffect(() => {
    if (session) {
      reset(session.timerSeconds);
    }
  }, [reset, session]);

  if (!session || !currentSituation) {
    return null;
  }

  const progressPercent = ((session.currentIndex + 1) / session.situations.length) * 100;

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="SRT Practice" title="Respond with calm action" subtitle="Read each situation clearly, decide quickly, and keep your answer practical under time pressure." />

      <section className="glass-panel p-8 sm:p-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Progress</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Situation {session.currentIndex + 1} of {session.situations.length}
              </h2>
            </div>
            <div className="countdown-chip">
              <p className="text-xs uppercase tracking-[0.24em] text-blue-200">Countdown</p>
              <p className="mt-2 text-4xl font-semibold text-white">{secondsLeft}s</p>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="subtle-panel sm:p-8">
            <p className="section-kicker">Situation</p>
            <p className="mt-4 text-xl leading-8 text-white sm:text-2xl">{currentSituation}</p>
          </div>

          <div>
            <label htmlFor="response" className="text-sm font-medium text-white">
              Your Response
            </label>
            <textarea
              id="response"
              autoFocus
              className="soft-input mt-3 min-h-[180px] resize-y"
              placeholder="Write your response here"
              value={response}
              onChange={(event) => setResponse(event.target.value)}
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
