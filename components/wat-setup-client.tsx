"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { SAMPLE_WAT_WORDS } from "@/lib/sample-words";
import { createWatSession, getWatHistory, saveWatSession } from "@/lib/storage";
import { sanitizeWords } from "@/lib/wat";

export function WatSetupClient({ isDemo }: { isDemo: boolean }) {
  const router = useRouter();
  const [wordsText, setWordsText] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(15);
  const [error, setError] = useState("");
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    setSessionCount(getWatHistory().length);
  }, []);

  useEffect(() => {
    if (isDemo && !wordsText.trim()) {
      setWordsText(SAMPLE_WAT_WORDS.join("\n"));
    }
  }, [isDemo, wordsText]);

  const parsedWords = useMemo(() => sanitizeWords(wordsText), [wordsText]);

  const loadSampleWords = () => {
    setWordsText(SAMPLE_WAT_WORDS.join("\n"));
    setError("");
  };

  const startPractice = () => {
    const words = sanitizeWords(wordsText);

    if (!wordsText.trim()) {
      setError("Please enter words before starting practice.");
      return;
    }

    if (words.length < 5) {
      setError("Add at least 5 words to begin WAT practice.");
      return;
    }

    const safeTimer = Number.isFinite(timerSeconds) && timerSeconds > 0 ? timerSeconds : 15;
    const session = createWatSession(words, safeTimer);
    saveWatSession(session);
    router.push("/practice/wat/session");
  };

  return (
    <div className="space-y-16">
      <PageHeader eyebrow="WAT Setup" title="Build your Word Reaction Test" subtitle="Paste one word per line, set the countdown, and launch a realistic timed WAT session." />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel p-6 sm:p-8">
          <label className="block text-sm font-medium text-white" htmlFor="words">
            Words List
          </label>
          <p className="mt-2 text-sm text-slate-300">One word per line. Minimum 5 words required.</p>
          <textarea
            id="words"
            className="soft-input mt-4 min-h-[360px] resize-y"
            value={wordsText}
            onChange={(event) => {
              setWordsText(event.target.value);
              setError("");
            }}
            placeholder={`brave\ntruth\nleader\nresponsibility\nfuture`}
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="secondary-button" onClick={loadSampleWords}>
              Load Sample 60 Words
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
              Timer Per Word (seconds)
            </label>
            <input
              id="timer"
              type="number"
              min={1}
              max={120}
              className="soft-input mt-3"
              value={timerSeconds}
              onChange={(event) => setTimerSeconds(Number(event.target.value) || 15)}
            />
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="metric-card">
                <p className="text-slate-400">Words Ready</p>
                <p className="mt-2 text-2xl font-semibold text-white">{parsedWords.length}</p>
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
              <li>Respond instinctively and keep moving.</li>
              <li>When the timer ends, the app auto-advances to the next word.</li>
              <li>Your complete session is stored locally for review.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
