"use client";
import { useLanguage } from "@/components/LanguageProvider";
function youtubeId(source: string) {
  try {
    const url = new URL(source);
    if (url.protocol !== "https:") return null;
    const hostname = url.hostname.replace(/^www\./, "");
    const id = hostname === "youtu.be" ? url.pathname.slice(1) : hostname === "youtube.com" || hostname === "m.youtube.com" ? url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] : null;
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}

export default function VideoPlayer({ url, title }: { url: string | null; title: string }) {
  const { t } = useLanguage();
  void t;
  if (!url) return <div className="video-placeholder"><span>▶</span><p>No video added yet</p><small>Admins can add a video source via video management.</small></div>;
  const id = youtubeId(url);
  if (id) return <div className="video-player-wrap"><div className="video-player"><iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div><a className="text-link" href={url} target="_blank" rel="noopener noreferrer">Open on YouTube ↗</a></div>;
  return <div className="video-placeholder"><span>▶</span><p>External video</p><a className="text-link" href={url} target="_blank" rel="noopener noreferrer">Open video at source ↗</a></div>;
}
