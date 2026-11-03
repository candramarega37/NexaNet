"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Video = { id: string; title: string; description: string; durationMins: number; videoUrl: string | null; published: boolean };
const initial = { title: "", description: "", durationMins: 10, videoUrl: "" };

export default function AdminVideos() {
  const { t } = useLanguage();
  const [items, setItems] = useState<Video[]>([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  async function load() {
    const response = await fetch("/api/admin/videos"); const data = await response.json();
    if (response.ok) setItems(data.videos); else setMessage(data.error);
  }
  useEffect(() => {
    let active = true;
    fetch("/api/admin/videos").then(async response => ({ response, data: await response.json() })).then(({ response, data }) => {
      if (!active) return;
      if (response.ok) setItems(data.videos); else setMessage(data.error);
    }).catch(() => { if (active) setMessage("Failed to load videos."); });
    return () => { active = false; };
  }, []);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/admin/videos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, durationMins: Number(form.durationMins), published: false }) });
    const data = await response.json();
    if (response.ok) { setForm(initial); setMessage("Video saved as draft."); await load(); }
    else setMessage(data.error ?? "Failed to save video.");
    setBusy(false);
  }
  async function update(item: Video, body: Partial<Video>) {
    const response = await fetch(`/api/admin/videos/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (response.ok) await load(); else setMessage("Failed to save video changes.");
  }
  async function remove(item: Video) {
    if (!window.confirm(`Delete video "${item.title}"?`)) return;
    const response = await fetch(`/api/admin/videos/${item.id}`, { method: "DELETE" });
    if (response.ok) await load(); else setMessage("Failed to delete video.");
  }
  return <div className="admin-manager"><div className="admin-items"><h2>{t("admin.videos")} ({items.length})</h2>{items.map(item=><article className="admin-item" key={item.id}><div><b>{item.title}</b><small>{item.durationMins} min · {item.videoUrl ? "URL available" : "no media"} · {item.published ? t("admin.published") : t("admin.draft")}</small></div><div className="admin-item-actions"><button onClick={()=>void update(item,{published:!item.published})} aria-label={`${item.published?t("admin.unpublish"):t("admin.publish")}: ${item.title}`}>{item.published?t("admin.unpublish"):t("admin.publish")}</button><button className="danger-action" onClick={()=>void remove(item)} aria-label={`${t("admin.delete")} ${item.title}`}>{t("admin.delete")}</button></div></article>)}{items.length===0&&<p className="admin-empty">No videos yet.</p>}</div><form className="admin-form" onSubmit={create}><h2>{t("admin.addVideo")}</h2><label>{t("admin.title")}<input required minLength={3} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>{t("admin.description")}<textarea required minLength={10} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><label>{t("admin.duration")}<input type="number" min="1" max="600" value={form.durationMins} onChange={e=>setForm({...form,durationMins:Number(e.target.value)})}/></label><label>Video URL<input value={form.videoUrl} onChange={e=>setForm({...form,videoUrl:e.target.value})} placeholder="https://youtube.com/watch?v=... or /models/video.mp4"/></label><button className="button button-dark" type="submit" disabled={busy}>{busy?t("common.loading"):t("admin.save")}</button>{message&&<p className="admin-message" role="status">{message}</p>}</form></div>;
}