import { useId } from "react";
import { cn } from "../lib/utils";

/**
 * DownloadReel brand mark — solid #ed5526 badge with glossy
 * highlight, inner ring, and a bold download arrow
 * dropping into a tray.
 */
export function LogoMark({ size = 26, className }) {
  const id = useId();
  const safe = id.replace(/[^a-zA-Z0-9]/g, "");
  const gradId = `dr-bg-${safe}`;
  const glossId = `dr-gloss-${safe}`;
  const shadowId = `dr-shadow-${safe}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-hidden="true"
      className={cn("shrink-0 drop-shadow-[0_2px_8px_rgba(237,85,38,0.35)]", className)}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2663a" />
          <stop offset="0.5" stopColor="#ed5526" />
          <stop offset="1" stopColor="#d14a21" />
        </linearGradient>
        <linearGradient id={glossId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.38" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="0.46" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.12" />
        </linearGradient>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* base */}
      <rect width="32" height="32" rx="9" fill={`url(#${gradId})`} />
      {/* glossy overlay */}
      <rect width="32" height="32" rx="9" fill={`url(#${glossId})`} />
      {/* inner highlight ring */}
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="8.25"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* play-dot accent */}
      <circle cx="22.6" cy="9.4" r="1.6" fill="#ffffff" opacity="0.95" />
      <circle cx="22.6" cy="9.4" r="2.6" fill="#ffffff" opacity="0.25" />

      {/* download arrow */}
      <g filter={`url(#${shadowId})`}>
        <path
          d="M16 7.5v10.8m0 0l-4.9-4.9M16 18.3l4.9-4.9"
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M9.2 23.6h13.6"
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity="0.95"
        />
      </g>
    </svg>
  );
}

/**
 * Full navbar/footer lockup: mark + two-tone wordmark.
 */
export function Logo({ markSize = 26, className }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={markSize} />
      <span className="text-[15.5px] tracking-tight">
        <span className="font-semibold text-fg">Download</span>
        <span className="font-extrabold text-[#ed5526]">Reel</span>
      </span>
    </span>
  );
}
