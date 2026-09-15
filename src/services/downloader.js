import { sleep } from "../lib/utils";

export const STAGE_LABELS = {
  detecting: "Detecting platform...",
  fetching: "Fetching video...",
};

/**
 * Downloader service.
 *
 * Platform downloads cannot run in the browser — platforms block
 * cross-origin requests and require server-side extraction. When
 * VITE_DOWNLOAD_API points at a processing API (see server/index.mjs,
 * which wraps yt-dlp), this calls it for real. When no API is
 * configured, the flow stays an honest preview — it never pretends a
 * download happened.
 *
 *   await downloadVideo(url, platform, { onStage })
 *   -> { ok, real, url, title, platform, file: { url, filename, filesize } }
 *   or  { ok, demo, url, platform }  (no API configured)
 */

const DOWNLOAD_API = import.meta.env.VITE_DOWNLOAD_API || "";

export function isDownloadApiConfigured() {
  return Boolean(DOWNLOAD_API);
}

async function downloadViaApi(url, platform, onStage) {
  onStage?.("detecting");
  onStage?.("fetching");

  const endpoint = `${DOWNLOAD_API}?url=${encodeURIComponent(url)}`;
  let response;
  try {
    response = await fetch(endpoint, { headers: { Accept: "application/json" } });
  } catch {
    throw new Error(
      "Couldn't reach the download service. Make sure it's running."
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* fall through to the error below */
  }

  if (!response.ok || !data?.ok || !data?.file?.url) {
    throw new Error(
      data?.error || "The download service couldn't process that link."
    );
  }

  return {
    ok: true,
    real: true,
    url,
    title: data.title ?? null,
    thumbnail: data.thumbnail ?? null,
    duration: data.duration ?? null,
    quality: data.quality ?? null,
    ext: data.ext ?? null,
    uploader: data.uploader ?? null,
    platform: { slug: platform.slug, name: platform.name },
    file: {
      url: new URL(data.file.url, DOWNLOAD_API).href,
      filename: data.file.filename,
      filesize: data.filesize ?? null,
    },
  };
}

export async function downloadVideo(url, platform, { onStage } = {}) {
  if (DOWNLOAD_API) {
    return downloadViaApi(url, platform, onStage);
  }

  // No API connected — honest preview, no fake download.
  onStage?.("detecting");
  await sleep(900);

  onStage?.("fetching");
  await sleep(1400);

  return {
    ok: true,
    demo: true,
    url,
    platform: { slug: platform.slug, name: platform.name },
    note: "No download API is configured, so this is a flow preview only.",
  };
}
