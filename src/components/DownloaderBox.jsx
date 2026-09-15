import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Check, Download, Loader2, X } from "lucide-react";
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
  // In-page download progress: idle | downloading | done | error.
  // `progress` is { loaded, total } in bytes (total may be null).
  const [dlState, setDlState] = useState("idle");
  const [progress, setProgress] = useState(null);
  const abortRef = useRef(null);

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
    abortRef.current?.abort();
    abortRef.current = null;
    setDlState("idle");
    setProgress(null);

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
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("idle");
    setStage(null);
    setError(null);
    setResult(null);
    setDlState("idle");
    setProgress(null);
    setUrl("");
  }

  /**
   * Download the prepared file through fetch with a byte-counting
   * stream reader, so the button + progress bar show the real
   * percentage. Completed bytes are saved via a blob object URL,
   * which preserves the previous "save to disk" behaviour.
   */
  async function handleDownload() {
    if (dlState === "downloading" || !result?.file?.url) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const expectedTotal =
      Number.isFinite(result.file.filesize) && result.file.filesize > 0
        ? result.file.filesize
        : null;
    setDlState("downloading");
    setProgress({ loaded: 0, total: expectedTotal });

    try {
      const response = await fetch(result.file.url, {
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        throw new Error(`Download failed (HTTP ${response.status}).`);
      }
      const headerTotal = Number(response.headers.get("Content-Length"));
      const total =
        Number.isFinite(headerTotal) && headerTotal > 0
          ? headerTotal
          : expectedTotal;

      const reader = response.body.getReader();
      const chunks = [];
      let loaded = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.byteLength;
        setProgress({ loaded, total });
      }

      const blob = new Blob(chunks, { type: "video/mp4" });
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = result.file.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 15000);

      setProgress({ loaded, total: total ?? loaded });
      setDlState("done");
    } catch (err) {
      if (err?.name === "AbortError") {
        setDlState("idle");
      } else {
        setDlState("error");
      }
      setProgress(null);
    }
  }

  function cancelDownload() {
    abortRef.current?.abort();
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
                preload="none"
                poster={result.thumbnail || undefined}
                src={result.file.url}
                className="mt-3 max-h-80 w-full rounded-md border border-line bg-black"
              />

              <div className="mt-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={
                      dlState === "downloading" ? undefined : handleDownload
                    }
                    disabled={dlState === "downloading"}
                    className="inline-flex h-10 min-w-44 items-center justify-center gap-2 rounded-md bg-btn px-5 text-sm font-medium text-btn-fg transition-colors duration-150 hover:bg-btn-hover disabled:cursor-wait disabled:opacity-90"
                  >
                    {dlState === "downloading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {progress?.total
                          ? `Downloading… ${Math.min(100, Math.floor((progress.loaded / progress.total) * 100))}%`
                          : "Downloading…"}
                      </>
                    ) : dlState === "done" ? (
                      <>
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                        Saved — download again
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        {dlState === "error"
                          ? "Retry download"
                          : "Download video"}
                      </>
                    )}
                  </button>
                  {dlState === "downloading" ? (
                    <button
                      type="button"
                      onClick={cancelDownload}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-line px-4 text-sm text-muted transition-colors duration-150 hover:border-line-strong hover:text-fg"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  ) : (
                    <p className="font-mono text-[11px] leading-relaxed text-faint">
                      {result.file.filename}
                      {result.file.filesize
                        ? ` · ${formatBytes(result.file.filesize)}`
                        : ""}
                    </p>
                  )}
                </div>

                {dlState === "downloading" && progress && (
                  <div className="mt-3 animate-fade-in">
                    <div
                      className="h-1.5 overflow-hidden rounded-full bg-surface-2"
                      role="progressbar"
                      aria-label="Download progress"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={
                        progress.total
                          ? Math.min(
                              100,
                              Math.floor(
                                (progress.loaded / progress.total) * 100
                              )
                            )
                          : undefined
                      }
                    >
                      {progress.total ? (
                        <div
                          className="h-full rounded-full bg-ok transition-[width] duration-200"
                          style={{
                            width: `${Math.min(100, (progress.loaded / progress.total) * 100)}%`,
                          }}
                        />
                      ) : (
                        <div className="h-full w-1/2 animate-pulse rounded-full bg-ok" />
                      )}
                    </div>
                    <p className="mt-1.5 font-mono text-[11px] text-faint">
                      {formatBytes(progress.loaded)}
                      {progress.total
                        ? ` of ${formatBytes(progress.total)}`
                        : " downloaded"}
                    </p>
                  </div>
                )}

                {dlState === "done" && (
                  <p className="mt-2 flex animate-fade-in items-center gap-1.5 text-xs text-ok">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Saved to your downloads.
                  </p>
                )}

                {dlState === "error" && (
                  <p className="mt-2 flex animate-fade-in items-center gap-1.5 text-xs text-danger">
                    <AlertCircle className="h-3.5 w-3.5" />
                    The download was interrupted. Check your connection and
                    retry.
                  </p>
                )}
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
