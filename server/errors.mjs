/**
 * Formats raw yt-dlp stderr messages into readable status codes and messages.
 */
import { MAX_VIDEO_DURATION_SECONDS, MAX_DOWNLOAD_SIZE_MB } from "./config.mjs";

export function durationLimitError() {
  return {
    status: 413,
    error: `That video exceeds the ${MAX_VIDEO_DURATION_SECONDS}-second download limit.`,
  };
}

export function sizeLimitError() {
  return {
    status: 413,
    error: `That video exceeds the ${MAX_DOWNLOAD_SIZE_MB} MB download limit.`,
  };
}

export function rateLimitedError(retryAfter) {
  return {
    status: 429,
    error: "Too many requests — slow down and try again shortly.",
    retryAfter,
  };
}

export function queueFullError() {
  return {
    status: 429,
    error:
      "The download server is busy — all slots and the waiting queue are full. Try again in a minute.",
  };
}

export function diskLowError(freeMB) {
  return {
    status: 507,
    error:
      `The download server is low on temporary storage${Number.isFinite(freeMB) ? ` (${freeMB} MB free)` : ""}. Try again later.`,
  };
}

export function friendlyError(raw) {
  const msg = String(raw || "").trim();
  const last = msg.split("\n").pop() || msg;
  const core = (last.replace(/^ERROR:\s*/i, "") || msg).slice(0, 300);

  if (/logged-in|--cookies|--username|--netrc|pass cookies|Sign in to confirm|Login required|login required|Private video|private account|requires authentication/i.test(core)) {
    return {
      status: 401,
      error:
        "This post needs a logged-in session to access. Add a cookies file (server/cookies.txt, Netscape format) and retry.",
    };
  }
  if (/No video could be found|no video/i.test(core)) {
    return {
      status: 404,
      error: "No video was found in that post.",
    };
  }
  // Duration gate (--match-filter): single yt-dlp process skipped the
  // video before downloading anything.
  if (/does not pass filter/i.test(core)) return durationLimitError();
  // Size gate (--max-filesize): aborted during selection/download.
  if (/max-?filesize|file is (bigger|larger) than/i.test(core))
    return sizeLimitError();
  if (/HTTP Error 40[48]:?|40[48]: Not Found|Gone|not exist|removed|deleted|tombstone/i.test(core)) {
    return {
      status: 404,
      error:
        "That post doesn't exist, was deleted, or isn't publicly available.",
    };
  }
  if (/Unsupported URL/i.test(core)) {
    return { status: 400, error: "This link isn't supported." };
  }
  if (/Failed to connect|Could not connect|timed out|Timeout|timeout/i.test(core)) {
    return {
      status: 504,
      error:
        "Couldn't reach that platform from the server — the network or the platform may be blocking the connection. Try again later.",
    };
  }
  if (/SABR|PO Token|missing a URL|Requested format is not available/i.test(core)) {
    return {
      status: 502,
      error:
        "The platform withheld the playable formats for this request (SABR / PO-token gate). Retry, add cookies, or use a different quality.",
    };
  }
  if (/Geo|geo-block|not available in your country/i.test(core)) {
    return {
      status: 451,
      error: "That video is region-restricted on this platform.",
    };
  }
  if (/DRM|drm/i.test(core)) {
    return { status: 451, error: "That video is DRM-protected and can't be saved." };
  }
  return { status: 502, error: core || "The download service couldn't process that link." };
}
