"use client";
import { FormEvent, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Props = { name: string; email: string; role: string; className: string | null; major: string | null; joinedAt: string };
export default function ProfilePanel({ name, email, role, className, major, joinedAt }: Props) {
  const { t } = useLanguage();
  const [values, setValues] = useState({ name, className: className ?? "", major: major ?? "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try { const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); const data = await response.json(); if (!response.ok) { setError(true); setMessage(data.error ?? "Failed to update profile."); return; } setError(false); setMessage("Profile updated successfully."); } catch { setError(true); setMessage("Connection error. Please try again."); } finally { setBusy(false); }
  }
  return <form className="profile-panel" onSubmit={save}><div className="profile-avatar" aria-hidden="true">{values.name.trim().slice(0, 1).toUpperCase()}</div><label>Name<input required minLength={2} maxLength={80} value={values.name} onChange={event => setValues({ ...values, name: event.target.value })} /></label><label>{t("auth.email")}<input value={email} readOnly /></label><label>Class<input maxLength={80} placeholder="e.g. 11 TKJ 1" value={values.className} onChange={event => setValues({ ...values, className: event.target.value })} /></label><label>Major<input maxLength={100} placeholder="e.g. Computer Network Engineering" value={values.major} onChange={event => setValues({ ...values, major: event.target.value })} /></label><label>Role<input value={role === "ADMIN" ? "Administrator" : "Student"} readOnly /></label><label>Joined<input value={joinedAt} readOnly /></label><button className="button button-dark" disabled={busy}>{busy ? t("common.loading") : t("common.save")}</button>{message && <p className={error ? "form-error" : "form-success"} role="status">{message}</p>}</form>;
}
