"use client";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function CompleteMaterial({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  async function start() {
    const response = await fetch(`/api/materials/${encodeURIComponent(slug)}/progress/start`, { method: "POST" });
    const data = await response.json();
    setMessage(response.ok ? "Material added to your learning list." : data.error);
  }
  async function complete() {
    const response = await fetch(`/api/materials/${encodeURIComponent(slug)}/progress`, { method: "POST" });
    const data = await response.json();
    setMessage(response.ok ? "Material marked complete and saved to your progress." : data.error);
  }
  return <div className="material-action"><button className="button material-start" onClick={start}>{t("materials.startLearning")}</button><button className="button button-dark" onClick={complete}>{t("pages.stCompleted")} <span>✓</span></button>{message && <p role="status">{message}</p>}</div>;
}
