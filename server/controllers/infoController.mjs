import {
  FORMAT,
  BASE_ARGS,
  MAX_VIDEO_DURATION_SECONDS,
  MAX_DOWNLOAD_BYTES,
} from "../config.mjs";
import {
  friendlyError,
  durationLimitError,
  sizeLimitError,
  rateLimitedError,
} from "../errors.mjs";
import { runYtDlp } from "../services/ytdlp.mjs";
import { isAllowedUrl, json, safeName, pickThumbnail, pickQuality } from "../utils.mjs";
import { checkRateLimit } from "../ratelimit.mjs";

export async function handleInfo(req, res, target) {
  const clean = isAllowedUrl(target);
  if (!clean) {
    return json(res, 400, { ok: false, error: "Unsupported or invalid URL." });
  }

  const rl = checkRateLimit(req, "info");
  if (rl.limited) {
    const { status, error } = rateLimitedError(rl.retryAfter);
    res.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Retry-After": String(rl.retryAfter),
    });
    return res.end(JSON.stringify({ ok: false, error }));
  }

  try {
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

    // Early production gates (exact where known; /api/file re-enforces).
    if (
      Number.isFinite(info.duration) &&
      info.duration > MAX_VIDEO_DURATION_SECONDS
    ) {
      const d = durationLimitError();
      return json(res, d.status, { ok: false, error: d.error });
    }
    if (Number.isFinite(filesize) && filesize > MAX_DOWNLOAD_BYTES) {
      const s = sizeLimitError();
      return json(res, s.status, { ok: false, error: s.error });
    }

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
