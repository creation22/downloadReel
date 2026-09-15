/**
 * downloadReel download API — a small local service that wraps yt-dlp.
 *
 * Platforms (Instagram, ...) block cross-origin browser requests, so
 * downloads need server-side extraction. Run this alongside the
 * frontend:
 *
 *   1. Install yt-dlp and make sure it's on your PATH
 *      (https://github.com/yt-dlp/yt-dlp#installation)
 *   2. npm run api
 *   3. Set VITE_DOWNLOAD_API=http://localhost:8787/api/info in .env
 *
 * Endpoints:
 *   GET /api/info?url=<video url>  -> { ok, title, ext, filesize, file }
 *   GET /api/file?url=<video url>  -> streams the video as an attachment
 *
 * Requirements (vendored in server/bin when possible):
 *   - yt-dlp   (mandatory)
 *   - ffmpeg   (mandatory for platforms that serve split video/audio
 *               streams — they don't offer pre-merged formats, so
 *               yt-dlp must merge them)
 *   - node     (used as yt-dlp's JavaScript runtime so it can solve
 *               player challenges)
 *
 * Optional: drop a Netscape-format cookies file at server/cookies.txt (or
 * set COOKIES_FILE) to enable login-walled platforms such as Vimeo and
 * Instagram, which no longer allow anonymous downloads.
 */

import http from "node:http";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT || 8787);

// Prefer the vendored binary (server/bin) over a system-wide install.
const here = path.dirname(fileURLToPath(import.meta.url));
const localBin = path.join(
  here,
  "bin",
  process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp"
);
const YTDLP = fs.existsSync(localBin) ? localBin : "yt-dlp";

// ffmpeg is needed to merge split video/audio streams (bv*+ba).
const localFfmpeg = path.join(
  here,
  "bin",
  process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg"
);
const FFMPEG = fs.existsSync(localFfmpeg) ? localFfmpeg : "ffmpeg";

// Optional cookies file for login-walled platforms (Vimeo, Instagram, ...).
const COOKIES_FILE =
  process.env.COOKIES_FILE && fs.existsSync(process.env.COOKIES_FILE)
    ? process.env.COOKIES_FILE
    : fs.existsSync(path.join(here, "cookies.txt"))
      ? path.join(here, "cookies.txt")
      : null;

// Best video+audio (merged with ffmpeg), falling back to the best
// pre-merged format. Several platforms only serve split DASH/HLS
// streams, so yt-dlp needs ffmpeg to merge them.
//
// The avc/mp4a preference is deliberate: plain `bv*+ba` often picks
// AV1/VP9 video + Opus audio, which many built-in players can't decode —
// the file then plays audio with no picture ("only voice"). H.264 + AAC
// in MP4 plays everywhere, so it is preferred at every fallback level.
const FORMAT = "bv*[vcodec^=avc]+ba[acodec^=mp4a]/b[vcodec^=avc]/bv*+ba/b";

// yt-dlp defaults to curl_cffi browser impersonation. On some networks
// impersonated TLS sessions stall indefinitely (extraction never
// progresses), while the plain urllib/requests stack works — so
// impersonation is disabled unless IMPERSONATE is set (e.g. chrome).
// Set IMPERSONATE=chrome to re-enable it globally (helps TikTok on some
// networks).
const IMPERSONATE = process.env.IMPERSONATE || "";

// Optional egress proxy for networks that block platforms directly
// (e.g. TikTok TCP timeouts). Set HTTP_PROXY / HTTPS_PROXY / ALL_PROXY
// or PROXY. Passed through to yt-dlp as --proxy.
const PROXY =
  process.env.PROXY ||
  process.env.YTDLP_PROXY ||
  process.env.HTTPS_PROXY ||
  process.env.HTTP_PROXY ||
  process.env.ALL_PROXY ||
  "";

const BASE_ARGS = [
  "--no-playlist",
  "--no-warnings",
  "--socket-timeout",
  "30",
  "--retries",
  "2",
  "--js-runtimes",
  "node",
  ...(IMPERSONATE ? ["--impersonate", IMPERSONATE] : ["--impersonate="]),
  ...(FFMPEG !== "ffmpeg" ? ["--ffmpeg-location", FFMPEG] : []),
  ...(COOKIES_FILE ? ["--cookies", COOKIES_FILE] : []),
  ...(PROXY ? ["--proxy", PROXY] : []),
];

