/**
 * Platform downloader guides — generated from per-platform facts so every
 * post is specific to that platform. 4 angles per platform + specials.
 */

const PLATFORMS = [
  {
    name: "TikTok",
    slug: "tiktok",
    toolHref: "/tiktok-video-downloader",
    contentTypes: "short vertical videos from public accounts",
    watermark: true,
    quality:
      "Most TikTok videos are uploaded at 1080p vertical (1080x1920). What you download is exactly what was uploaded — a downloader can't add detail that isn't there.",
    quirks:
      "TikTok re-encodes every upload, so even a pristine source loses a little sharpness before it ever reaches the app. Downloads give you the post-re-encode version, which is still the best copy that exists.",
    errors: [
      "the video was deleted or made private after you copied the link",
      "the account is private, so the share link only works for approved followers",
      "you copied a link to a photo carousel or a live stream instead of a video post",
    ],
    linkKinds: "full @user/video links from the browser and shortened vm.tiktok.com share links",
    specialNote:
      "Saved TikTok videos normally carry a bouncing watermark with the username. If you need a clean copy for editing or reposting with permission, our downloader prepares the video without the burned-in watermark.",
  },
  {
    name: "Instagram",
    slug: "instagram",
    toolHref: "/instagram-video-downloader",
    contentTypes: "Reels, feed videos and IGTV-era long-form posts",
    watermark: false,
    quality:
      "Instagram serves Reels at up to 1080p and feed videos at up to 1080p as well. Horizontal feed videos keep their aspect ratio; Reels are vertical 9:16.",
    quirks:
      "Instagram re-compresses uploads aggressively, especially high-motion content. Expect some artifacts in fast-moving Reels regardless of how you download them.",
    errors: [
      "the post belongs to a private account — only public posts can be processed",
      "you pasted a Story link, which expires after 24 hours and isn't supported",
      "the post is geographically restricted or removed",
    ],
    linkKinds: "/reel/... and /p/... links, both in the app's share menu and in a desktop browser",
    specialNote:
      "Reels are the most-shared format on Instagram, and the share link is one tap away in the app. That makes saving public Reels for offline reference or repurposing (with permission) a 30-second job.",
  },
  {
    name: "X",
    slug: "x",
    toolHref: "/x-video-downloader",
    contentTypes: "videos embedded in public posts and threads",
    watermark: false,
    quality:
      "X hosts videos at up to 1080p (sometimes 4K for premium uploads). The downloader fetches the highest variant the post exposes.",
    quirks:
      "X re-encodes uploads and often serves several quality tiers. A good downloader picks the top tier instead of whatever the network happened to stream to you.",
    errors: [
      "the post was deleted or the account became protected",
      "you copied a link to a quote-post rather than the post that actually contains the video",
      "the media is attached to a Spaces or live event rather than a regular video post",
    ],
    linkKinds: "x.com and twitter.com post links, including links from within threads",
    specialNote:
      "Journalists and researchers cite X videos constantly — and posts get deleted. Saving a local copy of a public post you're citing is basic source hygiene.",
  },
  {
    name: "Facebook",
    slug: "facebook",
    toolHref: "/facebook-video-downloader",
    contentTypes: "feed videos, public Reels and Watch content",
    watermark: false,
    quality:
      "Facebook serves multiple renditions per video, commonly up to 1080p. HD variants appear once processing finishes, which can take minutes after upload.",
    quirks:
      "Facebook pages often upload in HD but the mobile app defaults to streaming lower tiers on slow connections. Downloading grabs the best rendition, not the one your phone settled for.",
    errors: [
      "the video is only visible to friends or a private group",
      "you copied a link from the video's page rather than the post itself, losing the reference",
      "the content was removed for policy reasons",
    ],
    linkKinds: "facebook.com/watch, /reel and post links, plus fb.watch short links",
    specialNote:
      "Facebook Watch links and fb.watch short links both resolve to the same video — the short form is handy for sharing but the full post link is more reliable for downloading.",
  },
  {
    name: "Reddit",
    slug: "reddit",
    toolHref: "/reddit-video-downloader",
    contentTypes: "videos hosted natively on Reddit posts",
    watermark: false,
    quality:
      "Reddit-hosted video is capped at 1080p and often lower, depending on the uploader's source. Audio and video are stored as separate tracks on Reddit's CDN.",
    quirks:
      "Reddit splits every native video into a video-only stream and an audio-only stream. In the app they play together, but a naive 'save video' grabs silent video. A proper downloader merges the tracks back together.",
    errors: [
      "the post was removed by moderators or its author",
      "the video is an embed from YouTube or another site — those need that platform's downloader",
      "you pasted a crosspost link where the original is hosted elsewhere",
    ],
    linkKinds: "standard /r/.../comments/... post links and direct v.redd.it media links",
    specialNote:
      "The split audio/video design is why so many saved Reddit videos are silent. If that has bitten you before, it's the platform's storage model, not a broken downloader.",
  },
  {
    name: "YouTube",
    slug: "youtube",
    toolHref: null,
    contentTypes: "public videos, Shorts and live stream replays",
    watermark: false,
    quality:
      "YouTube serves everything from 144p to 4K and beyond, in both progressive and adaptive streams, with separate audio for anything above 360p.",
    quirks:
      "YouTube's terms of service explicitly reserve downloads to YouTube's own offline features, and third-party downloaders are a grey-to-dark area for anything except content you own or that's clearly licensed for reuse.",
    errors: [
      "the video is private, unlisted in restricted ways, or age-gated",
      "the uploader disabled playback on third-party sites and tools",
      "the stream is a live premiere that hasn't finished processing",
    ],
    linkKinds: "youtube.com/watch, youtu.be and /shorts/ links",
    specialNote:
      "For your own channel, YouTube Studio offers the original upload as a direct download under 'Download' in the three-dot menu — always better than any re-downloaded copy.",
  },
  {
    name: "Vimeo",
    slug: "vimeo",
    toolHref: "/vimeo-video-downloader",
    contentTypes: "public portfolio, creative and filmmaker uploads",
    watermark: false,
    quality:
      "Vimeo is the quality-first platform: uploads keep far more of their original detail, and public videos commonly expose 1080p and 4K renditions.",
    quirks:
      "Many Vimeo videos are portfolio work with explicit copyright. Downloading a public video for offline viewing is one thing; reusing it in your own project without a license is another.",
    errors: [
      "the video is password-protected or domain-restricted",
      "the creator disabled downloads and embedding — only truly public pages can be processed",
      "the video is part of a private showcase",
    ],
    linkKinds: "standard vimeo.com/ID links and player.vimeo.com embed links",
    specialNote:
      "Filmmakers often deliberately leave downloads on for portfolio pieces. If a video matters to your work, check the creator's license before reusing any part of it.",
  },
  {
    name: "Twitch",
    slug: "twitch",
    toolHref: "/twitch-video-downloader",
    contentTypes: "clips and past broadcasts (VODs)",
    watermark: false,
    quality:
      "Clips are capped at the source's broadcast quality, commonly 720p or 1080p at 60fps. VOD quality matches the original stream's top rendition.",
    quirks:
      "Twitch deletes VODs — unhighlighted ones expire after about two months, and banned channels vanish entirely. If you want a copy, the clock is ticking.",
    errors: [
      "the VOD expired and was deleted by Twitch",
      "the clip or video is sub-only, which makes it private",
      "you pasted a channel URL instead of a specific clip or video link",
    ],
    linkKinds: "clips.twitch.tv links, channel /clip/ links and /videos/ VOD links",
    specialNote:
      "Clips are the natural unit of Twitch content — short, shareable, and stable. VODs are the fragile ones. Save what matters before the expiry date.",
  },
  {
    name: "Pinterest",
    slug: "pinterest",
    toolHref: "/pinterest-video-downloader",
    contentTypes: "video pins on public boards — recipe videos, DIY clips, tutorials",
    watermark: false,
    quality:
      "Video pins are typically 720p or 1080p vertical or square, optimized for feed browsing rather than big-screen viewing.",
    quirks:
      "Pinterest content is aggressively re-pinned, so the pin you found may not be the original source. Tracing back to the creator matters if you plan to use the video anywhere beyond personal reference.",
    errors: [
      "the pin is on a secret board",
      "you pasted an image pin link — only video pins are supported",
      "the original pin was deleted and the link now leads nowhere",
    ],
    linkKinds: "standard pinterest.com/pin/... links and pin.it short links",
    specialNote:
      "Pinterest video pins are usually tutorials worth keeping — recipes, workouts, crafts. Saving them for offline reference works exactly like any other public video.",
  },
  {
    name: "Threads",
    slug: "threads",
    toolHref: "/threads-video-downloader",
    contentTypes: "videos attached to public Threads posts",
    watermark: false,
    quality:
      "Threads videos commonly appear at 720p–1080p, mirroring Instagram's compression pipeline since both share Meta's media backend.",
    quirks:
      "Threads is a younger platform, so fewer tools handle its link format — @user/post/... URLs are the shape to look for.",
    errors: [
      "the account is private",
      "the post was deleted after you copied the link",
      "you pasted a repost link rather than the original post containing the video",
    ],
    linkKinds: "threads.net and threads.com post links",
    specialNote:
      "Because Threads and Instagram share infrastructure, a video posted to both often looks identical — but you still need the matching platform's downloader for each link.",
  },
  {
    name: "Snapchat",
    slug: "snapchat",
    toolHref: "/snapchat-video-downloader",
    contentTypes: "Spotlight clips and public stories",
    watermark: false,
    quality:
      "Spotlight videos are vertical, typically 1080p, and re-encoded by Snapchat's pipeline like every other social platform.",
    quirks:
      "Private snaps — person-to-person messages — are private by design and cannot and should not be extracted. Only public Spotlight and public story content works with a downloader.",
    errors: [
      "the story expired — public stories are time-limited like private ones",
      "you tried a private snap, which no tool can or should process",
      "the Spotlight clip was removed",
    ],
    linkKinds: "snapchat.com/spotlight/... links and story.snapchat.com links",
    specialNote:
      "Spotlight is Snapchat's TikTok-style public feed — those clips are meant for wide distribution, which is why they're the downloadable part of the platform.",
  },
  {
    name: "LinkedIn",
    slug: "linkedin",
    toolHref: "/linkedin-video-downloader",
    contentTypes: "videos in public posts — talks, demos, company announcements",
    watermark: false,
    quality:
      "LinkedIn transcodes uploads to standard renditions, commonly topping out at 1080p. Screen recordings and slideshows dominate the format.",
    quirks:
      "The useful content on LinkedIn is disproportionately professional — conference talks, product demos, hiring announcements. Public visibility is the deciding factor for downloading.",
    errors: [
      "the post's visibility was set to connections-only or a specific company",
      "the post was deleted by the author or the company",
      "you pasted a feed URL instead of the specific post's permalink",
    ],
    linkKinds: "linkedin.com/posts/... permalinks",
    specialNote:
      "A permalink is the key on LinkedIn — the feed URL changes constantly, but the post permalink is stable and is what a downloader needs.",
  },
];

