import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

export const PORT = Number(process.env.PORT || 8787);

const here = path.dirname(fileURLToPath(import.meta.url));

// Prefer vendored binary (server/bin) over system-wide install.
const localBin = path.join(
  here,
  "bin",
  process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp"
);
export const YTDLP = fs.existsSync(localBin) ? localBin : "yt-dlp";

// ffmpeg is needed to merge split video/audio streams (bv*+ba).
const localFfmpeg = path.join(
  here,
  "bin",
  process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg"
);
export const FFMPEG = fs.existsSync(localFfmpeg) ? localFfmpeg : "ffmpeg";

// Optional cookies file for login-walled platforms (Vimeo, Instagram, ...).
export const COOKIES_FILE =
  process.env.COOKIES_FILE && fs.existsSync(process.env.COOKIES_FILE)
    ? process.env.COOKIES_FILE
    : fs.existsSync(path.join(here, "cookies.txt"))
      ? path.join(here, "cookies.txt")
      : null;

// Best video+audio (merged with ffmpeg), falling back to best pre-merged format.
export const FORMAT = "bv*[vcodec^=avc]+ba[acodec^=mp4a]/b[vcodec^=avc]/bv*+ba/b";

export const IMPERSONATE = process.env.IMPERSONATE || "";

export const PROXY =
  process.env.PROXY ||
  process.env.YTDLP_PROXY ||
  process.env.HTTPS_PROXY ||
  process.env.HTTP_PROXY ||
  process.env.ALL_PROXY ||
  "";

export const BASE_ARGS = [
  "--no-playlist",
  "--no-warnings",
  "--socket-timeout",
  "30",
  "--retries",
  "2",
  "--js-runtimes",
  "node",
  ...(IMPERSONATE ? ["--impersonate", IMPERSONATE] : []),
  ...(FFMPEG !== "ffmpeg" ? ["--ffmpeg-location", FFMPEG] : []),
  ...(COOKIES_FILE ? ["--cookies", COOKIES_FILE] : []),
  ...(PROXY ? ["--proxy", PROXY] : []),
];

export const INFO_TIMEOUT_MS = Number(process.env.INFO_TIMEOUT_MS || 100000);
export const DOWNLOAD_TIMEOUT_MS = Number(process.env.DOWNLOAD_TIMEOUT_SECONDS || 180) * 1000;

// ---- Production stability limits (all configurable, sane defaults) ----
// MAX_VIDEO_DURATION_SECONDS: rejects server-side downloads longer than
// this (reels-focused service). Checked in /api/info (exact duration)
// and enforced inside the single yt-dlp process via --match-filter.
export const MAX_VIDEO_DURATION_SECONDS = num(process.env.MAX_VIDEO_DURATION_SECONDS, 600);
// MAX_DOWNLOAD_SIZE_MB: generous VPS safety cap for server-side files.
// Enforced during the download via yt-dlp --max-filesize, estimated
// up-front in /api/info, and verified on the finished file. The
// in-browser ffmpeg.wasm tools are NOT affected by this.
export const MAX_DOWNLOAD_SIZE_MB = num(process.env.MAX_DOWNLOAD_SIZE_MB, 300);
export const MAX_DOWNLOAD_BYTES = MAX_DOWNLOAD_SIZE_MB * 1024 * 1024;
// MAX_CONCURRENT_DOWNLOADS: heavy /api/file jobs running at once;
// extras wait in a small in-memory FIFO (MAX_QUEUE_SIZE), then 429.
export const MAX_CONCURRENT_DOWNLOADS = Math.floor(num(process.env.MAX_CONCURRENT_DOWNLOADS, 2));
export const MAX_QUEUE_SIZE = Math.floor(num(process.env.MAX_QUEUE_SIZE, 20));
// Per-IP rate limits for expensive endpoints (sliding window).
export const RATE_LIMIT_WINDOW_MS = num(process.env.RATE_LIMIT_WINDOW_SECONDS, 60) * 1000;
export const RATE_LIMIT_INFO_REQUESTS = Math.floor(num(process.env.RATE_LIMIT_INFO_REQUESTS, 30));
export const RATE_LIMIT_DOWNLOAD_REQUESTS = Math.floor(num(process.env.RATE_LIMIT_DOWNLOAD_REQUESTS, 5));
// MIN_FREE_DISK_MB: refuse new download jobs when tmpdir has less free
// space than this (protects the VPS from filling the disk).
export const MIN_FREE_DISK_MB = num(process.env.MIN_FREE_DISK_MB, 2048);

function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const ALLOWED_DOMAINS = [
  "x.com",
  "twitter.com",
  "t.co",
  "instagram.com",
  "instagr.am",
  "tiktok.com",
  "facebook.com",
  "fb.watch",
  "fb.me",
  "reddit.com",
  "v.redd.it",
  "redd.it",
  "pinterest.com",
  "pin.it",
  "vimeo.com",
  "threads.net",
  "threads.com",
  "snapchat.com",
  "linkedin.com",
  "lnkd.in",
  "twitch.tv",
  "clips.twitch.tv",
];