const INFO_TIMEOUT_MS = Number(process.env.INFO_TIMEOUT_MS || 100000);

function friendlyError(raw) {
  const msg = String(raw || "").trim();
  const last = msg.split("\n").pop() || msg;
  const core = (last.replace(/^ERROR:\s*/i, "") || msg).slice(0, 300);

  if (/logged-in|--cookies|--username|--netrc|pass cookies|Sign in to confirm|Login required|login required|Private video|private account|requires authentication/i.test(core))
    return {
      status: 401,
      error:
        "This post needs a logged-in session to access. Add a cookies file (server/cookies.txt, Netscape format) and retry.",
    };
  if (/No video could be found|no video/i.test(core))
    return {
      status: 404,
      error: "No video was found in that post.",
    };
  if (/HTTP Error 40[48]:?|40[48]: Not Found|Gone|not exist|removed|deleted|tombstone/i.test(core))
    return {
      status: 404,
      error:
        "That post doesn't exist, was deleted, or isn't publicly available.",
    };
  if (/Unsupported URL/i.test(core))
    return { status: 400, error: "This link isn't supported." };
  if (/Failed to connect|Could not connect|timed out|Timeout|timeout/i.test(core))
    return {
      status: 504,
      error:
        "Couldn't reach that platform from the server — the network or the platform may be blocking the connection. Try again later.",
    };
  if (/SABR|PO Token|missing a URL|Requested format is not available/i.test(core))
    return {
      status: 502,
      error:
        "The platform withheld the playable formats for this request (SABR / PO-token gate). Retry, add cookies, or use a different quality.",
    };
  if (/Geo|geo-block|not available in your country/i.test(core))
    return {
      status: 451,
      error: "That video is region-restricted on this platform.",
    };
  if (/DRM|drm/i.test(core))
    return { status: 451, error: "That video is DRM-protected and can't be saved." };
  return { status: 502, error: core || "The download service couldn't process that link." };
}

const ALLOWED_DOMAINS = [
  "x.com",
  "twitter.com",
  "instagram.com",
  "tiktok.com",
  "facebook.com",
  "fb.watch",
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

function isAllowedUrl(value) {
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

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

function runYtDlp(args, { timeoutMs = INFO_TIMEOUT_MS } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(YTDLP, args, { windowsHide: true });
    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(
        new Error(
          "ERROR: extraction timed out — the platform took too long to respond (possibly a challenge loop or a slow network)."
        )
      );
    }, timeoutMs);
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(
        new Error(
          e.code === "ENOENT"
            ? "yt-dlp is not installed or not on PATH."
            : `Failed to run yt-dlp: ${e.message}`
        )
      );
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve(out);
      } else {
        reject(new Error(err.trim() || `yt-dlp exited with code ${code}`));
      }
    });
  });
}

function pickThumbnail(info) {
  if (info.thumbnail) return info.thumbnail;
  const thumbs = Array.isArray(info.thumbnails) ? info.thumbnails : [];
  if (!thumbs.length) return null;
  // Prefer the highest-resolution thumbnail (last entries tend to be largest).
  const sorted = [...thumbs].sort(
    (a, b) =>
      (a.width ?? 0) * (a.height ?? 0) - (b.width ?? 0) * (b.height ?? 0)
  );
  return sorted[sorted.length - 1]?.url ?? null;
}

