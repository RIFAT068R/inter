"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { getLatestCompletedSrtSession, saveAnalyzerInput, type SrtSession } from "@/lib/storage";

export default function SrtResultPage() {
  const router = useRouter();
  const [session, setSession] = useState<SrtSession | null>(null);

  useEffect(() => {
    const completedSession = getLatestCompletedSrtSession();

    if (!completedSession) {
      router.replace("/practice/srt");
      return;
    }

    setSession(completedSession);
  }, [router]);

  const stats = useMemo(() => {
    if (!session) {
      return null;
    }

    const totalSituations = session.situations.length;
    const completedResponses = session.answers.filter((entry) => entry.response.trim()).length;
    const skippedResponses = totalSituations - completedResponses;

    return {
      totalSituations,
      completedResponses,
      skippedResponses,
    };
  }, [session]);

  if (!session || !stats) {
    return null;
  }

  const openAnalyzer = () => {
    saveAnalyzerInput({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      examType: "SRT",
      importedFromLatestWat: false,
      answers: session.answers.map((entry) => ({
        prompt: entry.situation,
        answer: entry.response,
      })),
    });
    router.push("/analyzer");
  };

  return (
    <div className="space-y-14">
      <PageHeader eyebrow="SRT Result" title="Situation review" subtitle="Check what you completed, what you skipped, and send your responses to the analyzer for quick rule-based feedback." />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Situations" value={stats.totalSituations.toString()} />
        <StatCard label="Completed Responses" value={stats.completedResponses.toString()} />
        <StatCard label="Skipped Responses" value={stats.skippedResponses.toString()} />
      </section>

      <section className="glass-panel p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" className="primary-button" onClick={openAnalyzer}>
            Analyze Answers
          </button>
          <Link href="/practice/srt" className="secondary-button">
            Practice Again
          </Link>
          <Link href="/dashboard" className="secondary-button">
            Back to Dashboard
          </Link>
        </div>
      </section>

      <section className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead className="bg-white/5 text-left text-slate-300">
              <tr>
                <th className="px-5 py-4 font-medium">Situation</th>
                <th className="px-5 py-4 font-medium">Response</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {session.answers.map((entry) => (
                <tr key={`${entry.index}-${entry.situation}`} className="align-top">
                  <td className="px-5 py-4 font-medium text-white">{entry.situation}</td>
                  <td className="px-5 py-4 text-slate-300">{entry.response || <span className="text-slate-500">No response</span>}</td>
                  <td className="px-5 py-4">
                    <span
                      className={entry.response.trim() ? "rounded-full bg-[#CEF17B]/15 px-3 py-1 text-[#CEF17B]" : "rounded-full bg-white/10 px-3 py-1 text-slate-300"}
                    >
                      {entry.response.trim() ? "Completed" : "Skipped"}
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
