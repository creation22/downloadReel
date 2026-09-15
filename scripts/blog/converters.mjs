/**
 * Converter guides — generated from per-format facts. Two posts per major
 * format (how-to + comparison/explainer), plus audio and preset guides.
 */

const MP4_NOTE =
  "MP4 with H.264 video and AAC audio is the one combination every device, browser, editor and platform accepts without complaint.";

const FORMATS = [
  {
    from: "MOV", fromSlug: "mov", ext: ".mov", toolSlug: "mov-to-mp4",
    origin: "MOV is Apple's QuickTime format — the default output of every iPhone and iPad camera, and Final Cut Pro's native language.",
    sources: "iPhone recordings, iPad exports, Final Cut projects, old camcorders and a surprising number of stock-footage sites",
    why: "Apple hardware and software handle MOV beautifully. Everything else treats it as a foreign guest — Windows players grumble, some web platforms reject it outright, and non-Apple editors need to transcode it before timeline work.",
    codecNote: "Most iPhone MOV files already contain H.264 or HEVC video, which means converting to MP4 can often be a near-lossless container swap rather than a full re-encode.",
    vsWorth: true,
    vsTitle: "MOV vs MP4: which format should you actually keep?",
  },
  {
    from: "MKV", fromSlug: "mkv", ext: ".mkv", toolSlug: "mkv-to-mp4",
    origin: "MKV (Matroska) is the open-source world's container of choice — a deliberately maximalist format that can hold virtually any codec, multiple audio tracks, subtitles and chapters in one file.",
    sources: "archived media libraries, Blu-ray and DVD rips, anime and fansub communities, downloads from older tools",
    why: "MKV is the best storage container nobody's phone can play. TVs, iOS devices and most social platforms skip it entirely, which is why it's the classic 'archival at home, convert to share' format.",
    codecNote: "An MKV containing H.264 video and AAC audio converts to MP4 as a remux — streams copied unchanged, zero quality loss, finished in seconds.",
    vsWorth: true,
    vsTitle: "MKV vs MP4: the honest comparison",
  },
  {
    from: "AVI", fromSlug: "avi", ext: ".avi", toolSlug: "avi-to-mp4",
    origin: "AVI is a 1992 Microsoft container that predates modern codecs, streaming and frankly the internet as we know it.",
    sources: "old camcorder footage, early digital cameras, downloads from the 2000s, legacy software exports",
    why: "AVI files are big for their quality, unsupported by modern phones and browsers, and can't hold modern codecs properly. There is no good reason to keep video in AVI in the 2020s.",
    codecNote: "AVI typically contains aging codecs (DivX, Xvid, MJPEG), so conversion to MP4 is a genuine re-encode — but a worthwhile one, since H.264 will look better at a fraction of the size.",
    vsWorth: false,
  },
  {
    from: "WebM", fromSlug: "webm", ext: ".webm", toolSlug: "webm-to-mp4",
    origin: "WebM is Google's web-native format — VP8/VP9 video with Opus or Vorbis audio, designed for HTML5 playback and open licensing.",
    sources: "browser recordings, web games, downloads that came from streaming sites, open-source tool exports",
    why: "WebM plays in every modern browser and nowhere else — editors, phones and TVs treat it as a second-class citizen. Converting to MP4 is the standard move when a WebM needs to leave the browser.",
    codecNote: "VP9-to-H.264 conversion is a real re-encode. Both codecs are efficient, so the quality cost at sensible settings is small — but it's there, unlike a remux.",
    vsWorth: true,
    vsTitle: "WebM vs MP4: which one does your project need?",
  },
  {
    from: "AVI", skip: true,
  },
  {
    from: "M4V", fromSlug: "m4v", ext: ".m4v", toolSlug: "m4v-to-mp4",
    origin: "M4V is Apple's variant of MP4, developed for iTunes — nearly identical inside, but historically wrapped in Apple's DRM and QuickTime assumptions.",
    sources: "old iTunes purchases and rentals, legacy Apple exports",
    why: "The cruel joke of M4V is that it's essentially MP4 with Apple's copy-protection fingerprints. Unprotected M4V files convert to MP4 with essentially zero loss; DRM-protected ones can't be converted at all.",
    codecNote: "Without DRM, M4V-to-MP4 is a container rename in all but name — same H.264, same AAC, different wrapper.",
    vsWorth: false,
  },
  {
    from: "FLV", fromSlug: "flv", ext: ".flv", toolSlug: "flv-to-mp4",
    origin: "FLV was the Flash video format that powered YouTube's first decade — and died with Flash itself in 2020.",
    sources: "very old downloads, archived early-web video, some legacy CCTV and screencast systems still limping along",
    why: "Nothing modern plays FLV. Browsers dropped Flash support entirely, so an FLV file is effectively a sealed box — conversion to MP4 is the only way to make it watchable again.",
    codecNote: "FLV usually contains H.264 video already (late-era Flash), so conversion is often a container remux with a light re-encode of the audio.",
    vsWorth: false,
  },
  {
    from: "MPG", fromSlug: "mpg", ext: ".mpg", toolSlug: "mpg-to-mp4",
    origin: "MPG carries MPEG-1 and MPEG-2 — the codecs of VCDs, DVDs and broadcast television, i.e. the formats your family's camcorder and your old DVD player spoke.",
    sources: "DVD rips, digital camcorders from the 2000s, broadcast recordings",
    why: "MPEG-2 is a fine broadcast codec and a terrible sharing one — files run several times larger than H.264 at the same quality. Converting MPG to MP4 is the single biggest quality-per-megabyte upgrade in all of format conversion.",
    codecNote: "Expect a real re-encode — but with H.264's efficiency, you can cut file size by 60–75% with no visible difference.",
    vsWorth: false,
  },
  {
    from: "3GP", fromSlug: "3gp", ext: ".3gp", toolSlug: "3gp-to-mp4",
    origin: "3GP was built for the phones of 2003 — tiny files for tiny screens over painfully slow networks, back when a 320x240 video was ambitious.",
    sources: "old phone recordings from the pre-smartphone and early-smartphone era",
    why: "If you've found a folder of old 3GP family videos, conversion is rescue work: the format is dead, the players are gone, and MP4 is the only way those memories stay watchable.",
    codecNote: "3GP files are low-resolution by design (usually 320x240 or less), so converting won't make them sharper — it makes them *playable*, which matters more.",
    vsWorth: false,
  },
];

