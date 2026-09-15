/**
 * Instagram Reel download service (frontend).
 *
 * Mirrors the dipayansarkar47/insta-reels-downloader reference flow
 * (getApidata: paste URL -> loading -> thumbnail + quality + download link,
 * video player, error state) but calls the local /api/instagram endpoint so
 * the RapidAPI key never leaves the server. Falls back to the generic
 * /api/info downloader when no Instagram endpoint is configured.
 */

export const INSTAGRAM_STAGE_LABELS = {
  detecting: "Checking Instagram link...",
  fetching: "Fetching reel...",
};

const INSTAGRAM_API =
  import.meta.env.VITE_INSTAGRAM_API || "http://localhost:8787/api/instagram";
const GENERIC_API = import.meta.env.VITE_DOWNLOAD_API || "";

export function isInstagramApiConfigured() {
  return Boolean(INSTAGRAM_API || GENERIC_API);
}

function resolveEndpoint() {
  return INSTAGRAM_API || GENERIC_API;
}

function normaliseInstagramPayload(data, url) {
  const firstLink = Array.isArray(data.links) ? data.links[0] : null;
  return {
    ok: true,
    real: true,
    url,
    title: data.title ?? null,
    thumbnail: data.thumbnail ?? data.picture ?? null,
    duration: data.duration ?? null,
    quality: data.quality ?? firstLink?.quality ?? null,
    ext: data.ext ?? "mp4",
    uploader: data.uploader ?? null,
    provider: data.provider ?? null,
    platform: { slug: "instagram", name: "Instagram" },
    qualities: Array.isArray(data.links)
      ? data.links
          .filter((l) => l?.url)
          .map((l) => ({ quality: l.quality ?? "video", url: l.url }))
      : [],
    file: data.file?.url
      ? {
          url: data.file.url.startsWith("http")
            ? data.file.url
            : new URL(data.file.url, resolveEndpoint()).href,
          filename: data.file.filename ?? "instagram-reel.mp4",
          filesize: data.filesize ?? null,
        }
      : null,
  };
}

/**
 * Fetch an Instagram Reel/post and return a normalised result:
 * { ok, real, url, title, thumbnail, quality, qualities, file, provider }
 */
export async function fetchInstagramReel(url, { onStage } = {}) {
  const endpoint = resolveEndpoint();
  if (!endpoint) {
    throw new Error(
      "The Instagram service isn't configured in this build."
    );
  }

  onStage?.("detecting");
  onStage?.("fetching");

  let response;
  try {
    response = await fetch(`${endpoint}?url=${encodeURIComponent(url)}`, {
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new Error(
      "Couldn't reach the Instagram service. Make sure it's running (`npm run api`)."
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* fall through to the error below */
  }

  if (!response.ok || !data?.ok) {
    throw new Error(
      data?.error || "Something went wrong while fetching that reel."
    );
  }

  // Generic /api/info fallback has no links array — still normalises fine.
  return normaliseInstagramPayload(data, url);
}