/* ---------------- angle templates ---------------- */

function howtoPost(p) {
  return {
    title: `How to download ${p.name} videos the easy way`,
    category: "downloaders",
    tags: [p.name.toLowerCase(), "downloader", "how-to"],
    toolHref: p.toolHref,
    intro: [
      `Saving a video from ${p.name} shouldn't require an app install, an account login, or a sketchy website with five pop-ups. All you actually need is the link to a public post and a downloader that can prepare the video behind it.`,
      `This guide walks through the full process on ${p.name} — where to find the link, what the downloader does with it, and how to end up with a clean file on your device instead of a bookmark you'll never find again.`,
    ],
    sections: [
      {
        h: `What kinds of ${p.name} videos can be saved`,
        body: [
          `The downloader works with ${p.contentTypes}. The rule is simple: if the video is publicly visible without logging in, it can be processed. Content behind private accounts, closed groups or follower-only visibility is off-limits by design — no tool can (or should) reach it.`,
          p.quirks,
        ],
      },
      {
        h: "Getting the right link",
        body: [
          `Every platform makes this slightly different, but ${p.name} gives you the link in the share menu or the browser address bar. ${p.linkKinds[0].toUpperCase() + p.linkKinds.slice(1)} are all recognized.`,
        ],
        list: [
          `Open the ${p.name} post that contains the video.`,
          "Use the share or copy-link option — or copy the URL from the address bar in a desktop browser.",
          "Make sure you're copying the post's own link, not a link to the whole profile or feed.",
          "Paste the link into the downloader at the top of this site and press Download.",
          "Save the prepared video to your device.",
        ],
      },
      {
        h: "What you actually get",
        body: [
          p.quality,
          "One thing a downloader never does is invent quality. The file you receive is the best version the platform stores — nothing upscaled, nothing fabricated.",
        ],
      },
      {
        h: "Where saved videos land on your device",
        body: [
          "Browsers put downloads in your standard Downloads folder unless you've changed the setting. On phones, the file lands in your gallery or Files app, usually under a 'Downloads' or 'From browsers' collection.",
          `From there, you can move it wherever you like — an editor's media folder, a cloud drive, or an offline playlist. ${p.name} content plays back in any standard player once it's a real file.`,
        ],
      },
    ],
    tips: [
      "Copy the link while you're watching — hunting for a post again later is always harder.",
      "On desktop, the browser address bar is the most reliable link source.",
      "Save files into clearly named folders immediately; 'download (14).mp4' helps nobody.",
      p.watermark
        ? "Need an edit-ready copy without the watermark? That's exactly what this downloader prepares."
        : "Keep the creator's name in your filename if you might want credit or permission later.",
    ],
    faqs: [
      {
        q: "Do I need an account to download a video?",
        a: "No. The downloader works with public links only and never asks for your credentials.",
      },
      {
        q: "Does it work on phones and desktops?",
        a: "Yes — the process is identical. Copy the link in the app or browser, paste it into the downloader, save the file.",
      },
      {
        q: "Can I download private videos?",
        a: "No. Private, follower-only and closed-group content isn't publicly accessible, and no legitimate tool can process it.",
      },
    ],
  };
}

