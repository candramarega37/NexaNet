"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Question = { id: string; prompt: string; options: string[] };
export default function QuizForm({ slug, questions }: { slug: string; questions: Question[] }) {
  const { t, locale } = useLanguage();
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [result, setResult] = useState<{ score: number; correct: number; total: number; explanations: { correct: boolean; explanation: string }[] } | null>(null);
  const [error, setError] = useState("");
  const [hints, setHints] = useState<Record<number, string>>({});
  const answeredCount = answers.filter(answer => answer >= 0).length;
  const isEnglish = locale === "en";
  async function getHint(index: number) {
    const response = await fetch("/api/ai/quiz-hint", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ quizSlug: slug, questionIndex: index }) });
    const data = await response.json(); setHints(current => ({ ...current, [index]: response.ok ? data.hint : data.error }));
  }
  async function submit() {
    setError("");
    if (answers.some(answer => answer < 0)) { setError("Select an answer for every question first."); return; }
    const response = await fetch(`/api/quizzes/${encodeURIComponent(slug)}/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error); return; }
    setResult(data);
  }
  return <div className={`quiz-form${slug === "pretest-jaringan-dasar" ? " quiz-form-pretest" : ""}`}>
    <div className="quiz-progress-card"><div><span>{isEnglish ? "YOUR PROGRESS" : "PROGRES JAWABAN"}</span><b>{answeredCount} / {questions.length} {isEnglish ? "answered" : "terjawab"}</b></div><div className="quiz-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answeredCount}><i style={{width:`${questions.length?answeredCount/questions.length*100:0}%`}}/></div><small>{isEnglish ? "Take your time. You can change your answer before submitting." : "Kerjakan dengan tenang. Jawaban masih bisa diubah sebelum dikirim."}</small></div>
    {questions.map((question, qIndex) => <fieldset className="quiz-question" key={question.id}><legend><span className="quiz-question-index">{String(qIndex + 1).padStart(2,"0")}</span><span>{question.prompt}</span></legend>{question.options.map((option, index) => <label className={answers[qIndex]===index?"selected":""} key={option}><input type="radio" name={question.id} checked={answers[qIndex] === index} disabled={!!result} onChange={() => {setAnswers(current => current.map((answer, i) => i === qIndex ? index : answer));setError("");}} /><span>{option}</span></label>)}<button className="hint-button" type="button" onClick={() => void getHint(qIndex)}>{t("quizzes.hint")}</button>{hints[qIndex] && <p className="quiz-feedback" role="status">{hints[qIndex]}</p>}{result && <p className={result.explanations[qIndex].correct ? "quiz-correct" : "quiz-feedback"}>{result.explanations[qIndex].correct ? t("quizzes.correct") : t("quizzes.review")} {result.explanations[qIndex].explanation}</p>}</fieldset>)}
    {error && <p className="form-error" role="alert">{error}</p>}
    {result ? <div className="quiz-result" role="status"><span>{t("quizzes.score")}</span><b>{result.score}%</b><small>{result.correct} / {result.total} {t("quizzes.correct")}</small></div> : <div className="quiz-submit-row"><button className="button button-dark" type="button" disabled={answeredCount!==questions.length} onClick={submit}>{t("quizzes.submit")} <span>→</span></button>{answeredCount!==questions.length&&<small>{isEnglish?`${questions.length-answeredCount} questions left to answer`:`${questions.length-answeredCount} soal lagi belum dijawab`}</small>}</div>}
  </div>;
}
