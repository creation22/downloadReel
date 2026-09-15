/**
 * Concurrency gate, FIFO queue, temp-file registry, child-process
 * registry and free-disk guard for heavy /api/file download jobs.
 *
 * All state transitions are synchronous (Node is single-threaded), so
 * acquire/release cannot race — there is no await between check and
 * mutation anywhere below.
 */

import fs from "node:fs";
import os from "node:os";
import { spawn } from "node:child_process";
import {
  MAX_CONCURRENT_DOWNLOADS,
  MAX_QUEUE_SIZE,
  MIN_FREE_DISK_MB,
} from "./config.mjs";

let active = 0;
const waiters = []; // FIFO of { release, settled }
const tempFiles = new Set();
const children = new Set();

export function jobStats() {
  return {
    activeDownloads: active,
    queuedDownloads: waiters.length,
    trackedTempFiles: tempFiles.size,
  };
}

/**
 * Try to take a download slot.
 * -> { queued: false }                 run immediately (slot held)
 * -> { queued: true, wait, entry }     wait for `wait`, then run
 * -> { full: true }                    at capacity + queue full: 429
 */
export function acquireDownloadSlot() {
  if (active < MAX_CONCURRENT_DOWNLOADS) {
    active += 1;
    return { queued: false };
  }
  if (waiters.length >= MAX_QUEUE_SIZE) {
    return { full: true };
  }
  let release;
  const wait = new Promise((resolve) => {
    release = resolve;
  });
  const entry = { release, settled: false };
  waiters.push(entry);
  return { queued: true, wait, entry };
}

/** Drop a queued entry (e.g. client disconnected while waiting). */
export function cancelQueued(entry) {
  if (!entry || entry.settled) return;
  entry.settled = true;
  const i = waiters.indexOf(entry);
  if (i >= 0) waiters.splice(i, 1);
}

/**
 * Give the slot back. A waiting (non-cancelled) entry inherits it, so
 * `active` only decreases when nobody is waiting.
 */
export function releaseDownloadSlot() {
  while (waiters.length > 0) {
    const next = waiters.shift();
    if (next.settled) continue;
    next.settled = true;
    next.release();
    return;
  }
  active = Math.max(0, active - 1);
}

// ---- Temporary files ----

export function trackTemp(filePath) {
  tempFiles.add(filePath);
}

export function untrackTemp(filePath) {
  tempFiles.delete(filePath);
}

/** Best-effort delete of a temp download (plus any .part sibling). */
export function cleanupTemp(filePath) {
  untrackTemp(filePath);
  fs.unlink(filePath, () => {});
  fs.unlink(`${filePath}.part`, () => {});
  fs.unlink(`${filePath}.ytdl`, () => {});
}

// ---- Child processes (no orphans) ----

export function trackChild(child) {
  children.add(child);
  child.on("close", () => children.delete(child));
  child.on("error", () => children.delete(child));
}

/**
 * Kill a child AND its descendants (yt-dlp spawns ffmpeg). Children are
 * spawned `detached` so POSIX kills the whole process group; Windows
 * falls back to terminating the child itself.
 */
export function killChild(child) {
  try {
    if (!child || child.killed || child.exitCode !== null) return;
    if (process.platform === "win32") {
      // No process groups on Windows: taskkill /T takes the whole tree
      // (yt-dlp + its ffmpeg child). Falls back to a plain kill.
      try {
        const killer = spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
          windowsHide: true,
        });
        killer.on("error", () => {
          try {
            child.kill("SIGKILL");
          } catch {
            /* gone */
          }
        });
      } catch {
        child.kill("SIGKILL");
      }
      return;
    }
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {
      child.kill("SIGKILL");
    }
  } catch {
    /* already gone */
  }
}

/** Last-resort cleanup on server shutdown: kill everything, wipe temps. */
export function shutdownAll() {
  for (const child of [...children]) killChild(child);
  children.clear();
  for (const filePath of [...tempFiles]) cleanupTemp(filePath);
}

// ---- Free disk guard ----

function freeDiskMB(dir) {
  try {
    if (typeof fs.statfsSync !== "function") return null; // cannot check
    const s = fs.statfsSync(dir);
    const free = Number(s.bavail) * Number(s.bsize);
    if (!Number.isFinite(free) || free < 0) return null;
    return free / (1024 * 1024);
  } catch {
    return null;
  }
}

export function diskGuard() {
  if (!MIN_FREE_DISK_MB) return { ok: true };
  const free = freeDiskMB(os.tmpdir());
  if (free === null) return { ok: true, unknown: true }; // fail open
  return { ok: free >= MIN_FREE_DISK_MB, freeMB: Math.floor(free) };
}
