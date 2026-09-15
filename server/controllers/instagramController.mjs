import { friendlyError, rateLimitedError } from "../errors.mjs";
import { fetchInstagramReel, rapidApiConfigured } from "../services/instagram.mjs";
import { json } from "../utils.mjs";
import { checkRateLimit } from "../ratelimit.mjs";

/**
 * GET /api/instagram?url=<instagram reel/post url>
 * -> { ok, provider, title, thumbnail, quality, links, file }
 */
export async function handleInstagram(req, res, target) {
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
    const result = await fetchInstagramReel(target);
    return json(res, 200, result);
  } catch (err) {
    if (err?.status === 400 || err?.status === 413) {
      return json(res, err.status, { ok: false, error: err.message });
    }
    const mapped = friendlyError(err.message || err);
    return json(res, mapped.status, {
      ok: false,
      error: mapped.error,
      provider: rapidApiConfigured() ? "rapidapi" : "ytdlp",
    });
  }
}
