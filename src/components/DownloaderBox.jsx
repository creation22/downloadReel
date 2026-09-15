import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Check, Download } from "lucide-react";
import { detectPlatform, DETECT_ERRORS } from "../lib/detect";
import { downloadVideo, STAGE_LABELS } from "../services/downloader";
import { formatBytes, formatDuration } from "../lib/utils";
import { PlatformIcon } from "./icons/PlatformIcon";
import { UrlInput, LinkIcon } from "./UrlInput";
import { DownloadState } from "./DownloadState";

const FLOW_STEPS = ["Paste URL", "Detecting", "Video found", "Download"];

/**
 * The complete downloader flow: URL input, validation, platform
 * detection, mock processing and the honest "ready" preview.
 *
 * Pass `platform` to lock the box to one platform's page, or omit it
 * for auto-detect mode (homepage).
 *
 * All media logic lives in services/downloader.js — this component
 * only renders states.
 */
export function DownloaderBox({ platform = null }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | working | ready | error
  const [stage, setStage] = useState(null); // "detecting" | "fetching"
  const [error, setError] = useState(null); // { message, linkTo?, linkLabel? }
  const [result, setResult] = useState(null);

  const liveDetected = useMemo(() => {
    if (!url.trim()) return null;
    return detectPlatform(url).platform ?? null;
  }, [url]);

  const inputIcon = platform ? (
    <PlatformIcon slug={platform.slug} size={18} />
  ) : liveDetected ? (
    <PlatformIcon
      key={liveDetected.slug}
      slug={liveDetected.slug}
      size={18}
      className="animate-fade-in text-muted"
    />
  ) : (
    <LinkIcon />
  );

  const flow =
    status !== "working"
      ? { activeIndex: -1, doneCount: 3 }
      : stage === "fetching"
        ? { activeIndex: 2, doneCount: 2 }
        : { activeIndex: 1, doneCount: 1 };

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "working") return;

    setError(null);
    setResult(null);

    const detection = detectPlatform(url);
    if (detection.error) {
      setStatus("error");
      setError({ message: DETECT_ERRORS[detection.error] });
      return;
    }

    const target = platform ?? detection.platform;

    if (platform && detection.platform.slug !== platform.slug) {
      setStatus("error");
      setError({
        message: `That looks like a ${detection.platform.name} link.`,
        linkTo: detection.platform.href,
        linkLabel: `Use the ${detection.platform.name} downloader instead`,
      });
      return;
    }

    setStatus("working");
    try {
      const response = await downloadVideo(detection.url, target, {
        onStage: setStage,
      });
      setResult(response);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError({
        message:
          err?.message ||
          "Something went wrong while processing the link. Please try again.",
      });
    }
  }

  function reset() {
    setStatus("idle");
    setStage(null);
    setError(null);
    setResult(null);
    setUrl("");
  }

  return (
    <div>
      <UrlInput
        value={url}
        onChange={setUrl}
        onSubmit={handleSubmit}
        placeholder={
          platform ? platform.placeholder : "Paste a video link..."
        }
        icon={inputIcon}
        loading={status === "working"}
        disabled={status === "working"}
      />

      {status === "error" && error && (
        <div className="mt-3 flex animate-fade-in items-start gap-2 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            {error.message}
            {error.linkTo && (
              <>
                {" "}
                <Link
                  to={error.linkTo}
                  className="font-medium underline underline-offset-2 hover:text-danger"
                >
                  {error.linkLabel}
                </Link>
              </>
            )}
          </p>
        </div>
      )}

      {status === "working" && (
        <div className="mt-5 animate-fade-in rounded-md border border-line bg-surface p-5">
          <p className="flex items-center gap-2 font-mono text-xs text-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {STAGE_LABELS[stage] ?? "Working..."}
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

      {status === "ready" && result && (
        <div className="mt-5 animate-fade-up rounded-md border border-line bg-surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-ok/30 bg-ok/10 text-ok">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <div>
                <p className="text-sm font-semibold text-fg">Video found</p>
                <p className="mt-0.5 font-mono text-[11px] text-faint">
                  ready to download from {result.platform.name}
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

          <div className="mt-4 flex min-w-0 items-center gap-2.5 rounded-md border border-line bg-canvas px-3 py-2">
            <PlatformIcon
              slug={result.platform.slug}
              size={16}
              className="shrink-0 text-faint"
            />
            <p className="truncate font-mono text-xs text-muted">
              {result.url}
            </p>
          </div>

          {result.real && result.file ? (
            <>
              {/* Reel-style preview: thumbnail, title, quality (mirrors the
                  insta-reels-downloader reference UX, powered by the local
                  yt-dlp API instead of RapidAPI). */}
              <div className="mt-4 flex items-center gap-4 rounded-md border border-line bg-canvas p-3">
                {result.thumbnail ? (
                  <img
                    src={result.thumbnail}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-md border border-line object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-faint">
                    <PlatformIcon slug={result.platform.slug} size={24} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-fg">
                    {result.title || "Video ready"}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {result.quality && (
                      <span className="rounded border border-line bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                        {result.quality}
                      </span>
                    )}
                    {result.ext && (
                      <span className="rounded border border-line bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                        {result.ext}
                      </span>
                    )}
                    {Number.isFinite(result.duration) && (
                      <span className="font-mono text-[11px] text-faint">
                        {formatDuration(result.duration)}
                      </span>
                    )}
                    {result.uploader && (
                      <span className="truncate text-xs text-faint">
                        @{result.uploader}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <video
                controls
                preload="metadata"
                poster={result.thumbnail || undefined}
                src={result.file.url}
                className="mt-3 max-h-80 w-full rounded-md border border-line bg-black"
              />

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={result.file.url}
                  download={result.file.filename}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-btn px-5 text-sm font-medium text-btn-fg transition-colors duration-150 hover:bg-btn-hover"
                >
                  <Download className="h-4 w-4" />
                  Download video
                </a>
                <p className="font-mono text-[11px] leading-relaxed text-faint">
                  {result.file.filename}
                  {result.file.filesize
                    ? ` · ${formatBytes(result.file.filesize)}`
                    : ""}
                </p>
              </div>
            </>
          ) : (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  disabled
                  title="No download API is configured in this build"
                  className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-md bg-btn px-5 text-sm font-medium text-btn-fg opacity-40"
                >
                  <Download className="h-4 w-4" />
                  Download video
                </button>
                <p className="text-xs leading-relaxed text-faint">
                  <span className="mr-1.5 rounded border border-dashed border-line-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                    demo
                  </span>
                  This is a preview of the download flow. Platform downloads
                  need the processing service — nothing is downloaded yet.
                </p>
            </div>
            )}
        </div>
      )}
    </div>
  );
}
