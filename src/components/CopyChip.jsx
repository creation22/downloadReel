import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy } from "@phosphor-icons/react";
import { cn } from "../lib/utils";

const variants = {
  chip: "rounded border border-line bg-surface px-2 py-0.5 font-mono text-xs",
  row: "w-full justify-between gap-3 rounded-md border border-line bg-surface px-3.5 py-2 font-mono text-xs",
};

/**
 * Copy-to-clipboard chip. Confirms with a Sonner toast and a brief
 * icon swap; degrades gracefully when the browser blocks the
 * clipboard (non-secure contexts, denied permission).
 */
export function CopyChip({
  value,
  label,
  variant = "chip",
  toastMessage = "Copied",
  className,
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(toastMessage);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy — your browser blocked clipboard access.");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${value}`}
      title={`Copy ${value}`}
      className={cn(
        "group/copy inline-flex min-w-0 items-center text-muted transition-colors duration-150",
        "hover:border-line-strong hover:bg-surface-2 hover:text-fg",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fg/10",
        variants[variant],
        className
      )}
    >
      <span className="min-w-0 truncate">{label ?? value}</span>
      {copied ? (
        <Check className="h-3 w-3 shrink-0 text-ok" strokeWidth={2.5} />
      ) : (
        <Copy className="h-3 w-3 shrink-0 text-faint transition-colors group-hover/copy:text-muted" />
      )}
    </button>
  );
}
