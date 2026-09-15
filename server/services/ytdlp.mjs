import { spawn } from "node:child_process";
import { YTDLP, INFO_TIMEOUT_MS } from "../config.mjs";
import { trackChild, killChild } from "../jobs.mjs";

// Bounds so a rogue process can't balloon server memory. -J payloads for
// a single video are KBs; 16 MB of headroom is generous.
const MAX_STDOUT_BYTES = 16 * 1024 * 1024;
const STDERR_TAIL_BYTES = 16 * 1024;

function appendCapped(current, chunk, cap) {
  const next = current + chunk;
  return next.length > cap ? next.slice(-cap) : next;
}

export function runYtDlp(args, { timeoutMs = INFO_TIMEOUT_MS } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(YTDLP, args, { windowsHide: true });
    trackChild(child);
    let out = "";
    let err = "";
    let oversized = false;

    const timer = setTimeout(() => {
      killChild(child);
      reject(
        new Error(
          "ERROR: extraction timed out — the platform took too long to respond (possibly a challenge loop or a slow network)."
        )
      );
    }, timeoutMs);

    const finish = (fn) => (...a) => {
      clearTimeout(timer);
      fn(...a);
    };

    child.stdout.on("data", (d) => {
      out += d;
      if (out.length > MAX_STDOUT_BYTES) {
        oversized = true;
        killChild(child);
      }
    });
    child.stderr.on("data", (d) => {
      err = appendCapped(err, String(d), STDERR_TAIL_BYTES);
    });

    child.on("error", finish((e) => {
      reject(
        new Error(
          e.code === "ENOENT"
            ? "yt-dlp is not installed or not on PATH."
            : `Failed to run yt-dlp: ${e.message}`
        )
      );
    }));

    child.on("close", finish((code) => {
      if (oversized) {
        reject(new Error("ERROR: metadata response too large — refusing to buffer it."));
      } else if (code === 0) {
        resolve(out);
      } else {
        reject(new Error(err.trim() || `yt-dlp exited with code ${code}`));
      }
    }));
  });
}