function qualityPost(p) {
  return {
    title: `Getting the best possible quality when you save ${p.name} videos`,
    category: "downloaders",
    tags: [p.name.toLowerCase(), "quality", "downloader"],
    toolHref: p.toolHref,
    intro: [
      `You saved a video from ${p.name} and it looks softer than it did in the app. Nine times out of ten, the culprit isn't the downloader — it's the platform's own re-encoding, or the app quietly streaming you a lower tier while saving you a different one.`,
      `Here's how quality actually works on ${p.name}, what a download can and can't recover, and how to make sure you always end up with the sharpest copy that exists.`,
    ],
    sections: [
      {
        h: "The platform has already re-encoded everything",
        body: [
          p.quirks,
          "This is the single most important fact about downloaded social video: what you see in the app is already a compressed, re-encoded copy of the upload. Your download can at best match it — never exceed it.",
        ],
      },
      {
        h: `Quality tiers on ${p.name}`,
        body: [
          p.quality,
          "When a downloader prepares a video, it requests the highest rendition the platform exposes for that post — not whatever your connection happened to stream at the time you were watching.",
        ],
      },
      {
        h: "Why your in-app view can look better than the file",
        body: [
          "Apps apply sharpening, higher brightness and screen-optimized color profiles that make compressed video look nicer. A raw file in a neutral player looks flatter by comparison — but it's the honest copy, not a worse one.",
          "To compare fairly, play the downloaded file at full screen at its native resolution. Don't judge a 1080p vertical video stretched across a 27-inch monitor.",
        ],
      },
      {
        h: "What to do if quality still disappoints",
        body: [
          "First, confirm you downloaded the top rendition — paste the link again and check the file size; a visibly small file usually means a lower tier. Second, check the original post in-app: if the upload itself was low quality, that's the ceiling. Third, avoid re-encoding the file again; every conversion generation costs detail.",
        ],
        list: [
          "Check the downloaded file's resolution in your player's info panel.",
          "Compare against the post in the app, not against your memory of it.",
          "Never re-export a downloaded video at a higher resolution — upscaling adds nothing.",
          "For archiving, keep the original file untouched and make copies for editing.",
        ],
      },
    ],
    tips: [
      "File size is a fast proxy for quality tier — tiny file, low rendition.",
      "Archive the untouched download; edit a copy instead.",
      "Fast-motion content (sports, dance) shows compression artifacts first — expect it.",
      "Vertical videos look best played at native size or on a phone.",
    ],
    faqs: [
      {
        q: "Can a downloader improve on the platform's quality?",
        a: "No. Downloads return the best rendition the platform stores. Anything claiming to 'enhance' or upscale during download is just re-encoding — which costs quality, not adds it.",
      },
      {
        q: "Why is my download silent or blocky?",
        a: "Some platforms store audio and video as separate tracks (Reddit is the classic case). A proper downloader merges them; a naive one doesn't. Grab the link again with a tool that does the merge.",
      },
      {
        q: "Does downloading in HD need a faster connection?",
        a: "No — download speed affects how fast the file arrives, not which rendition you get. The downloader requests the top tier regardless.",
      },
    ],
  };
}

