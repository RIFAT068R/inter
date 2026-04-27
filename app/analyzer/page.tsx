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
  type AiAnalysisResult,
} from "@/lib/storage";

const DAILY_AI_LIMIT = 5;
const AI_USAGE_KEY = "nextleader-ai-usage";

export default function AnalyzerPage() {
  const router = useRouter();
  const [answersText, setAnswersText] = useState("");
  const [status, setStatus] = useState("Paste answers manually or import the latest WAT session.");
  const [error, setError] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isOcrRunning, setIsOcrRunning] = useState(false);
  const [ocrFileName, setOcrFileName] = useState("");
  const [remainingAiUses, setRemainingAiUses] = useState(DAILY_AI_LIMIT);
  const [isAiRunning, setIsAiRunning] = useState(false);

  useEffect(() => {
    const storedInput = getAnalyzerInput();
    setRemainingAiUses(getRemainingAiUses());

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
      examType: "WAT",
      answers: importedAnswers,
      importedFromLatestWat: true,
    });

    setAnswersText(importedAnswers.map((entry) => entry.answer).join("\n"));
    setStatus("Latest WAT answers loaded from localStorage.");
    setError("");
  };

  const extractTextFromImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsOcrRunning(true);
    setOcrProgress(0);
    setOcrFileName(file.name);
    setError("");
    setStatus("Starting OCR...");

    try {
      const Tesseract = await import("tesseract.js");
      const result = await Tesseract.recognize(file, "eng", {
        logger: (message) => {
          if (typeof message.progress === "number") {
            setOcrProgress(Math.round(message.progress * 100));
          }

          if (typeof message.status === "string") {
            const readableStatus = message.status.charAt(0).toUpperCase() + message.status.slice(1);
            setStatus(`${readableStatus} ${typeof message.progress === "number" ? `${Math.round(message.progress * 100)}%` : ""}`.trim());
          }
        },
      });

      const extractedText = result.data.text.trim();

      if (!extractedText) {
        setError("OCR could not extract readable text from that image.");
        setStatus("OCR finished with no readable text.");
        return;
      }

      setAnswersText(extractedText);
      setStatus("OCR complete. Review and edit the extracted text before analysis.");
    } catch {
      setError("OCR failed to process that image in the browser.");
      setStatus("OCR failed.");
    } finally {
      setIsOcrRunning(false);
      event.target.value = "";
    }
  };

  const analyze = () => {
    const resolvedInput = getResolvedAnalyzerInput(answersText);

    if (answersText.trim().length === 0) {
      setError("Paste at least one answer before analysis.");
      return;
    }

    if (resolvedInput.answers.length === 0) {
      setError("No valid answers found.");
      return;
    }

    saveAnalyzerInput(resolvedInput);
    saveAnalyzerResult(analyzeAnswers(resolvedInput.answers, resolvedInput.examType));
    router.push("/analyzer/result");
  };

  const analyzeWithAi = async () => {
    const resolvedInput = getResolvedAnalyzerInput(answersText);

    if (answersText.trim().length === 0) {
      setError("Paste at least one answer before analysis.");
      return;
    }

    if (resolvedInput.answers.length === 0) {
      setError("No valid answers found.");
      return;
    }

    const remaining = getRemainingAiUses();

    if (remaining <= 0) {
      setError("Daily AI limit reached. Rule-based analysis is still available.");
      setRemainingAiUses(0);
      return;
    }

    setIsAiRunning(true);
    setError("");
    setStatus("Running AI deep analysis...");

    try {
      const response = await fetch("/api/analyze-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examType: resolvedInput.examType,
          answers: resolvedInput.answers,
        }),
      });

      const data = (await response.json()) as AiAnalysisResult | { error?: string };

      if (!response.ok || !("answers" in data)) {
        setError("error" in data && data.error ? data.error : "AI analysis failed.");
        setStatus("Rule-based analysis remains available.");
        return;
      }

      saveAnalyzerInput(resolvedInput);

      const baseResult = analyzeAnswers(resolvedInput.answers, resolvedInput.examType);
      saveAnalyzerResult({
        ...baseResult,
        aiAnalysis: data,
      });

      incrementAiUsage();
      setRemainingAiUses(getRemainingAiUses());
      router.push("/analyzer/result");
    } catch {
      setError("AI analysis failed in this session.");
      setStatus("Rule-based analysis remains available.");
    } finally {
      setIsAiRunning(false);
    }
  };

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Analyzer" title="Free answer analyzer" subtitle="Run short practical feedback on your answers using local rule-based scoring. No paid API, no external backend, and no data leaves your browser." />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)] lg:items-start">
        <div className="glass-panel p-8 sm:p-10">
          <div className="space-y-8">
            <div>
              <label htmlFor="answers" className="block text-sm font-medium text-white">
                Answers Input
              </label>
              <p className="mt-2 text-sm text-slate-300">Paste one answer per line or extract text from an image before analysis.</p>
            </div>

            <div>
              <label htmlFor="ocr-upload" className="block text-sm font-medium text-white">
                Upload Answer Image
              </label>
              <input
                id="ocr-upload"
                type="file"
                accept="image/*"
                className="soft-input mt-4 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                onChange={extractTextFromImage}
                disabled={isOcrRunning}
              />
              <p className="mt-3 text-xs leading-6 text-slate-400">OCR may make mistakes. Please review before analysis.</p>

              {isOcrRunning ? (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-blue-200">
                    <span>OCR Loading</span>
                    <span>{ocrProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${ocrProgress}%` }} />
                  </div>
                  <p className="text-sm text-slate-300">Processing `{ocrFileName}` locally in your browser.</p>
                </div>
              ) : null}
            </div>

            <textarea
              id="answers"
              className="soft-input min-h-[420px] resize-y"
              value={answersText}
              onChange={(event) => {
                setAnswersText(event.target.value);
                setStatus("Manual answers ready for analysis.");
                setError("");
              }}
              placeholder={`I will stay calm, help the team, and solve the issue quickly.\nI will inform the concerned person and take safe action immediately.`}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button type="button" className="secondary-button" onClick={importLatestWat}>
                Import Latest WAT Result
              </button>
              <button type="button" className="primary-button" onClick={analyze}>
                Analyze
              </button>
              <button type="button" className="secondary-button" onClick={analyzeWithAi} disabled={isAiRunning || remainingAiUses <= 0}>
                {isAiRunning ? "Running AI..." : "AI Deep Analysis"}
              </button>
            </div>

            <div className="space-y-2">
              {error ? <p className="text-sm text-rose-300">{error}</p> : <p className="text-sm text-slate-400">{status}</p>}
              {remainingAiUses <= 0 ? <p className="text-sm text-amber-300">Daily AI limit reached. Rule-based analysis only.</p> : null}
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 sm:p-8 lg:sticky lg:top-24">
          <p className="section-kicker">Analyzer Guide</p>
          <div className="mt-4 space-y-6">
            <div>
              <p className="text-sm font-semibold text-white">Ready</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{parsedAnswers.length} answers detected. Rule-based analysis is instant. AI deep analysis is optional.</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">AI Uses Today</p>
              <p className="mt-2 text-3xl font-semibold text-white">{remainingAiUses}</p>
            </div>

            <div className="space-y-3 text-sm leading-6 text-slate-300">
              <p>Strong signals include help, solve, lead, inform, organize, calm, protect, support, team, action, quickly, and safely.</p>
              <p>OCR runs client-side only. Review extracted text before analysis.</p>
              <p>This is practice feedback, not official ISSB evaluation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function getResolvedAnalyzerInput(answersText: string) {
  const answers = parseManualAnswers(answersText);
  const storedInput = getAnalyzerInput();
  const storedInputText = storedInput?.answers.map((entry) => entry.answer).join("\n");

  if (storedInput && answersText === storedInputText) {
    return storedInput;
  }

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    examType: "General Practice",
    answers,
    importedFromLatestWat: false,
  };
}

function getRemainingAiUses() {
  if (typeof window === "undefined") {
    return DAILY_AI_LIMIT;
  }

  const today = getLocalDateKey();
  const raw = window.localStorage.getItem(AI_USAGE_KEY);

  if (!raw) {
    return DAILY_AI_LIMIT;
  }

  try {
    const parsed = JSON.parse(raw) as { date: string; count: number };

    if (parsed.date !== today) {
      return DAILY_AI_LIMIT;
    }

    return Math.max(0, DAILY_AI_LIMIT - parsed.count);
  } catch {
    return DAILY_AI_LIMIT;
  }
}

function incrementAiUsage() {
  if (typeof window === "undefined") {
    return;
  }

  const today = getLocalDateKey();
  const raw = window.localStorage.getItem(AI_USAGE_KEY);
  let nextCount = 1;

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { date: string; count: number };
      nextCount = parsed.date === today ? parsed.count + 1 : 1;
    } catch {
      nextCount = 1;
    }
  }

  window.localStorage.setItem(AI_USAGE_KEY, JSON.stringify({ date: today, count: nextCount }));
}

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
