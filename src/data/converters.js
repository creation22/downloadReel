import {
  FileVideo,
  Film,
  AudioLines,
  SlidersVertical,
  Gauge,
  FileCog,
  SunMedium,
} from "lucide-react";

/**
 * Central converter registry.
 *
 * Every entry is one preset on the same underlying converter — not a
 * separate tool. This registry powers the tools directory, routing and
 * the converter pages. Add a preset by appending an entry (or a new
 * factory call) here.
 */

const COMMON_VIDEO = [".mp4", ".webm", ".mov", ".mkv", ".avi", ".m4v"];

const uploadFaq = {
  q: "Does my file get uploaded to a server?",
  a: "No. Conversion runs locally in your browser — your file stays on your device the whole time.",
};

const MP4_NOTE =
  "MP4 is the most widely supported video format, which makes it a safe default for playback, editing and sharing.";

/* ---------- factories (one per preset family) ---------- */

function formatConverter({ slug, from, fromExts, to, toExt, note }) {
  const F = from.toUpperCase();
  const T = to.toUpperCase();
  return {
    slug,
    group: "format",
    category: "convert",
    name: `${F} to ${T} Converter`,
    title: `${F} to ${T} Converter`,
    heading: `${from} to ${to} converter`,
    tagline: `Convert ${F} videos to ${T} directly in your browser.`,
    description: `Convert ${F} videos to ${T} directly in your browser — no uploads, no signup. ${F} in, ${T} out, nothing to configure.`,
    preset: {
      input: fromExts.join(", "),
      output: `.${toExt}`,
      mode: "format conversion",
    },
    accepts: fromExts,
    convertingLabel: `Converting to ${T}...`,
    outputLabel: `.${toExt}`,
    outputExt: toExt,
    buildArgs: (input, output) => [
      "-i",
      input,
      ...(to === "webm"
        ? [
            "-c:v",
            "libvpx-vp9",
            "-deadline",
            "realtime",
            "-cpu-used",
            "5",
            "-crf",
            "34",
            "-b:v",
            "0",
            "-c:a",
            "libopus",
            "-b:a",
            "128k",
          ]
        : [
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "23",
            "-c:a",
            "aac",
            "-b:a",
            "160k",
            "-movflags",
            "+faststart",
          ]),
      output,
    ],
    icon: FileVideo,
    whatIs: [
      `The ${F} to ${T} converter turns ${F} video files into ${T} files locally in your browser. The preset is fixed — ${F} in, ${T} out — so there's nothing to configure.`,
      note,
    ],
    howTo: [
      `Select or drop a ${F} file (${fromExts.join(", ")}).`,
      `Press Convert — the ${F} → ${T} preset is applied automatically.`,
      `Save the converted ${T} file to your device.`,
    ],
    supportedFiles: fromExts,
    faqs: [
      {
        q: `Is converting ${F} to ${T} free?`,
        a: "Yes. The converter is free to use and requires no signup.",
      },
      uploadFaq,
      {
        q: `Will quality change when converting ${F} to ${T}?`,
        a: "Conversion re-encodes the video, so a small quality difference is possible. The preset targets quality close to the source.",
      },
    ],
  };
}

function audioConverter({ slug, format, note, qualityAnswer, codecArgs }) {
  const F = format.toUpperCase();
  return {
    slug,
    group: "extract",
    category: "audio",
    name: `Video to ${F} Converter`,
    title: `Video to ${F} Converter`,
    heading: `video to ${format} converter`,
    tagline: `Extract the audio from a video and save it as ${F} — right in your browser.`,
    description: `Extract audio from a video file and save it as ${F} directly in your browser — no uploads, no signup.`,
    preset: {
      input: "any common video",
      output: `.${format}`,
      mode: "audio extraction",
    },
    accepts: COMMON_VIDEO,
    convertingLabel: `Extracting audio (${F})...`,
    outputLabel: `.${format}`,
    outputExt: format,
    buildArgs: (input, output) => ["-i", input, ...codecArgs, output],
    icon: AudioLines,
    whatIs: [
      `The video to ${F} converter pulls the audio track out of a video file and saves it as ${F}, locally in your browser. Only the audio is kept — the video track is discarded.`,
      note,
    ],
    howTo: [
      "Select or drop a video file (.mp4, .webm, .mov, .mkv, .avi).",
      `Press Convert — the video → ${F} preset is applied automatically.`,
      `Save the ${F} file to your device.`,
    ],
    supportedFiles: COMMON_VIDEO,
    faqs: [
      { q: `Does converting to ${F} affect audio quality?`, a: qualityAnswer },
      uploadFaq,
      {
        q: "Is only the audio saved?",
        a: "Yes. The video track is discarded — the output is an audio file.",
      },
    ],
  };
}

