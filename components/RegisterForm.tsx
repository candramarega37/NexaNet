"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function RegisterForm() {
  const { t } = useLanguage();
  const router = useRouter(); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true); const form = new FormData(event.currentTarget);
    try { const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), password: form.get("password") }) }); const result = await response.json(); if (!response.ok) { setError(result.error ?? "Registration failed."); return; } router.push("/dashboard"); router.refresh(); }
    catch { setError("Connection error. Please try again."); } finally { setBusy(false); }
  }
  return <form className="login-form" onSubmit={submit}><label>Name<input required name="name" autoComplete="name" minLength={2} maxLength={80} /></label><label>{t("auth.email")}<input required type="email" name="email" autoComplete="email" placeholder={t("auth.emailPlaceholder")} /></label><label>{t("auth.password")}<input required type="password" name="password" autoComplete="new-password" minLength={10} maxLength={128} placeholder={t("auth.passwordPlaceholder")} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark" disabled={busy}>{busy ? t("common.loading") : t("auth.signUp")}</button><small>Already have an account? <Link href="/login">{t("nav.login")}</Link></small></form>;
}