const AUDIO = [
  {
    name: "MP3", slug: "video-to-mp3", container: "MP3",
    note: "MP3 is the format every device on earth understands — the safe default for music libraries, podcasts and car stereos.",
    detail: "MP3 throws away audio detail to save space. At 320kbps it's excellent; at 128kbps it's noticeably dull on good headphones. For voice-only extraction, 128–192kbps is plenty; for music, go 256–320.",
  },
  {
    name: "WAV", slug: "video-to-wav", container: "WAV",
    note: "WAV is uncompressed PCM audio — the format of recording studios and the best choice when the audio is going into further editing.",
    detail: "WAV preserves every sample exactly as decoded, at the cost of enormous files: roughly 10MB per minute of stereo. Use it when you'll edit, master or re-encode later; use a compressed format when this is the final stop.",
  },
  {
    name: "AAC", slug: "video-to-aac", container: "AAC",
    note: "AAC is what modern video actually uses — the standard audio codec inside MP4, YouTube, Instagram and most streaming platforms.",
    detail: "AAC beats MP3 on quality-per-bit by a meaningful margin: a 128kbps AAC file sounds as good as or better than a 192kbps MP3. If your source video's audio is AAC (it usually is), extracting to AAC can be a lossless copy — no re-encode at all.",
  },
  {
    name: "OGG", slug: "video-to-ogg", container: "Ogg/Vorbis",
    note: "Ogg Vorbis is the open-source alternative — the audio codec of Wikipedia, many game engines and the free-software world.",
    detail: "Vorbis matches or beats AAC at most bitrates and is completely patent-unencumbered. The catch is compatibility: fine on desktops and Android, spotty on Apple hardware and some car systems.",
  },
];

