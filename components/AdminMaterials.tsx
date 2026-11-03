"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Material = { id: string; slug: string; title: string; category: string; difficulty: string; published: boolean };
const initial = { title: "", slug: "", description: "", category: "Basic Networking", difficulty: "Basic", durationMins: 15, content: "", objectives: "" };

export default function AdminMaterials() {
  const { t } = useLanguage();
  const [items, setItems] = useState<Material[]>([]);
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() {
    const response = await fetch("/api/admin/materials"); const data = await response.json();
    if (response.ok) setItems(data.materials); else setMessage(data.error ?? "Failed to load materials.");
  }
  useEffect(() => {
    let active = true;
    fetch("/api/admin/materials").then(async response => ({ response, data: await response.json() })).then(({ response, data }) => {
      if (!active) return;
      if (response.ok) setItems(data.materials); else setMessage(data.error ?? "Failed to load materials.");
    }).catch(() => { if (active) setMessage("Failed to load materials."); });
    return () => { active = false; };
  }, []);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/admin/materials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, durationMins: Number(form.durationMins), published: true }) });
    const data = await response.json();
    if (response.ok) { setForm(initial); setMessage("New material added successfully."); await load(); }
    else setMessage(data.error ?? "Failed to save material.");
    setBusy(false);
  }
  async function toggle(item: Material) {
    const response = await fetch(`/api/admin/materials/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !item.published }) });
    if (response.ok) await load(); else setMessage("Failed to save status change.");
  }
  async function remove(item: Material) {
    if (!window.confirm(t("admin.deleteConfirm"))) return;
    const response = await fetch(`/api/admin/materials/${item.id}`, { method: "DELETE" });
    if (response.ok) { setMessage("Material deleted."); await load(); } else setMessage("Failed to delete material.");
  }
  return <div className="admin-manager"><div className="admin-items"><h2>{t("admin.materials")} ({items.length})</h2>{items.map(item=><article className="admin-item" key={item.id}><div><b>{item.title}</b><small>{item.category} · {item.slug} · {item.published ? t("admin.published") : t("admin.draft")}</small></div><div className="admin-item-actions"><button onClick={()=>void toggle(item)} aria-label={`${item.published ? t("admin.unpublish") : t("admin.publish")}: ${item.title}`}>{item.published ? t("admin.unpublish") : t("admin.publish")}</button><button className="danger-action" onClick={()=>void remove(item)} aria-label={`${t("admin.delete")} ${item.title}`}>{t("admin.delete")}</button></div></article>)}{items.length===0&&<p className="admin-empty">{t("admin.noMaterials")}</p>}</div><form className="admin-form" onSubmit={create}><h2>{t("admin.addMaterial")}</h2><label>{t("admin.title")}<input required minLength={3} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>{t("admin.slug")}<input required pattern="[a-z0-9-]+" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})}/></label><label>{t("admin.description")}<textarea required minLength={10} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><div className="admin-form-row"><label>{t("admin.category")}<input required value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></label><label>{t("admin.difficulty")}<select value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})}><option>Basic</option><option>Intermediate</option><option>Advanced</option></select></label></div><label>{t("admin.duration")}<input type="number" min="1" max="600" value={form.durationMins} onChange={e=>setForm({...form,durationMins:Number(e.target.value)})}/></label><label>{t("admin.content")}<textarea required minLength={30} rows={5} value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/></label><label>{t("admin.objectives")}<textarea required value={form.objectives} onChange={e=>setForm({...form,objectives:e.target.value})}/></label><button className="button button-dark" type="submit" disabled={busy}>{busy ? t("common.loading") : t("admin.save")}</button>{message && <p className="admin-message" role="status">{message}</p>}</form></div>;
}