function troubleshootPost(p) {
  return {
    title: `${p.name} video won't download? Here's how to fix it`,
    category: "downloaders",
    tags: [p.name.toLowerCase(), "troubleshooting", "downloader"],
    toolHref: p.toolHref,
    intro: [
      `You pasted a ${p.name} link, hit download, and… nothing. Or worse, an error that tells you nothing. Almost every failed download falls into one of a handful of causes, and nearly all of them are fixable in under a minute.`,
      `Work through this checklist in order — it moves from the most common causes to the rare ones, starting with the link itself.`,
    ],
    sections: [
      {
        h: "Start with the link",
        body: [
          `The number one cause of failures is a link that doesn't point where you think it points. On ${p.name}, the reliable formats are ${p.linkKinds}. Anything else — a profile URL, a search result page, a share link that got truncated by a messaging app — will fail.`,
        ],
        list: [
          "Re-copy the link directly from the post itself, not from a message someone sent you.",
          "Check the link wasn't cut short — it should end the way the platform ends its URLs.",
          "Make sure you grabbed the permalink, not the page you happened to be browsing.",
        ],
      },
      {
        h: "Check that the content is actually public",
        body: [
          `Private content fails by design. The common private-content failures on ${p.name}: ${p.errors.join("; ")}.`,
          "If any of those match, there's nothing to fix on your end — the content simply isn't publicly accessible, and no tool can (or should) process it.",
        ],
      },
      {
        h: "Verify the post still exists",
        body: [
          "Open the link in a private/incognito browser window. If the post doesn't load there, it won't load for a downloader either — deleted, removed or expired content fails the same way. This is the fastest possible test: if you can't see it incognito, it's gone or gated.",
        ],
      },
      {
        h: "If it still fails",
        body: [
          "Content that loads fine incognito but still won't download is rare but happens — usually a platform-side CDN hiccup or a link format edge case. Waiting a few minutes and retrying solves the transient cases. If a specific post consistently fails while others work, the post itself is the problem, not your workflow.",
        ],
        list: [
          "Retry after a few minutes — transient CDN errors are real.",
          "Try the other link format for the same post if the platform has more than one.",
          "Test with a different public post to confirm your workflow still works.",
        ],
      },
    ],
    tips: [
      "The incognito test answers 'is it gone or is it gated?' in five seconds.",
      "Links copied from chat apps get truncated surprisingly often — re-copy from the source.",
      "Screenshots of error messages help if you're reporting an issue; descriptions usually don't.",
      "A downloader can only ever match the platform's own availability, never beat it.",
    ],
    faqs: [
      {
        q: "Why did a link that worked yesterday fail today?",
        a: `Because the post changed state — deleted, made private, or removed by moderators. ${p.name} content is mutable; save what matters when you see it.`,
      },
      {
        q: "Could my account be the problem?",
        a: "No — downloaders don't use your account. If a video is visible to the public, it's downloadable; if it isn't, no login on your side would help.",
      },
      {
        q: "Is there a limit on how many videos I can download?",
        a: "Public links can be processed one after another without a practical limit. Failures are almost always about the specific post, not your volume.",
      },
    ],
  };
}

