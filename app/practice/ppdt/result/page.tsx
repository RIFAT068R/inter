"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { getLatestCompletedPpdtSession, saveAnalyzerInput, type PpdtSession } from "@/lib/storage";

export default function PpdtResultPage() {
  const router = useRouter();
  const [session, setSession] = useState<PpdtSession | null>(null);

  useEffect(() => {
    const completedSession = getLatestCompletedPpdtSession();

    if (!completedSession) {
      router.replace("/practice/ppdt");
      return;
    }

    setSession(completedSession);
  }, [router]);

  if (!session) {
    return null;
  }

  const openAnalyzer = () => {
    saveAnalyzerInput({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      examType: "PPDT",
      importedFromLatestWat: false,
      answers: [{ prompt: session.image.name, answer: session.story }],
    });
    router.push("/analyzer");
  };

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="PPDT Result" title="Perception review" subtitle="Review the original image and your written story, then send the response to the analyzer for quick local feedback." />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Image" value="1" />
        <StatCard label="Story Status" value={session.story.trim() ? "Completed" : "Skipped"} />
        <StatCard label="Writing Time" value={`${Math.round(session.writingTimeSeconds / 60)} min`} />
      </section>

      <section className="glass-panel p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" className="primary-button" onClick={openAnalyzer}>
            Analyze Answer
          </button>
          <Link href="/practice/ppdt" className="secondary-button">
            Practice Again
          </Link>
          <Link href="/dashboard" className="secondary-button">
            Back to Dashboard
          </Link>
        </div>
      </section>

      <section className="glass-panel overflow-hidden p-4 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <img src={session.image.url} alt={session.image.name} className="h-72 w-full rounded-[1.5rem] object-cover" />
          <div>
            <p className="text-lg font-semibold text-white">{session.image.name}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">{session.story || "No story written for this image."}</p>
          </div>
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
