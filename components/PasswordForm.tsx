"use client";
import { FormEvent } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function PasswordForm() {
  const { t } = useLanguage();
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch("/api/profile/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: form.get("currentPassword"), newPassword: form.get("newPassword") }) }); const data = await response.json(); alert(response.ok ? "Password updated successfully." : data.error); if (response.ok) formElement.reset();
  }
  return <form className="profile-panel" onSubmit={save}><label>{t("auth.currentPassword")}<input type="password" name="currentPassword" required minLength={8} autoComplete="current-password" placeholder={t("auth.currentPasswordPlaceholder")} /></label><label>{t("auth.newPassword")}<input type="password" name="newPassword" required minLength={10} autoComplete="new-password" placeholder={t("auth.newPasswordPlaceholder")} /></label><button className="button button-dark">{t("common.save")} <span>→</span></button></form>;
}