function mobilePost(p) {
  const name = p.name;
  return {
    title: `Saving ${name} videos on iPhone and Android: the mobile workflow`,
    category: "downloaders",
    tags: [p.slug, "mobile", "downloader", "how-to"],
    toolHref: p.toolHref,
    intro: [
      `Desktop workflows are easy — address bar, copy, paste. On a phone, ${name} lives in an app, the address bar is hidden, and every step is a little different. The good news: none of it is harder, it's just not obvious the first time.`,
      `Here's the complete mobile workflow for saving ${name} videos — iOS and Android — including where files land and how to get them into your gallery properly.`,
    ],
    sections: [
      {
        h: "Copying the link in the app",
        body: [
          `In the ${name} app, every post's share menu holds a 'Copy link' option — that's your ticket. Tap the share icon (the arrow or paper plane), look for the chain-link or 'Copy link' button, and the URL is on your clipboard.`,
          `From a mobile browser instead of the app? Tap the address bar, select the whole URL, and copy. ${p.linkKinds[0].toUpperCase() + p.linkKinds.slice(1)} — the same formats the desktop uses — all work on mobile.`,
        ],
        list: [
          "In-app: share menu → Copy link. That's the whole step.",
          "In-browser: tap the address bar, select all, copy.",
          "Beware of chat-app forwards: links get truncated; re-copy from the source when in doubt.",
        ],
      },
      {
        h: "Pasting into the downloader",
        body: [
          "Open the downloader site in your mobile browser (both Safari and Chrome work fine), tap the paste field, and long-press → Paste. The clipboard does the work; no typing URLs on a phone keyboard.",
          "Press Download and wait for the preparation to finish. On mobile this is usually seconds; big HD files on slow connections take a little longer.",
        ],
      },
      {
        h: "Where the file lands (and the gallery question)",
        body: [
          "On Android, downloaded files land in Downloads (via Chrome) or the app's download folder — and most video files appear in Gallery/Photos automatically or after a 'scan'. On iOS, files land in the Files app (On My iPhone → Downloads), and the gallery is a separate matter: use the Files app's share menu → 'Save Video' to put the MP4 into Photos.",
          "That iOS last step is the one people miss — the video is downloaded fine, it's just sitting in Files, not Photos. 'Save Video' moves it where you expect it to be.",
        ],
        list: [
          "Android: check Files → Downloads first; Gallery picks video up automatically on most phones.",
          "iPhone: Files app → Downloads → long-press the video → Share → Save Video.",
          "From Photos/Files you can then move files into albums, editors or cloud drives like any other video.",
        ],
      },
      {
        h: "Mobile gotchas worth knowing",
        body: [
          `In-app browsers (the browser that opens inside ${name}, or inside a chat app) are the classic trap: they sometimes can't trigger downloads properly. If a download refuses to start, copy the site's URL, open it in a real Safari/Chrome tab, and try again.`,
          `And quality is the same on mobile as desktop — ${p.quality.toLowerCase().replace(/\.$/, "")}. A phone is not a second-class client; the top rendition is the top rendition wherever you download it.`,
        ],
      },
    ],
    tips: [
      "iOS downloads live in the Files app, not Photos — 'Save Video' is the step that moves them.",
      "In-app browsers are flaky for downloads; switch to a real Safari/Chrome tab.",
      "Long-press the paste field — never type URLs by hand on a phone.",
      "Share menu → Copy link beats screenshotting a post you want to save later.",
    ],
    faqs: [
      {
        q: "Do I need to install an app to download videos?",
        a: "No. A mobile browser and the site are enough — nothing to install, no storage permissions to grant.",
      },
      {
        q: "Why doesn't the video appear in my iPhone gallery?",
        a: "iOS saves downloads to the Files app. Find the MP4 in Downloads, long-press, and choose Share → 'Save Video' to add it to Photos.",
      },
      {
        q: "Is the quality lower on mobile?",
        a: "No — the downloader serves the top rendition the platform exposes regardless of your device.",
      },
    ],
  };
}

