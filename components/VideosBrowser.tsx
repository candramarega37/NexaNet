"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

type Video = { id: string; title: string; description: string; durationMins: number };
export default function VideosBrowser({ videos }: { videos: Video[] }) {
  const { t, locale } = useLanguage();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => { const q = query.trim().toLowerCase(); return videos.filter(video => !q || `${video.title} ${video.description}`.toLowerCase().includes(q)); }, [videos, query]);
  return <div className="video-browser">
    <label className="video-search">
      <span className="video-search-icon" aria-hidden="true">⌕</span>
      <span className="sr-only">{t("common.search")}</span>
      <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={locale === "en" ? "Search videos, topics, or keywords" : "Cari video, topik, atau kata kunci"} />
    </label>
    {filtered.length ? <div className="video-library-grid">{filtered.map((video, index) => <Link className="video-library-card" href={`/videos/${video.id}`} key={video.id}>
      <div className="video-library-art" data-video-index={index % 6}>
        <span className="video-library-number">VIDEO {String(index + 1).padStart(2, "0")}</span>
        <span className="video-library-play" aria-hidden="true">▶</span>
        <span className="video-library-duration">{video.durationMins} {t("videos.minSuffix")}</span>
      </div>
      <div className="video-library-copy">
        <div className="video-library-kicker"><span>{locale === "en" ? "LEARNING VIDEO" : "VIDEO PEMBELAJARAN"}</span><span>{video.durationMins} {t("videos.minSuffix")}</span></div>
        <h2>{video.title}</h2>
        <p>{video.description}</p>
        <span className="video-library-action">{locale === "en" ? "Watch video" : "Tonton video"}<span aria-hidden="true">→</span></span>
      </div>
    </Link>)}</div> : <div className="demo-callout">{locale === "en" ? "No videos match your search." : "Video tidak ditemukan. Coba kata kunci lain."}</div>}
  </div>;
}
