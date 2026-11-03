"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type DiagnosisStep = { prompt: string; yes: string; no: string; check?: string; evidence?: string };
type DiagnosisAnswer = "yes" | "no" | "unknown";
type TroubleshootingItem = { slug: string; title: string; description: string; symptoms: string[]; steps: DiagnosisStep[] };

export default function TroubleshootingCase({ item }: { item: TroubleshootingItem }) {
  const { t, locale } = useLanguage();
  const [answers, setAnswers] = useState<Record<number, DiagnosisAnswer>>({});
  const [evidence, setEvidence] = useState<Record<number, string>>({});
  const [reviewed, setReviewed] = useState(false);
  const isEnglish = locale === "en";
  const completed = Object.keys(answers).length;
  const allAnswered = completed === item.steps.length;
  const labels: Record<DiagnosisAnswer, string> = isEnglish
    ? { yes: "Yes, confirmed", no: "No, not observed", unknown: "Not checked" }
    : { yes: "Ya, terkonfirmasi", no: "Tidak ditemukan", unknown: "Belum diperiksa" };

  function saveReport() {
    const lines = [
      item.title,
      item.description,
      "",
      isEnglish ? "SYMPTOMS" : "GEJALA",
      ...item.symptoms.map(symptom => `- ${symptom}`),
      "",
      isEnglish ? "INVESTIGATION RESULTS" : "HASIL INVESTIGASI",
      ...item.steps.flatMap((step, index) => [
        `${index + 1}. ${step.prompt}`,
        `   ${isEnglish ? "Result" : "Hasil"}: ${labels[answers[index]]}`,
        `   ${isEnglish ? "Next action" : "Tindak lanjut"}: ${answers[index] === "yes" ? step.yes : answers[index] === "no" ? step.no : step.check ?? t("labs.runCheckRecord")}`,
        ...(evidence[index]?.trim() ? [`   ${isEnglish ? "Evidence" : "Bukti"}: ${evidence[index].trim()}`] : []),
      ]),
      "",
      isEnglish
        ? "A test result is evidence for the next step, not proof of the root cause. Change one thing at a time and retest."
        : "Hasil pemeriksaan adalah bukti untuk menentukan langkah berikutnya, bukan bukti tunggal penyebab utama. Ubah satu hal setiap kali lalu uji ulang.",
    ];
    const blob = new Blob(["\uFEFF", lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${item.slug}-laporan-investigasi.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function resetInvestigation() {
    setAnswers({});
    setEvidence({});
    setReviewed(false);
  }

  return <div className="trouble-case">
    <section className="case-symptom">
      <div className="case-symptom-heading"><span>{isEnglish ? "INVESTIGATION BRIEF" : "RINGKASAN KASUS"}</span><span>{item.symptoms.length} {t("labs.signsLabel")} · {item.steps.length} {isEnglish ? "checks" : "pemeriksaan"}</span></div>
      <div className="case-symptom-main"><span className="case-symptom-icon" aria-hidden="true">⌁</span><div><h1>{item.title}</h1><p>{item.description}</p></div></div>
      <div className="case-symptom-details"><div className="case-observed"><h3>{isEnglish ? "Reported symptoms" : "Gejala yang dilaporkan"}</h3><ul>{item.symptoms.map(symptom => <li key={symptom}><span aria-hidden="true">✓</span>{symptom}</li>)}</ul></div>
        <div className="case-guidance"><span aria-hidden="true">✦</span><div><b>{isEnglish ? "Investigation goal" : "Tujuan investigasi"}</b><p>{isEnglish ? "Follow the path one check at a time. Record what you observe and use it to choose the next test." : "Ikuti pemeriksaan satu per satu. Catat bukti yang ditemukan dan gunakan untuk menentukan pengujian berikutnya."}</p></div></div>
      </div>
    </section>

    <section className="case-investigation" aria-label={t("labs.diagnosisSteps")}>
      <div className="case-progress-head"><div><span>{isEnglish ? "INVESTIGATION PROGRESS" : "PROGRES INVESTIGASI"}</span><b>{completed} / {item.steps.length} {isEnglish ? "checks recorded" : "pemeriksaan dicatat"}</b></div><button className="case-reset" type="button" onClick={resetInvestigation}>{isEnglish ? "Reset" : "Ulangi"}</button></div>
      <div className="case-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={item.steps.length} aria-valuenow={completed}><span style={{ width: `${item.steps.length ? completed / item.steps.length * 100 : 0}%` }}/></div>
      <h2>{t("labs.diagnosisSteps")}</h2>
      <div className="case-step-list">{item.steps.map((step, index) => <article className={`diagnosis-step${answers[index] ? " answered" : ""}`} key={`${index}-${step.prompt}`}>
        <div className="diagnosis-step-heading"><span>{String(index + 1).padStart(2, "0")}</span><div><b>{step.prompt}</b><p>{step.check ?? (isEnglish ? "Run this check on the affected device or network segment." : "Jalankan pemeriksaan ini pada perangkat atau segmen jaringan yang terdampak.")}</p></div></div>
        <div className="diagnosis-options" role="group" aria-label={`${t("labs.answerForStep")} ${index + 1}`}>
          {(["yes", "no", "unknown"] as DiagnosisAnswer[]).map(value => <label className={answers[index] === value ? "selected" : ""} key={value}>
            <input type="radio" name={`${item.slug}-diagnosis-${index}`} checked={answers[index] === value} onChange={() => { setAnswers(current => ({ ...current, [index]: value })); setReviewed(false); }}/>
            <span>{labels[value]}</span>
          </label>)}
        </div>
        <label className="case-evidence-field"><span>{isEnglish ? "Evidence / notes" : "Bukti / catatan"}</span><textarea value={evidence[index] ?? ""} onChange={event => { setEvidence(current => ({ ...current, [index]: event.target.value })); setReviewed(false); }} placeholder={step.evidence ?? (isEnglish ? "Record a command result, IP address, indicator, or time observed…" : "Catat hasil perintah, alamat IP, indikator, atau waktu pemeriksaan…")} rows={2}/></label>
      </article>)}</div>
      <div className="case-review-actions"><button className="button button-dark" type="button" disabled={!allAnswered} onClick={() => setReviewed(true)}>{isEnglish ? "Review investigation" : "Tinjau hasil investigasi"}<span>↗</span></button>{!allAnswered && <small>{isEnglish ? "Choose a result for each check. Use “Not checked” if you cannot run it yet." : "Pilih hasil untuk setiap pemeriksaan. Pilih “Belum diperiksa” jika belum bisa menjalankannya."}</small>}</div>
    </section>

    {reviewed && <section className="case-feedback" role="status">
      <div className="case-report-heading"><div><span>{isEnglish ? "INVESTIGATION SUMMARY" : "RINGKASAN INVESTIGASI"}</span><h2>{t("labs.analysisTitle")}</h2></div><button className="case-report-download" type="button" onClick={saveReport}>↓ {isEnglish ? "Download report" : "Unduh laporan"}</button></div>
      {item.steps.map((step, index) => <article className="case-result-row" key={index}><div><span>{String(index + 1).padStart(2, "0")}</span><div><b>{step.prompt}</b><small>{labels[answers[index]]}</small></div></div><p>{answers[index] === "yes" ? step.yes : answers[index] === "no" ? step.no : step.check ?? t("labs.runCheckRecord")}</p>{evidence[index]?.trim() && <blockquote>{isEnglish ? "Recorded evidence" : "Bukti tercatat"}: {evidence[index].trim()}</blockquote>}</article>)}
      <div className="case-method-note"><b>{isEnglish ? "Use the result as a lead" : "Gunakan hasil sebagai petunjuk"}</b><p>{isEnglish ? "A single test narrows the investigation but does not prove the root cause. Change one thing at a time, repeat the same test, and record whether the symptom changes." : "Satu hasil pemeriksaan membantu mempersempit investigasi, tetapi belum membuktikan penyebab utama. Ubah satu hal setiap kali, ulangi tes yang sama, lalu catat apakah gejalanya berubah."}</p></div>
    </section>}
  </div>;
}
