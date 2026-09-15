import { useState } from "react";
import { WarningCircle, Check, Download } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  INSTAGRAM_STAGE_LABELS,
  fetchInstagramReel,
} from "../services/instagram";
import { formatBytes, formatDuration } from "../lib/utils";
import { PlatformIcon } from "./icons/PlatformIcon";
import { UrlInput } from "./UrlInput";
import { DownloadState } from "./DownloadState";

const FLOW_STEPS = ["Paste URL", "Detecting", "Video found", "Download"];

const INSTAGRAM_REEL_PATTERN =
  /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\//i;

/**
 * Instagram Reel downloader box.
 *
 * Port of the dipayansarkar47/insta-reels-downloader reference UX —
 * URL input -> "Download Video" -> loading state -> thumbnail + quality
 * + download link, inline video player and error box — rebuilt on the
 * local /api/instagram service (yt-dlp by default, RapidAPI when
 * RAPIDAPI_KEY is set server-side) instead of calling RapidAPI with an
 * exposed key from the browser.
 */
export function InstagramReelBox() {
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | working | ready | error
  const [stage, setStage] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);

  const flow =
    status !== "working"
      ? { activeIndex: -1, doneCount: 3 }
      : stage === "fetching"
        ? { activeIndex: 2, doneCount: 2 }
        : { activeIndex: 1, doneCount: 1 };

  async function getReelData(e) {
    e?.preventDefault?.();
    if (status === "working") return;

    const trimmed = videoUrl.trim();
    if (!trimmed) {
      setStatus("error");
      setError("Please enter an Instagram reel link first.");
      return;
    }
    if (!INSTAGRAM_REEL_PATTERN.test(trimmed)) {
      setStatus("error");
      setError("That doesn't look like an Instagram link.");
      return;
    }

    setStatus("working");
    setError(null);
    setVideoData(null);

    try {
      const result = await fetchInstagramReel(trimmed, {
        onStage: setStage,
      });
      if (!result.file) {
        throw new Error("No video was found in that post.");
      }
      setVideoData(result);
      setStatus("ready");
      toast.success("Reel found — ready to download");
    } catch (err) {
      setStatus("error");
      setError(err?.message || "Something went wrong...");
    }
  }

  function reset() {
    setStatus("idle");
    setStage(null);
    setVideoData(null);
    setError(null);
    setVideoUrl("");
  }

  const downloadQualities =
    videoData?.qualities?.length > 1 ? videoData.qualities : [];

  return (
    <div>
      <UrlInput
        value={videoUrl}
        onChange={setVideoUrl}
        onSubmit={getReelData}
        placeholder="Enter Instagram reel url"
        icon={<PlatformIcon slug="instagram" size={18} />}
        loading={status === "working"}
        disabled={status === "working"}
        buttonLabel="Download Video"
      />

      {status === "working" && (
        <div className="mt-5 animate-fade-in rounded-md border border-line bg-surface p-5">
          <p className="flex items-center gap-2 font-mono text-xs text-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {INSTAGRAM_STAGE_LABELS[stage] ?? "Loading..."}
          </p>
          <div className="mt-5">
            <DownloadState
              steps={FLOW_STEPS}
              activeIndex={flow.activeIndex}
              doneCount={flow.doneCount}
            />
          </div>
        </div>
      )}

      {status === "ready" && videoData && (
        <div className="mt-5 animate-fade-up rounded-md border border-line bg-surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-ok/30 bg-ok/10 text-ok">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <div>
                <p className="text-sm font-semibold text-fg">Video found</p>
                <p className="mt-0.5 font-mono text-[11px] text-faint">
                  {videoData.title || "instagram reel ready to download"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-fg"
            >
              Try another link
            </button>
          </div>

          <div className="mt-4 flex items-center gap-4 rounded-md border border-line bg-canvas p-3">
            {videoData.thumbnail ? (
              <img
                src={videoData.thumbnail}
                alt="Reel thumbnail"
                className="h-20 w-20 shrink-0 rounded-md border border-line object-cover"
                loading="lazy"
              />
            ) : (
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-faint">
                <PlatformIcon slug="instagram" size={24} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-fg">
                {videoData.quality || videoData.ext || "Video"}
              </p>
              {videoData.uploader && (
                <p className="mt-0.5 truncate text-xs text-faint">
                  @{videoData.uploader}
                </p>
              )}
              {Number.isFinite(videoData.duration) && (
                <p className="mt-0.5 font-mono text-[11px] text-faint">
                  {formatDuration(videoData.duration)}
                </p>
              )}
            </div>
            <a
              href={videoData.file.url}
              download={videoData.file.filename}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md bg-btn px-4 text-sm font-medium text-btn-fg transition-colors duration-150 hover:bg-btn-hover"
            >
              <Download weight="duotone" className="h-4 w-4" />
              Download
            </a>
          </div>

          {downloadQualities.length > 0 && (
            <ul className="mt-3 space-y-2">
              {downloadQualities.slice(1).map((q) => (
                <li
                  key={`${q.quality}-${q.url}`}
                  className="flex items-center justify-between gap-3 rounded-md border border-line bg-canvas px-3 py-2"
                >
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    {q.quality}
                  </span>
                  <a
                    href={q.url}
                    target="_blank"
                    rel="noreferrer"
                    download={videoData.file.filename}
                    className="text-xs font-medium text-accent underline underline-offset-2 hover:text-fg"
                  >
                    Download
                  </a>
                </li>
              ))}
            </ul>
          )}

          <video
            controls
            preload="metadata"
            poster={videoData.thumbnail || undefined}
            src={videoData.file.url}
            className="mt-3 max-h-80 w-full rounded-md border border-line bg-black"
          />

          <p className="mt-3 font-mono text-[11px] leading-relaxed text-faint">
            {videoData.file.filename}
            {videoData.file.filesize
              ? ` · ${formatBytes(videoData.file.filesize)}`
              : ""}
          </p>
        </div>
      )}

      {status === "error" && error && (
        <div className="mt-3 flex animate-fade-in items-start gap-2 rounded-md bg-danger/10 p-3 text-sm text-danger">
          <WarningCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
