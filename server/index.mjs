/**
 * downloadReel download API — local extraction service wrapping yt-dlp.
 */

import http from "node:http";
import { spawn } from "node:child_process";
import { PORT, YTDLP, FFMPEG, COOKIES_FILE, PROXY, IMPERSONATE, DOWNLOAD_TIMEOUT_MS } from "./config.mjs";
import { json } from "./utils.mjs";
import { shutdownAll } from "./jobs.mjs";
import { handleHealth } from "./controllers/healthController.mjs";
import { handleInfo } from "./controllers/infoController.mjs";
import { handleFile } from "./controllers/fileController.mjs";
import { handleInstagram } from "./controllers/instagramController.mjs";

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

  switch (url.pathname) {
    case "/api/health":
      return handleHealth(req, res);
    case "/api/info":
      return handleInfo(req, res, target);
    case "/api/instagram":
      return handleInstagram(req, res, target);
    case "/api/file":
      return handleFile(req, res, target, url);
    default:
      return json(res, 404, { ok: false, error: "Not found." });
  }
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

  console.log(
    `cookies file: ${COOKIES_FILE || "(none — login-walled platforms like Vimeo/Instagram will fail)"}`
  );
  console.log(
    `proxy: ${PROXY ? "(set — TikTok/network-blocked platforms will route through it)" : "(none — set PROXY or HTTP_PROXY if TikTok times out)"}`
  );
  console.log(
    `impersonation: ${IMPERSONATE || "(disabled — plain urllib; set IMPERSONATE=chrome to re-enable)"}`
  );

  const check = spawn(YTDLP, ["--version"], { windowsHide: true });
  check.on("error", () =>
    console.error("WARNING: yt-dlp was not found — downloads will fail.")
  );
  check.stdout.on("data", (v) =>
    console.log(`yt-dlp ${String(v).trim()} detected.`)
  );
});

// Long-lived download responses must survive past Node's default 5-minute
// server timeout: allow the download timeout plus queue-wait headroom.
server.requestTimeout = DOWNLOAD_TIMEOUT_MS + 10 * 60 * 1000;

// Graceful shutdown: never leave yt-dlp/ffmpeg orphans or temp files.
let shuttingDown = false;
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n${signal} — stopping download API (killing jobs, wiping temps)...`);
  shutdownAll();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref?.();
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