function howtoPost(f) {
  return {
    title: `How to convert ${f.from} to MP4 (without losing quality)`,
    category: "converters",
    tags: [f.from.toLowerCase(), "mp4", "converter", "how-to"],
    toolHref: `/${f.toolSlug}-converter`,
    intro: [
      `${f.origin}`,
      `If you have ${f.ext} files sitting on a drive, the practical question isn't whether to convert them — it's how to do it without quality loss and without handing your videos to some upload-based converter site. This guide covers both.`,
    ],
    sections: [
      {
        h: `Where ${f.from} files come from`,
        body: [
          `Typical sources: ${f.sources}. If that describes your folder, you're in good company — this is one of the most common conversions there is.`,
        ],
      },
      {
        h: `Why ${f.from} needs converting`,
        body: [
          f.why,
          MP4_NOTE,
        ],
      },
      {
        h: "The quality question",
        body: [
          f.codecNote,
          "The distinction that matters: a remux copies the video and audio streams into a new container unchanged — instant and lossless. A re-encode decodes and re-compresses the video — slower, and every generation costs a little detail. Smart conversion remuxes when the codecs allow it and re-encodes only when it must.",
        ],
      },
      {
        h: "Converting with DownloadReel",
        body: [
          "The converter runs entirely in your browser — your file never leaves your device, which makes it both faster and more private than upload-based converters.",
        ],
        list: [
          `Open the ${f.from} to MP4 converter.`,
          `Drop in your ${f.ext} file (or click to browse).`,
          "Press Convert — processing happens locally using WebCodecs/FFmpeg compiled to WebAssembly.",
          "Save the finished MP4 wherever you like.",
        ],
      },
      {
        h: "Batch converting a library",
        body: [
          "If you're converting a whole archive, work through files one at a time and keep the originals until you've spot-checked the results. Storage is cheap; a bad batch conversion of your only copy is not.",
        ],
      },
    ],
    tips: [
      "Spot-check the first converted file before running a whole archive through.",
      "Keep originals of anything irreplaceable until conversions are verified.",
      "If the source is already H.264 inside a different wrapper, the conversion is lossless remux — relax.",
      "Name converted files sensibly: 'family-2007.mp4', not 'convert(3).mp4'.",
    ],
    faqs: [
      {
        q: "Will converting reduce the quality?",
        a: f.codecNote.includes("remux") || f.codecNote.includes("copy")
          ? "Not meaningfully — this conversion can be done as a container swap with the streams copied unchanged. Verify with a spot check and you'll struggle to find a difference."
          : "There's a small generation loss because the codecs differ, but with sensible settings it's invisible in practice. Keep the original if it's irreplaceable.",
      },
      {
        q: "Does my file get uploaded anywhere?",
        a: "No. Conversion runs locally in your browser — the file stays on your device the whole time.",
      },
      {
        q: "How long does conversion take?",
        a: "A remux finishes in seconds regardless of length. A re-encode depends on file length and your device's CPU — usually around real-time on a modern laptop.",
      },
    ],
  };
}

