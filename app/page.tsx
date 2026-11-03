"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function Mark() {
  return (
    <span className="nx-mark" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <b />
    </span>
  );
}

export default function Home() {
  const { t } = useLanguage();
  
  const flow = [
    { n: "01", title: t("landing.flow.pretest.title"), desc: t("landing.flow.pretest.desc"), href: "/quizzes/pretest-jaringan-dasar", cta: t("landing.flow.pretest.cta") },
    { n: "02", title: t("landing.flow.materials.title"), desc: t("landing.flow.materials.desc"), href: "/materials", cta: t("landing.flow.materials.cta") },
    { n: "03", title: t("landing.flow.posttest.title"), desc: t("landing.flow.posttest.desc"), href: "/quizzes/posttest-jaringan-dasar", cta: t("landing.flow.posttest.cta") },
    { n: "04", title: t("landing.flow.lab.title"), desc: t("landing.flow.lab.desc"), href: "/network-lab", cta: t("landing.flow.lab.cta") },
  ];

  const materials = [
    { slug: "dasar-jaringan-komputer", tag: "FOUNDATION", title: t("landing.materials.items.0.title"), desc: t("landing.materials.items.0.desc"), time: "12 min" },
    { slug: "osi-layer", tag: "CONCEPT", title: t("landing.materials.items.1.title"), desc: t("landing.materials.items.1.desc"), time: "18 min" },
    { slug: "tcp-ip", tag: "CONCEPT", title: t("landing.materials.items.2.title"), desc: t("landing.materials.items.2.desc"), time: "16 min" },
    { slug: "ipv4-addressing", tag: "PRACTICE", title: t("landing.materials.items.3.title"), desc: t("landing.materials.items.3.desc"), time: "17 min" },
    { slug: "ipv4-subnetting", tag: "PRACTICE", title: t("landing.materials.items.4.title"), desc: t("landing.materials.items.4.desc"), time: "24 min" },
    { slug: "troubleshooting-jaringan", tag: "PRACTICE", title: t("landing.materials.items.5.title"), desc: t("landing.materials.items.5.desc"), time: "22 min" },
  ];

  return (
    <main className="nx">
      <header className="nx-nav">
        <Link href="/" className="nx-brand">
          <Mark />
          <span>
            NEXA<span className="nx-brand-light">NET</span>
          </span>
        </Link>
        <nav className="nx-links">
          <a href="#alur">{t("nav.learningPath")}</a>
          <a href="#materi">{t("nav.materials")}</a>
          <a href="#tes">{t("nav.quizzes")}</a>
          <a href="#lab">{t("nav.networkLab")}</a>
        </nav>
        <div className="nx-nav-actions">
          <LanguageSwitcher />
          <Link className="nx-login" href="/login">
            {t("nav.login")}
          </Link>
          <Link className="nx-btn nx-btn-primary nx-btn-sm" href="/dashboard">
            {t("landing.hero.cta.primary")} <span>↗</span>
          </Link>
        </div>
      </header>

      <section className="nx-hero">
        <div className="nx-hero-copy">
          <div className="nx-kicker">
            <span className="nx-dot" /> {t("landing.hero.kicker")}
          </div>
          <h1>
            {t("landing.hero.title.line1")}
            <br />
            <em>{t("landing.hero.title.line2")}</em>
          </h1>
          <p>
            {t("landing.hero.description")}
          </p>
          <div className="nx-hero-actions">
            <Link className="nx-btn nx-btn-primary" href="/dashboard">
              {t("landing.hero.cta.primary")} <span>↗</span>
            </Link>
            <Link className="nx-btn nx-btn-ghost" href="#alur">
              {t("landing.hero.cta.secondary")} <span>→</span>
            </Link>
          </div>
          <div className="nx-hero-meta">
            <div>
              <b>25</b>
              <small>{t("landing.hero.meta.pretest")}</small>
            </div>
            <div>
              <b>6</b>
              <small>{t("landing.hero.meta.materials")}</small>
            </div>
            <div>
              <b>25</b>
              <small>{t("landing.hero.meta.posttest")}</small>
            </div>
          </div>
        </div>
        <div className="nx-hero-art" aria-hidden="true">
          <div className="nx-orbit nx-orbit-a" />
          <div className="nx-orbit nx-orbit-b" />
          <svg className="nx-wires" viewBox="0 0 520 420">
            <path d="M70 120 200 70 340 120 450 70M70 120 110 300 250 360 400 290M200 70 250 220 340 120 400 290M110 300 250 220 450 70M340 120 455 200" />
            <circle cx="70" cy="120" r="5" />
            <circle cx="200" cy="70" r="5" />
            <circle cx="450" cy="70" r="5" />
            <circle cx="455" cy="200" r="5" />
            <circle cx="110" cy="300" r="5" />
            <circle cx="400" cy="290" r="5" />
          </svg>
          <div className="nx-node nx-node-a">
            <span className="nx-node-ic">⌁</span>
            <span>
              <b>Router</b>
              <small>layer 3 · routing</small>
            </span>
          </div>
          <div className="nx-node nx-node-b">
            <span className="nx-node-ic">▤</span>
            <span>
              <b>Switch</b>
              <small>layer 2 · frame</small>
            </span>
          </div>
          <div className="nx-score">
            <small>CONTOH HASIL</small>
            <b>
              Pretest 48 → Posttest 88
            </b>
            <i>
              <u style={{ width: "88%" }} />
            </i>
          </div>
          <div className="nx-ip">
            <small>IP ADDRESS</small>
            <b>192.168.1.10/24</b>
            <em>● ACTIVE</em>
          </div>
        </div>
      </section>

      <section className="nx-flow" id="alur">
        <div className="nx-section-head">
          <div className="nx-kicker">{t("landing.sections.featured.title")}</div>
          <h2>
            {t("landing.flow.subtitle") || t("landing.flow.subtitle")}
          </h2>
        </div>
        <div className="nx-flow-grid">
          {flow.map((s) => (
            <article key={s.n} className="nx-step">
              <span className="nx-step-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <Link href={s.href}>
                {s.cta} <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="nx-materi" id="materi">
        <div className="nx-section-head nx-section-head-row">
          <div>
            <div className="nx-kicker">{t("landing.sections.featured.title")}</div>
            <h2>
              {t("landing.sections.featured.subtitle")}
            </h2>
          </div>
          <Link className="nx-btn nx-btn-ghost" href="/materials">
            {t("landing.sections.featured.allMaterials")} <span>↗</span>
          </Link>
        </div>
        <div className="nx-materi-grid">
          {materials.map((m, i) => (
            <Link key={m.slug} href={`/materials/${m.slug}`} className="nx-card">
              <div className={`nx-card-art art-${(i % 3) + 1}`}>
                <span>NEXA / MODUL {String(i + 1).padStart(2, "0")}</span>
                <b>{m.title.charAt(0)}</b>
                <em>↗</em>
              </div>
              <div className="nx-card-meta">
                <span>{m.tag}</span>
                <span>◷ {m.time}</span>
              </div>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="nx-tes" id="tes">
        <div className="nx-section-head">
          <div className="nx-kicker">{t("landing.sections.pretestPosttest.title")}</div>
          <h2>
            {t("landing.sections.pretestPosttest.subtitle")}
          </h2>
          <p className="nx-section-desc">
            {t("landing.sections.pretestPosttest.description") || "Both packages cover network basics, devices, topologies, OSI & TCP/IP, IPv4 & subnetting, routing-switching, security, and troubleshooting — with parallel questions for valid gain measurement."}
          </p>
        </div>
        <div className="nx-tes-grid">
          <article className="nx-test nx-test-pre">
            <span className="nx-test-tag">{t("landing.sections.pretestPosttest.before")}</span>
            <h3>{t("landing.sections.pretestPosttest.pretestTitle")}</h3>
            <p>{t("landing.sections.pretestPosttest.pretestDesc")}</p>
            <ul>
              <li>{t("landing.sections.pretestPosttest.features.0") || "25 multiple choice"}</li>
              <li>{t("landing.sections.pretestPosttest.features.1") || "Score & instant review"}</li>
              <li>{t("landing.sections.pretestPosttest.features.2") || "Saved to your progress"}</li>
            </ul>
            <Link className="nx-btn nx-btn-primary" href="/quizzes/pretest-jaringan-dasar">
              {t("landing.sections.pretestPosttest.pretestCta")} <span>↗</span>
            </Link>
          </article>
          <article className="nx-test nx-test-post">
            <span className="nx-test-tag">{t("landing.sections.pretestPosttest.after")}</span>
            <h3>{t("landing.sections.pretestPosttest.posttestTitle")}</h3>
            <p>{t("landing.sections.pretestPosttest.posttestDesc")}</p>
            <ul>
              <li>{t("landing.sections.pretestPosttest.postFeatures.0") || "25 parallel multiple choice"}</li>
              <li>{t("landing.sections.pretestPosttest.postFeatures.1") || "Score & instant review"}</li>
              <li>{t("landing.sections.pretestPosttest.postFeatures.2") || "Proof of learning gain"}</li>
            </ul>
            <Link className="nx-btn nx-btn-dark" href="/quizzes/posttest-jaringan-dasar">
              {t("landing.sections.pretestPosttest.posttestCta")} <span>↗</span>
            </Link>
          </article>
        </div>
      </section>

      <section className="nx-lab" id="lab">
        <div className="nx-lab-copy">
          <div className="nx-kicker">{t("landing.sections.lab.title")}</div>
          <h2>
            {t("landing.sections.lab.subtitle")}
          </h2>
          <p>{t("landing.sections.lab.description")}</p>
          <div className="nx-hero-actions">
            <Link className="nx-btn nx-btn-dark" href="/network-lab">
              {t("landing.sections.lab.networkLab")} <span>↗</span>
            </Link>
            <Link className="nx-btn nx-btn-ghost" href="/troubleshooting">
              {t("landing.sections.lab.troubleshooting")} <span>→</span>
            </Link>
          </div>
        </div>
        <div className="nx-lab-cards">
          <Link href="/network-lab" className="nx-mini">
            <b>{t("landing.sections.lab.networkLab")}</b>
            <small>{t("landing.sections.lab.networkLabDesc") || "Simulate star, bus, mesh topologies"}</small>
            <span>↗</span>
          </Link>
          <Link href="/troubleshooting" className="nx-mini">
            <b>{t("landing.sections.lab.troubleshooting")}</b>
            <small>{t("landing.sections.lab.troubleshootingDesc") || "5 cases: no-internet, IP conflict, DNS…"}</small>
            <span>↗</span>
          </Link>
        </div>
      </section>

      <section className="nx-closing">
        <div className="nx-kicker nx-kicker-light">{t("landing.sections.closing.title") || "READY TO START LEARNING?"}</div>
        <h2>
          {t("landing.sections.closing.subtitle") || "Sign in, follow the flow, watch your progress grow."}
        </h2>
        <div className="nx-hero-actions nx-center">
          <Link className="nx-btn nx-btn-light" href="/dashboard">
            {t("landing.sections.closing.cta.primary") || "Sign in to dashboard"} <span>↗</span>
          </Link>
          <Link className="nx-btn nx-btn-outline-light" href="/quizzes/pretest-jaringan-dasar">
            {t("landing.sections.closing.cta.secondary") || "Start pretest"} <span>→</span>
          </Link>
        </div>
      </section>

      <footer className="nx-footer">
        <Link href="/" className="nx-brand">
          <Mark />
          <span>
            NEXA<span className="nx-brand-light">NET</span>
          </span>
        </Link>
        <span className="nx-footer-tag">{t("landing.footer.tagline") || "Learn. Practice. Troubleshoot."}</span>
        <span className="nx-footer-copy">{t("landing.footer.copyright") || "© 2026 NEXANET · PRETEST → MATERIALS → POSTTEST → LAB"}</span>
      </footer>
    </main>
  );
}