function downscaleConverter({ slug, name, fromRes, toRes, why }) {
  const height = toRes.replace(/\D/g, "");
  return {
    slug,
    group: "quality",
    category: "convert",
    name,
    title: name,
    heading: name.toLowerCase(),
    tagline: `Downscale ${fromRes} videos to ${toRes} directly in your browser.`,
    description: `Downscale ${fromRes} videos to ${toRes} directly in your browser — no uploads, no signup. ${fromRes} in, ${toRes} out, nothing to configure.`,
    preset: { input: "any common video", output: toRes, mode: "downscale" },
    accepts: COMMON_VIDEO,
    convertingLabel: `Downscaling to ${toRes}...`,
    outputLabel: `${toRes} video`,
    outputExt: "mp4",
    buildArgs: (input, output) => [
      "-i",
      input,
      "-vf",
      `scale=-2:${height}`,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-b:a",
      "160k",
      "-movflags",
      "+faststart",
      output,
    ],
    icon: SlidersVertical,
    whatIs: [
      `The ${name.toLowerCase()} downscales ${fromRes} video to ${toRes} locally in your browser. The preset is fixed — ${fromRes} in, ${toRes} out.`,
      why,
    ],
    howTo: [
      `Select or drop a ${fromRes} video file (.mp4, .webm, .mov, .mkv).`,
      `Press Convert — the ${fromRes} → ${toRes} preset is applied automatically.`,
      `Save the downscaled video to your device.`,
    ],
    supportedFiles: COMMON_VIDEO,
    faqs: [
      {
        q: "Will detail be lost?",
        a: `Yes — resolution is reduced on purpose. The preset keeps the result as sharp as ${toRes} allows.`,
      },
      uploadFaq,
      {
        q: "Is the format kept?",
        a: "Yes. The video keeps its format — only the resolution changes.",
      },
    ],
  };
}

function fpsConverter({ slug, fromFps, toFps, why, smoothAnswer }) {
  const name = `${fromFps} to ${toFps} Converter`;
  const fps = toFps.replace("fps", "");
  return {
    slug,
    group: "quality",
    category: "convert",
    name,
    title: name,
    heading: `${fromFps} to ${toFps} converter`,
    tagline: `Convert video from ${fromFps} to ${toFps} directly in your browser.`,
    description: `Convert video from ${fromFps} to ${toFps} directly in your browser — no uploads, no signup. ${fromFps} in, ${toFps} out, nothing to configure.`,
    preset: { input: "any common video", output: toFps, mode: "frame rate conversion" },
    accepts: COMMON_VIDEO,
    convertingLabel: `Converting to ${toFps}...`,
    outputLabel: `${toFps} video`,
    outputExt: "mp4",
    buildArgs: (input, output) => [
      "-i",
      input,
      "-vf",
      `fps=${fps}`,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-b:a",
      "160k",
      "-movflags",
      "+faststart",
      output,
    ],
    icon: SlidersVertical,
    whatIs: [
      `The ${fromFps} to ${toFps} converter changes the frame rate of a video locally in your browser. The preset is fixed — ${fromFps} in, ${toFps} out.`,
      why,
    ],
    howTo: [
      "Select or drop a video file (.mp4, .webm, .mov, .mkv, .avi).",
      `Press Convert — the ${fromFps} → ${toFps} preset is applied automatically.`,
      `Save the ${toFps} video to your device.`,
    ],
    supportedFiles: COMMON_VIDEO,
    faqs: [
      { q: "Will motion look less smooth?", a: smoothAnswer },
      uploadFaq,
      {
        q: "Is the format kept?",
        a: "Yes. The video keeps its format and resolution — only the frame rate changes.",
      },
    ],
  };
}