function vsPost(f) {
  return {
    title: f.vsTitle,
    category: "formats",
    tags: [f.from.toLowerCase(), "mp4", "comparison"],
    toolHref: `/${f.toolSlug}-converter`,
    intro: [
      `Every format guide online eventually reveals the same secret: ${f.from} and MP4 are containers — boxes — and the quality lives in the codecs inside them. Once you understand that, the whole 'which format is better' debate collapses into a few practical questions.`,
      `Here's the honest comparison, marketing removed.`,
    ],
    sections: [
      {
        h: "Containers don't determine quality — codecs do",
        body: [
          `A video file is a container (${f.from}, MP4, MKV…) holding video and audio streams encoded with codecs (H.264, HEVC, VP9…). ${f.codecNote}`,
          "This is why 'convert MOV to MP4' can mean anything from a lossless container swap to a full re-encode — it depends entirely on what's inside the source file.",
        ],
      },
      {
        h: `What ${f.from} is genuinely good at`,
        body: [
          f.origin,
          `If you live entirely inside that format's ecosystem, there's little reason to convert. The friction starts the moment the file needs to travel: ${f.why.toLowerCase().startsWith("apple") ? "sharing with non-Apple devices" : "playing outside its home turf"}.`,
        ],
      },
      {
        h: "What MP4 does better",
        body: [
          MP4_NOTE,
          "That universality is the entire argument. You trade nothing in quality potential — MP4 holds the same modern codecs — and you gain playback everywhere: every phone, browser, smart TV, editor and social platform.",
        ],
      },
      {
        h: "The practical recommendation",
        body: [
          `Keep ${f.from} where its ecosystem pays off; convert to MP4 for sharing, uploading and anything that leaves your own setup. For archival, some people keep the original container and convert on demand — storage is cheaper than re-encoding regrets.`,
        ],
        list: [
          `Working inside the ${f.from} ecosystem? Stay there.`,
          "Sharing, uploading, or playing on unknown devices? MP4.",
          "Archiving? Keep originals; convert copies as needed.",
        ],
      },
    ],
    tips: [
      "Judge formats by their codecs and support, never by brand loyalty.",
      "A remux between containers is free — use it whenever codecs match.",
      "'MP4' isn't a quality level; an old-codec MP4 can look far worse than a modern MKV.",
    ],
    faqs: [
      {
        q: "Is MP4 always the right answer?",
        a: "For sharing and general playback, close to always. For archival with multiple audio tracks and subtitles, MKV remains the better box — convert copies for playback and keep the MKV master.",
      },
      {
        q: "Can I convert back without stacking losses?",
        a: "Each re-encode costs a little quality, so avoid round-trips. Remuxes (container-only conversions) don't touch the streams and can be repeated freely.",
      },
      {
        q: "Which codecs should my MP4 contain?",
        a: "H.264 video + AAC audio is the universal safe pair. H.265/HEVC and AV1 compress better but play on fewer devices — use them only when you control the playback side.",
      },
    ],
  };
}

function audioPost(a) {
  const target = a.name === "AAC" ? "AAC audio" : `${a.name}`;
  return {
    title:
      a.name === "MP3"
        ? "How to extract audio from any video (video to MP3)"
        : `Extracting ${target} from video the right way`,
    category: "converters",
    tags: [a.name.toLowerCase(), "audio", "converter", "how-to"],
    toolHref: `/${a.slug}-converter`,
    intro: [
      `You want the sound, not the picture — a lecture for the commute, a song from a clip, a podcast moment, a sound effect for a project. Extracting audio from video is one of the most common conversions there is, and one of the most commonly done badly.`,
      `Here's how to pull clean audio out of any video file, and how to choose the format that keeps the most quality: ${a.note}`,
    ],
    sections: [
      {
        h: "The one rule that preserves quality",
        body: [
          "Audio inside modern video files is already compressed — usually AAC at 128–256kbps. When you extract to MP3, you're re-encoding already-compressed audio, and every re-encode generation costs detail. Extract to a format that matches the source (or better, copies it) and you keep everything.",
          a.detail,
        ],
      },
      {
        h: "Why MP3 still rules for compatibility, and what beats it",
        body: [
          "MP3 plays on literally everything, which is why it remains the default answer. But if your source video's audio is AAC (most MP4s), extracting to AAC can copy the stream with zero additional loss — and to M4A/AAC files that play on all the same modern devices.",
          "WAV is the lossless escape hatch for editing workflows; Opus and Vorbis (in OGG) lead the quality-per-bit charts for open ecosystems. Pick by destination, not by habit.",
        ],
      },
      {
        h: "Extracting with DownloadReel",
        body: [
          "The extractor runs locally in your browser — your file never uploads anywhere.",
        ],
        list: [
          `Open the video to ${a.name} converter.`,
          "Drop in your video file — MP4, MOV, MKV, WebM, AVI and friends all work.",
          `Press Convert — the audio stream is extracted and encoded to ${a.name}.`,
          "Save the finished audio file.",
        ],
      },
      {
        h: "Bitrate guidance that actually matters",
        body: [
          "For voice: 128kbps MP3 / 96–128kbps AAC is transparent. For music: 256–320kbps MP3 or 192–256kbps AAC. For editing: uncompressed WAV, always. And if the source audio was 128kbps AAC, extracting to 320kbps MP3 adds nothing — you can't un-compress what was already compressed.",
        ],
      },
    ],
    tips: [
      "Match the source codec when possible — AAC-in to AAC-out can be lossless.",
      "Higher bitrate can't recover detail lost before you got the file.",
      "Voice needs far less bitrate than music — don't waste storage on talk audio.",
      "For editing and sound design, extract to WAV and re-encode once at the end.",
    ],
    faqs: [
      {
        q: "Does extracting audio reduce the video's quality?",
        a: "It doesn't touch the video at all — extraction reads the audio stream and leaves the source file unchanged.",
      },
      {
        q: "Why does my extracted MP3 sound duller than the video?",
        a: "Most often it's a double-compression issue: already-compressed AAC audio re-encoded to MP3 at a low bitrate. Extract to AAC instead, or raise the MP3 bitrate to 256kbps+.",
      },
      {
        q: "Can I extract audio from a downloaded video?",
        a: "Yes — extraction works on any file you have, including your own downloads and recordings. The same copyright rules as video apply: personal use is the safe default, redistribution needs permission.",
      },
    ],
  };
}

