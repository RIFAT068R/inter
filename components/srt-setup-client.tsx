"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { SAMPLE_SRT_SITUATIONS } from "@/lib/sample-situations";
import { createSrtSession, getSrtHistory, saveSrtSession } from "@/lib/storage";
import { sanitizeWords } from "@/lib/wat";

export function SrtSetupClient() {
  const router = useRouter();
  const [situationsText, setSituationsText] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [error, setError] = useState("");
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    setSessionCount(getSrtHistory().length);
  }, []);

  const parsedSituations = useMemo(() => sanitizeWords(situationsText), [situationsText]);

  const loadSampleSituations = () => {
    setSituationsText(SAMPLE_SRT_SITUATIONS.join("\n"));
    setError("");
  };

  const startPractice = () => {
    const situations = sanitizeWords(situationsText);

    if (!situationsText.trim()) {
      setError("Please enter situations before starting practice.");
      return;
    }

    if (situations.length < 3) {
      setError("Add at least 3 situations to begin SRT practice.");
      return;
    }

    const safeTimer = Number.isFinite(timerSeconds) && timerSeconds > 0 ? timerSeconds : 30;
    const session = createSrtSession(situations, safeTimer);
    saveSrtSession(session);
    router.push("/practice/srt/session");
  };

  return (
    <div className="space-y-14">
      <PageHeader eyebrow="SRT Setup" title="Build your Situation Response Test" subtitle="Paste one situation per line, set the timer, and launch a realistic SRT session." />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel p-6 sm:p-8">
          <label className="block text-sm font-medium text-white" htmlFor="situations">
            Situations List
          </label>
          <p className="mt-2 text-sm text-slate-300">One situation per line. Use concise real-world decision prompts.</p>
          <textarea
            id="situations"
            className="soft-input mt-4 min-h-[360px] resize-y"
            value={situationsText}
            onChange={(event) => {
              setSituationsText(event.target.value);
              setError("");
            }}
            placeholder={`You see a friend panic before a test. What do you do?\nYour team loses direction during a task. How do you respond?`}
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="button" className="secondary-button" onClick={loadSampleSituations}>
              Load Sample Situations
            </button>
            <button type="button" className="primary-button" onClick={startPractice}>
              Start
            </button>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-6">
            <p className="section-kicker">Session Settings</p>
            <label className="mt-4 block text-sm font-medium text-white" htmlFor="timer">
              Timer Per Situation (seconds)
            </label>
            <input
              id="timer"
              type="number"
              min={1}
              max={180}
              className="soft-input mt-3"
              value={timerSeconds}
              onChange={(event) => setTimerSeconds(Number(event.target.value) || 30)}
            />
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="metric-card">
                <p className="text-slate-400">Situations Ready</p>
                <p className="mt-2 text-2xl font-semibold text-white">{parsedSituations.length}</p>
              </div>
              <div className="metric-card">
                <p className="text-slate-400">Saved Sessions</p>
                <p className="mt-2 text-2xl font-semibold text-white">{sessionCount}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <p className="section-kicker">Practice Notes</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li>Respond with calm, useful action and clear responsibility.</li>
              <li>When the timer ends, the app auto-advances to the next situation.</li>
              <li>Your full SRT session is saved locally for review and analysis.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