/* ---------- preset entries ---------- */

const raw = [
  // format conversion
  formatConverter({
    slug: "mp4-to-webm",
    from: "mp4",
    fromExts: [".mp4"],
    to: "webm",
    toExt: "webm",
    note: "WebM is an open format built for the web — small files and native browser support make it a good fit for embedding.",
  }),
  formatConverter({ slug: "webm-to-mp4", from: "webm", fromExts: [".webm"], to: "mp4", toExt: "mp4", note: MP4_NOTE }),
  formatConverter({ slug: "mov-to-mp4", from: "mov", fromExts: [".mov"], to: "mp4", toExt: "mp4", note: MP4_NOTE }),
  formatConverter({ slug: "mkv-to-mp4", from: "mkv", fromExts: [".mkv"], to: "mp4", toExt: "mp4", note: MP4_NOTE }),
  formatConverter({ slug: "avi-to-mp4", from: "avi", fromExts: [".avi"], to: "mp4", toExt: "mp4", note: MP4_NOTE }),
  formatConverter({ slug: "m4v-to-mp4", from: "m4v", fromExts: [".m4v"], to: "mp4", toExt: "mp4", note: MP4_NOTE }),
  formatConverter({ slug: "flv-to-mp4", from: "flv", fromExts: [".flv"], to: "mp4", toExt: "mp4", note: MP4_NOTE }),
  formatConverter({
    slug: "mpg-to-mp4",
    from: "mpg",
    fromExts: [".mpg", ".mpeg"],
    to: "mp4",
    toExt: "mp4",
    note: MP4_NOTE,
  }),
  formatConverter({ slug: "3gp-to-mp4", from: "3gp", fromExts: [".3gp"], to: "mp4", toExt: "mp4", note: MP4_NOTE }),

  // video → other
  {
    slug: "video-to-gif",
    group: "extract",
    category: "creator",
    name: "Video to GIF Converter",
    title: "Video to GIF Converter",
    heading: "video to gif converter",
    tagline: "Turn a short video clip into a looping GIF — right in your browser.",
    description:
      "Turn a video clip into an animated GIF directly in your browser — no uploads, no signup. Video in, looping GIF out.",
    preset: { input: "any common video", output: ".gif", mode: "GIF conversion" },
    accepts: COMMON_VIDEO,
    convertingLabel: "Converting to GIF...",
    outputLabel: ".gif",
    outputExt: "gif",
    buildArgs: (input, output) => [
      "-i",
      input,
      "-filter_complex",
      "[0:v]fps=12,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse[out]",
      "-map",
      "[out]",
      output,
    ],
    icon: Film,
    whatIs: [
      "The video to GIF converter turns a short video clip into an animated GIF locally in your browser. The preset is fixed — video in, looping GIF out.",
      "GIFs play anywhere images do and loop automatically, which makes them a simple way to share short, silent moments.",
    ],
    howTo: [
      "Select or drop a video file (.mp4, .webm, .mov, .mkv, .avi).",
      "Press Convert — the video → GIF preset is applied automatically.",
      "Save the GIF to your device.",
    ],
    supportedFiles: COMMON_VIDEO,
    faqs: [
      {
        q: "Do GIFs have sound?",
        a: "No. The GIF format doesn't support audio — only the video track is used.",
      },
      uploadFaq,
      {
        q: "How long can a clip be?",
        a: "GIF files grow quickly with length, so short clips work best — a few seconds keeps the file manageable.",
      },
    ],
  },
  audioConverter({
    slug: "video-to-mp3",
    format: "mp3",
    note: "MP3 is the most widely supported audio format and plays almost everywhere.",
    qualityAnswer:
      "MP3 is a lossy format, so some quality change is possible. The preset targets quality that sounds like the source for most listening.",
    codecArgs: ["-vn", "-c:a", "libmp3lame", "-q:a", "2"],
  }),
  audioConverter({
    slug: "video-to-wav",
    format: "wav",
    note: "WAV is uncompressed, so it keeps the source audio quality at the cost of larger files.",
    qualityAnswer:
      "No — WAV stores the audio without additional lossy compression, so the source quality is kept.",
    codecArgs: ["-vn", "-c:a", "pcm_s16le"],
  }),
  audioConverter({
    slug: "video-to-ogg",
    format: "ogg",
    note: "OGG is an open, royalty-free format with good quality at smaller file sizes.",
    qualityAnswer:
      "OGG is lossy but efficient — quality stays close to the source at the preset settings.",
    codecArgs: ["-vn", "-c:a", "libvorbis", "-q:a", "5"],
  }),
  audioConverter({
    slug: "video-to-aac",
    format: "aac",
    note: "AAC is the standard audio format inside many video files and is widely supported by phones and players.",
    qualityAnswer:
      "AAC is lossy but efficient, and usually sounds close to the source at the preset settings.",
    codecArgs: ["-vn", "-c:a", "aac", "-b:a", "192k"],
  }),

  // quality / optimization
  downscaleConverter({
    slug: "4k-video",
    name: "4K Video Converter",
    fromRes: "4K (2160p)",
    toRes: "1080p",
    why: "A 1080p copy plays more smoothly on most devices, is quicker to share, and is much smaller than the 4K source.",
  }),
  downscaleConverter({
    slug: "1080p-video",
    name: "1080p Video Converter",
    fromRes: "1080p",
    toRes: "720p",
    why: "A 720p copy is lighter to store and share, and still looks sharp on smaller screens.",
  }),
  downscaleConverter({
    slug: "720p-to-480p",
    name: "720p to 480p Converter",
    fromRes: "720p",
    toRes: "480p",
    why: "A 480p copy is very light — useful when file size matters more than sharpness.",
  }),
  fpsConverter({
    slug: "60fps-to-30fps",
    fromFps: "60fps",
    toFps: "30fps",
    why: "A 30fps file is smaller and plays comfortably on most devices, and everyday footage looks fine at 30fps.",
    smoothAnswer:
      "Slightly, yes — halving the frame rate is a visible trade-off. Most everyday video still looks smooth at 30fps.",
  }),
  fpsConverter({
    slug: "30fps-to-24fps",
    fromFps: "30fps",
    toFps: "24fps",
    why: "24fps has the slower, more cinematic motion associated with film — a common choice for a movie-like look.",
    smoothAnswer:
      "Slightly, by design — 24fps has the classic film look, which is less fluid than 30fps but intentionally so.",
  }),
  {
    slug: "video-bitrate",
    group: "quality",
    category: "compress",
    name: "Video Bitrate Converter",
    title: "Video Bitrate Converter",
    heading: "video bitrate converter",
    tagline: "Lower the bitrate of a video to shrink its file size — right in your browser.",
    description:
      "Adjust the bitrate of a video to reduce its file size directly in your browser — no uploads, no signup.",
    preset: { input: "any common video", output: "smaller file", mode: "bitrate adjustment" },
    accepts: COMMON_VIDEO,
    convertingLabel: "Adjusting bitrate...",
    outputLabel: "video",
    outputExt: "mp4",
    buildArgs: (input, output) => [
      "-i",
      input,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "28",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      output,
    ],
    icon: Gauge,
    whatIs: [
      "The video bitrate converter lowers the bitrate of a video to shrink its file size, locally in your browser. Format and resolution stay the same.",
      "Bitrate is how much data a video uses per second — less bitrate means a smaller file, at some cost to detail.",
    ],
    howTo: [
      "Select or drop a video file (.mp4, .webm, .mov, .mkv, .avi).",
      "Press Convert — the bitrate preset is applied automatically.",
      "Save the smaller video to your device.",
    ],
    supportedFiles: COMMON_VIDEO,
    faqs: [
      {
        q: "What is bitrate?",
        a: "Bitrate is the amount of data used per second of video. Lowering it reduces file size, with some loss of detail.",
      },
      uploadFaq,
      {
        q: "Will the video look worse?",
        a: "Some detail is lost — that's the trade-off for a smaller file. The preset targets a balance of size and quality.",
      },
    ],
  },
  {
    slug: "video-codec",
    group: "quality",
    name: "Video Codec Converter",
    title: "Video Codec Converter",
    heading: "video codec converter",
    tagline: "Re-encode a video to H.264 for maximum compatibility — right in your browser.",
    description:
      "Re-encode a video to the widely supported H.264 codec directly in your browser — no uploads, no signup.",
    preset: { input: "any common video", output: "H.264", mode: "re-encode" },
    accepts: COMMON_VIDEO,
    convertingLabel: "Re-encoding to H.264...",
    outputLabel: "H.264 video",
    outputExt: "mp4",
    buildArgs: (input, output) => [
      "-i",
      input,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-b:a",
      "160k",
      "-movflags",
      "+faststart",
      output,
    ],
    icon: FileCog,
    whatIs: [
      "The video codec converter re-encodes video to H.264 — the codec nearly every player and device supports — locally in your browser.",
      "If a video won't play on an older device or player, re-encoding to H.264 is the most common fix.",
    ],
    howTo: [
      "Select or drop a video file (.mp4, .webm, .mov, .mkv, .avi).",
      "Press Convert — the re-encode preset is applied automatically.",
      "Save the H.264 video to your device.",
    ],
    supportedFiles: COMMON_VIDEO,
    faqs: [
      {
        q: "What is a codec?",
        a: "A codec is the method used to encode video. H.264 is the most widely supported, which makes it a safe target for compatibility.",
      },
      uploadFaq,
      {
        q: "Will re-encoding lose quality?",
        a: "Re-encoding can introduce a small quality change. The preset targets quality close to the source.",
      },
    ],
  },
  {
    slug: "hdr-to-sdr",
    group: "quality",
    name: "HDR to SDR Converter",
    title: "HDR to SDR Converter",
    heading: "hdr to sdr converter",
    tagline: "Tone-map HDR video to standard dynamic range — right in your browser.",
    description:
      "Tone-map HDR video to SDR directly in your browser — no uploads, no signup. Works where the source allows it.",
    preset: { input: "HDR video", output: "SDR video", mode: "tone-map" },
    accepts: COMMON_VIDEO,
    convertingLabel: "Tone-mapping to SDR...",
    outputLabel: "SDR video",
    outputExt: "mp4",
    buildArgs: (input, output) => [
      "-i",
      input,
      "-vf",
      "zscale=transfer=linear:npl=100,tonemap=hable,zscale=transfer=bt709:matrix=bt709:range=limited",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-b:a",
      "160k",
      "-movflags",
      "+faststart",
      output,
    ],
    icon: SunMedium,
    whatIs: [
      "The HDR to SDR converter tone-maps HDR video to standard dynamic range, locally in your browser. This makes HDR footage watchable on ordinary SDR screens.",
      "Tone mapping works where the source allows it — results vary between videos, and some of the HDR look is unavoidably lost.",
    ],
    howTo: [
      "Select or drop an HDR video file (.mp4, .webm, .mov, .mkv).",
      "Press Convert — the tone-map preset is applied automatically.",
      "Save the SDR video to your device.",
    ],
    supportedFiles: COMMON_VIDEO,
    faqs: [
      {
        q: "Will colors look different?",
        a: "Yes — tone mapping compresses the brighter highlights and wider colors of HDR into the SDR range. The result is accurate for SDR, but not identical to the HDR original.",
      },
      uploadFaq,
      {
        q: "Does it work on every HDR video?",
        a: "It works where the source allows. Some HDR formats and metadata combinations can't be tone-mapped faithfully, so results vary.",
      },
    ],
  },
];

export const converters = raw.map((c) => ({
  ...c,
  href: `/${c.slug}-converter`,
}));

export function getConverterBySlug(slug) {
  return converters.find((c) => c.slug === slug);
}

/** Map a converter entry to the tool shape used by the tools directory. */
export function converterToTool(c) {
  const input =
    c.preset.input === "any common video"
      ? "video"
      : c.preset.input === "HDR video"
        ? "HDR"
        : c.preset.input;
  const output = c.preset.output.replace(/ video$/, "");
  return {
    id: c.slug,
    name: c.name,
    description: c.tagline,
    category: c.category,
    href: c.href,
    available: true,
    icon: c.icon,
    meta: `${input} → ${output}`,
  };
}
