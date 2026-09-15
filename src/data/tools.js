import { createElement } from "react";
import {
  Archive,
  Scissors,
  Image as ImageIcon,
  Download,
  ArrowsLeftRight,
  ArrowsInSimple,
  Waveform,
  FilmStrip,
} from "@phosphor-icons/react";
import { platforms } from "./platforms";
import { converters, converterToTool } from "./converters";

/** Wrap a Phosphor icon so it always renders in the duotone weight. */
const duotone = (Icon) => (props) =>
  createElement(Icon, { weight: "duotone", ...props });

export const toolCategories = [
  { id: "all", label: "All" },
  { id: "download", label: "Download", icon: duotone(Download) },
  { id: "convert", label: "Convert", icon: duotone(ArrowsLeftRight) },
  { id: "compress", label: "Compress", icon: duotone(ArrowsInSimple) },
  { id: "edit", label: "Edit", icon: duotone(Scissors) },
  { id: "audio", label: "Audio", icon: duotone(Waveform) },
  { id: "creator", label: "Creator", icon: duotone(FilmStrip) },
];

function titleCase(name) {
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Map a platform entry to the tool shape used by the directory. */
export function platformToTool(p) {
  return {
    id: p.slug,
    name: titleCase(p.toolName),
    description: p.cardDescription,
    category: "download",
    href: p.href,
    available: true,
    meta: p.domains.slice(0, 2).join(" · "),
  };
}

const downloaderTools = platforms.map(platformToTool);
const converterTools = converters.map(converterToTool);

const futureTools = [
  {
    id: "video-compressor",
    name: "Video Compressor",
    description: "Reduce the file size of a video.",
    category: "compress",
    available: false,
    icon: duotone(Archive),
    meta: "mp4 · webm · mov",
  },
  {
    id: "video-trimmer",
    name: "Video Trimmer",
    description: "Cut a video down to the part you need.",
    category: "edit",
    available: false,
    icon: duotone(Scissors),
    meta: "mp4 · webm · mov",
  },
  {
    id: "thumbnail-downloader",
    name: "Thumbnail Downloader",
    description: "Save the thumbnail image of a video.",
    category: "creator",
    available: false,
    icon: duotone(ImageIcon),
    meta: "jpg · png",
  },
];

export const tools = [...downloaderTools, ...converterTools, ...futureTools];
