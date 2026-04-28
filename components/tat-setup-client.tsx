"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { createTatSession, saveTatSession, type TatImage } from "@/lib/storage";

export function TatSetupClient() {
  const router = useRouter();
  const [timerSeconds, setTimerSeconds] = useState(240);
  const [images, setImages] = useState<TatImage[]>([]);
  const [error, setError] = useState("");

  const imageCount = useMemo(() => images.length, [images]);

  const onFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    const nextImages = selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...nextImages]);
    setError("");
    event.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const target = current.find((image) => image.id === id);

      if (target) {
        URL.revokeObjectURL(target.url);
      }

      return current.filter((image) => image.id !== id);
    });
  };

  const startPractice = () => {
    if (images.length === 0) {
      setError("Upload at least one image before starting TAT practice.");
      return;
    }

    const safeTimer = Number.isFinite(timerSeconds) && timerSeconds > 0 ? timerSeconds : 240;
    const session = createTatSession(images, safeTimer);
    saveTatSession(session);
    router.push("/practice/tat/session");
  };

  return (
    <div className="space-y-16">
      <PageHeader eyebrow="TAT Setup" title="Build your Thematic Apperception Test" subtitle="Upload multiple images, preview them, set the writing timer, and start a browser-only TAT session." />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel p-6 sm:p-8">
          <label className="block text-sm font-medium text-white" htmlFor="tat-images">
            Upload Images
          </label>
          <p className="mt-2 text-sm text-slate-300">Images are stored temporarily in this browser session using object URLs only.</p>
          <input
            id="tat-images"
            type="file"
            accept="image/*"
            multiple
            className="soft-input mt-4 file:mr-4 file:rounded-xl file:border-0 file:bg-[#CEF17B] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
            onChange={onFilesSelected}
          />

          {images.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {images.map((image, index) => (
                <div key={image.id} className="subtle-panel p-4">
                  <img src={image.url} alt={image.name} className="h-44 w-full rounded-2xl object-cover" />
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">Image {index + 1}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-400">{image.name}</p>
                    </div>
                    <button type="button" className="text-xs font-semibold text-rose-300" onClick={() => removeImage(image.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
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
            <label className="mt-4 block text-sm font-medium text-white" htmlFor="tat-timer">
              Writing Time Per Image (seconds)
            </label>
            <input
              id="tat-timer"
              type="number"
              min={30}
              max={900}
              className="soft-input mt-3"
              value={timerSeconds}
              onChange={(event) => setTimerSeconds(Number(event.target.value) || 240)}
            />
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="metric-card">
                <p className="text-slate-400">Images Ready</p>
                <p className="mt-2 text-2xl font-semibold text-white">{imageCount}</p>
              </div>
              <div className="metric-card">
                <p className="text-slate-400">Default Time</p>
                <p className="mt-2 text-2xl font-semibold text-white">4 min</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <p className="section-kicker">Practice Notes</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li>Study the image, infer the situation, then write a clear story with direction.</li>
              <li>Your uploads stay temporary and are not stored on any server.</li>
              <li>When time ends, the app moves to the next image automatically.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
