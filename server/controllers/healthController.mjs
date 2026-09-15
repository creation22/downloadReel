import {
  YTDLP,
  FFMPEG,
  COOKIES_FILE,
  PROXY,
  IMPERSONATE,
  MAX_VIDEO_DURATION_SECONDS,
  MAX_DOWNLOAD_SIZE_MB,
  MAX_CONCURRENT_DOWNLOADS,
  MAX_QUEUE_SIZE,
  DOWNLOAD_TIMEOUT_MS,
} from "../config.mjs";
import { json } from "../utils.mjs";
import { jobStats } from "../jobs.mjs";

export function handleHealth(req, res) {
  return json(res, 200, {
    ok: true,
    ytdlp: YTDLP,
    ffmpeg: FFMPEG,
    cookies: Boolean(COOKIES_FILE),
    proxy: Boolean(PROXY),
    impersonate: IMPERSONATE || "(disabled — plain urllib)",
    limits: {
      maxVideoDurationSeconds: MAX_VIDEO_DURATION_SECONDS,
      maxDownloadSizeMB: MAX_DOWNLOAD_SIZE_MB,
      maxConcurrentDownloads: MAX_CONCURRENT_DOWNLOADS,
      maxQueueSize: MAX_QUEUE_SIZE,
      downloadTimeoutMs: DOWNLOAD_TIMEOUT_MS,
    },
    load: jobStats(),
  });
}