const PRESETS = [
  {
    title: "Downscaling 4K to 1080p: when and how to do it right",
    slugP: "4k-to-1080p",
    tag: "resolution",
    toolSlug: "1080p-video",
    intro: [
      "4K is glorious on the panel it was made for — and an overkill liability everywhere else. If you're not editing 4K, not playing it back on a 4K screen, and not keeping it for the future, a 1080p copy can cut file size by 75% with quality most eyes can't distinguish at normal viewing distance.",
      "Here's when downscaling is the smart move, and how to do it without the mushy result that gives resizing its bad reputation.",
    ],
    sections: [
      {
        h: "The honest case for keeping 4K",
        body: [
          "Keep 4K when any of these are true: you're editing with reframing/cropping plans (4K gives you headroom to punch into a shot and still output 1080p), the footage is archive-worthy (family, once-in-a-lifetime events), or your playback setup is actually 4K. In those cases, the storage cost buys you real value.",
        ],
      },
      {
        h: "The equally honest case for 1080p",
        body: [
          "For social uploads, messaging apps, and sharing with normal humans, 1080p is the destination format anyway — the platforms re-encode to it regardless. Carrying a 4K master through a workflow that ends at 1080p just burns time and disk.",
          "The math is stark: 4K has four times the pixels of 1080p, and roughly the file size to match. Downscaling with a good resizer recovers three quarters of that with a quality cost that's genuinely hard to spot at couch distance.",
        ],
      },
      {
        h: "How to downscale properly",
        body: [
          "The trap is naive resizing — a fast, cheap pixel dump that aliases hard edges into shimmer. A proper downscale uses good filtering (the technical names are bicubic and Lanczos) and lands crisper than the original's 1080p downshift in many players.",
        ],
        list: [
          "Open the 1080p converter preset on this site.",
          "Drop in your 4K file.",
          "Convert — rescaling and re-encoding happen locally in your browser.",
          "Spot-check fine detail (hair, text, foliage) before deleting anything.",
        ],
      },
    ],
    tips: [
      "Never upscale 1080p to 4K for 'quality' — there's nothing to recover; use the original.",
      "Fine repeating detail (stripes, brick) is where bad downscaling shows first — check it.",
      "Keep 4K masters of anything you might re-edit later; convert copies for delivery.",
    ],
    faqs: [
      {
        q: "Does 4K-to-1080p look better than native 1080p footage?",
        a: "Sometimes, yes — downscaling four pixels into one averages out noise and can look cleaner than a native sensor capture. It's the one form of conversion that genuinely improves perceived quality.",
      },
      {
        q: "What bitrate should the 1080p output use?",
        a: "For H.264, 8–12 Mbps covers 1080p30 generously; fast-motion content leans toward the top of the range.",
      },
    ],
  },
  {
    title: "60fps vs 30fps vs 24fps: frame rates explained (and how to convert)",
    slugP: "frame-rate-guide",
    tag: "frame rate",
    toolSlug: "60fps-to-30fps",
    intro: [
      "Frame rate is the most argued-about, least understood number in video. 24fps is 'cinematic', 30fps is 'TV', 60fps is 'smooth' — the slogans are everywhere, and they're roughly true but wildly incomplete.",
      "Here's what frame rates actually do, when each one is the right call, and what happens when you convert between them.",
    ],
    sections: [
      {
        h: "What the numbers mean",
        body: [
          "Frame rate is how many individual images per second the file contains. More frames per second means smoother motion — up to a point of diminishing returns — and more data. Fewer frames feel choppier but carry the specific 'texture' each rate is known for.",
          "The look is real and cultural: 24fps reads as 'film' because a century of cinema trained us to associate it with narrative. 60fps reads as 'video' — news, sports, games — because that's where we meet it.",
        ],
      },
      {
        h: "Choosing a frame rate",
        body: [
          "The practical defaults: 24fps for narrative, mood and anything that should feel like a movie. 30fps for standard vlogs, tutorials and corporate content. 60fps for fast motion — sports, gaming, action cameras — where 24/30 visibly stutters.",
          "One rule beats all the theory: match your frame rate to your footage's origin and your platform's norm. Mixing rates inside a project forces conversions that cost smoothness.",
        ],
      },
      {
        h: "Converting between frame rates",
        body: [
          "Dropping 60fps to 30fps is safe: the converter simply keeps every other frame, and motion stays consistent. Going the other way — 30 to 60 — must fabricate frames that never existed (interpolation), which produces the infamous 'soap opera' smear on camera pans.",
          "Frame-rate conversion is also the classic silent-audio killer: mismatched assumptions about frame timing can desync or drop audio. Converters that handle audio timing correctly avoid it — if your converted file's lips don't match, that's the cause.",
        ],
      },
    ],
    tips: [
      "Down in frame rate (60→30) is safe; up (30→60) fabricates frames — avoid it.",
      "Pick the frame rate at shoot/export time, not in post.",
      "Game capture belongs at 60fps; talking-head video doesn't.",
      "If converted audio drifts out of sync, the frame-timing handling was wrong — try a proper converter.",
    ],
    faqs: [
      {
        q: "Is 60fps always better quality?",
        a: "It's smoother, which is different from better. For cinematic content, 60fps actively fights the intended look. 'Better' means matching the content's purpose.",
      },
      {
        q: "Why does my 60fps footage look weird on social platforms?",
        a: "Most platforms re-encode toward their norms and some aggressively compress high frame rates, which can smear detail. Test a 30fps upload of fast-motion content and compare.",
      },
    ],
  },
  {
    title: "Video bitrate explained: the number that decides your quality",
    slugP: "bitrate-explained",
    tag: "bitrate",
    toolSlug: "video-bitrate",
    intro: [
      "Resolution gets the marketing; bitrate does the work. A 1080p video at a healthy bitrate looks crisp; the same resolution starved of bitrate looks like a watercolor. If you learn one technical number, make it this one.",
      "Here's what bitrate means, how much you actually need, and how to change it without wrecking your video.",
    ],
    sections: [
      {
        h: "What bitrate actually is",
        body: [
          "Bitrate is the amount of data per second of video — measured in megabits per second (Mbps) for anything modern. Bits are the budget a codec spends describing each frame: generous budgets preserve detail, tight budgets force the codec to blur, block and smear to fit.",
          "This explains the everyday mysteries: why two '1080p' files can look nothing alike, why dark scenes and confetti are where streams fall apart first (complex, unpredictable detail is expensive), and why 'resolution' on a spec sheet tells you almost nothing about what you'll see.",
        ],
      },
      {
        h: "How much bitrate you need",
        body: [
          "Sensible H.264 starting points for 30fps content: 1080p wants 8–12 Mbps, 720p wants 5–7, 4K wants 35–45. Double roughly for 60fps (twice the frames, twice the bits to describe them). HEVC and AV1 deliver the same quality at roughly half these numbers — that's their whole pitch.",
          "The platform norms matter as much as the math: YouTube re-encodes everything anyway, messaging apps crush bitrate hard, and 'more' past the point of transparency is wasted storage.",
        ],
      },
      {
        h: "Changing bitrate",
        body: [
          "Raising a file's bitrate does nothing — the detail was already lost when it was encoded. Lowering it re-encodes smaller at a quality cost you control with the number. The bitrate converter on this site does exactly this locally in your browser.",
        ],
        list: [
          "Open the bitrate converter.",
          "Drop in your video.",
          "Pick your target — a percentage of the original or an explicit Mbps value.",
          "Convert and compare a high-motion section before committing to archives.",
        ],
      },
    ],
    tips: [
      "Judge encodes by the worst moments — dark scenes, confetti, fast pans — not the easy ones.",
      "Bitrate can't be added back after the fact; the ceiling is set at first encode.",
      "Modern codecs (HEVC, AV1) halve the bitrate for the same quality — when playback supports them.",
    ],
    faqs: [
      {
        q: "What's the best bitrate for uploads?",
        a: "Match the platform's own recommendations (they publish them) — higher just gets re-encoded down, lower bakes in avoidable loss.",
      },
      {
        q: "Is a bigger file always better quality?",
        a: "No — an inefficient codec or wasteful settings inflate size without visual gain. Compare at the same codec and settings before equating bytes with quality.",
      },
    ],
  },
  {
    title: "HDR to SDR conversion: why your video looks washed out (and the fix)",
    slugP: "hdr-to-sdr",
    tag: "hdr",
    toolSlug: "hdr-to-sdr",
    intro: [
      "You played a modern video on an older screen and everything looked pale and washed out — or dark and murky. Congratulations, you've met the HDR-to-SDR problem, one of the most common and least explained video issues of the current era.",
      "Here's what's actually happening, and how to convert HDR footage so it looks right on ordinary displays.",
    ],
    sections: [
      {
        h: "What HDR actually changes",
        body: [
          "HDR video carries more brightness range and usually a wider color gamut (PQ/HLG transfer, BT.2020 colors). On an HDR-capable display, that's the spectacular version. On an SDR display without proper tone mapping, the player naively squeezes that extended range into the small one — and the result is the washed-out gray you've seen.",
          "Modern phones shoot HDR by default now, which is why this problem exploded: people film on an HDR device and share to an SDR world.",
        ],
      },
      {
        h: "Tone mapping: the honest conversion",
        body: [
          "Proper HDR-to-SDR conversion is tone mapping — selectively compressing highlights and re-deriving saturation so the image keeps its punch within SDR's smaller envelope. It's the difference between 'looks dim' and 'looks intentional'.",
          "The HDR to SDR converter on this site applies proper tone mapping locally — your footage goes in looking washed out and comes out looking like a well-graded SDR video.",
        ],
        list: [
          "Open the HDR to SDR converter.",
          "Drop in your HDR footage (iPhone HDR, HDR camera files, HDR downloads).",
          "Convert — tone mapping runs in your browser.",
          "Compare on an SDR screen: colors should read full, not pale.",
        ],
      },
      {
        h: "Should you just turn HDR off?",
        body: [
          "For footage you'll share widely, shooting SDR (or 'SDR default' in camera settings) sidesteps the entire problem — most viewers are still on SDR screens and social platforms handle HDR inconsistently. Keep HDR for the projects you control end to end, and convert to SDR for everything else.",
        ],
      },
    ],
    tips: [
      "iPhone shoots HDR by default — check camera settings before sharing-bound footage.",
      "Washed-out playback on old screens is HDR, not a broken file.",
      "Convert once, at the end of your workflow — tone map before editing and you grade on the wrong image.",
    ],
    faqs: [
      {
        q: "Does converting HDR to SDR lose quality?",
        a: "It trades the extended brightness range — which your target screens can't show anyway — for correct standard-range rendering. On SDR displays the converted file looks dramatically *better* than naive playback.",
      },
      {
        q: "How do I know if a file is HDR?",
        a: "A player's info panel (VLC: Codec Information) lists the transfer function — PQ/HLG/arib-std-b67 means HDR. Files from modern iPhones default to HDR more often than people realize.",
      },
    ],
  },
];

