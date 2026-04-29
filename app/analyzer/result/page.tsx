"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { GlassCard } from "@/components/glass-card";
import { formatScore } from "@/lib/analyzer";
import { getAnalyzerResult, type AnalyzerResult, type AnalyzerTrait } from "@/lib/storage";

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

  const status = getLeadershipStatus(result.leadershipIndex);

  return (
    <div className="space-y-16">
      <PageHeader eyebrow="Analyzer Result" title="Leadership report" subtitle="Review your overall leadership pattern, trait balance, and answer-by-answer improvement opportunities." />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="p-8">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-center">
            <LeadershipRing score={result.leadershipIndex} status={status.label} />

            <div>
              <p className="type-label">Overall Leadership Index</p>
              <h2 className="type-heading-l mt-3 text-white">{status.label}</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                {status.description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <MetricTile label="Answers" value={result.answers.length.toString()} />
                <MetricTile label="Strength Areas" value={result.strengths.length.toString()} />
                <MetricTile label="Weak Areas" value={result.weakAreas.length.toString()} />
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-6">
          <InfoCard title="Strength Areas" items={result.strengths.length ? result.strengths : ["No strong cluster yet. Keep building a larger answer set."]} />
          <InfoCard title="Weak Areas" items={result.weakAreas.length ? result.weakAreas : ["No major weak cluster detected in this report."]} />
          <InfoCard title="Improvement Tips" items={result.improvementTips} />
        </div>
      </section>

      <section className="grid gap-6">
        {result.answers.map((entry, index) => (
          <GlassCard key={`${entry.prompt}-${index}`} className="p-8">
            <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="type-label">Answer {index + 1}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">{entry.prompt}</h3>
                  </div>
                  <div className="rounded-2xl border border-[#CEF17B]/15 bg-[#CEF17B]/10 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.22em] text-lime-acc">Score</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{formatScore(entry.overall)}/10</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <ContentCard title="Submitted Response" value={entry.answer || "No answer submitted."} />
                  <ContentCard title="Improved Response" value={buildImprovedResponse(entry)} />
                  <ContentCard title="Strengths" value={buildStrengths(entry)} />
                  <ContentCard title="Weakness" value={buildWeakness(entry)} />
                </div>
              </div>

              <div>
                <p className="type-label">Trait Balance</p>
                <div className="mt-5 space-y-4">
                  {TRAITS.map((trait) => (
                    <TraitBar key={trait} trait={trait} value={entry.scores[trait]} />
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </section>

      {result.aiAnalysis ? (
        <GlassCard className="p-8">
          <div className="grid gap-6 xl:grid-cols-[240px_1fr] xl:items-start">
            <div>
              <p className="type-label">AI Deep Analysis</p>
              <p className="mt-3 text-4xl font-semibold text-white">{formatScore(result.aiAnalysis.leadershipIndex)}/10</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{result.aiAnalysis.disclaimer}</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {result.aiAnalysis.improvementTips.map((tip) => (
                <div key={tip} className="rounded-2xl bg-white/5 p-5">
                  <p className="text-sm leading-6 text-slate-300">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      ) : null}

      <GlassCard className="p-8">
        <p className="type-label">Better Sample Answer Style</p>
        <p className="mt-3 max-w-3xl text-base leading-8 text-white">{result.sampleAnswerStyle}</p>
        <p className="mt-4 text-sm text-slate-400">{result.disclaimer}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/analyzer" className="primary-button">
            Analyze More Answers
          </Link>
          <Link href="/dashboard" className="secondary-button">
            Back to Dashboard
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}

function LeadershipRing({ score, status }: { score: number; status: string }) {
  const normalizedScore = Math.max(0, Math.min(score, 10));
  const percentage = normalizedScore * 10;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle cx="80" cy="80" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#CEF17B"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 300ms ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-4xl font-bold text-white">{formatScore(score)}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-lime-acc">Leadership</p>
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-lime-acc">{status}</p>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <GlassCard className="p-6 sm:p-8">
      <p className="type-label">{title}</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <p key={item} className="text-sm leading-6 text-slate-300">{item}</p>
        ))}
      </div>
    </GlassCard>
  );
}

function ContentCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <p className="mt-3 text-sm leading-7 text-slate-300">{value}</p>
    </div>
  );
}

function TraitBar({ trait, value }: { trait: AnalyzerTrait; value: number }) {
  const width = `${Math.max(0, Math.min(value, 10)) * 10}%`;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-white">{trait}</p>
        <p className="text-sm text-slate-300">{formatScore(value)}/10</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[#CEF17B] transition-all duration-300 ease-out" style={{ width }} />
      </div>
    </div>
  );
}

function getLeadershipStatus(score: number) {
  if (score >= 8.5) {
    return {
      label: "Officer-like",
      description: "Your responses consistently suggest initiative, responsibility, and strong decision control under pressure.",
    };
  }

  if (score >= 7) {
    return {
      label: "Strong",
      description: "You are showing clear leadership potential. Keep improving clarity and consistency across every response.",
    };
  }

  if (score >= 5.5) {
    return {
      label: "Promising",
      description: "There are solid traits in your responses, but you need sharper action language and stronger judgement consistency.",
    };
  }

  return {
    label: "Developing",
    description: "Your report shows a foundation to build on. Focus on direct action, calm tone, and responsibility in every answer.",
  };
}

function buildStrengths(entry: AnalyzerResult["answers"][number]) {
  const topTraits = [...TRAITS]
    .sort((left, right) => entry.scores[right] - entry.scores[left])
    .slice(0, 2);

  return `${topTraits.join(" and ")} appear strongest here. ${entry.feedback}`;
}

function buildWeakness(entry: AnalyzerResult["answers"][number]) {
  const weakestTrait = [...TRAITS].sort((left, right) => entry.scores[left] - entry.scores[right])[0];
  return `${weakestTrait} needs more support. Make the answer more direct, practical, and confident.`;
}

function buildImprovedResponse(entry: AnalyzerResult["answers"][number]) {
  const base = entry.answer.trim();

  if (!base) {
    return "I respond calmly, take responsibility, and act in a useful way that supports others safely.";
  }

  if (/^i\s/i.test(base)) {
    return `${base.replace(/\.$/, "")}. I act quickly, stay calm, and take responsibility.`;
  }

  return `I ${base.charAt(0).toLowerCase()}${base.slice(1).replace(/\.$/, "")}, stay calm, and take responsibility.`;
}
