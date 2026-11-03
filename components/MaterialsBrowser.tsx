"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import MaterialArtwork from "@/components/MaterialArtwork";

type Item = { slug: string; title: string; description: string; category: string; difficulty: string; durationMins: number; status: string; percent: number };

const englishMaterialCopy: Record<string, { title: string; description: string; category: string }> = {
  "dasar-jaringan-komputer": {
    title: "Computer Networking Basics",
    description: "Learn how devices connect, exchange data, and share resources.",
    category: "Networking Basics",
  },
  "osi-layer": {
    title: "OSI Model",
    description: "Understand the seven communication layers and use the OSI model to trace network issues.",
    category: "OSI Model",
  },
  "tcp-ip": {
    title: "TCP/IP Model",
    description: "Connect the TCP/IP model to protocols used by everyday devices.",
    category: "TCP/IP",
  },
  "ipv4-addressing": {
    title: "IPv4 Addressing",
    description: "Learn IPv4 addresses, prefixes, subnet masks, gateways, and host configuration.",
    category: "IPv4 Addressing",
  },
  "ipv4-subnetting": {
    title: "IPv4 Subnetting",
    description: "Divide an IPv4 block into subnets sized for host needs and easier management.",
    category: "Subnetting",
  },
  "troubleshooting-jaringan": {
    title: "Network Troubleshooting",
    description: "Use a systematic process and diagnostic tools to find the source of network issues.",
    category: "Troubleshooting",
  },
};

const englishDifficulty: Record<string, string> = {
  Dasar: "Basic",
  Menengah: "Intermediate",
  Lanjut: "Advanced",
};

export default function MaterialsBrowser({ materials }: { materials: Item[] }) {
  const { t, locale } = useLanguage();
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("All categories"); const [difficulty, setDifficulty] = useState("All difficulties"); const [progress, setProgress] = useState("All statuses");
  const categories = useMemo(() => [...new Set(materials.map(item => item.category))], [materials]);
  const difficulties = useMemo(() => [...new Set(materials.map(item => item.difficulty))], [materials]);
  const copyFor = (item: Item) => locale === "en" ? englishMaterialCopy[item.slug] ?? item : item;
  const labelDifficulty = (value: string) => locale === "en" ? englishDifficulty[value] ?? value : value;
  const labelCategory = (value: string) => locale === "en"
    ? Object.values(englishMaterialCopy).find(copy => copy.category === value)?.category
      ?? materials.map(item => copyFor(item)).find(copy => copy.category === value)?.category
      ?? value
    : value;
  const filtered = materials.filter(item => {
    const copy = copyFor(item);
    const matchesQuery = !query || `${item.title} ${item.description} ${copy.title} ${copy.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === "All categories" || item.category === category) && (difficulty === "All difficulties" || item.difficulty === difficulty) && (progress === "All statuses" || item.status === progress);
  });
  return <><div className="material-filters"><label className="material-search">{t("materials.search")}<input type="search" placeholder={t("materials.search")} value={query} onChange={event => setQuery(event.target.value)} /></label><label>{t("admin.category")}<select value={category} onChange={event => setCategory(event.target.value)}><option value="All categories">{t("materials.allCategories")}</option>{categories.map(item => <option key={item} value={item}>{labelCategory(item)}</option>)}</select></label><label>{t("admin.difficulty")}<select value={difficulty} onChange={event => setDifficulty(event.target.value)}><option value="All difficulties">{t("materials.allDifficulties")}</option>{difficulties.map(item => <option key={item} value={item}>{labelDifficulty(item)}</option>)}</select></label><label>{t("materials.progress")}<select value={progress} onChange={event => setProgress(event.target.value)}><option value="All statuses">{locale === "en" ? "All statuses" : "Semua status"}</option><option value="NOT_STARTED">{t("pages.stNotStarted")}</option><option value="IN_PROGRESS">{t("pages.stInProgress")}</option><option value="COMPLETED">{t("pages.stCompleted")}</option></select></label></div><div className="material-grid">{filtered.map(item => {
    const copy = copyFor(item);
    return <Link className="material-card" href={`/materials/${item.slug}`} key={item.slug}><div className="material-card-art" data-material-art={item.slug}><span>{copy.category.toUpperCase()}</span><MaterialArtwork slug={item.slug}/><small>{labelDifficulty(item.difficulty)}</small></div><div className="material-card-meta"><span>{copy.category}</span><span>{item.durationMins} {t("videos.minSuffix")}</span></div><h2>{copy.title}</h2><p>{copy.description}</p><div className="material-progress"><span>{item.status === "COMPLETED" ? t("pages.stCompleted") : item.status === "IN_PROGRESS" ? t("pages.stInProgress") : t("pages.stNotStarted")}</span><span>{item.percent}%</span></div><div className="material-progress-track"><i style={{ width: `${item.percent}%` }} /></div></Link>;
  })}{filtered.length === 0 && <div className="demo-callout">{locale === "en" ? "No materials match. Try changing search terms or filters." : "Materi tidak ditemukan. Coba ubah kata pencarian atau filter."}</div>}</div></>;
}
