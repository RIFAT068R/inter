"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { formatScore } from "@/lib/analyzer";
import { getAnalyzerResult, type AnalyzerResult } from "@/lib/storage";

const TRAITS = ["Leadership", "Confidence", "Responsibility", "Decision Making", "Positivity", "Practicality"] as const;

export default function AnalyzerResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalyzerResult | null>(null);

  useEffect(() => {
    const storedResult = getAnalyzerResult();

    if (!storedResult) {
      router.replace("/analyzer");
      return;
    }

    setResult(storedResult);
  }, [router]);

  const traitAverages = useMemo(() => {
    if (!result) {
      return [];
    }

    return TRAITS.map((trait) => ({
      trait,
      value:
        result.answers.length === 0
          ? 0
          : result.answers.reduce((sum, entry) => sum + entry.scores[trait], 0) / result.answers.length,
    }));
  }, [result]);

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Analyzer Result" title="Practice feedback overview" subtitle="Review per-answer signals, overall leadership index, and direct next-step improvements." />

      <section className="glass-panel p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Analysis Mode</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-base font-medium text-white">{result.examType} | Rule-based analyzer is the default engine.</p>
          <span className={result.aiAnalysis ? "rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300" : "rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300"}>
            {result.aiAnalysis ? "AI Deep Analysis Included" : "Rule-Based Only"}
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Leadership Index" value={`${formatScore(result.leadershipIndex)}/10`} />
        <StatCard label="Answers Analyzed" value={result.answers.length.toString()} />
        <StatCard label="Strength Areas" value={result.strengths.length.toString()} />
        <StatCard label="Weak Areas" value={result.weakAreas.length.toString()} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Trait Snapshot</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {traitAverages.map((item) => (
              <div key={item.trait} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-slate-400">{item.trait}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{formatScore(item.value)}/10</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <InfoPanel title="Strength Areas" items={result.strengths.length ? result.strengths : ["No clear strength cluster yet. Build a larger answer set."]} />
          <InfoPanel title="Weak Areas" items={result.weakAreas.length ? result.weakAreas : ["No major weak cluster detected in this set."]} />
          <InfoPanel title="Improvement Tips" items={result.improvementTips} />
        </div>
      </section>

      {result.aiAnalysis ? (
        <>
          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-panel p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">AI Deep Analysis</p>
              <p className="mt-3 text-3xl font-semibold text-white">{formatScore(result.aiAnalysis.leadershipIndex)}/10</p>
              <p className="mt-4 text-sm leading-6 text-slate-300">{result.aiAnalysis.disclaimer}</p>
            </div>
            <InfoPanel title="Top 3 AI Improvement Tips" items={result.aiAnalysis.improvementTips} />
          </section>

          <section className="glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead className="bg-white/5 text-left text-slate-300">
                  <tr>
                    <th className="px-5 py-4 font-medium">Prompt</th>
                    <th className="px-5 py-4 font-medium">Score</th>
                    <th className="px-5 py-4 font-medium">Strengths</th>
                    <th className="px-5 py-4 font-medium">Weakness</th>
                    <th className="px-5 py-4 font-medium">Improved Answer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {result.aiAnalysis.answers.map((entry, index) => (
                    <tr key={`${entry.prompt}-${index}`} className="align-top">
                      <td className="px-5 py-4 font-medium text-white">{entry.prompt}</td>
                      <td className="px-5 py-4 text-slate-300">{entry.score}/10</td>
                      <td className="px-5 py-4 text-slate-300">{entry.strengths}</td>
                      <td className="px-5 py-4 text-slate-300">{entry.weakness}</td>
                      <td className="px-5 py-4 text-slate-300">{entry.improvedAnswer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      <section className="glass-panel p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Better Sample Answer Style</p>
        <p className="mt-3 text-base leading-7 text-white">{result.sampleAnswerStyle}</p>
        <p className="mt-4 text-sm text-slate-400">{result.disclaimer}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/analyzer" className="primary-button">
            Analyze More Answers
          </Link>
          <Link href="/dashboard" className="secondary-button">
            Back to Dashboard
          </Link>
        </div>
      </section>

      <section className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/5 text-left text-slate-300">
              <tr>
                <th className="px-5 py-4 font-medium">Prompt</th>
                <th className="px-5 py-4 font-medium">Answer</th>
                <th className="px-5 py-4 font-medium">Scores</th>
                <th className="px-5 py-4 font-medium">Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {result.answers.map((entry, index) => (
                <tr key={`${entry.prompt}-${index}`} className="align-top">
                  <td className="px-5 py-4 font-medium text-white">{entry.prompt}</td>
                  <td className="px-5 py-4 text-slate-300">{entry.answer}</td>
                  <td className="px-5 py-4 text-slate-300">
                    <div className="grid gap-1">
                      {TRAITS.map((trait) => (
                        <span key={trait}>
                          {trait}: {entry.scores[trait]}/10
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{entry.feedback}</td>
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
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="glass-panel p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{title}</p>
      <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}
