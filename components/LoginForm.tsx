"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { safePostLoginPath } from "@/lib/auth-redirect.mjs";

export default function LoginForm({ nextPath = "" }: { nextPath?: string }) {
  const { t, locale } = useLanguage();
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true); const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", credentials: "same-origin", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
      const result = await response.json();
      if (!response.ok) { setError(result.error ?? "Login failed."); return; }

      const sessionResponse = await fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" });
      const session = await sessionResponse.json();
      if (!sessionResponse.ok || !session.user) {
        setError(locale === "id"
          ? "Login berhasil, tetapi sesi tidak tersimpan di browser. Buka tautan pada browser biasa dan gunakan alamat yang sama."
          : "Login succeeded, but the browser did not keep the session. Open the link in a regular browser and use the same address.");
        return;
      }

      window.location.assign(safePostLoginPath(nextPath, session.user.role, window.location.origin));
    }
    catch { setError("Connection error. Please try again."); } finally { setBusy(false); }
  }
  return <form className="login-form" onSubmit={submit}><label>{t("auth.email")}<input required type="email" name="email" autoComplete="username" placeholder={t("auth.emailPlaceholder")} /></label><label>{t("auth.password")}<input required type="password" name="password" autoComplete="current-password" minLength={8} placeholder={t("auth.passwordPlaceholder")} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark" disabled={busy}>{busy ? t("common.loading") : t("auth.submit")}<span>↗</span></button><small><Link href="/forgot-password">{t("auth.forgotPassword")}</Link> · {t("auth.noAccount")} <Link href="/register">{t("auth.signUp")}</Link></small></form>;
}
