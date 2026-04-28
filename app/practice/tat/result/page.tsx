"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { getLatestCompletedTatSession, saveAnalyzerInput, type TatSession } from "@/lib/storage";

export default function TatResultPage() {
  const router = useRouter();
  const [session, setSession] = useState<TatSession | null>(null);

  useEffect(() => {
    const completedSession = getLatestCompletedTatSession();

    if (!completedSession) {
      router.replace("/practice/tat");
      return;
    }

    setSession(completedSession);
  }, [router]);

  const stats = useMemo(() => {
    if (!session) {
      return null;
    }

    const totalImages = session.images.length;
    const completedStories = session.answers.filter((entry) => entry.story.trim()).length;

    return {
      totalImages,
      completedStories,
      skippedStories: totalImages - completedStories,
    };
  }, [session]);

  if (!session || !stats) {
    return null;
  }

  const openAnalyzer = () => {
    saveAnalyzerInput({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      examType: "TAT",
      importedFromLatestWat: false,
      answers: session.answers.map((entry) => ({
        prompt: entry.image.name,
        answer: entry.story,
      })),
    });
    router.push("/analyzer");
  };

  return (
    <div className="space-y-16">
      <PageHeader eyebrow="TAT Result" title="Story review" subtitle="Review each image and story, then send your responses to the analyzer for short practical feedback." />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Images" value={stats.totalImages.toString()} />
        <StatCard label="Completed Stories" value={stats.completedStories.toString()} />
        <StatCard label="Skipped Stories" value={stats.skippedStories.toString()} />
      </section>

      <section className="glass-panel p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" className="primary-button" onClick={openAnalyzer}>
            Analyze Answers
          </button>
          <Link href="/practice/tat" className="secondary-button">
            Practice Again
          </Link>
          <Link href="/dashboard" className="secondary-button">
            Back to Dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-4">
        {session.answers.map((entry) => (
          <article key={entry.image.id} className="glass-panel overflow-hidden p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <img src={entry.image.url} alt={entry.image.name} className="h-64 w-full rounded-[1.5rem] object-cover" />
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-lg font-semibold text-white">{entry.image.name}</p>
                  <span className={entry.story.trim() ? "rounded-full bg-[#CEF17B]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#CEF17B]" : "rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300"}>
                    {entry.story.trim() ? "Completed" : "Skipped"}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{entry.story || "No story written for this image."}</p>
              </div>
            </div>
          </article>
        ))}
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