function rulesPost(p) {
  return {
    title: `Is it okay to download ${p.name} videos? What you should know`,
    category: "downloaders",
    tags: [p.name.toLowerCase(), "copyright", "ethics", "rules"],
    toolHref: p.toolHref,
    intro: [
      `"Can I legally download this?" is the question everyone asks and almost nobody answers carefully. The honest answer: it depends on what you download and — more importantly — what you do next.`,
      `This is a plain-language overview, not legal advice. But the practical rules of thumb are consistent across platforms, including ${p.name}.`,
    ],
    sections: [
      {
        h: "Downloading for personal viewing",
        body: [
          "Saving a public video to watch offline later is, in practice, the least problematic use there is. You're not redistributing anything, not monetizing anything, and the copy serves the same purpose as a bookmark — just one that actually works on a plane.",
          `Most platforms' terms of service formally reserve downloading to their own offline features. Terms like that matter for the contract between you and the platform, but personal offline viewing is universally the low-stakes case.`,
        ],
      },
      {
        h: "The uses that actually cross lines",
        body: [
          "Problems start when a downloaded video leaves your device. Re-uploading someone else's video as your own content, monetizing it, editing it into your projects without permission, or stripping attribution — those are the uses that turn a grey area into a real copyright problem.",
          p.specialNote,
        ],
        list: [
          "Generally low-stakes: offline viewing, showing a friend, keeping a reference copy.",
          "Needs permission: reposting, editing into your own content, using in anything monetized.",
          "Never okay: re-uploading someone's work as your own, or removing credit and pretending it's yours.",
        ],
      },
      {
        h: "Platform rules vs. copyright law",
        body: [
          `Two different rulebooks apply. Copyright law protects the creator's work itself. ${p.name}'s terms of service govern your account's relationship with the platform — and violating them is an account risk (a takedown, a strike), not a lawsuit.`,
          "The practical hierarchy: respect creators first, platform terms second. Both are satisfied by personal offline use of public content and both are violated by uncredited republication.",
        ],
      },
      {
        h: "When in doubt, ask",
        body: [
          "For anything beyond personal viewing, the cleanest route is asking the creator. Most creators respond well to 'can I use 10 seconds of your clip with credit?' — and a yes in writing resolves every ambiguity at once.",
          "Also worth knowing: content that states its license (Creative Commons, public domain) comes with reuse permissions already attached. Look for it before assuming the answer is no.",
        ],
      },
    ],
    tips: [
      "Personal offline copies are the safe default; everything public-facing needs permission.",
      "A written 'yes' from the creator beats any legal theory.",
      "Check for Creative Commons or public-domain licensing before asking.",
      "Crediting the creator doesn't replace permission, but omitting it guarantees a problem.",
    ],
    faqs: [
      {
        q: "Is downloading videos for offline viewing illegal?",
        a: "For personal offline viewing of public content, you're in the lowest-risk category there is. Real problems attach to redistribution and reuse without permission, not to watching a saved file yourself.",
      },
      {
        q: "Can I repost a downloaded video if I credit the creator?",
        a: "Credit is courteous but it isn't permission. For reposting, editing into your content, or anything monetized, get an explicit yes from the creator first.",
      },
      {
        q: "What about downloading my own videos?",
        a: `Always fine — it's your content. On platforms with original-file access (like your own channel backends), grab the original instead of a re-downloaded copy.`,
      },
    ],
  };
}

