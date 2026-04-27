"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { createPpdtSession, savePpdtSession, type TatImage } from "@/lib/storage";

export function PpdtSetupClient() {
  const router = useRouter();
  const [image, setImage] = useState<TatImage | null>(null);
  const [viewingTimeSeconds, setViewingTimeSeconds] = useState(30);
  const [writingTimeSeconds, setWritingTimeSeconds] = useState(240);
  const [error, setError] = useState("");

  const onFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (image) {
      URL.revokeObjectURL(image.url);
    }

    setImage({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
    });
    setError("");
    event.target.value = "";
  };

  const startPractice = () => {
    if (!image) {
      setError("Upload one image before starting PPDT practice.");
      return;
    }

    const safeViewingTime = Number.isFinite(viewingTimeSeconds) && viewingTimeSeconds > 0 ? viewingTimeSeconds : 30;
    const safeWritingTime = Number.isFinite(writingTimeSeconds) && writingTimeSeconds > 0 ? writingTimeSeconds : 240;
    const session = createPpdtSession(image, safeViewingTime, safeWritingTime);
    savePpdtSession(session);
    router.push("/practice/ppdt/session");
  };

  return (
    <div className="space-y-14">
      <PageHeader eyebrow="PPDT Setup" title="Build your Picture Perception and Description Test" subtitle="Upload one image, set viewing and writing timers, and start a two-phase PPDT session with real exam-style pressure." />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel p-6 sm:p-8">
          <label className="block text-sm font-medium text-white" htmlFor="ppdt-image">
            Upload Image
          </label>
          <p className="mt-2 text-sm text-slate-300">The image stays temporary in this browser session only. No backend storage is used.</p>
          <input
            id="ppdt-image"
            type="file"
            accept="image/*"
            className="soft-input mt-4 file:mr-4 file:rounded-xl file:border-0 file:bg-[#CEF17B] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
            onChange={onFileSelected}
          />

          {image ? (
            <div className="mt-6 subtle-panel p-4">
              <img src={image.url} alt={image.name} className="h-72 w-full rounded-[1.5rem] object-cover" />
              <p className="mt-3 text-sm font-medium text-white">{image.name}</p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="primary-button" onClick={startPractice}>
              Start
            </button>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-6">
            <p className="section-kicker">Session Settings</p>
            <label className="mt-4 block text-sm font-medium text-white" htmlFor="ppdt-viewing-time">
              Picture Viewing Time (seconds)
            </label>
            <input
              id="ppdt-viewing-time"
              type="number"
              min={5}
              max={180}
              className="soft-input mt-3"
              value={viewingTimeSeconds}
              onChange={(event) => setViewingTimeSeconds(Number(event.target.value) || 30)}
            />

            <label className="mt-5 block text-sm font-medium text-white" htmlFor="ppdt-writing-time">
              Story Writing Time (seconds)
            </label>
            <input
              id="ppdt-writing-time"
              type="number"
              min={30}
              max={900}
              className="soft-input mt-3"
              value={writingTimeSeconds}
              onChange={(event) => setWritingTimeSeconds(Number(event.target.value) || 240)}
            />

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="metric-card">
                <p className="text-slate-400">Viewing Default</p>
                <p className="mt-2 text-2xl font-semibold text-white">30s</p>
              </div>
              <div className="metric-card">
                <p className="text-slate-400">Writing Default</p>
                <p className="mt-2 text-2xl font-semibold text-white">4 min</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <p className="section-kicker">Practice Notes</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li>First observe the image under strict viewing time only.</li>
              <li>Then the image disappears and writing begins immediately.</li>
              <li>The story auto-submits when writing time ends.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
