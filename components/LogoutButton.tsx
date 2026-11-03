"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

export default function LogoutButton() {
  const { t } = useLanguage();
  const router = useRouter();
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); }
  return <button className="logout-button" onClick={logout}>{t("nav.logout")}</button>;
}
