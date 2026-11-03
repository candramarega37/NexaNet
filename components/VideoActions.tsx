"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function VideoActions({ id }: { id: string }) {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  async function markWatched() {
    const response = await fetch(`/api/videos/${encodeURIComponent(id)}/watch`, { method: "POST" });
    const data = await response.json();
    setMessage(response.ok ? t("pages.progressSaved") : data.error);
  }
  return <div className="material-action"><button className="button button-dark" onClick={markWatched}>{t("pages.actVideoWatched")} <span>✓</span></button>{message && <p role="status">{message}</p>}</div>;
}