/* ---------------- specials (extra posts for specific platforms) ---------------- */

function specialPosts() {
  const posts = [];
  const tiktok = PLATFORMS.find((p) => p.slug === "tiktok");
  posts.push({
    title: "How to save TikTok videos without the watermark",
    category: "downloaders",
    tags: ["tiktok", "watermark", "downloader", "how-to"],
    toolHref: tiktok.toolHref,
    intro: [
      "Every saved TikTok normally arrives with a bouncing watermark carrying the creator's username. Great for attribution; terrible when you just want a clean clip to rewatch, study, or — with permission — repurpose.",
      "Here's what the watermark actually is, why it's burned in, and how to get a clean copy the straightforward way.",
    ],
    sections: [
      {
        h: "What the TikTok watermark really is",
        body: [
          "The watermark is rendered onto the video during the export the app performs when you save or share. It's not a separate layer you can peel off the finished file — it's part of the pixels by the time the file exists.",
          "That's why 'watermark removers' that promise to erase it from a saved file are really re-encoding and cropping or blurring — all of which cost quality. The clean route is to never get the watermark in the first place: have the downloader prepare the video directly, without the app's burned-in export.",
        ],
      },
      {
        h: "Getting a clean copy",
        body: [
          "The process is the same as any TikTok download — the difference is which file the tool prepares for you.",
        ],
        list: [
          "Open the TikTok video and copy its link from the share menu.",
          "Paste the link into the downloader on this site.",
          "Press Download — the video is prepared without the burned-in watermark.",
          "Save the file; it's a clean 1080p vertical MP4.",
        ],
      },
      {
        h: "The permission note (it matters)",
        body: [
          "A watermark-free file makes repurposing easy — which is exactly why permission matters more once you have one. Removing attribution and reposting someone's clip as your own is the clearest way to turn a grey area into a genuine problem, on TikTok and everywhere else.",
          "Use clean copies for what they're good for: comfortable rewatching, frame study, editing practice, or reposting with the creator's blessing and a visible credit in your caption.",
        ],
      },
    ],
    tips: [
      "Clean copies still deserve credit — put the creator's @handle in your caption when you share.",
      "Never trust 'remover' apps that ask for your TikTok login; they don't need it and shouldn't have it.",
      "The clean file is the same quality as the watermarked one — nothing is lost by skipping the watermark.",
    ],
    faqs: [
      {
        q: "Does removing the watermark reduce quality?",
        a: "Not when the downloader prepares the video without it in the first place. Quality only suffers when an app tries to scrub the watermark off an already-saved file.",
      },
      {
        q: "Is saving without the watermark allowed?",
        a: "Personal offline viewing is the low-risk default as with any downloaded video. Reposting a clean copy without permission is where it genuinely crosses a line.",
      },
      {
        q: "Do other platforms watermark downloads?",
        a: "TikTok is the main one. Most other platforms serve clean video, and their downloaders — like ours — deliver the file as the platform stores it.",
      },
    ],
  });

  const insta = PLATFORMS.find((p) => p.slug === "instagram");
  posts.push({
    title: "Saving Instagram Reels: a practical guide",
    category: "downloaders",
    tags: ["instagram", "reels", "downloader", "how-to"],
    toolHref: insta.toolHref,
    intro: [
      "Reels are Instagram's center of gravity — the format where the interesting stuff gets posted and, inevitably, where the save-for-later requests come from.",
      "Instagram's own 'save' button files a Reel into a folder you'll never open again. If you actually want the video, here's the reliable path.",
    ],
    sections: [
      {
        h: "Why the in-app save isn't enough",
        body: [
          "Instagram's saved folder is a bookmark, not a copy. The Reel disappears the moment the creator deletes the post, archives it, or goes private. A downloaded file is the only version you control.",
          "There's also the offline case: flights, commutes, gyms with no signal. Bookmarks need the app and a connection; files don't care.",
        ],
      },
      {
        h: "How to save a public Reel",
        body: [
          "The Reel share menu exposes the link in two taps, which is all the downloader needs.",
        ],
        list: [
          "Open the Reel and tap the share (paper plane) icon.",
          "Choose 'Copy link' — the /reel/... URL is now on your clipboard.",
          "Paste it into the downloader on this site and press Download.",
          "Save the prepared MP4 — vertical, up to 1080p, exactly as posted.",
        ],
      },
      {
        h: "What about Stories and private accounts",
        body: [
          "Stories are time-limited by design and aren't supported — they're a different product with a 24-hour lifecycle. Private accounts are equally firm: their posts aren't public, so nothing can process them. Both limits are features, not bugs.",
        ],
      },
      {
        h: "Repurposing Reels the right way",
        body: [
          "If you're a creator collecting reference Reels for style study, download away. If you want to repost or remix someone's Reel, the rules are the same as anywhere: ask first, credit visibly, and keep proof of the yes. Trends travel across platforms precisely because creators let them — don't be the reason one stops.",
        ],
      },
    ],
    tips: [
      "The /reel/ link from the share menu works in both the app and a desktop browser.",
      "Save Reels the day you find them — posts vanish without notice.",
      "For reposts: permission first, credit in the first line of the caption.",
    ],
    faqs: [
      {
        q: "Can I download a Reel from a private account?",
        a: "No. Private account posts aren't publicly accessible, and no tool can (or should) reach them.",
      },
      {
        q: "Do downloaded Reels include the audio?",
        a: "Yes — the file is the complete video with its audio, as posted (music licensing in the app is a playback matter; the saved file contains what the post contains).",
      },
      {
        q: "What's the best quality a saved Reel can be?",
        a: "Reels top out at 1080p vertical. That's the platform ceiling for the format, and downloads deliver it.",
      },
    ],
  });

  const reddit = PLATFORMS.find((p) => p.slug === "reddit");
  posts.push({
    title: "Why saved Reddit videos have no sound — and how to fix it",
    category: "downloaders",
    tags: ["reddit", "audio", "troubleshooting", "downloader"],
    toolHref: reddit.toolHref,
    intro: [
      "You saved a Reddit video, opened it, and… silence. It's the most common Reddit downloading complaint by a mile, and it has a genuinely technical cause that has nothing to do with your phone, your player, or the downloader being broken.",
      "Here's what's actually happening on Reddit's side, and how to get a file with the audio merged back in.",
    ],
    sections: [
      {
        h: "Reddit splits video and audio",
        body: [
          "Reddit's CDN stores every native video as two separate files: a video-only stream and an audio-only stream. When you watch in the app or on the site, the player fetches both and plays them in sync. That's also why the same video can offer a silent 'video-only' rendition so freely.",
          "When a naive save grabs the video stream, it grabs exactly that — video only. The audio exists, sitting in its own file next door; the tool just never fetched it.",
        ],
      },
      {
        h: "The fix: merge the tracks",
        body: [
          "A downloader that understands Reddit's model fetches both tracks and merges them into a single file before handing it to you. That's what our Reddit downloader does — the link workflow is unchanged.",
        ],
        list: [
          "Copy the Reddit post's link (the /comments/ permalink, or a v.redd.it link).",
          "Paste it into the downloader on this site and press Download.",
          "Both tracks are fetched and merged — you get a normal MP4 with sound.",
        ],
      },
      {
        h: "When there's genuinely no audio",
        body: [
          "Some Reddit videos truly are silent: the uploader posted video with no sound track in the first place, or replaced the audio with a text overlay. If the post plays silently in the app too, the file has no audio to recover — check the original post before blaming the download.",
        ],
      },
    ],
    tips: [
      "Always sanity-check against the original post: silent there means silent, period.",
      "Merged files play in any standard player — no special codec setup needed.",
      "v.redd.it direct links work too if that's what you copied.",
    ],
    faqs: [
      {
        q: "Does merging lose any quality?",
        a: "No. The merge is a lossless container operation — both tracks are copied into one file unchanged.",
      },
      {
        q: "Do embedded YouTube videos on Reddit work the same way?",
        a: "No — those are external embeds hosted on another platform. They need that platform's workflow, not Reddit's downloader.",
      },
      {
        q: "Why does Reddit even split the files?",
        a: "It's a bandwidth design: the player can start video instantly and fetch audio separately, and lower-quality video tiers can share the same audio track. Clever for them, confusing for savers.",
      },
    ],
  });

  return posts;
}

export function generatePlatformPosts() {
  const posts = [];
  for (const p of PLATFORMS) {
    posts.push(howtoPost(p));
    posts.push(qualityPost(p));
    posts.push(troubleshootPost(p));
    posts.push(rulesPost(p));
    posts.push(mobilePost(p));
  }
  posts.push(...specialPosts());
  return posts;
}
