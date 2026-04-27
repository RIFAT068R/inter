"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { saveAnalyzerInput, type WatSession, getLatestCompletedWatSession } from "@/lib/storage";
import { analyzeWatSession, formatAverageLength } from "@/lib/wat";

export default function WatResultPage() {
  const router = useRouter();
  const [session, setSession] = useState<WatSession | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    const completedSession = getLatestCompletedWatSession();

    if (!completedSession) {
      router.replace("/practice/wat");
      return;
    }

    setSession(completedSession);
  }, [router]);

  const stats = useMemo(() => {
    if (!session) {
      return null;
    }

    return analyzeWatSession(session);
  }, [session]);

  if (!session || !stats) {
    return null;
  }

  const openAnalyzer = () => {
    saveAnalyzerInput({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      examType: "WAT",
      importedFromLatestWat: true,
      answers: session.answers.map((entry) => ({
        prompt: entry.word,
        answer: entry.answer,
      })),
    });
    router.push("/analyzer");
  };

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="WAT Result" title="Session review" subtitle="Inspect your completion pattern, answer depth, and quick local feedback after each timed run." />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Words" value={stats.totalWords.toString()} />
        <StatCard label="Completed Answers" value={stats.completedAnswers.toString()} />
        <StatCard label="Skipped Answers" value={stats.skippedAnswers.toString()} />
        <StatCard label="Average Answer Length" value={formatAverageLength(stats.averageAnswerLength)} />
      </section>

      <section className="glass-panel p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" className="primary-button" onClick={openAnalyzer}>
            Analyze Answers
          </button>
          <button type="button" className="secondary-button" onClick={() => setShowAnalysis((value) => !value)}>
            Quick Review
          </button>
          <Link href="/practice/wat" className="secondary-button">
            Practice Again
          </Link>
          <Link href="/dashboard" className="secondary-button">
            Back to Dashboard
          </Link>
        </div>

        {showAnalysis ? (
          <div className="mt-6 subtle-panel">
            <p className="section-kicker">Local Analysis</p>
            <p className="mt-3 text-base font-medium text-white">{stats.summary}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {stats.insights.map((insight) => (
                <div key={insight.title} className="metric-card p-4">
                  <p className="font-medium text-white">{insight.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead className="bg-white/5 text-left text-slate-300">
              <tr>
                <th className="px-5 py-4 font-medium">Word</th>
                <th className="px-5 py-4 font-medium">Answer</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {session.answers.map((entry) => (
                <tr key={`${entry.index}-${entry.word}`} className="align-top">
                  <td className="px-5 py-4 font-medium text-white">{entry.word}</td>
                  <td className="px-5 py-4 text-slate-300">{entry.answer || <span className="text-slate-500">No response</span>}</td>
                  <td className="px-5 py-4">
                    <span
                      className={entry.answer.trim() ? "rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300" : "rounded-full bg-amber-500/15 px-3 py-1 text-amber-300"}
                    >
                      {entry.answer.trim() ? "Completed" : "Skipped"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel p-6">
      <p className="section-kicker">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