export function generateConverterPosts() {
  const posts = [];
  const seen = new Set();
  for (const f of FORMATS) {
    if (f.skip || seen.has(f.fromSlug)) continue;
    seen.add(f.fromSlug);
    posts.push(howtoPost(f));
    if (f.vsWorth) posts.push(vsPost(f));
  }
  // MP4 to WebM (the reverse direction)
  const webm = FORMATS.find((f) => f.fromSlug === "webm");
  posts.push({
    title: "MP4 to WebM: when the 'web' format is the right call",
    category: "converters",
    tags: ["webm", "mp4", "converter"],
    toolHref: "/mp4-to-webm-converter",
    intro: [
      "Everyone converts WebM to MP4 — the reverse direction is rarer and more interesting. WebM (VP9 + Opus) is royalty-free, web-native, and often smaller than H.264 MP4 at the same quality. For embedding video in your own site, it's genuinely worth considering.",
      "Here's when converting MP4 to WebM earns its keep, and what it costs you.",
    ],
    sections: [
      {
        h: "The case for WebM",
        body: [
          "Three real advantages: licensing (VP9 and Opus are patent-unencumbered — the reason open-source projects and Wikipedia standardized on WebM), efficiency (VP9 at the same quality typically undercuts H.264 by 20–40% in size), and web nativeness (every modern browser plays it in a <video> tag with zero fuss).",
          "For self-hosted website video, that combination is compelling: smaller files, no licensing anxiety, guaranteed playback in every current browser.",
        ],
      },
      {
        h: "The costs",
        body: [
          "Compatibility beyond the browser: phones' gallery players, TVs, and older editors are inconsistent with WebM. And encoding cost: VP9 is dramatically slower to encode than H.264 — expect the conversion to take noticeably longer.",
          `The quality side is fair, though: this is a true re-encode, and ${webm.codecNote.toLowerCase()}`,
        ],
      },
      {
        h: "How to convert",
        body: [
          "The MP4 to WebM converter runs locally, encoding to VP9 + Opus in your browser.",
        ],
        list: [
          "Open the MP4 to WebM converter.",
          "Drop in your MP4.",
          "Convert — VP9 encoding is slower than H.264; give it time.",
          "Embed with <code>&lt;video src=\"clip.webm\"&gt;</code> and enjoy the smaller file.",
        ],
      },
    ],
    tips: [
      "WebM's sweet spot is self-hosted web video — that's where its advantages compound.",
      "VP9 encoding is slow; batch convert overnight if you have a library.",
      "Serving both formats? Modern <video> lets you list MP4 as fallback after WebM.",
    ],
    faqs: [
      {
        q: "Is WebM smaller than MP4 at the same quality?",
        a: "Usually, by 20–40% — VP9 is simply a more efficient codec than H.264. AV1 (which WebM also holds) extends that lead further, at an even heavier encoding cost.",
      },
      {
        q: "Will WebM play on iPhones?",
        a: "In Safari, yes. In gallery players and third-party apps, support is inconsistent — for mobile sharing, MP4 remains the safe choice.",
      },
    ],
  });

  for (const a of AUDIO) posts.push(audioPost(a));
  posts.push(...PRESETS.map((p) => ({
    ...p,
    category: "formats",
    tags: [p.tag, "converter"],
    toolHref: `/${p.toolSlug}-converter`,
    sections: p.sections,
    tips: p.tips,
    faqs: p.faqs,
  })));
  return posts;
}
