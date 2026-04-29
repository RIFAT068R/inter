"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Textarea } from "@/components/textarea";
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
  const timerState = getTimerState(secondsLeft, session.timerSeconds);
  const actionLabel = session.currentIndex + 1 === session.situations.length ? "Submit" : "Next";

  return (
    <div className="focus-shell">
      <div className="focus-inner">
        <div className="focus-topbar">
          <div>
            <p className="focus-progress">Situation {session.currentIndex + 1} of {session.situations.length}</p>
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
            <p className="max-w-4xl text-2xl leading-9 text-white sm:text-3xl sm:leading-[3rem]">{currentSituation}</p>
            <div className="w-full max-w-3xl">
              <Textarea
                id="response"
                autoFocus
                className="min-h-[220px] text-base"
                placeholder="Write your response"
                value={response}
                onChange={(event) => setResponse(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="focus-actions">
          <Button variant="ghost" onClick={() => router.push("/practice/srt")}>Exit</Button>
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

  if (secondsLeft <= Math.max(8, Math.ceil(duration * 0.35))) {
    return { className: "focus-timer-warn" };
  }

  return { className: "focus-timer-safe" };
}
