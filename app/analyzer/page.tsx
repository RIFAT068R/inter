"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { analyzeAnswers, parseImportedWatAnswers, parseManualAnswers } from "@/lib/analyzer";
import {
  getAnalyzerInput,
  getLatestCompletedWatSession,
  saveAnalyzerInput,
  saveAnalyzerResult,
} from "@/lib/storage";

export default function AnalyzerPage() {
  const router = useRouter();
  const [answersText, setAnswersText] = useState("");
  const [status, setStatus] = useState("Paste answers manually or import the latest WAT session.");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedInput = getAnalyzerInput();

    if (storedInput?.answers.length) {
      setAnswersText(storedInput.answers.map((entry) => entry.answer).join("\n"));
      if (storedInput.importedFromLatestWat) {
        setStatus("Latest WAT answers loaded from localStorage.");
      }
    }
  }, []);

  const parsedAnswers = useMemo(() => parseManualAnswers(answersText), [answersText]);

  const importLatestWat = () => {
    const latestSession = getLatestCompletedWatSession();

    if (!latestSession) {
      setError("No completed WAT result found in localStorage.");
      return;
    }

    const importedAnswers = parseImportedWatAnswers(
      latestSession.answers.map((entry) => ({
        prompt: entry.word,
        answer: entry.answer,
      })),
    );

    if (importedAnswers.length === 0) {
      setError("Latest WAT result has no completed answers to analyze.");
      return;
    }

    saveAnalyzerInput({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      answers: importedAnswers,
      importedFromLatestWat: true,
    });

    setAnswersText(importedAnswers.map((entry) => entry.answer).join("\n"));
    setStatus("Latest WAT answers loaded from localStorage.");
    setError("");
  };

  const analyze = () => {
    const answers = parseManualAnswers(answersText);

    if (answersText.trim().length === 0) {
      setError("Paste at least one answer before analysis.");
      return;
    }

    if (answers.length === 0) {
      setError("No valid answers found.");
      return;
    }

    const storedInput = getAnalyzerInput();
    const fallbackInput = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      answers,
      importedFromLatestWat: false,
    };

    const storedInputText = storedInput?.answers.map((entry) => entry.answer).join("\n");

    const answersToAnalyze =
      storedInput && answersText === storedInputText
        ? storedInput.answers
        : answers;

    saveAnalyzerInput(
      storedInput && answersToAnalyze === storedInput.answers
        ? storedInput
        : {
            ...fallbackInput,
            answers: answersToAnalyze,
          },
    );

    saveAnalyzerResult(analyzeAnswers(answersToAnalyze));
    router.push("/analyzer/result");
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Analyzer" title="Free answer analyzer" subtitle="Run short practical feedback on your answers using local rule-based scoring. No paid API, no external backend, and no data leaves your browser." />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel p-6 sm:p-8">
          <label htmlFor="answers" className="block text-sm font-medium text-white">
            Answers Input
          </label>
          <p className="mt-2 text-sm text-slate-300">Paste one answer per line. Keep each line as a separate response for cleaner scoring.</p>
          <textarea
            id="answers"
            className="soft-input mt-4 min-h-[360px] resize-y"
            value={answersText}
            onChange={(event) => {
              setAnswersText(event.target.value);
              setStatus("Manual answers ready for analysis.");
              setError("");
            }}
            placeholder={`I will stay calm, help the team, and solve the issue quickly.\nI will inform the concerned person and take safe action immediately.`}
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="button" className="secondary-button" onClick={importLatestWat}>
              Import Latest WAT Result
            </button>
            <button type="button" className="primary-button" onClick={analyze}>
              Analyze
            </button>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : <p className="mt-4 text-sm text-slate-400">{status}</p>}
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Analyzer Notes</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <p>Scoring traits: Leadership, Confidence, Responsibility, Decision Making, Positivity, and Practicality.</p>
              <p>Strong signals include help, solve, lead, inform, organize, calm, protect, support, team, action, quickly, and safely.</p>
              <p>Strong action-led answers score better than passive or fearful responses.</p>
              <p>This is practice feedback, not official ISSB evaluation.</p>
            </div>
          </div>

          <div className="glass-panel p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Ready To Analyze</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-slate-400">Answers</p>
                <p className="mt-2 text-2xl font-semibold text-white">{parsedAnswers.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-slate-400">Mode</p>
                <p className="mt-2 text-lg font-semibold text-white">Free Local</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
