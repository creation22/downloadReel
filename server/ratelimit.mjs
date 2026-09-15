/**
 * Per-IP sliding-window rate limiter for expensive endpoints.
 * In-memory only (single process): buckets are pruned on every hit and
 * swept periodically, with a hard cap so rotating IPs can't grow the map.
 */

import {
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_INFO_REQUESTS,
  RATE_LIMIT_DOWNLOAD_REQUESTS,
} from "./config.mjs";

const buckets = new Map(); // ip -> { info: number[], file: number[] }
const MAX_BUCKETS = 10000;

function ipOf(req) {
  const fwd = req.headers?.["x-forwarded-for"];
  if (typeof fwd === "string" && fwd) {
    return fwd.split(",")[0].trim().slice(0, 64) || "unknown";
  }
  return req.socket?.remoteAddress || "unknown";
}

function limitFor(kind) {
  return kind === "file" ? RATE_LIMIT_DOWNLOAD_REQUESTS : RATE_LIMIT_INFO_REQUESTS;
}

/**
 * -> { limited: false } | { limited: true, retryAfter }
 * A rejected request does NOT consume quota.
 */
export function checkRateLimit(req, kind) {
  const now = Date.now();
  const ip = ipOf(req);
  let bucket = buckets.get(ip);
  if (!bucket) {
    if (buckets.size >= MAX_BUCKETS) buckets.clear();
    bucket = { info: [], file: [] };
    buckets.set(ip, bucket);
  }
  const hits = bucket[kind].filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  bucket[kind] = hits;
  if (hits.length >= limitFor(kind)) {
    const retryAfter = Math.max(
      1,
      Math.ceil((RATE_LIMIT_WINDOW_MS - (now - hits[0])) / 1000)
    );
    return { limited: true, retryAfter };
  }
  hits.push(now);
  return { limited: false };
}

// Periodic sweep for IPs that never return (stale timestamps only).
const sweep = setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of buckets) {
    bucket.info = bucket.info.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    bucket.file = bucket.file.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (bucket.info.length === 0 && bucket.file.length === 0) {
      buckets.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW_MS);
sweep.unref?.();
