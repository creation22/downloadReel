import { useId, useState } from "react";
import { AlertCircle, Check, FileVideo, Loader2, Save, X } from "lucide-react";
import {
  convertVideo,
  cancelConversion,
  ConversionError,
  MAX_INPUT_BYTES,
} from "../services/converter";
import { cn, formatBytes } from "../lib/utils";
import { DownloadState } from "./DownloadState";

const STEPS = ["Select file", "Converting", "Save file"];

/**
 * The complete converter flow: file drop zone, type validation, real
 * in-browser conversion (ffmpeg.wasm) with progress, and the result
 * panel with a real save action.
 *
 * One component renders every converter preset — all behaviour comes
 * from the converter data entry. All media logic lives in
 * services/converter.js; this component only renders states.
 */
export function ConverterBox({ converter }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | working | ready | error
  const [stage, setStage] = useState(null); // loading | reading | converting
  const [progress, setProgress] = useState(null); // 0..1
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputId = useId();

  function pickFile(next) {
    if (!next) return;
    setError(null);
    setResult(null);
    setSaved(false);

    const ext = `.${(next.name.split(".").pop() || "").toLowerCase()}`;
    if (!converter.accepts.includes(ext)) {
      setFile(null);
      setStatus("error");
      setError(
        `That file type isn't supported. This tool takes ${converter.preset.input} files.`
      );
      return;
    }

    if (next.size > MAX_INPUT_BYTES) {
      setFile(null);
      setStatus("error");
      setError("That file is too large for in-browser processing (limit is 1 GB).");
      return;
    }

    setFile(next);
    setStatus("idle");
    setStage(null);
    setProgress(null);
  }

  async function handleConvert(e) {
    e.preventDefault();
    if (!file || status === "working") return;

    setStatus("working");
    setError(null);
    setProgress(null);
    try {
      const response = await convertVideo(file, converter, {
        onStage: setStage,
        onProgress: setProgress,
      });
      setResult(response);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof ConversionError || err instanceof Error
          ? err.message
          : "Something went wrong while converting. Please try again."
      );
    }
  }

  function cancel() {
    cancelConversion();
    setStatus("idle");
    setStage(null);
    setProgress(null);
    setError(null);
    setResult(null);
  }

  function reset() {
    setFile(null);
    setStatus("idle");
    setStage(null);
    setProgress(null);
    setError(null);
    setResult(null);
    setSaved(false);
  }

  function save() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(result.blob);
    a.download = result.outputName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 30000);
    setSaved(true);
  }

  const pct = progress != null ? Math.round(progress * 100) : null;
  const stageLabel =
    stage === "loading"
      ? "Loading engine..."
      : stage === "reading"
        ? "Reading file..."
        : stage === "converting"
          ? pct != null
            ? `${converter.convertingLabel.replace("...", "")} · ${pct}%`
            : converter.convertingLabel
          : "Working...";

  const flow =
    status === "working"
      ? { activeIndex: 1, doneCount: 1 }
      : saved
        ? { activeIndex: -1, doneCount: 3 }
        : { activeIndex: -1, doneCount: 2 };

  const sizeDelta =
    result && result.inputSize > 0
      ? Math.round((1 - result.outputSize / result.inputSize) * 100)
      : null;

  return (
    <div>
      {!file ? (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pickFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-surface px-6 py-10 text-center transition-colors duration-150 sm:py-12",
            dragging
              ? "border-accent bg-surface-2"
              : "border-line-strong hover:border-faint hover:bg-surface-2/60"
          )}
        >
          <input
            id={inputId}
            type="file"
            accept={converter.accepts.join(",")}
            className="hidden"
            onChange={(e) => {
              pickFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-canvas text-muted">
            <FileVideo className="h-5 w-5" />
          </span>
          <p className="mt-1 text-sm font-medium text-fg">
            Drop a video file here
          </p>
          <p className="font-mono text-[11px] text-faint">
            or click to browse · {converter.preset.input} · runs locally
          </p>
        </label>
      ) : (
        <form
          onSubmit={handleConvert}
          className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4 sm:flex-row sm:items-center"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-canvas text-muted">
              <FileVideo className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-fg">
                {file.name}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-faint">
                {formatBytes(file.size)} · out {converter.outputLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label="Remove file"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-faint transition-colors duration-150 hover:bg-surface-2 hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <button
            type="submit"
            disabled={status === "working"}
            className={cn(
              "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium",
              "bg-btn text-btn-fg transition-colors duration-150 hover:bg-btn-hover",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {status === "working" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {status === "working" ? "Working..." : "Convert"}
          </button>
        </form>
      )}

      {status === "error" && error && (
        <div className="mt-3 flex animate-fade-in items-start gap-2 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {status === "working" && (
        <div className="mt-5 animate-fade-in rounded-md border border-line bg-surface p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="flex min-w-0 items-center gap-2 font-mono text-xs text-muted">
              <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent" />
              <span className="truncate">{stageLabel}</span>
            </p>
            <button
              type="button"
              onClick={cancel}
              className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-fg"
            >
              Cancel
            </button>
          </div>
          {stage === "loading" && (
            <p className="mt-2 font-mono text-[11px] text-faint">
              first run downloads the engine (~31 MB) — cached for next time
            </p>
          )}
          {stage === "converting" && pct != null && (
            <div className="mt-4 h-1 w-full overflow-hidden rounded bg-line">
              <div
                className="h-full rounded bg-accent transition-[width] duration-200"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
          <div className="mt-5">
            <DownloadState
              steps={STEPS}
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
                <p className="text-sm font-semibold text-fg">
                  Conversion complete
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-faint">
                  processed locally · nothing was uploaded
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-fg"
            >
              Convert another file
            </button>
          </div>

          <div className="mt-4 space-y-2 rounded-md border border-line bg-canvas px-3 py-2.5 font-mono text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-muted">{result.outputName}</span>
              <span className="shrink-0 text-fg">
                {formatBytes(result.outputSize)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-faint">in · {file.name}</span>
              <span
                className={cn(
                  "shrink-0",
                  sizeDelta != null && sizeDelta > 0 ? "text-ok" : "text-faint"
                )}
              >
                {formatBytes(result.inputSize)}
                {sizeDelta != null &&
                  sizeDelta !== 0 &&
                  ` → ${sizeDelta > 0 ? "−" : "+"}${Math.abs(sizeDelta)}%`}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={save}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-btn px-5 text-sm font-medium text-btn-fg transition-colors duration-150 hover:bg-btn-hover"
            >
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? "Saved" : `Save ${converter.outputLabel}`}
            </button>
            <p className="text-xs leading-relaxed text-faint">
              Saved to your browser's download folder.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
