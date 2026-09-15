/**
 * Handwritten evergreen guides — the formats/editing/tips backbone.
 * Topics selected from what actually earns traffic in this space:
 * format explainers, compression, social specs, HLS streams, privacy.
 */

export function generateCorePosts() {
  return [
    {
      title: "Containers vs codecs: the one video concept that explains everything",
      slugP: "container-vs-codec",
      category: "formats",
      tags: ["codecs", "containers", "basics"],
      intro: [
        "Half of all video confusion — 'why won't this play', 'why did converting wreck the quality', 'is MKV better than MP4' — dissolves once you learn one distinction: the container is not the codec.",
        "Ten minutes here will save you years of format guesswork. Here's the model, then what it explains.",
      ],
      sections: [
        {
          h: "The box and the stuff in the box",
          body: [
            "A container (MP4, MKV, MOV, WebM, AVI) is packaging: it holds one or more video streams, one or more audio streams, maybe subtitles and chapters, plus an index saying where everything starts. It determines the file extension and what players will even attempt to open it.",
            "A codec (H.264, HEVC, VP9, AV1 for video; AAC, MP3, Opus for audio) is the compression algorithm the streams inside are encoded with. It determines the quality-per-megabyte, the decoding horsepower needed, and — critically — whether a device can decode the file once the container is opened.",
          ],
        },
        {
          h: "Same box, different stuff",
          body: [
            "Two files named .mp4 can contain completely different codecs: one H.264 (plays on anything from the last 15 years), one AV1 (needs recent hardware or software decoding). The extension tells you nothing about what's inside — which is why 'it's an MP4, why won't it play?' is such a common and reasonable question with an unsatisfying answer.",
            "Conversely, the same codec can live in many boxes: H.264 sits happily inside MP4, MOV and MKV. That's why MOV-to-MP4 can be a lossless container swap — nothing inside changes, only the packaging.",
          ],
        },
        {
          h: "What this explains",
          body: [
            "'MKV vs MP4 quality': wrong question — both hold the same codecs. 'Converting ruined my video': you re-encoded when you could have remuxed. 'My TV plays some MP4s but not others': the codec inside differs, probably HEVC vs H.264. 'Audio desynced after converting': the audio codec or timing assumptions changed between containers.",
          ],
          list: [
            "Container = packaging. Codec = the compressed streams inside.",
            "The extension alone never tells you the codec.",
            "Remux = new container, same streams, zero loss.",
            "Re-encode = new streams, real but controllable quality cost.",
          ],
        },
        {
          h: "How to see what's inside your file",
          body: [
            "Any decent player will tell you: VLC's Codec Information panel (Ctrl+J) lists every stream and its codec. On the command line, ffprobe does the same in exhaustive detail. Thirty seconds of checking answers 'will this play on my TV' and 'can I remux or must I re-encode' definitively.",
          ],
        },
      ],
      tips: [
        "Check the codec with VLC (Ctrl+J) before blaming the extension.",
        "H.264 + AAC in MP4 is the 'plays everywhere' pair — default to it when unsure.",
        "If the codecs already match your target, you can remux losslessly instead of re-encoding.",
      ],
      faqs: [
        {
          q: "Which containers hold which codecs?",
          a: "MP4 officially holds H.264/H.265/AV1 + AAC/MP3; WebM holds VP8/VP9/AV1 + Opus/Vorbis; MKV holds essentially anything; MOV holds what QuickTime knows. In practice MKV's 'anything goes' design is why it's the archival favorite.",
        },
        {
          q: "Can a container change without quality loss?",
          a: "Yes — when both containers support the codecs inside, conversion is a remux: streams copied unchanged. This site's converters remux automatically when possible.",
        },
      ],
    },
    {
      title: "Remux vs re-encode: the conversion trick that loses nothing",
      slugP: "remux-vs-reencode",
      category: "formats",
      tags: ["remux", "codecs", "converter"],
      intro: [
        "There's a category of format conversion that finishes in seconds regardless of file length, uses almost no CPU, and loses literally zero quality. Most people don't know it exists, and pay for that ignorance in re-encoding time and generational loss.",
        "It's called remuxing, and knowing when it applies is the single most useful skill in day-to-day video conversion.",
      ],
      sections: [
        {
          h: "What remuxing is",
          body: [
            "Remuxing (re-multiplexing) means taking the video and audio streams out of one container and placing them, byte-for-byte unchanged, into another. Nothing is decoded or compressed. It's repacking a book in a different box — the book is untouched.",
            "Because no decoding happens, a remux runs at disk speed: a two-hour movie remuxes in seconds. And because the streams are copied bit-exact, quality loss is mathematically zero.",
          ],
        },
        {
          h: "When you can remux",
          body: [
            "The condition: both containers must support the codecs inside. MKV to MP4 with H.264 + AAC inside? Remux. MOV to MP4 from an iPhone? Usually remux (H.264/HEVC + AAC live happily in MP4). AVI with DivX to MP4? No — re-encode, because MP4 doesn't officially carry DivX.",
            "This is also why 'converting' between MKV and MP4 so often preserves quality perfectly: the codecs (H.264, HEVC, AAC) are common to both boxes. The containers differ; the content doesn't need to.",
          ],
        },
        {
          h: "What re-encoding costs",
          body: [
            "Re-encoding decodes every frame and re-compresses it with a new codec — real CPU work (minutes to hours, not seconds) and a genuine, if usually invisible, quality cost. Each generation of re-encoding compounds: an encode of an encode of an encode visibly degrades.",
            "The professional habit follows directly: re-encode only when the codec must change. When only the container must change, remux.",
          ],
          list: [
            "Container change, codecs compatible → remux (fast, lossless).",
            "Codec change needed → re-encode (slow, small loss).",
            "Editing, compressing, resizing → always re-encode, there's no way around it.",
          ],
        },
      ],
      tips: [
        "If a 'conversion' takes seconds on a long file, it was a remux — and that's a good thing.",
        "Keep one archival master and remux copies for specific devices; never re-encode the master.",
        "Avoid double conversions (AVI→MP4→WebM); go straight from source to target.",
      ],
      faqs: [
        {
          q: "How can I tell if a converter remuxed or re-encoded?",
          a: "Speed is the giveaway — remuxes finish at disk speed. Technically, compare codec names before and after (VLC Ctrl+J): unchanged codecs mean remux.",
        },
        {
          q: "Does remuxing change file size?",
          a: "Only slightly — container overhead differs a little (MKV and MP4 are both lean). A remux will never halve or double a file; a re-encode might.",
        },
      ],
    },
    {
      title: "That video you're watching isn't a file: HLS and M3U8 explained",
      slugP: "hls-m3u8-explained",
      category: "formats",
      tags: ["hls", "m3u8", "streaming", "basics"],
      intro: [
        "You press play on a web video, and your browser downloads… nothing you can save. No single file, no obvious URL — because modern streaming video isn't a file. It's hundreds of small segments stitched together on the fly, orchestrated by a text file called a manifest.",
        "This is HLS, and understanding it explains why 'save video as' fails on streaming sites, why quality auto-adjusts, and what a downloader actually does.",
      ],
      sections: [
        {
          h: "Manifests and segments",
          body: [
            "HLS (HTTP Live Streaming — Apple's design, now the web default) splits video into segments of a few seconds each. A manifest file (.m3u8 — a plain text playlist) lists the segments, and for adaptive streams, lists multiple renditions: the same video at several resolutions and bitrates.",
            "Your player fetches the manifest, chooses a rendition based on your screen and current bandwidth, downloads segments a few seconds ahead, and stitches them into a seamless buffer. That's 'a video playing'. From the network's perspective, there is no single video file to save.",
          ],
        },
        {
          h: "Why this design won",
          body: [
            "Segments make everything easy that a monolithic file makes hard: instant seeking (fetch only the segments you need), adaptive quality (switch renditions mid-stream without a pause), resilience (a dropped segment retries; a dropped download restarts), and CDN caching (small files cache efficiently at the edge).",
            "The cost is yours: right-clicking a stream saves nothing, because the 'video' only exists as a just-in-time assembly in memory.",
          ],
        },
        {
          h: "What downloading an HLS stream means",
          body: [
            "A downloader that handles HLS fetches every segment of a chosen rendition in order and concatenates them into a single file — typically an MP4 — with the original streams intact. If the segments are H.264/AAC (nearly always), this is effectively a giant remux: no quality lost, just reassembly.",
            "The same principle powers this site's browser-based converters: fetch segments over your normal connection, remux locally, hand you one clean file.",
          ],
        },
        {
          h: "The limits",
          body: [
            "Live HLS is different: segments appear in real time and the window rolls forward — there's nothing complete to fetch until the stream ends. And DRM-protected HLS (Netflix, Disney+, and friends) is encrypted on purpose; no legitimate tool touches it, and neither should anything you trust.",
          ],
        },
      ],
      tips: [
        "An .m3u8 URL is a playlist, not the video — downloading it alone gets you a text file.",
        "Master manifests list all renditions; pick the highest for archiving.",
        "Live streams can't be 'downloaded' — only recorded in real time or fetched as a VOD afterward.",
      ],
      faqs: [
        {
          q: "Can I turn an M3U8 stream into an MP4?",
          a: "Yes — for on-demand streams. The tool fetches all segments and remuxes them into a single MP4 with no quality loss. Live and DRM streams are the exceptions.",
        },
        {
          q: "Why does quality change while I watch?",
          a: "That's adaptive bitrate — the player switching renditions as your bandwidth moves. It's the feature HLS was designed around.",
        },
      ],
    },
    {
      title: "Can you download a live stream? The honest answer",
      slugP: "download-live-streams",
      category: "downloaders",
      tags: ["live", "streaming", "troubleshooting"],
      intro: [
        "A live broadcast is the one case where downloading genuinely cannot work in the way people hope — because there is nothing finished to download. The stream is being created in real time; you can't fetch the end of something that doesn't have an end yet.",
        "But there are real answers here: what's possible, what recording gets you, and why the VOD is usually the better target.",
      ],
      sections: [
        {
          h: "Why live streams resist downloading",
          body: [
            "A live HLS stream is a rolling window: segments are published seconds behind reality and old segments expire. A downloader arriving mid-stream can only see what currently exists — the beginning is already gone, the end doesn't exist. You can't download a file that is still being written by the event itself.",
            "Some platforms do write a full recording in parallel — that's the VOD (video on demand), and it appears minutes to hours after the stream ends.",
          ],
        },
        {
          h: "Option 1: wait for the VOD",
          body: [
            "This is almost always the right answer. The VOD is the complete, clean, purpose-encoded recording: starts at the beginning, no gaps, no capture artifacts, often at better quality than the live stream was serving. When a VOD exists (Twitch keeps VODs roughly two months before deleting them; most platforms keep event recordings indefinitely), downloading it after the fact beats any live capture.",
          ],
        },
        {
          h: "Option 2: record in real time",
          body: [
            "When no VOD will exist — one-off events, expiring broadcasts — real-time recording is the only option. That means capturing your screen (or the stream's playback) for the full duration at the full duration: a two-hour event takes two hours to capture. Quality matches what your connection streamed, not the source.",
            "The honest trade: recording always costs exactly the length of the event and never exceeds live-stream quality. It's the fallback, not the plan.",
          ],
        },
        {
          h: "What to do before the next event",
          body: [
            "Check whether the platform archives streams (most do), note the account's VOD settings (creators can disable them), and if the content matters and archiving is off — plan to record from the start, because joining late means the beginning is lost forever.",
          ],
        },
      ],
      tips: [
        "VOD first, recording second — the finished recording is always cleaner.",
        "Twitch deletes unhighlighted VODs after ~60 days; download what matters before then.",
        "Recording costs real time — start before the event, not partway through.",
      ],
      faqs: [
        {
          q: "Can a downloader capture the part of a stream that already passed?",
          a: "No. Expired live segments are gone from the CDN. Only the VOD, if one is written, contains the past.",
        },
        {
          q: "Is recording my screen the same quality as the stream?",
          a: "Close, but not identical — you're capturing the decoded playback on your display, including whatever rendition your connection was getting. The VOD's encode is typically better.",
        },
      ],
    },
    {
      title: "How to compress a video without wrecking it",
      slugP: "compress-video-without-losing-quality",
      category: "editing",
      tags: ["compression", "file size", "how-to"],
      toolHref: "/video-bitrate-converter",
      intro: [
        "The request comes in a hundred forms — 'this video is 2GB and email caps at 25MB', 'my storage is full of phone videos', 'the client can't open this' — but it's always the same job: make the file smaller without making it visibly worse.",
        "Compression done right is almost invisible. Compression done wrong looks like a crime scene. Here's how to land on the right side of that line.",
      ],
      sections: [
        {
          h: "Where file size actually comes from",
          body: [
            "Video size is bitrate × duration. Nothing else. Resolution and frame rate matter only through their effect on bitrate. So compression means one of three things: lower the bitrate, shrink the resolution so a lower bitrate still looks sharp, or move to a more efficient codec that needs fewer bits for the same picture.",
            "The efficiency ladder is the important fact: H.265/HEVC delivers the same quality as H.264 at roughly half the bits; AV1 roughly halves it again. A codec swap alone can quarter your file size — if your playback targets support the codec.",
          ],
        },
        {
          h: "The dial that matters: CRF",
          body: [
            "Modern encoders expose quality as CRF (constant rate factor) — a single number where lower means better and bigger. The practical sweet spots for H.264: CRF 18 is visually transparent for most content, CRF 23 is the standard balance, CRF 28 starts to show on close inspection. Each +6 roughly halves the bitrate.",
            "CRF-based compression lets the encoder spend bits where they're needed — busy, detailed scenes — and save them where they're not. That's why it beats a fixed bitrate for quality-per-byte, and why 'just lower the bitrate' is the blunt-instrument version.",
          ],
        },
        {
          h: "A compression workflow that works",
          body: [
            "For most people the sequence is: pick H.264 (or HEVC if your targets are recent devices), set CRF 23, keep the original resolution, and check the result. If it's still too big, CRF 26. Still too big and it's destined for a phone screen? Drop to 720p. Each step loses less than people fear if you take them in order.",
          ],
          list: [
            "Step 1: re-encode at CRF 23, same resolution — often a 50%+ cut with no visible change.",
            "Step 2: CRF 26–28 if needed — fine for sharing copies, not masters.",
            "Step 3: resolution drop to 720p — only for small-screen destinations.",
            "Keep the original if the video matters; compress the copy you send.",
          ],
        },
        {
          h: "What never to do",
          body: [
            "Never compress an already-compressed file again when you can re-compress from the source — generational loss compounds. Never upscale before compressing (you're spending bits inventing pixels). And never trust a tool that promises 'no quality loss' on a 90% size reduction — that's marketing, not physics.",
          ],
        },
      ],
      tips: [
        "CRF 18 transparent, 23 standard, 28 visibly compromised — remember three numbers.",
        "HEVC halves size vs H.264; AV1 halves it again — when playback allows.",
        "Test compression settings on a 30-second high-motion excerpt, not the whole video.",
        "Compress the delivery copy; keep the master untouched.",
      ],
      faqs: [
        {
          q: "How much smaller can a video get without visible loss?",
          a: "From a phone-camera original (which is encoded generously), 50–70% is routine with CRF 23. From an already-compressed download, expect far less headroom.",
        },
        {
          q: "Does lowering resolution always save space?",
          a: "It saves a lot, but a bitrate-starved 1080p often looks worse than a healthy 720p. If you must cut hard, cutting resolution with adequate bitrate beats keeping resolution with starved bitrate.",
        },
      ],
    },
    {
      title: "Video specs for every platform: the cheat sheet creators actually need",
      slugP: "social-media-video-specs",
      category: "editing",
      tags: ["social media", "specs", "upload"],
      intro: [
        "Every platform has opinions: aspect ratios, resolution caps, length limits, codec preferences. They change often enough that any printed cheat sheet is stale — so the durable knowledge is the *logic* behind the specs, plus the current defaults.",
        "Here's both: the reasoning that stays true, and the numbers as they stand now.",
      ],
      sections: [
        {
          h: "The logic underneath the specs",
          body: [
            "Almost every platform spec exists for one of three reasons: where the video plays (phone-first feeds want vertical 9:16; browsing feeds want 4:5 or 1:1 to occupy more screen), how long attention lasts (short-form surfaces cap length), and how much re-encoding the platform will do (upload generously above the platform's own bitrate so its re-encode starts from quality).",
            "The universal safe move: upload H.264 MP4, the highest resolution the platform accepts up to 1080p (4K only where explicitly welcomed), with clean audio at full loudness — every platform re-encodes, and a strong source survives it better.",
          ],
        },
        {
          h: "The current defaults",
          body: [
            "TikTok and Reels: 9:16, 1080x1920, up to 10 minutes (shorts up to 3). YouTube: 16:9 for standard (up to 4K/8K), 9:16 for Shorts. X/Twitter: 16:9 or 1:1, 1080p well received, clips up to ~2 minutes for standard posts. Instagram feed: 4:5 vertical wins screen space; 1:1 still fine. Facebook: 4:5 for feed, 9:16 for Reels. LinkedIn: 1:1 or 4:5 squares outperform landscape in-feed.",
            "Treat these as defaults, not laws — every platform publishes its own current spec pages, and those pages are the source of truth when a big upload matters.",
          ],
        },
        {
          h: "One video, every platform",
          body: [
            "The efficient workflow for multi-platform posting: edit a 16:9 master, then export platform crops from it — 9:16 and 4:5 versions with the subject centered so crops don't decapitate anyone. Doing this at export time (rather than re-editing per platform) keeps a multi-platform upload a 15-minute job.",
          ],
          list: [
            "Edit one master at the highest resolution you have.",
            "Export 16:9 (YouTube, X), 9:16 (Shorts/Reels/TikTok), 4:5 (Instagram/LI feed).",
            "Center subjects for the vertical crop — or deliberately frame for it while shooting.",
            "Keep exports above ~12 Mbps for 1080p sources so platform re-encodes start strong.",
          ],
        },
      ],
      tips: [
        "H.264 MP4 is accepted everywhere; don't get clever unless the platform asked.",
        "4:5 occupies ~40% more feed screen than 16:9 on phones — free reach.",
        "Check the platform's own spec page before a campaign-scale upload.",
        "Shoot with vertical crop in mind: subject center-frame.",
      ],
      faqs: [
        {
          q: "Should I upload 4K to social platforms?",
          a: "Where it's accepted and your connection allows: yes for YouTube (its VP9/AV1 transcodes start from the best source), cautiously elsewhere — most platforms deliver at 1080p anyway and the upload cost is real. For feed content, clean 1080p beats mangled 4K.",
        },
        {
          q: "Why does my video look worse after uploading than before?",
          a: "Every platform re-encodes your upload — that's unavoidable. The fix is headroom: upload at quality above the platform's delivery target so its re-encode starts from a strong source.",
        },
      ],
    },
    {
      title: "Video too big to send? Getting files under WhatsApp, email and Messenger limits",
      slugP: "video-too-big-to-send",
      category: "editing",
      tags: ["file size", "whatsapp", "email", "how-to"],
      toolHref: "/video-bitrate-converter",
      intro: [
        "The limits are the bane of sharing video: WhatsApp caps files at 2GB (but mangles quality well before that in practice), most email at 20–25MB, Discord at 10MB on free plans, and Messenger re-compresses whatever you send it. The video is 800MB. Now what?",
        "There are exactly four moves, and the right one depends on the recipient and how much quality matters.",
      ],
      sections: [
        {
          h: "Move 1: compress for messaging",
          body: [
            "For sending clips to be watched once on a phone, 720p at CRF 26–28 H.264 lands a typical phone video at 8–20MB per minute — small enough for email, well clear of messaging app mangling. Nobody watching on a phone screen notices the difference in a clip whose job is 'look at this'.",
            "The key is compressing with intent: a throwaway share can be crushed hard; family footage being archived should not. Compress the copy you send, keep the original you keep.",
          ],
        },
        {
          h: "Move 2: link instead of attach",
          body: [
            "When quality matters, don't push bytes through the messaging layer at all. Upload the file to a cloud drive and send a link. Email attachments were a 1990s solution; a link is weightless, works at any file size, and the recipient streams or downloads the pristine file.",
            "This is the answer for anything longer than a couple of minutes or anything the recipient will keep.",
          ],
        },
        {
          h: "Move 3: trim what you actually need",
          body: [
            "The most underrated compression is temporal: send the 40 seconds that matter, not the 6 minutes around them. Trimming to the relevant segment often cuts more size than any encoder setting, with literally zero quality loss on what remains.",
          ],
        },
        {
          h: "Move 4: drop resolution only as the last resort",
          body: [
            "480p is the floor for watchable phone playback — below that, text in the video becomes unreadable. If you've compressed, trimmed, and the file still doesn't fit, the honest conclusion is that this channel isn't right for this video: send a link instead of destroying the footage.",
          ],
        },
      ],
      tips: [
        "720p + CRF 26 covers 90% of 'send this clip' needs.",
        "Links for keepers, attachments for throwaways.",
        "Trimming beats encoding — zero loss, often bigger savings.",
        "480p is the quality floor; go lower and text dissolves.",
      ],
      faqs: [
        {
          q: "What size should I target for WhatsApp?",
          a: "Stay under ~16–64MB and WhatsApp passes it through largely intact; beyond that it forces its own heavy recompression. For longer content, send a link.",
        },
        {
          q: "Does zipping a video make it smaller?",
          a: " Barely — video is already compressed, and zip finds almost nothing left to squeeze. Expect 1–5%. Compressing the video itself is the real move.",
        },
      ],
    },
    {
      title: "GIF vs MP4: stop making 40MB GIFs",
      slugP: "gif-vs-mp4",
      category: "editing",
      tags: ["gif", "mp4", "how-to"],
      toolHref: "/video-to-gif-converter",
      intro: [
        "The crime scene is familiar: a 6-second looping clip as a 40MB GIF, loading like it's 2009, eating mobile data for breakfast. The GIF format is from 1987, and it shows — no video compression at all, just 256-color frames stacked in a file.",
        "Here's why GIFs get so enormous, when a GIF is still the right answer, and how to make ones that don't embarrass themselves.",
      ],
      sections: [
        {
          h: "Why GIFs are so heavy",
          body: [
            "GIF has no inter-frame compression — every frame is a complete standalone image, unlike video codecs where most frames are stored as changes from the previous one. A 6-second, 480px, 15fps GIF routinely outweighs a 1080p MP4 of the same clip. It's not that your tool made a bad GIF; it's that GIF is a terrible video format.",
            "Add the 256-color limit and you get the other classic GIF symptom: banding and speckle on gradients — skin tones and skies posterize because the palette can't describe them.",
          ],
        },
        {
          h: "When GIF still wins",
          body: [
            "Two genuine niches remain: places that only accept images (some forums, some chat surfaces, email bodies — no video embeds allowed), and the autoplay-loop-with-no-sound aesthetic that GIFs guarantee everywhere with zero player UI.",
            "Everywhere else — social platforms, docs, READMEs, chat apps with video stickers — a muted, looping MP4 or WebM is the modern equivalent at a tenth the size, and every major platform natively loops muted autoplay video for exactly this reason.",
          ],
        },
        {
          h: "Making acceptable GIFs",
          body: [
            "When a GIF is required, the size levers are brutal but simple: dimensions (480px wide is the polite ceiling; 320 for chat), frame rate (15fps reads fine for loops; 10 for slow content), and length (under 6 seconds ideally). Together they take a monster to a civilized 3–8MB.",
          ],
          list: [
            "Trim to the exact loop — shorter loop, smaller file, better gag.",
            "Scale to 480px (or 320 for chat).",
            "Dither to 15fps.",
            "Check file size; over ~8MB means re-cutting, not sending.",
          ],
        },
        {
          h: "The MP4 route",
          body: [
            "For everything else: convert the clip to a muted, looping MP4 at the same dimensions — typically 5–10% of the GIF's size with dramatically better color. The video-to-GIF converter on this site handles both directions locally in your browser.",
          ],
        },
      ],
      tips: [
        "A 40MB GIF and a 4MB MP4 of the same clip look identical in a feed — pick the MP4.",
        "480px / 15fps / <6s is the polite GIF formula.",
        "Gradients and skin tones are where the 256-color palette betrays you first.",
      ],
      faqs: [
        {
          q: "Why do platforms convert my GIFs to video?",
          a: "Because they're sane: WhatsApp, X, Discord and others auto-convert GIFs to muted MP4 on upload to save their own bandwidth. Your GIF is often already a video by the time anyone sees it.",
        },
        {
          q: "Does a GIF loop better than a video?",
          a: "Players can loop muted video seamlessly too — the perceived advantage is habit and universal image support, not the format's looping mechanics.",
        },
      ],
    },
    {
      title: "From SD to 4K: how video resolutions actually evolved",
      slugP: "resolution-evolution",
      category: "formats",
      tags: ["resolution", "history", "4k"],
      intro: [
        "Standard Definition, 720x480 pixels, was the consumer baseline for half a century — from the 1940s to the 2000s. Today a phone in your pocket shoots 4K, 3840x2160, more than eight times the pixels. How did we get here, and what did each step actually buy?",
        "The history matters because it explains today's practical choices: why 1080p remains the workhorse, why 4K's value depends on screen size and distance, and why more pixels stopped being the whole story.",
      ],
      sections: [
        {
          h: "The SD era (480i/576i)",
          body: [
            "SD's 480 (NTSC) or 576 (PAL) lines were an analog broadcast compromise locked in mid-century and kept by inertia: CRTs couldn't do better, broadcast spectrum couldn't carry more, and nobody had a screen big enough to want it. DVDs carried SD digitally in the late 90s — same resolution, cleaner signal.",
            "Which is why your family's DVD-era footage caps at 480 lines no matter what you do with it — the detail above that was never captured.",
          ],
        },
        {
          h: "HD and Full HD (720p/1080p)",
          body: [
            "Flat panels forced the issue: LCDs are fixed-pixel devices, and the industry settled a ladder — 1280x720 (HD) then 1920x1080 (Full HD), with the 'p' (progressive scan) replacing interlacing's alternating fields. Blu-ray and HD broadcast made 1080p the 2000s' destination; YouTube and then phones made it universal.",
            "1080p turned out to be a long-lived sweet spot: at typical couch distance on typical TVs, more pixels stopped being visibly 'more' — a fact that kept 1080p alive long past its predicted obsolescence.",
          ],
        },
        {
          h: "4K and beyond",
          body: [
            "4K (3840x2160) quadruples 1080p's pixels — the name refers to the ~4000 horizontal pixels. Its visible benefit scales with screen size and viewing distance: dramatic on a 65-inch panel at two meters, negligible on a 21-inch monitor at arm's length. 8K exists in the spec sheets and almost nowhere in living rooms.",
            "The quieter revolution ran alongside: per-pixel quality. Modern 1080p from a good encoder with adequate bitrate looks far better than early-YouTube 1080p ever did — HDR, wide color gamut and efficient codecs (HEVC, AV1) now move perceived quality more than raw pixel count does.",
          ],
        },
        {
          h: "What this means for your files",
          body: [
            "Practical conclusions: convert upward never (upscaling invents pixels; the ceiling is the source), keep resolution at or below the native capture, and spend your quality budget on bitrate and codec before spending it on pixels. A well-fed 1080p beats a starved 4K every time it's actually watched.",
          ],
        },
      ],
      tips: [
        "Never upscale to 'improve' footage — you can't add detail that wasn't captured.",
        "Viewing distance decides whether 4K is visible: big screen, close couch or it isn't.",
        "Bitrate and HDR move perceived quality more than extra pixels do.",
      ],
      faqs: [
        {
          q: "Can I convert old SD footage to HD?",
          a: "You can resize it, but you can't restore detail that was never captured. Proper upscalers smooth and sharpen convincingly at a distance, but the honest description is 'a bigger copy of the same information'.",
        },
        {
          q: "Is 4K worth it for social uploads?",
          a: "Rarely — most feeds deliver 1080p and re-encode hard. 4K pays on YouTube specifically, where higher-resolution sources trigger better transcodes.",
        },
      ],
    },
    {
      title: "Aspect ratios explained: 16:9, 9:16, 1:1, 4:5 and when each wins",
      slugP: "aspect-ratios-explained",
      category: "editing",
      tags: ["aspect ratio", "social media", "specs"],
      intro: [
        "Aspect ratio — width to height — decides how your video occupies a screen before a single pixel of quality matters. A 16:9 video in a 9:16 feed sits in a letterboxed puddle; a 9:16 video on YouTube wastes two thirds of the frame. The ratio is the first format decision, and most people make it by accident.",
        "Here's what each common ratio is for, and the crop logic that gets one video onto every surface.",
      ],
      sections: [
        {
          h: "The four that matter",
          body: [
            "16:9 (widescreen) is the video default: YouTube, TVs, streaming, screen recordings. 9:16 (vertical) owns the phone-first surfaces: Shorts, Reels, TikTok, Stories. 1:1 (square) is the neutral all-rounder that occupies equal space in any feed. 4:5 (portrait) is Instagram and LinkedIn's feed favorite — vertical screen occupation without full-phone height.",
            "The feed economics are the point: on a phone in portrait (which is how feeds are scrolled), a 4:5 video occupies roughly 40% more screen than 16:9 — free attention for a crop decision.",
          ],
        },
        {
          h: "Cropping without decapitation",
          body: [
            "Converting between ratios means deciding what fills the new frame. Center-crop is the default and the trap: heads live in the top third, and a naive 16:9→9:16 center crop removes them. The professional habit is shooting center-framed (or with crop in mind), so the vertical extraction keeps the subject intact.",
            "For existing footage where the subject strays from center, a conscious pan-crop — letting the crop window track the subject across the video — beats both static options. It's more work; it's the difference between a crop that looks intentional and one that looks like an accident.",
          ],
        },
        {
          h: "Letterbox, pillarbox, or crop",
          body: [
            "When you don't crop, you pad: letterboxing adds bars above/below (a tall video in a wide frame), pillarboxing adds bars left/right (a wide video in a tall frame). Padding preserves everything but reads as 'old TV show on YouTube'; cropping fills the frame but throws away the edges. Neither is wrong — but a deliberate choice beats a default.",
          ],
        },
      ],
      tips: [
        "Shoot 16:9 with the subject center-framed and vertical crops come free.",
        "4:5 beats 16:9 for feed reach on phones — the same content, more screen.",
        "Blur-fill (a blurred copy as background behind a centered video) is the polished version of padding.",
      ],
      faqs: [
        {
          q: "What ratio should my default upload be?",
          a: "One master per surface: 16:9 for YouTube and web, 9:16 for the vertical surfaces, 4:5 for feed posts. The exports are cheap; the reach difference isn't.",
        },
        {
          q: "Can I convert 9:16 to 16:9 without losing the subject?",
          a: "Yes — blur-fill background with the full vertical video centered, or pan-crop to track the subject. Straight pillarbox also works and is the most neutral choice.",
        },
      ],
    },
    {
      title: "Why upload-based converter sites make us nervous (and what local processing fixes)",
      slugP: "why-local-processing",
      category: "tips",
      tags: ["privacy", "local processing", "security"],
      intro: [
        "The typical online converter workflow: select your file, watch a progress bar, and — somewhere in the middle of that — your family video, your unreleased demo, your client footage gets uploaded to somebody else's server. You have no idea where it goes after that.",
        "This site was built on a different premise: conversion that happens entirely in your browser, where your file never leaves your device. Here's why that distinction matters more than most people realize.",
      ],
      sections: [
        {
          h: "What actually happens on an upload-based converter",
          body: [
            "The file transfers to a server, gets converted there, and returns. In between: it exists on someone else's disk, in someone else's jurisdiction, under someone else's retention policy. Reputable services delete quickly; disreputable ones keep everything. You can't tell them apart from the landing page.",
            "The risks are concrete rather than theoretical: private footage on third-party infrastructure, files intercepted or retained, and — the classic of the genre — converter sites bundled with deceptive download buttons and ad networks that range from annoying to malicious.",
          ],
        },
        {
          h: "What local processing changes",
          body: [
            "Modern browsers can decode and encode video at near-native speed (WebCodecs API, with WebAssembly FFmpeg as the workhorse fallback). That makes 'your file never leaves your device' a technical reality rather than a slogan: the converter runs in the tab, reads your file locally, and writes the result locally. Nothing is uploaded because there's no server involved at all.",
            "The properties that follow: no size caps beyond your own memory (servers impose them per-user), no queue during peak hours, works offline once loaded, and no retention policy to trust because nothing was retained.",
          ],
        },
        {
          h: "The tradeoffs, honestly",
          body: [
            "Local processing uses your CPU, not a datacenter's: heavy conversions run slower on old hardware than on a beefy server, and battery-powered devices feel it. Browser sandboxes also cap memory for enormous files, so a 3-hour 4K remux is comfortable but a 3-hour 4K HEVC re-encode may push a phone's limits.",
            "For files up to a couple of gigabytes — which is nearly everything people actually convert — local wins on every axis that matters: privacy, speed (no upload round-trip), availability, and cost.",
          ],
        },
        {
          h: "How to tell which kind of tool you're using",
          body: [
            "The tell is in the network: open your browser's DevTools, watch the Network tab during a conversion, and see whether your file streams out to a server. Upload-based tools show a steady outbound transfer the whole time; local tools show nothing but page assets. Any converter can be vetted this way in thirty seconds.",
          ],
        },
      ],
      tips: [
        "DevTools Network tab is the lie detector: outbound file transfer = upload-based.",
        "Sensitive or unreleased footage should never touch a converter that uploads.",
        "Local converters keep working offline — a surprisingly useful property on planes and trains.",
      ],
      faqs: [
        {
          q: "Is browser-based conversion as good as server-based?",
          a: "For the codecs and operations that matter daily — H.264, HEVC, VP9, remuxing, trimming, resizing — yes: the same encoders run, compiled for the browser. Very long 4K re-encodes are where local hardware shows its limits.",
        },
        {
          q: "Does 'no upload' mean the site can't see anything about me?",
          a: "Your file, its name and its contents stay local. Standard page analytics (a page was loaded) is the normal footprint of any website.",
        },
      ],
    },
    {
      title: "Video copyright for normal people: a plain-language guide",
      slugP: "video-copyright-basics",
      category: "tips",
      tags: ["copyright", "ethics", "rules"],
      intro: [
        "Copyright makes people anxious because the law is technical and the internet is full of confident wrong answers. But for everyday downloading and converting, the practical rules fit on an index card.",
        "This is plain language, not legal advice — but it's calibrated to how enforcement actually works, not to fear or folklore.",
      ],
      sections: [
        {
          h: "The default rule",
          body: [
            "The moment someone creates a video, it's copyrighted — automatically, no registration, no © symbol needed. Their rights cover copying, distributing, and publicly performing the work. Everything else — fair use, platform norms, personal copies — is an exception or a tolerance layered on top of that default.",
            "What this means practically: downloading a public video isn't automatically a legal event the way people fear, but *republishing* someone's video without permission is squarely what copyright exists to prevent.",
          ],
        },
        {
          h: "The personal-use zone",
          body: [
            "Saving a public video to watch offline later, keeping a reference copy of a tutorial, showing a clip to a friend over dinner — these are the low-risk personal-use cases that essentially every downloader's real traffic consists of. You're not distributing; you're time-shifting and space-shifting a copy for yourself.",
            "Platform terms of service are a separate layer: many reserve downloads to their own offline features. Violating terms risks your account with that platform — a takedown or a strike — rather than a lawsuit. Real-world stakes, but different stakes.",
          ],
        },
        {
          h: "The clear lines",
          body: [
            "Where genuine risk lives: re-uploading someone's video as your own, monetizing their work, editing it into your projects without permission, stripping watermarks to hide the source, or redistributing paid/subscription content. These are the uses that get channels struck, accounts banned, and occasionally people sued.",
          ],
          list: [
            "Safe default: personal offline copies of public content.",
            "Permission needed: reposting, remixing, monetized use, anything public-facing.",
            "Never: passing someone's work off as your own.",
            "Licensed content (Creative Commons, public domain) carries its reuse permissions stated up front.",
          ],
        },
        {
          h: "Asking, and getting yes",
          body: [
            "The route almost nobody takes is the one that works: ask the creator. 'Can I use 10 seconds of your clip with credit in my video?' is a message most creators answer within days, and a yes in writing resolves every ambiguity. Crediting without asking is courtesy; permission plus credit is correctness.",
          ],
        },
      ],
      tips: [
        "Permission in writing beats every legal theory — ask the creator.",
        "Look for Creative Commons or public-domain licensing before assuming the answer is no.",
        "Credit is courtesy, not a license; it doesn't substitute for asking.",
        "Your own footage is always yours — including anything you download back for reuse.",
      ],
      faqs: [
        {
          q: "Is downloading a video for offline viewing illegal?",
          a: "Personal offline copies of public content sit in the lowest-risk practical category. The real enforcement weight lands on redistribution and commercial reuse without permission.",
        },
        {
          q: "What is fair use, exactly?",
          a: "A US legal defense (other countries have analogues like fair dealing) evaluated case-by-case: transformative purpose, amount used, market effect. It protects commentary, criticism, parody and analysis — it is not a blanket license to repost things you like.",
        },
      ],
    },
    {
      title: "How to organize a video library you'll still understand in five years",
      slugP: "organize-video-library",
      category: "tips",
      tags: ["organization", "workflow", "storage"],
      intro: [
        "Every video hoarder's library converges on the same end state: a folder named 'New folder (3)' containing 'VID_20260814_203911.mp4', 'video_final_v2_REAL.mp4', and 47 clips whose origin is a mystery. Future you inherits the mess.",
        "Organizing video isn't about being tidy — it's about being able to find the clip when it matters. Here's a system that survives contact with real life.",
      ],
      sections: [
        {
          h: "Filename conventions that pay rent",
          body: [
            "The filename is the only metadata guaranteed to travel with the file — through every copy, upload and app. A working convention: DATE_SOURCE_DESCRIPTION. '2026-08-14_ireland-cliffs-sunset.mp4' finds itself five years from now; 'video(12).mp4' never will.",
            "ISO dates (2026-08-14) sort chronologically as plain text, which is the quiet superpower: any file browser becomes a timeline. Avoid spaces and exotic characters — command-line tools and scripts handle clean names without friction.",
          ],
        },
        {
          h: "Folder structure: event-shaped, not format-shaped",
          body: [
            "Organizing by format ('all MP4s here') mirrors nothing about how you look for video. People search by event and subject: '2026/08-ireland/', 'family/mum-birthday/'. Event-shaped folders with dates keep themselves sorted as time passes, and originals/edits subfolders keep masters from being overwritten accidentally.",
          ],
          list: [
            "YYYY/MM-event/ as the backbone.",
            "originals/ for camera files and downloads — treated as read-only.",
            "edits/ for working copies; exports/ for final outputs.",
            "A loose 'inbox' folder for unsorted arrivals, triaged weekly.",
          ],
        },
        {
          h: "Metadata and tags",
          body: [
            "Filename and folders carry you most of the way; for serious libraries, player and DAM tools can read embedded metadata. Video metadata (title, creation date, comments) survives inside the file itself — though note that some conversions strip it. For anything professional-grade, an external catalog (a spreadsheet or a tool designed for media) outlives any single file's metadata.",
          ],
        },
        {
          h: "Deduplication and formats",
          body: [
            "Libraries accumulate duplicates: the same video saved twice under different names, or a downloaded file and its converted copy. Duplicate-finders that hash file contents (not names) catch the sneaky ones. And converting stray formats toward a house standard (H.264 MP4 for working copies) reduces the 'why won't this open' archaeology later — keep exotic originals, but normalize the copies you actually use.",
          ],
        },
      ],
      tips: [
        "DATE_SOURCE_DESCRIPTION in every filename — the convention that pays forever.",
        "ISO dates sort as text; use them and every browser becomes a timeline.",
        "Treat originals/ as read-only; edit copies, never masters.",
        "Hash-based duplicate finders catch renamed copies that name-matching never will.",
      ],
      faqs: [
        {
          q: "Should I rename camera files (IMG_1234 etc.)?",
          a: "Rename copies, keep originals untouched — the original cryptic name is the camera's receipt. 'VID_203911_edited.mp4' preserves the traceability while being findable.",
        },
        {
          q: "Do conversions lose my metadata?",
          a: "Some do — container remuxes usually keep it, re-encodes sometimes strip it. If metadata matters (professional libraries), verify after converting or keep metadata in an external catalog.",
        },
      ],
    },
    {
      title: "Why won't this video play? A field guide to playback errors",
      slugP: "video-wont-play",
      category: "editing",
      tags: ["troubleshooting", "codecs", "playback"],
      intro: [
        "'Error: codec not supported.' A file that plays sound but no picture. A video that works on your laptop and refuses on your phone. Playback failure is the most common video problem there is, and almost every case traces back to one of five causes.",
        "Here's the diagnostic checklist, in order of likelihood.",
      ],
      sections: [
        {
          h: "Cause 1: the codec isn't supported",
          body: [
            "The container opens fine — the player knows it's an MP4 — but the stream inside is a codec it can't decode (HEVC on an old Android, AV1 on anything pre-2020, DV in pro footage). The tell: sound plays with a black screen (the audio codec is fine, the video one isn't), or a specific 'codec' error message.",
            "Fix: convert the file's video stream to H.264 — the universal safe codec — keeping resolution and audio unchanged. This is a re-encode, but a worthwhile one: the file becomes playable everywhere.",
          ],
        },
        {
          h: "Cause 2: the container isn't supported",
          body: [
            "Some players and platforms simply refuse certain extensions: iOS gallery players ignore MKV regardless of what's inside; some web tools only accept MP4/MOV. The tell: an immediate rejection or 'format not supported' before playback even attempts — and the same codecs playing fine from a different container.",
            "Fix: remux to MP4 — a container swap with zero quality loss, since the streams don't change.",
          ],
        },
        {
          h: "Cause 3: broken index or truncated file",
          body: [
            "A download that didn't finish or a file cut mid-write has a damaged index — the map that tells players where streams start. The tell: the video plays from the middle but can't seek, plays zero seconds and stops, or only a repair tool opens it.",
            "Fix: remux through a converter or 'rebuild index' in a player like VLC (it offers this when it detects the problem). If the file is truncated mid-stream, some content is simply gone.",
          ],
        },
        {
          h: "Causes 4 and 5: DRM and bandwidth",
          body: [
            "DRM-protected files (iTunes purchases of the DRM era, streaming-service downloads) refuse to play outside their authorized app by design — no conversion is legitimate there. And HLS streams that stall and rebuffer are bandwidth or rendition issues, not file problems: lower the quality or fix the connection.",
          ],
        },
      ],
      tips: [
        "Audio-with-black-screen = unsupported video codec. Convert the video stream to H.264.",
        "Instant rejection = unsupported container. Remux to MP4, losslessly.",
        "Can't seek / stops early = broken index. Remux or rebuild the index.",
        "VLC plays almost anything — a great diagnostic player even if it's not your daily one.",
      ],
      faqs: [
        {
          q: "Why does my phone play some MP4s but not others?",
          a: "The extensions match but the codecs inside differ — commonly HEVC or AV1 in the failures and H.264 in the successes. Check with a player's codec info panel and convert the offenders's video stream.",
        },
        {
          q: "Is there a codec pack that fixes everything?",
          a: "On desktop, VLC (or mpv) is the honest answer — a player with everything built in. On phones and TVs you can't install codecs; converting the file to H.264/AAC in MP4 is the actual fix.",
        },
      ],
    },
    {
      title: "Repurposing video content across platforms (without doing it badly)",
      slugP: "repurposing-content",
      category: "tips",
      tags: ["workflow", "social media", "repurposing"],
      intro: [
        "One piece of content, five platforms, five formats — repurposing is how creators get leverage, and also how they produce the awkward 'landscape video shoved into a vertical frame with two giant bars' posts everyone scrolls past.",
        "The difference between good and bad repurposing is about ten decisions, most of them made once and reused forever. Here's the playbook.",
      ],
      sections: [
        {
          h: "Start from the platform's native language",
          body: [
            "A native post looks like it was made for the surface it's on: 9:16 full-screen with burned captions for Reels/TikTok/Shorts, 16:9 with strong title framing for YouTube, 4:5 with a hook line for feeds. Repurposing is translation, not forwarding — each platform's version should feel native, not adapted.",
          ],
        },
        {
          h: "The one-master workflow",
          body: [
            "Edit a master at the highest resolution, cut for the long-form version first (YouTube/website), then derive: the strongest 30–60 seconds become the vertical short; three key moments become feed clips; the audio track alone becomes the podcast/clip segment. Deriving beats re-editing — the work compounds instead of repeating.",
          ],
          list: [
            "Master edit (16:9) at full quality — the source of truth.",
            "Vertical cut: best 30–60s, 9:16, captions burned in.",
            "Feed cuts: 3 key moments as 4:5/1:1 clips.",
            "Audio-only export for podcast platforms where relevant.",
          ],
        },
        {
          h: "Captions are not optional",
          body: [
            "The majority of vertical-feed video is watched muted — autoplay is silent by convention. Uncaptioned repurposed video is functionally invisible: well-formatted captions (readable size, safe margins, short lines) routinely double completion rates. Every serious repurposing workflow burns or embeds captions on the vertical versions.",
          ],
        },
        {
          h: "Converting between the versions",
          body: [
            "The technical steps — aspect crops, resolution normalization, frame-rate alignment, muted looping exports — are exactly what browser converters handle: crop the master's export to 9:16, normalize to 1080x1920, keep the platform-friendly H.264 MP4. Do it at export time from the master so every derived version starts from full quality, not from a compressed previous generation.",
          ],
        },
      ],
      tips: [
        "Translate, don't forward — each platform's version should feel native.",
        "Derive from one master; never re-edit from a compressed copy.",
        "Burn captions on vertical versions; muted autoplay is the norm.",
        "Check each platform's current specs before a big multi-post push.",
      ],
      faqs: [
        {
          q: "Should I post the same video everywhere at once?",
          a: "Adapted versions of the same content, yes — audiences barely overlap across platforms. Identical files, no: the platform-native version outperforms the lazy forward every time.",
        },
        {
          q: "What's the minimum viable repurposing setup?",
          a: "A 16:9 master, one 9:16 cut with captions, and one 4:5 feed clip covers the surfaces that matter for most creators. That's ten extra minutes of export time.",
        },
      ],
    },
    {
      title: "Choosing the right video downloader in 2026: online, desktop, extension or CLI",
      slugP: "choosing-a-video-downloader",
      category: "tips",
      tags: ["tools", "comparison", "downloader"],
      intro: [
        "Every shape of downloader has real strengths and real failure modes, and the honest answer to 'which is best' is 'which for what'. Here's the state of the field in 2026, category by category, without the affiliate-ranking theater.",
      ],
      sections: [
        {
          h: "Online (paste-a-link) downloaders",
          body: [
            "The convenience champion: no install, works from any device, handles the common platforms instantly. The honest weaknesses: you're trusting an anonymous web service (some are excellent and privacy-respecting; some are ad-farms with dark patterns — vet before pasting links to anything sensitive), feature depth is limited for niche sites, and free tiers sometimes cap quality or length.",
            "Best fit: everyday public-video saving where the convenience of 'works everywhere right now' outweighs everything else.",
          ],
        },
        {
          h: "Desktop apps",
          body: [
            "The power tier: batch queues, playlist handling, subscription-style watching of channels, format selection per download, and no browser limits. The costs: installation and updates, licenses for the good ones, and the general property of desktop software — you're running a program you have to trust on your whole machine.",
            "Best fit: high-volume workflows — archiving channels, research libraries, production pipelines.",
          ],
        },
        {
          h: "Browser extensions",
          body: [
            "The frictionless tier: a button lights up on any page with video, one click saves. The honest risks are structural: extensions see every page you visit, the well-maintained ones periodically vanish from stores during policy sweeps, and several popular ones have quietly proxied URLs through analytics endpoints.",
            "Best fit: frequent casual saving by people who read what permissions the extension actually requests.",
          ],
        },
        {
          h: "CLI tools (the yt-dlp world)",
          body: [
            "The ceiling: the open-source command-line tools support more sites, expose more format control, and update faster than every GUI layered on top of them. The cost is the interface — commands and flags rather than buttons — and the responsibility of staying within sites' terms and applicable law.",
            "Best fit: technical users, automation, and scripted workflows. For everyone else, a well-built web tool with the same capability (and none of the command line) covers 95% of real needs.",
          ],
        },
      ],
      tips: [
        "Match the tool to the volume: casual saving → web tool; archiving → desktop or CLI.",
        "Vet any online tool before pasting links to sensitive or private-adjacent content.",
        "Read an extension's permissions before installing — 'read and change all sites' is the norm, and it matters.",
        "Whatever you use, the copyright rules don't change with the tool.",
      ],
      faqs: [
        {
          q: "Are online downloaders safe?",
          a: "The good ones are; the bad ones are ad-farms. Signals of quality: no login demanded, no bundled 'download buttons' pointing at executables, clear privacy policy, and local processing claims you can verify in DevTools.",
        },
        {
          q: "Why did my favorite downloader stop working?",
          a: "Platforms change their internals constantly and tools chase them — an extension pulled from a store or a site that stopped resolving is routine. Tools with active maintenance survive; abandoned ones don't.",
        },
      ],
    },
    {
      title: "Backing up video footage: strategies that survive hard drive death",
      slugP: "video-backup-strategies",
      category: "tips",
      tags: ["backup", "storage", "workflow"],
      intro: [
        "Hard drives die at the worst moment; phones get lost; cloud accounts get locked. Video is the least reproducible data most people own — you can re-download software, but you cannot re-film a childhood — and it deserves a strategy with actual redundancy.",
        "The good news: a solid video backup system is simpler than it sounds, because it's mostly about following one rule consistently.",
      ],
      sections: [
        {
          h: "The 3-2-1 rule, video edition",
          body: [
            "The industry standard: 3 copies of anything you can't lose, on 2 different kinds of media, with 1 copy off-site. For video, a working translation: the working drive, a backup drive that mirrors it, and cloud storage (or a drive at another location) for the irreplaceable tier.",
            "The tiering is what makes it affordable: not everything needs 3 copies. The full camera archive? Working + backup drive. The curated 'actually precious' subset — the best clips, the milestone events — adds the off-site copy. Storage costs scale with importance instead of with bulk.",
          ],
        },
        {
          h: "What 'backup' isn't",
          body: [
            "A copy on the same drive isn't a backup. A sync service that mirrors deletions isn't a backup (delete on your phone, and it's gone in the cloud too — true backup keeps versions). And 'I'll upload it to [platform] someday' is not a backup: platforms re-compress everything they touch, and accounts are not archives.",
            "The test that matters: if your primary device died right now, what would you actually recover, at what quality, in how long? Anything you'd have to re-download from a social platform comes back compressed — an original-quality file that exists only on a dead drive is gone at full quality forever.",
          ],
        },
        {
          h: "Checksums and verification",
          body: [
            "Backups silently rot: bit rot is real, drives corrupt quietly, and a backup you've never verified is a hope, not a plan. Hash-based verification (tools generating checksums per file) tells you when a copy diverges from its master — run it after first copying to a new drive, and periodically for archives that matter.",
          ],
          list: [
            "Tier your footage: everything gets 2 copies, precious gets 3.",
            "Keep one precious-tier copy off-site or in cloud storage.",
            "Verify backups with checksums, not by spot-checking a thumbnail.",
            "Re-check the archive yearly — drives and formats both age.",
          ],
        },
      ],
      tips: [
        "Tier importance and pay for redundancy only where loss is unacceptable.",
        "Sync ≠ backup — sync replicates your deletions.",
        "Never treat a social platform as the archive of your only original-quality copy.",
        "Check your backups by restoring from them occasionally; that's the only real test.",
      ],
      faqs: [
        {
          q: "How much storage does proper video backup need?",
          a: "Roughly 2–2.5× your library size, concentrated where it matters: full-tier footage gets 2 copies, precious-tier gets 3. A 1TB camera archive wants ~2TB of backup space, with ~200GB of highlights also in the cloud.",
        },
        {
          q: "Are cloud services a good video backup?",
          a: "For the precious tier, yes — off-site is the property they add. For multi-TB raw archives, the economics get painful, which is exactly why tiering exists: originals on drives, highlights in the cloud.",
        },
      ],
    },
    {
      title: "Video metadata 101: what your files know about you",
      slugP: "video-metadata-101",
      category: "tips",
      tags: ["metadata", "privacy", "basics"],
      intro: [
        "Every video file carries a second, invisible payload: metadata — creation date, device, camera settings, sometimes GPS coordinates of where filming happened. It's useful for organizing your own library and a genuine privacy consideration when sharing files with anyone.",
        "Here's what's inside, when it matters, and what to do about it.",
      ],
      sections: [
        {
          h: "What's actually in there",
          body: [
            "Typical payload: creation and modification timestamps, recording device and model, resolution/frame-rate/codec details, duration, and — on phones with location services — GPS coordinates accurate to meters. Editors add more: project names, edit histories, sometimes usernames of the machine that exported the file.",
            "For organizing, this is gold: sort by real capture date rather than file-copy date, group by device, auto-tag by location. For sharing, it's a leak: 'here's my cat' with coordinates of your house attached.",
          ],
        },
        {
          h: "When metadata leaks matter",
          body: [
            "The scenarios that bite: sharing footage with strangers or semi-strangers (marketplaces, forums, freelance clients), posting files where metadata survives the upload (many platforms strip it; direct file shares don't), and journalism/activism contexts where location data is genuinely dangerous.",
            "The risk is asymmetric and invisible: the video shows what you chose to film; the metadata shows where and with what — things you didn't choose to disclose.",
          ],
        },
        {
          h: "Inspecting and stripping",
          body: [
            "Inspection: any player's info panel shows basics; ffprobe or ExifTool shows everything. Stripping: re-encoding usually drops most metadata as a side effect, but remuxes deliberately preserve it — the reliable removal is a tool with an explicit 'remove metadata' step, or ExifTool's overwrite mode for batch jobs.",
            "Note what survives where: most social platforms strip metadata on upload (their re-encode rebuilds the file), but direct file transfer — email attachments, drive shares, USB sticks — preserves it untouched.",
          ],
        },
      ],
      tips: [
        "Check a file's metadata before sharing footage with strangers — ExifTool or a player info panel.",
        "GPS in phone footage is the common leak; it's meters-accurate.",
        "Most social platforms strip metadata; direct file shares don't.",
        "For your own library, keep metadata — it's the organization layer.",
      ],
      faqs: [
        {
          q: "Does converting a video remove its metadata?",
          a: "Re-encoding usually drops most of it; remuxing preserves it deliberately. If removal is the goal, verify the output with an inspector rather than assuming.",
        },
        {
          q: "Can metadata be forged?",
          a: "Trivially — it's plain data in the file. Timestamps and GPS in a file are evidence of nothing by themselves; treat them as hints, not testimony.",
        },
      ],
    },
    {
      title: "Audio codecs compared: MP3, AAC, Opus, WAV and FLAC",
      slugP: "audio-codecs-compared",
      category: "formats",
      tags: ["audio", "codecs", "comparison"],
      intro: [
        "The audio world has a format war that video people barely notice and everyone participates in: MP3's universality, AAC's quiet dominance, Opus's technical superiority, WAV's losslessness, FLAC's archival compromise. Choosing between them is easier than the forum arguments suggest.",
        "Here's what each is actually for, in plain terms.",
      ],
      sections: [
        {
          h: "The compressed contenders",
          body: [
            "MP3 (1993) is the compatibility dinosaur: plays on literally everything, at the cost of needing more bits than modern codecs for the same quality — roughly 192kbps MP3 ≈ 128kbps AAC. AAC (late 90s) is what actually lives inside modern video and streaming — better per bit, universally supported by modern hardware, and the smart default for extraction.",
            "Opus (2012) is the open codec that wins on quality-per-bit at every bitrate measured — the reason it's the audio of WebM, Discord, WhatsApp voice notes and most calls. Its weakness is compatibility: fine everywhere modern, spotty on older Apple hardware and car systems.",
          ],
        },
        {
          h: "The lossless pair",
          body: [
            "WAV is uncompressed PCM — every sample exactly as recorded, ~10MB per stereo minute, and the working format of every DAW and editing timeline. FLAC is WAV compressed losslessly (~50% smaller) — byte-identical audio on decode, with metadata support that makes it the archival standard for music libraries.",
            "The rule: lossless for editing and archiving masters, lossy for delivery. Never go lossy→lossy more than once; each re-encode of already-compressed audio compounds the damage.",
          ],
        },
        {
          h: "What this means for extracting audio from video",
          body: [
            "Video audio is almost always AAC already (everything modern) or Opus (WebM sources). Extracting to the same codec can copy the stream untouched — zero further loss. Extracting MP3 re-encodes: acceptable at 256kbps+ for music, wasteful for voice.",
            "The tier list for extraction destinations: AAC for compatibility with no extra loss, WAV for editing workflows, MP3 only when the playback target demands it, Opus when you control the players (best quality-per-bit in existence).",
          ],
        },
      ],
      tips: [
        "Match the source codec on extraction — it can be a lossless copy.",
        "Lossless for masters and editing; lossy for delivery.",
        "Opus is the quality-per-bit king; AAC is the smart default; MP3 is the fallback.",
        "One lossy generation is invisible; three is audible — avoid re-encode chains.",
      ],
      faqs: [
        {
          q: "Can I hear the difference between 320kbps MP3 and lossless?",
          a: "In blind tests, most people can't — 320kbps MP3 is effectively transparent. The case for lossless is future-proofing and editing headroom, not audible superiority on delivery.",
        },
        {
          q: "Why not just always extract to WAV?",
          a: "You can — it's lossless from the source. But if the source audio was 128kbps AAC (as most is), WAV just inflates the file 8× with no recoverable detail. Lossless preserves what exists; it can't add what was already lost.",
        },
      ],
    },
  ].map((p) => ({ ...p, toolHref: p.toolHref || null }));
}
