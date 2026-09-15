import { ALLOWED_DOMAINS } from "./config.mjs";

export function isAllowedUrl(value) {
  try {
    const u = new URL(value);
    if (!/^https?:$/.test(u.protocol)) return null;
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    const ok = ALLOWED_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
    return ok ? u.href : null;
  } catch {
    return null;
  }
}

export function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

export function safeName(title, ext) {
  const base = (title || "video")
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return `${base || "video"}.${ext || "mp4"}`;
}

export function pickThumbnail(info) {
  if (info.thumbnail) return info.thumbnail;
  const thumbs = Array.isArray(info.thumbnails) ? info.thumbnails : [];
  if (!thumbs.length) return null;
  const sorted = [...thumbs].sort(
    (a, b) => (a.width ?? 0) * (a.height ?? 0) - (b.width ?? 0) * (b.height ?? 0)
  );
  return sorted[sorted.length - 1]?.url ?? null;
}

export function pickQuality(info, merged) {
  const height =
    info.height ??
    (merged
      ? Math.max(
          ...(Array.isArray(info.requested_formats)
            ? info.requested_formats.map((f) => f.height ?? 0)
            : [0])
        )
      : 0);
  if (height) return `${height}p`;
  return info.format_note || info.resolution || info.format || null;
}
