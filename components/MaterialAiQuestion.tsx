"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function MaterialAiQuestion({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function ask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setAnswer("");
    try {
      const response = await fetch("/api/ai/material", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, question }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Answer not available yet.");
      setAnswer(`[${data.mode === "mock" ? "DEMO" : "AI"}] ${data.answer}`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Connection trouble. Try again."); }
    finally { setBusy(false); }
  }
  return <section className="material-ai"><h2>Ask AI about this material</h2><p>Your question is answered using the material you have open.</p><form onSubmit={ask}><label className="sr-only" htmlFor="material-question">Question about the material</label><input id="material-question" value={question} onChange={event => setQuestion(event.target.value)} maxLength={1000} minLength={3} placeholder="Which part do you want to understand?"/><button className="primary-button" disabled={busy || question.trim().length < 3}>{busy ? t("common.loading") : "Ask"}</button></form>{error && <p className="form-error" role="alert">{error}</p>}{answer && <p className="material-ai-answer" role="status">{answer}</p>}</section>;
}
