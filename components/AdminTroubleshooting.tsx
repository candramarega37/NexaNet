"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Step = { prompt: string; yes: string; no: string };
type CaseItem = { id: string; slug: string; title: string; description: string; symptoms: string[]; steps: Step[]; published: boolean };
const emptyForm = { slug: "", title: "", description: "", symptoms: "", steps: "" };

export default function AdminTroubleshooting() {
  const { t } = useLanguage();
  const [items, setItems] = useState<CaseItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/troubleshooting");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    setItems(data.cases);
  }
  useEffect(() => {
    let live = true;
    fetch("/api/admin/troubleshooting").then(async response => ({ response, data: await response.json() })).then(({ response, data }) => {
      if (!live) return;
      if (response.ok) setItems(data.cases); else setMessage(data.error);
    }).catch(() => { if (live) setMessage("Failed to load troubleshooting cases."); });
    return () => { live = false; };
  }, []);

  function edit(item: CaseItem) {
    setEditingId(item.id);
    setForm({ slug: item.slug, title: item.title, description: item.description, symptoms: item.symptoms.join("\n"), steps: item.steps.map(step => `${step.prompt} | ${step.yes} | ${step.no}`).join("\n") });
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const body = { ...form, symptoms: form.symptoms.split("\n").map(value => value.trim()).filter(Boolean), steps: form.steps.split("\n").map(line => line.split("|").map(value => value.trim())).filter(parts => parts.length === 3).map(([prompt, yes, no]) => ({ prompt, yes, no })) };
      const response = await fetch(editingId ? `/api/admin/troubleshooting/${editingId}` : "/api/admin/troubleshooting", { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingId ? body : { ...body, published: false }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setForm(emptyForm); setEditingId(null); setMessage(editingId ? "Case updated." : "Case saved as draft."); await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Failed to save case."); }
    finally { setBusy(false); }
  }
  async function update(item: CaseItem, published: boolean) {
    const response = await fetch(`/api/admin/troubleshooting/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published }) });
    const data = await response.json(); if (response.ok) await load(); else setMessage(data.error);
  }
  async function remove(item: CaseItem) {
    if (!window.confirm(`Delete case "${item.title}"?`)) return;
    const response = await fetch(`/api/admin/troubleshooting/${item.id}`, { method: "DELETE" }); const data = await response.json();
    if (response.ok) await load(); else setMessage(data.error);
  }

  return <div className="admin-manager"><section className="admin-items"><h2>{t("admin.troubleshooting")} ({items.length})</h2>{items.map(item => <article className="admin-item" key={item.id}><div><b>{item.title}</b><small>/{item.slug} · {item.symptoms.length} symptoms · {item.steps.length} steps · {item.published?t("admin.published"):t("admin.draft")}</small></div><div className="admin-item-actions"><button onClick={() => edit(item)}>{t("admin.edit")}</button><button onClick={() => void update(item, !item.published)}>{item.published?t("admin.unpublish"):t("admin.publish")}</button><button className="danger-action" onClick={() => void remove(item)}>{t("admin.delete")}</button></div></article>)}</section>
    <form className="admin-form" onSubmit={save}><h2>{editingId ? t("admin.edit") : t("admin.addNew")}</h2><label>{t("admin.slug")}<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={event => setForm({ ...form, slug: event.target.value })} placeholder="wifi-slow"/></label><label>{t("admin.title")}<input required minLength={3} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })}/></label><label>{t("admin.description")}<textarea required minLength={10} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })}/></label><label>Symptoms (one per line)<textarea required value={form.symptoms} onChange={event => setForm({ ...form, symptoms: event.target.value })}/></label><label>Steps (prompt | if yes | if no, one per line)<textarea required placeholder="Is the link up? | Check gateway. | Check cable and port." value={form.steps} onChange={event => setForm({ ...form, steps: event.target.value })}/></label><button className="button button-dark" type="submit" disabled={busy}>{busy?t("common.loading"):editingId?t("admin.save"):t("admin.draft")}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>{t("common.cancel")}</button>}{message && <p className="admin-message" role="status">{message}</p>}</form></div>;
}