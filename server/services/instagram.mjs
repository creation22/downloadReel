/**
 * Instagram Reel extraction service.
 *
 * Two providers, in order:
 *   1. RapidAPI (`social-media-video-downloader`) — the same provider used
 *      by the dipayansarkar47/insta-reels-downloader reference app. Enabled
 *      when RAPIDAPI_KEY is set. The key stays on the server; the browser
 *      never sees it.
 *   2. yt-dlp (local) — the default. Needs no key and streams through the
 *      existing /api/file pipeline.
 */

import {
  BASE_ARGS,
  FORMAT,
  MAX_VIDEO_DURATION_SECONDS,
  MAX_DOWNLOAD_BYTES,
} from "../config.mjs";
import { runYtDlp } from "./ytdlp.mjs";
import { pickQuality, pickThumbnail, safeName } from "../utils.mjs";
import { durationLimitError, sizeLimitError } from "../errors.mjs";

const RAPIDAPI_HOST = "social-media-video-downloader.p.rapidapi.com";
const RAPIDAPI_URL = `https://${RAPIDAPI_HOST}/smvd/get/all`;
// Hard ceiling on the third-party call (separate from yt-dlp timeouts).
const RAPIDAPI_TIMEOUT_MS = Number(process.env.RAPIDAPI_TIMEOUT_MS || 30000);

function assertWithinLimits({ duration, filesize }) {
  if (
    Number.isFinite(duration) &&
    duration > MAX_VIDEO_DURATION_SECONDS
  ) {
    const d = durationLimitError();
    const err = new Error(d.error);
    err.status = d.status;
    throw err;
  }
  if (Number.isFinite(filesize) && filesize > MAX_DOWNLOAD_BYTES) {
    const s = sizeLimitError();
    const err = new Error(s.error);
    err.status = s.status;
    throw err;
  }
}

export function isInstagramUrl(value) {
  try {
    const u = new URL(value);
    if (!/^https?:$/.test(u.protocol)) return null;
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    const ok =
      host === "instagram.com" ||
      host.endsWith(".instagram.com") ||
      host === "instagr.am" ||
      host.endsWith(".instagr.am");
    if (!ok) return null;
    // Reels, feed posts, IGTV and share links all carry a video.
    if (!/\/(reel|reels|p|tv|s|share)\//i.test(u.pathname) && u.pathname !== "/") {
      // Still allow it — Instagram URL shapes change; let the provider decide.
    }
    return u.href;
  } catch {
    return null;
  }
}

function rapidApiKey() {
  return process.env.RAPIDAPI_KEY || process.env.RAPID_API_KEY || "";
}

export function rapidApiConfigured() {
  return Boolean(rapidApiKey());
}

/**
 * Reference-app flow (App.js getApidata): GET the RapidAPI endpoint with
 * { url, filename: "download" }, then read picture + links[0] { quality, link }.
 * Normalised to the local /api/info shape plus a `links` array.
 */
async function fetchViaRapidApi(clean) {
  const endpoint =
    `${RAPIDAPI_URL}?url=${encodeURIComponent(clean)}` +
    `&filename=${encodeURIComponent("download")}`;
  let response;
  try {
    response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        "X-RapidAPI-Key": rapidApiKey(),
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
      signal: AbortSignal.timeout(RAPIDAPI_TIMEOUT_MS),
    });
  } catch {
    throw new Error(
      "ERROR: Couldn't reach the Instagram service — check the network and try again."
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* handled below */
  }

  if (!response.ok) {
    const msg =
      data?.message || data?.error || `RapidAPI request failed (${response.status}).`;
    throw new Error(`ERROR: ${msg}`);
  }

  const links = Array.isArray(data?.links) ? data.links : [];
  const [{ quality = null, link = null } = {}] = links;
  const thumbnail =
    data?.picture || data?.thumbnail || data?.image || null;

  if (!link) {
    throw new Error("ERROR: No video could be found in that post.");
  }

  const ext = (() => {
    try {
      const pathname = new URL(link).pathname;
      const m = pathname.match(/\.([a-z0-9]{2,5})$/i);
      return (m?.[1] || "mp4").toLowerCase();
    } catch {
      return "mp4";
    }
  })();

  return {
    ok: true,
    provider: "rapidapi",
    title: data?.title || data?.description || null,
    ext,
    filesize: data?.filesize ?? data?.size ?? null,
    thumbnail,
    duration: data?.duration ?? null,
    quality,
    uploader: data?.author || data?.uploader || data?.username || null,
    links: links.map((l) => ({
      quality: l?.quality ?? null,
      url: l?.link ?? null,
    })),
    file: {
      // Direct provider CDN link (reference-app behaviour).
      url: link,
      filename: safeName(data?.title || "instagram-reel", ext),
    },
  };
}

async function fetchViaYtDlp(clean) {
  const out = await runYtDlp(["-J", "-f", FORMAT, ...BASE_ARGS, clean]);
  const info = JSON.parse(out);
  const merged = Array.isArray(info.requested_formats);
  const ext = merged ? "mp4" : info.ext || "mp4";
  const filesize = merged
    ? info.requested_formats.reduce(
        (sum, f) => sum + (f.filesize ?? f.filesize_approx ?? 0),
        0
      ) || null
    : (info.filesize ?? info.filesize_approx ?? null);
  const filename = safeName(info.title || "instagram-reel", ext);

  assertWithinLimits({
    duration: info.duration ?? null,
    filesize,
  });

  return {
    ok: true,
    provider: "ytdlp",
    title: info.title ?? null,
    ext,
    filesize,
    thumbnail: pickThumbnail(info),
    duration: info.duration ?? null,
    width: info.width ?? null,
    height: info.height ?? null,
    quality: pickQuality(info, merged),
    uploader: info.uploader ?? info.channel ?? null,
    file: {
      url: `/api/file?url=${encodeURIComponent(clean)}&name=${encodeURIComponent(filename)}`,
      filename,
    },
  };
}

export async function fetchInstagramReel(target) {
  const clean = isInstagramUrl(target);
  if (!clean) {
    const err = new Error("Unsupported or invalid Instagram URL.");
    err.status = 400;
    throw err;
  }
  if (rapidApiConfigured()) {
    try {
      const result = await fetchViaRapidApi(clean);
      assertWithinLimits({ duration: result.duration, filesize: result.filesize });
      return result;
    } catch (err) {
      // Fall through to yt-dlp when the quota is exhausted or the
      // provider fails — but surface auth errors directly. Limit
      // violations (status 413) are final, never retried.
      if (err?.status === 413) throw err;
      if (/401|403|unauthorized|forbidden|invalid.*key/i.test(err.message)) throw err;
      return fetchViaYtDlp(clean);
    }
  }
  return fetchViaYtDlp(clean);
}
