"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

export default function AppSidebar({ role, section }: { role: string; section: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? `/${section}`;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  type NavGroup = [string, [string, string][]];
  const studentGroups: NavGroup[] = [
    [t("sidebar.overview"), [[t("nav.dashboard"), "/dashboard"]]],
    [t("sidebar.learn"), [[t("nav.materials"), "/materials"], [t("nav.videos"), "/videos"], [t("nav.learningPath"), "/learning-path"]]],
    [t("sidebar.practice"), [[t("quizzes.pretest"), "/quizzes/pretest-jaringan-dasar"], [t("quizzes.title"), "/quizzes"], [t("quizzes.posttest"), "/quizzes/posttest-jaringan-dasar"], [t("labs.networkLab"), "/network-lab"], [t("labs.troubleshooting"), "/troubleshooting"]]],
    [t("sidebar.explore"), [[t("nav.threeDModels"), "/3d"]]],
    [t("sidebar.analyze"), [[t("nav.progress"), "/progress"], [t("nav.aiTutor"), "/ai-tutor"]]],
    [t("sidebar.account"), [[t("nav.profile"), "/profile"], [t("nav.settings"), "/settings"]]],
    [t("sidebar.guide"), [[t("nav.manualBook"), "/manual-book"]]],
  ];
  const adminGroup: NavGroup = [t("nav.admin"), [[t("admin.dashboard"), "/admin"], [t("admin.materials"), "/admin/materials"], [t("admin.videos"), "/admin/videos"], [t("admin.quizzes"), "/admin/quizzes"], [t("admin.questions"), "/admin/questions"], [t("admin.troubleshooting"), "/admin/troubleshooting"], [t("admin.threeDModels"), "/admin/3d-models"], [t("admin.students"), "/admin/students"], [t("admin.analytics"), "/admin/analytics"]]];
  const groups = (role === "ADMIN" || role === "TEACHER") ? [...studentGroups, adminGroup] : studentGroups;

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const toggleButton = toggleRef.current;
    document.body.style.overflow = "hidden";
    const focusable = () => sidebarRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [];
    focusable()[0]?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleButton?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = Array.from(focusable());
      if (!items.length) {
        event.preventDefault();
        sidebarRef.current?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      toggleButton?.focus();
    };
  }, [open]);

  function isActive(href: string) {
    if (pathname === href) return true;
    if (href === "/materials" || href === "/3d") return pathname.startsWith(`${href}/`);
    if (href === "/quizzes" && pathname.startsWith("/quizzes/")) {
      return !["/quizzes/pretest-jaringan-dasar", "/quizzes/posttest-jaringan-dasar"].includes(pathname);
    }
    return false;
  }

  return <>
    <button ref={toggleRef} className="sidebar-toggle" aria-label={open ? t("sidebar.toggleClose") : t("sidebar.toggleOpen")} aria-expanded={open} aria-controls="app-sidebar" onClick={() => setOpen(value => !value)}>{open ? "×" : "☰"}</button>
    {open && <button className="sidebar-backdrop" aria-label={t("sidebar.toggleClose")} onClick={() => setOpen(false)}/>}
    <aside ref={sidebarRef} id="app-sidebar" className={`app-sidebar${open ? " open" : ""}`} aria-label={t("sidebar.studyRoom")} role={open ? "dialog" : undefined} aria-modal={open || undefined} tabIndex={open ? -1 : undefined}><div className="sidebar-caption"><span>{t("sidebar.studyRoom")}</span><button className="sidebar-close" aria-label={t("sidebar.toggleClose")} onClick={() => setOpen(false)}>×</button></div>
      {groups.map(([heading, links]) => <section className="sidebar-group" key={heading}><h2>{heading}</h2>{links.map(([label, href]) => <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>)}</section>)}
    </aside>
  </>;
}
