import { FFmpeg } from "@ffmpeg/ffmpeg";

/**
 * Real in-browser conversion engine.
 *
 * Uses FFmpeg compiled to WebAssembly (@ffmpeg/core, loaded from CDN on
 * first use and cached by the browser). Everything runs on the client —
 * files never leave the device, which is exactly what the product
 * promises.
 *
 * NOTE: the ESM core build is required, not UMD. @ffmpeg/ffmpeg always
 * spawns its worker as `{ type: "module" }`, where `importScripts` does
 * not exist — so the worker dynamic-imports the core and needs its
 * default export, which only the ESM build provides. Passing the UMD
 * build fails with "failed to import ffmpeg-core.js".
 *
 *   await convertVideo(file, converter, { onStage, onProgress })
 *   -> { ok, real, blob, outputName, outputExt, outputSize, inputSize }
 */

const FFMPEG_VERSION = "0.12.10";
const CORE_VERSION = "0.12.10";
const CORE_BASE = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/esm`;
const CORE_JS = `${CORE_BASE}/ffmpeg-core.js`;
const CORE_WASM = `${CORE_BASE}/ffmpeg-core.wasm`;
const WORKER_URL = `https://unpkg.com/@ffmpeg/ffmpeg@${FFMPEG_VERSION}/dist/umd/814.ffmpeg.js`;

/** Practical limit for wasm memory (input + output both live in RAM). */
export const MAX_INPUT_BYTES = 1024 * 1024 * 1024; // 1 GB

const MIME_TYPES = {
  mp4: "video/mp4",
  webm: "video/webm",
  gif: "image/gif",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  aac: "audio/aac",
};

export class ConversionError extends Error {}

let ffmpeg = null;
let loadPromise = null;
let lastLog = "";

async function toBlobURL(url, type) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return URL.createObjectURL(new Blob([await res.arrayBuffer()], { type }));
}

async function getEngine() {
  if (ffmpeg) return ffmpeg;
  if (!loadPromise) {
    loadPromise = (async () => {
      const instance = new FFmpeg();
      instance.on("log", ({ message }) => {
        lastLog = message;
      });
      await instance.load({
        coreURL: await toBlobURL(CORE_JS, "text/javascript"),
        wasmURL: await toBlobURL(CORE_WASM, "application/wasm"),
        classWorkerURL: await toBlobURL(WORKER_URL, "text/javascript"),
      });
      ffmpeg = instance;
      return instance;
    })().catch((err) => {
      loadPromise = null;
      throw new ConversionError(
        "Couldn't load the conversion engine — check your connection and try again."
      );
    });
  }
  return loadPromise;
}

/** Kill the engine (used for cancellation). Next run reloads from cache. */
export function cancelConversion() {
  if (ffmpeg) {
    ffmpeg.terminate();
    ffmpeg = null;
    loadPromise = null;
  }
}

function friendlyError(converter) {
  const log = (lastLog || "").toLowerCase();
  if (log.includes("zscale") || log.includes("tonemap")) {
    return "HDR tone-mapping isn't supported by the in-browser engine yet.";
  }
  if (log.includes("decoder") || log.includes("codec")) {
    return "The file's codec couldn't be decoded by the in-browser engine.";
  }
  if (log.includes("memory") || log.includes("alloc")) {
    return "The file is too large for in-browser processing. Try a smaller file.";
  }
  return `Conversion failed${converter ? ` for the ${converter.name} preset` : ""}. The file may use an unsupported codec.`;
}

export async function convertVideo(file, converter, { onStage, onProgress } = {}) {
  if (file.size > MAX_INPUT_BYTES) {
    throw new ConversionError(
      "That file is too large for in-browser processing (limit is 1 GB)."
    );
  }

  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const stamp = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const inputName = `in_${stamp}.${ext}`;
  const outputName = `out_${stamp}.${converter.outputExt}`;

  onStage?.("loading");
  const engine = await getEngine();

  onStage?.("reading");
  await engine.writeFile(inputName, new Uint8Array(await file.arrayBuffer()));

  onStage?.("converting");
  const onProgressEvent = ({ progress }) => {
    const value = Math.min(Math.max(progress, 0), 1);
    if (value > 0) onProgress?.(value);
  };
  engine.on("progress", onProgressEvent);

  try {
    const code = await engine.exec(converter.buildArgs(inputName, outputName));
    if (code !== 0) throw new ConversionError(friendlyError(converter));

    const data = await engine.readFile(outputName);
    const blob = new Blob([data], {
      type: MIME_TYPES[converter.outputExt] ?? "application/octet-stream",
    });
    const baseName = file.name.replace(/\.[^.]+$/, "") || "output";
    const prettyName = `${baseName}.${converter.outputExt}`;

    return {
      ok: true,
      real: true,
      blob,
      outputName: prettyName,
      outputExt: converter.outputExt,
      outputSize: blob.size,
      inputSize: file.size,
    };
  } finally {
    engine.off("progress", onProgressEvent);
    for (const name of [inputName, outputName]) {
      try {
        await engine.deleteFile(name);
      } catch {
        /* file may not exist — fine */
      }
    }
  }
}
