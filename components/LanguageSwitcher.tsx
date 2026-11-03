"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="language-switcher" suppressHydrationWarning style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <button
        onClick={() => setLocale("id")}
        className={`lang-btn ${locale === "id" ? "active" : ""}`}
        aria-label="Indonesian"
        aria-pressed={locale === "id"}
        style={{
          padding: "6px 12px",
          border: "1px solid var(--line)",
          borderRadius: "6px",
          background: locale === "id" ? "var(--accent)" : "var(--surface)",
          color: locale === "id" ? "#fff" : "var(--ink)",
          fontSize: "11px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        ID
      </button>
      <button
        onClick={() => setLocale("en")}
        className={`lang-btn ${locale === "en" ? "active" : ""}`}
        aria-label="English"
        aria-pressed={locale === "en"}
        style={{
          padding: "6px 12px",
          border: "1px solid var(--line)",
          borderRadius: "6px",
          background: locale === "en" ? "var(--accent)" : "var(--surface)",
          color: locale === "en" ? "#fff" : "var(--ink)",
          fontSize: "11px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        EN
      </button>
    </div>
  );
}

export default LanguageSwitcher;