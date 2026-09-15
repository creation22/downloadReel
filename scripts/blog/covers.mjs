/**
 * Deterministic SVG cover art for each blog post.
 * 1200x630 (OG-friendly), gradient background + abstract shapes + title.
 */

const PALETTES = [
  ["#0f172a", "#1d4ed8"],
  ["#052e16", "#15803d"],
  ["#2e1065", "#7c3aed"],
  ["#431407", "#ea580c"],
  ["#082f49", "#0284c7"],
  ["#4c0519", "#e11d48"],
  ["#0f766e", "#14b8a6"],
  ["#450a0a", "#dc2626"],
  ["#0c4a6e", "#0891b2"],
  ["#27272a", "#71717a"],
  ["#4a044e", "#c026d3"],
  ["#064e3b", "#0d9488"],
  ["#1e1b4b", "#4f46e5"],
  ["#3f6212", "#65a30d"],
  ["#7c2d12", "#f97316"],
  ["#111827", "#34d399"],
];

const ACCENTS = ["#34d399", "#fbbf24", "#f472b6", "#38bdf8", "#a5b4fc", "#facc15"];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Word-wrap title into up to 3 lines of ~26 chars. */
function wrapTitle(title) {
  const words = title.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 27 && cur) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
    if (lines.length === 3) break;
  }
  if (cur && lines.length < 3) lines.push(cur.trim());
  if (lines.length === 3 && cur !== lines[2]) {
    lines[2] = lines[2].slice(0, 24).trimEnd() + "…";
  }
  return lines.slice(0, 3);
}

export function coverSvg({ slug, title, category, hashNum }) {
  const h = hashNum;
  const [bg1, bg2] = PALETTES[h % PALETTES.length];
  const accent = ACCENTS[(h >> 3) % ACCENTS.length];
  const accent2 = ACCENTS[(h >> 6) % ACCENTS.length];
  const ang = 120 + (h % 4) * 10;
  const lines = wrapTitle(title);
  const catLabel = (category || "blog").toUpperCase();
  const cx = 150 + (h % 300);
  const cy = 160 + ((h >> 4) % 180);
  const r1 = 180 + (h % 140);
  const r2 = 60 + ((h >> 7) % 120);
  const titleY = 630 - 40 - (lines.length - 1) * 52;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/>
      <stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.55"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g opacity="0.16" fill="none" stroke="#ffffff" stroke-width="1.5">
    <circle cx="${cx}" cy="${cy}" r="${r1}"/>
    <circle cx="${cx}" cy="${cy}" r="${r1 * 0.72}"/>
    <circle cx="${1200 - cx / 2}" cy="${630 - cy / 2}" r="${r2}"/>
  </g>
  <g opacity="0.5">
    <circle cx="${cx}" cy="${cy}" r="${3 + h % 4}" fill="${accent}"/>
    <circle cx="${1200 - cx / 2}" cy="${630 - cy / 2}" r="${2 + h % 3}" fill="${accent2}"/>
  </g>
  <g transform="translate(64 64)">
    <rect width="72" height="72" rx="18" fill="#ffffff" opacity="0.14"/>
    <path d="M28 22 L52 36 L28 50 Z" fill="#ffffff" opacity="0.9"/>
  </g>
  <text x="64" y="180" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="24" letter-spacing="6" fill="#ffffff" opacity="0.85">DOWNLOADREEL · ${esc(catLabel)}</text>
  <rect x="64" y="${titleY - 58}" width="72" height="6" rx="3" fill="${accent}"/>
  ${lines
    .map(
      (l, i) =>
        `<text x="64" y="${titleY + i * 52}" font-family="'Segoe UI', Arial, sans-serif" font-size="46" font-weight="700" fill="#ffffff">${esc(l)}</text>`
    )
    .join("\n  ")}
</svg>`;
}
