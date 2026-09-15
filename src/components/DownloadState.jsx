import { Check, Spinner } from "@phosphor-icons/react";
import { cn } from "../lib/utils";

/**
 * Generic step flow used by the downloader
 * (Paste URL -> Detecting -> Video found -> Download)
 * and the converter (Select file -> Converting -> Save file).
 *
 * activeIndex — index of the step currently in progress (spinner);
 *               -1 when no step is running.
 * doneCount   — number of completed steps. When the flow has finished
 *               without the final step, that last step renders as a
 *               dashed "pending" marker (it awaits the real engine).
 */
export function DownloadState({ steps, activeIndex, doneCount }) {
  const finished = activeIndex === -1;

  return (
    <ol className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-0">
      {steps.map((label, i) => {
        const done = i < doneCount;
        const active = i === activeIndex;
        const isFinalPending =
          finished && i === steps.length - 1 && doneCount === steps.length - 1;

        return (
          <li key={label} className="flex items-center gap-3 sm:flex-1 sm:pr-4">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                done && "border-fg bg-fg text-canvas",
                active && "border-fg bg-surface text-fg animate-fade-in",
                !done && !active && "border-line bg-surface text-faint",
                isFinalPending &&
                  "border-dashed border-line-strong bg-surface text-muted"
              )}
            >
              {done ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : active ? (
                <Spinner className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <span className="h-1 w-1 rounded-full bg-current" />
              )}
            </span>

            <span
              className={cn(
                "font-mono text-[11px] uppercase tracking-wider transition-colors duration-200",
                done || active ? "text-fg" : "text-faint"
              )}
            >
              {label}
            </span>

            {i < steps.length - 1 && (
              <span
                className={cn(
                  "hidden h-px flex-1 sm:block",
                  done ? "bg-fg" : "bg-line"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
