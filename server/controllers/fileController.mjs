import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import {
  YTDLP,
  FORMAT,
  BASE_ARGS,
  DOWNLOAD_TIMEOUT_MS,
  MAX_VIDEO_DURATION_SECONDS,
  MAX_DOWNLOAD_SIZE_MB,
  MAX_DOWNLOAD_BYTES,
} from "../config.mjs";
import {
  friendlyError,
  durationLimitError,
  sizeLimitError,
  rateLimitedError,
  queueFullError,
  diskLowError,
} from "../errors.mjs";
import { isAllowedUrl, json, safeName } from "../utils.mjs";
import { checkRateLimit } from "../ratelimit.mjs";
import {
  acquireDownloadSlot,
  cancelQueued,
  releaseDownloadSlot,
  trackTemp,
  cleanupTemp,
  trackChild,
  killChild,
  diskGuard,
} from "../jobs.mjs";

// Cap stderr retention so a chatty process can't grow server memory.
const STDERR_TAIL_BYTES = 16 * 1024;

function rateLimited(res, retryAfter) {
  const { status, error } = rateLimitedError(retryAfter);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Retry-After": String(retryAfter),
  });
  res.end(JSON.stringify({ ok: false, error }));
}

export function handleFile(req, res, target, url) {
  // 1. Validate BEFORE anything heavy (no process, slot, or temp file yet).
  const clean = isAllowedUrl(target);
  if (!clean) {
    return json(res, 400, { ok: false, error: "Unsupported or invalid URL." });
  }

  // 2. Per-IP rate limit for this expensive endpoint.
  const rl = checkRateLimit(req, "file");
  if (rl.limited) return rateLimited(res, rl.retryAfter);

  // 3. Refuse when tmp storage is nearly full (VPS protection).
  const disk = diskGuard();
  if (!disk.ok) {
    const { status, error } = diskLowError(disk.freeMB);
    return json(res, status, { ok: false, error });
  }

  const filename = safeName(
    url.searchParams.get("name") || "video",
    url.searchParams.get("name")?.split(".").pop() || "mp4"
  );

  // 4. Concurrency gate: run now, wait in queue, or 429 when full.
  const slot = acquireDownloadSlot();
  if (slot.full) {
    const { status, error } = queueFullError();
    return json(res, status, { ok: false, error });
  }
  if (!slot.queued) {
    startDownload(req, res, clean, filename);
    return;
  }

  // Queued: hold the connection until a slot frees. A disconnect while
  // waiting just drops the ticket — no process ever starts for it.
  const onAbort = () => cancelQueued(slot.entry);
  req.once("close", onAbort);
  slot.wait.then(() => {
    req.off("close", onAbort);
    if (req.destroyed || res.writableEnded || res.destroyed) {
      releaseDownloadSlot();
      return;
    }
    startDownload(req, res, clean, filename);
  });
}

function startDownload(req, res, clean, filename) {
  // Download to a temp file instead of piping to stdout: merging split
  // streams to a pipe forces MPEG-TS output (MP4 needs a seekable target
  // for its moov atom), which plays audio-only or not at all.
  const tmpId = crypto.randomBytes(8).toString("hex");
  const tmpFile = path.join(os.tmpdir(), `downloadreel-${tmpId}.mp4`);
  trackTemp(tmpFile);

  // ONE yt-dlp process per request. Duration and size gates ride along
  // inside it (--match-filter / --max-filesize) instead of extra probes.
  const child = spawn(
    YTDLP,
    [
      "-f",
      FORMAT,
      "--merge-output-format",
      "mp4",
      "--remux-video",
      "mp4",
      "--no-part",
      "--match-filter",
      `duration <= ${MAX_VIDEO_DURATION_SECONDS}`,
      "--max-filesize",
      `${MAX_DOWNLOAD_SIZE_MB}M`,
      ...BASE_ARGS,
      "-o",
      tmpFile,
      clean,
    ],
    { windowsHide: true, detached: process.platform !== "win32" }
  );
  trackChild(child);

  let err = "";
  let finished = false;

  const done = () => {
    if (finished) return true;
    finished = true;
    releaseDownloadSlot();
    return false;
  };

  const fail = (status, error) => {
    if (done()) return;
    clearTimeout(timer);
    killChild(child);
    cleanupTemp(tmpFile);
    if (!res.headersSent) json(res, status, { ok: false, error });
    else res.destroy();
  };

  const timer = setTimeout(() => {
    fail(
      504,
      "The download took too long — the platform may be slow or blocking the connection. Try again later."
    );
  }, DOWNLOAD_TIMEOUT_MS);

  child.stderr.on("data", (d) => {
    const next = err + String(d);
    err = next.length > STDERR_TAIL_BYTES ? next.slice(-STDERR_TAIL_BYTES) : next;
  });

  child.on("error", (e) => {
    const mapped = friendlyError(
      e.code === "ENOENT" ? "yt-dlp is not installed or not on PATH." : err || e.message
    );
    fail(mapped.status, mapped.error);
  });

  child.on("close", (code) => {
    clearTimeout(timer);
    if (finished) return;

    if (code !== 0) {
      const mapped = friendlyError(err);
      fail(mapped.status, mapped.error);
      return;
    }

    fs.stat(tmpFile, (statErr, stats) => {
      if (statErr || !stats || stats.size === 0) {
        // Exit 0 with no file == the --match-filter duration gate fired.
        if (/does not pass filter/i.test(err)) {
          const d = durationLimitError();
          fail(d.status, d.error);
        } else {
          fail(502, "The download completed but produced no file — the platform may have blocked it.");
        }
        return;
      }
      // Backstop: merged output can overshoot per-stream --max-filesize.
      if (stats.size > MAX_DOWNLOAD_BYTES) {
        const s = sizeLimitError();
        fail(s.status, s.error);
        return;
      }

      res.writeHead(200, {
        "Content-Type": "video/mp4",
        "Content-Length": stats.size,
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      });

      const stream = fs.createReadStream(tmpFile);
      stream.pipe(res);
      stream.on("error", () => {
        if (done()) return;
        cleanupTemp(tmpFile);
        res.destroy();
      });
      stream.on("end", () => {
        done();
        cleanupTemp(tmpFile);
      });
    });
  });

  // Client disconnect mid-download: kill the whole process tree, wipe temp.
  req.on("close", () => {
    if (finished) return;
    clearTimeout(timer);
    killChild(child);
    cleanupTemp(tmpFile);
    done();
  });
}
