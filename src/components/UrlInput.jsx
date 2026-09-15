import { Link2, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * The shared URL input used by the homepage hero and the platform
 * downloader pages. Presentational only — state lives in DownloaderBox.
 */
export function UrlInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  icon,
  loading = false,
  disabled = false,
  buttonLabel = "Download",
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2.5 sm:flex-row"
      noValidate
    >
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint">
          {icon}
        </span>
        <input
          type="text"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Video URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "h-11 w-full rounded-md border border-line bg-surface pl-10 pr-4 text-sm text-fg",
            "placeholder:text-faint outline-none transition-colors duration-150",
            "focus:border-line-strong focus:ring-4 focus:ring-fg/10",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      </div>
      <button
        type="submit"
        disabled={disabled}
        className={cn(
          "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium",
          "bg-btn text-btn-fg transition-colors duration-150 hover:bg-btn-hover",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fg/15",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Working..." : buttonLabel}
      </button>
    </form>
  );
}

/** Neutral icon shown when no platform has been detected yet. */
export function LinkIcon() {
  return <Link2 className="h-[18px] w-[18px]" />;
}