function pickQuality(info, merged) {
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

function safeName(title, ext) {
  const base = (title || "video")
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return `${base || "video"}.${ext || "mp4"}`;
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Accept",
      "Access-Control-Max-Age": "600",
    });
    return res.end();
  }
  if (req.method !== "GET") {
    return json(res, 405, { ok: false, error: "Method not allowed." });
  }
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const target = url.searchParams.get("url") || "";

  if (url.pathname === "/api/health") {
    return json(res, 200, {
      ok: true,
      ytdlp: YTDLP,
      ffmpeg: FFMPEG,
      cookies: Boolean(COOKIES_FILE),
      proxy: Boolean(PROXY),
      impersonate: IMPERSONATE || "(disabled — plain urllib)",
    });
  }

  if (url.pathname === "/api/info") {
    const clean = isAllowedUrl(target);
    if (!clean) {
      return json(res, 400, { ok: false, error: "Unsupported or invalid URL." });
    }
    try {
      // FORMAT may select two streams (video + audio) that yt-dlp merges
      // into one mp4 at download time.
      const out = await runYtDlp(["-J", "-f", FORMAT, ...BASE_ARGS, clean]);
      const info = JSON.parse(out);
      const merged = Array.isArray(info.requested_formats);
      const ext = merged
        ? "mp4"
        : info.ext || "mp4";
      const filesize = merged
        ? info.requested_formats.reduce(
            (sum, f) => sum + (f.filesize ?? f.filesize_approx ?? 0),
            0
          ) || null
        : (info.filesize ?? info.filesize_approx ?? null);
      const filename = safeName(info.title, ext);
      return json(res, 200, {
        ok: true,
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
      });
    } catch (err) {
      const mapped = friendlyError(err.message || err);
      return json(res, mapped.status, { ok: false, error: mapped.error });
    }
  }

  if (url.pathname === "/api/file") {
    const clean = isAllowedUrl(target);
    if (!clean) {
      return json(res, 400, { ok: false, error: "Unsupported or invalid URL." });
    }
    const filename = safeName(
      url.searchParams.get("name") || "video",
      url.searchParams.get("name")?.split(".").pop() || "mp4"
    );
    const child = spawn(
      YTDLP,
      [
        "-f",
        FORMAT,
        "--merge-output-format",
        "mp4",
        ...BASE_ARGS,
        "-o",
        "-",
        clean,
      ],
      { windowsHide: true }
    );

    // Don't commit to a 200 until yt-dlp has actually produced bytes —
    // otherwise extraction failures (login walls, geo-blocks, missing
    // ffmpeg) surface as a corrupt zero-byte download.
    let err = "";
    let headersSent = false;
    const FIRST_BYTE_TIMEOUT_MS = Number(process.env.FIRST_BYTE_TIMEOUT_MS || 100000);
    const fail = (mapped) => {
      clearTimeout(firstByteTimer);
      if (headersSent) return res.destroy();
      child.kill();
      return json(res, mapped.status, { ok: false, error: mapped.error });
    };
    const firstByteTimer = setTimeout(() => {
      if (!headersSent)
        fail({
          status: 504,
          error:
            "The video server took too long to start responding. Try again later.",
        });
    }, FIRST_BYTE_TIMEOUT_MS);

    child.stderr.on("data", (d) => (err += d));
    child.stdout.once("data", () => {
      clearTimeout(firstByteTimer);
      headersSent = true;
      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Access-Control-Allow-Origin": "*",
      });
      child.stdout.pipe(res);
    });
    child.on("error", () =>
      fail(friendlyError(err || "Failed to run yt-dlp: unknown error"))
    );
    child.on("close", (code) => {
      if (headersSent) {
        if (code !== 0) res.destroy();
        else res.end();
      } else {
        fail(friendlyError(err));
      }
    });
    req.on("close", () => {
      clearTimeout(firstByteTimer);
      child.kill();
    });
    return;
  }

  return json(res, 404, { ok: false, error: "Not found." });
});

server.listen(PORT, () => {
  console.log(`downloadReel download API -> http://localhost:${PORT}`);
  console.log(`yt-dlp binary: ${YTDLP}`);
  console.log(`ffmpeg binary: ${FFMPEG}`);
  if (FFMPEG === "ffmpeg") {
    console.error(
      "WARNING: ffmpeg was not found — merging is unavailable, so split-stream downloads will fail."
    );
  }
  console.log(`cookies file: ${COOKIES_FILE || "(none — login-walled platforms like Vimeo/Instagram will fail)"}`);
  console.log(`proxy: ${PROXY ? "(set — TikTok/network-blocked platforms will route through it)" : "(none — set PROXY or HTTP_PROXY if TikTok times out)"}`);
  console.log(`impersonation: ${IMPERSONATE || "(disabled — plain urllib; set IMPERSONATE=chrome to re-enable)"}`);
  // Log the detected versions.
  const check = spawn(YTDLP, ["--version"], { windowsHide: true });
  check.on("error", () =>
    console.error("WARNING: yt-dlp was not found — downloads will fail.")
  );
  check.stdout.on("data", (v) =>
    console.log(`yt-dlp ${String(v).trim()} detected.`)
  );
});
