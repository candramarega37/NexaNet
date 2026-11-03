"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Quiz = { id: string; slug: string; title: string; description: string; published: boolean; _count: { questions: number; attempts: number } };
type Question = { id: string; prompt: string; options: string; correctAnswer: number; explanation: string };
const blank = { slug: "", title: "", description: "" };
const blankQuestion = { prompt: "", options: "", correctAnswer: 0, explanation: "" };

export default function AdminQuizzes() {
  const { t } = useLanguage();
  const [items, setItems] = useState<Quiz[]>([]);
  const [selected, setSelected] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [form, setForm] = useState(blank);
  const [question, setQuestion] = useState(blankQuestion);
  const [message, setMessage] = useState("");
  async function load() {
    const response = await fetch("/api/admin/quizzes");
    const data = await response.json();
    if (response.ok) setItems(data.quizzes);
    else setMessage(data.error);
  }
  const loadQuestions = useCallback(async (id: string) => {
    const response = await fetch(`/api/admin/questions?quizId=${encodeURIComponent(id)}`);
    const data = await response.json();
    if (response.ok) setQuestions(data.questions);
    else setMessage(data.error);
  }, []);
  useEffect(() => {
    let active = true;
    fetch("/api/admin/quizzes").then(async response => ({ response, data: await response.json() })).then(({ response, data }) => {
      if (!active) return;
      if (response.ok) setItems(data.quizzes);
      else setMessage(data.error);
    }).catch(() => { if (active) setMessage("Failed to load quizzes."); });
    return () => { active = false; };
  }, []);
  async function create(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/quizzes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, published: false }) });
    const data = await response.json();
    if (response.ok) {
      setForm(blank);
      setMessage("Quiz saved as draft.");
      await load();
      setQuestions([]);
      setSelected(data.quiz.id);
      await loadQuestions(data.quiz.id);
    } else setMessage(data.error ?? "Quiz failed to save.");
  }
  async function addQuestion(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    const options = question.options.split("\n").map(value => value.trim()).filter(Boolean);
    const response = await fetch("/api/admin/questions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...question, quizId: selected, options, correctAnswer: Number(question.correctAnswer) }) });
    const data = await response.json();
    if (response.ok) {
      setQuestion(blankQuestion);
      await loadQuestions(selected);
    } else setMessage(data.error ?? "Question failed to save.");
  }
  async function removeQuestion(id: string) {
    const response = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    if (response.ok) await loadQuestions(selected);
  }
  async function updateQuiz(id: string, published: boolean) {
    const response = await fetch(`/api/admin/quizzes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published }) });
    if (response.ok) await load();
  }
  async function deleteQuiz(id: string) {
    if (!window.confirm(`Delete quiz? All questions and attempts will be deleted.`)) return;
    const response = await fetch(`/api/admin/quizzes/${id}`, { method: "DELETE" });
    if (response.ok) await load();
  }
  return <div className="admin-quiz-layout">
    <div className="admin-manager">
      <section className="admin-items">
        <h2>{t("admin.quizzes")} ({items.length})</h2>
        {items.map(item => <article className="admin-item" key={item.id}><div><b>{item.title}</b><small>{item._count.questions} {t("quizzes.question")} · {item._count.attempts} attempts · {item.published ? t("admin.published") : t("admin.draft")}</small></div><div className="admin-item-actions"><button onClick={() => { setSelected(item.id); loadQuestions(item.id); }}>{t("admin.questions")}</button><button onClick={() => void updateQuiz(item.id, !item.published)}>{item.published ? t("admin.unpublish") : t("admin.publish")}</button><button className="danger-action" onClick={() => void deleteQuiz(item.id)}>{t("admin.delete")}</button></div></article>)}
        {items.length === 0 && <p className="admin-empty">No quizzes yet.</p>}
      </section>
      <form className="admin-form" onSubmit={create}>
        <h2>{t("admin.addQuiz")}</h2>
        <label>{t("admin.slug")}<input required pattern="[a-z0-9-]+" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="network-basics" /></label>
        <label>{t("admin.title")}<input required minLength={3} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
        <label>{t("admin.description")}<textarea required minLength={10} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
        <button className="button button-dark" type="submit">{t("admin.addQuiz")}</button>
        {message && <p className="admin-message" role="status">{message}</p>}
      </form>
    </div>
    <div className="admin-manager">
      <section className="admin-items">
        <h2>{t("admin.questions")}</h2>
        {selected ? <div className="question-list">{questions.map(q => <article key={q.id}><div><b>{q.prompt}</b><small>{q.options.split("\n").filter(Boolean).length} options · {t("quizzes.answer")}: {Number(q.correctAnswer) + 1}</small></div><button className="danger-action" onClick={() => void removeQuestion(q.id)}>{t("admin.delete")}</button></article>)}<button onClick={() => setSelected("")}>{t("common.back")}</button></div> : <p className="admin-empty">Select a quiz to manage its questions.</p>}
      </section>
      {selected ? <form className="admin-form" onSubmit={addQuestion}>
        <h2>{t("admin.addNew")}</h2>
        <label>{t("quizzes.question")}<input required value={question.prompt} onChange={e => setQuestion({ ...question, prompt: e.target.value })} /></label>
        <label>Options (one per line)<textarea required value={question.options} onChange={e => setQuestion({ ...question, options: e.target.value })} rows={4} /></label>
        <label>{t("quizzes.correct")}<input type="number" min={0} value={question.correctAnswer} onChange={e => setQuestion({ ...question, correctAnswer: Number(e.target.value) })} /></label>
        <label>{t("quizzes.explanation")}<textarea value={question.explanation} onChange={e => setQuestion({ ...question, explanation: e.target.value })} /></label>
        <button className="button button-dark" type="submit">{t("admin.addNew")}</button>
      </form> : null}
    </div>
  </div>;
}
