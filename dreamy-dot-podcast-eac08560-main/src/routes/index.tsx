import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

type GenerationState = "idle" | "loading" | "ready" | "error";

const WEBHOOK_URL =
"https://ai-podcast-backend-production.up.railway.app/generate";

function Index() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [state, setState] = useState<GenerationState>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (state === "loading" || !topic.trim()) return;
    setState("loading");
    setAudioUrl(null);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: topic,
          language: language,
          }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      const url = data?.audioFile;
      if (!url) throw new Error("No audio returned");
      setAudioUrl(url);
      setState("ready");
      setTopic("");
    } catch (err) {
      console.error(err);
      setState("error");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8">
        <header className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-3xl shadow-sm">
            🎙️
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Podcast Studio
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Type a topic and we&apos;ll craft a cozy episode just for you.
          </p>
        </header>

        <section className="space-y-4">
          <label htmlFor="topic" className="sr-only">
            Podcast topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Type podcast topic here..."
            className="w-full rounded-2xl border border-input bg-card px-5 py-4 text-foreground shadow-sm outline-none ring-ring ring-offset-2 ring-offset-background transition-all placeholder:text-muted-foreground focus:border-ring focus:ring-2"
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-2xl border border-input bg-card px-5 py-4 text-foreground"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Kannada">Kannada</option>
          </select>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={state === "loading" || !topic.trim()}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
            >
              🔊
            </span>
            Generate Podcast
          </button>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {state === "idle" && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-2xl">
                🎧
              </div>
              <p className="text-lg font-medium text-foreground">
                Podcast will appear here.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter a topic above to get started.
              </p>
            </div>
          )}

          {state === "loading" && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-5 flex items-center gap-2">
                <span className="loading-dot loading-dot-1" />
                <span className="loading-dot loading-dot-2" />
                <span className="loading-dot" />
              </div>
              <p className="text-lg font-medium text-foreground">
                Creating podcast... please wait!
              </p>
            </div>
          )}

          {state === "ready" && audioUrl && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-2xl">
                🎉
              </div>
              <p className="mb-4 text-lg font-medium text-foreground">
                Podcast is ready! Click play to listen
              </p>
              <audio
                controls
                autoPlay={false}
                src={audioUrl}
                className="w-full rounded-xl"
              >
                Your browser does not support audio playback.
              </audio>
              <button
                type="button"
                onClick={() => setState("idle")}
                className="mt-6 rounded-xl bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Create another
              </button>
            </div>
          )}

          {state === "error" && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-2xl">
                😿
              </div>
              <p className="text-lg font-medium text-foreground">
                Oops! Something went wrong. Please try again
              </p>
              <button
                type="button"
                onClick={() => setState("idle")}
                className="mt-6 rounded-xl bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Try again
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
