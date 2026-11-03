import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { getTranslation, type Locale } from "@/lib/i18n";
import LoginForm from "@/components/LoginForm";
import CompleteMaterial from "@/components/CompleteMaterial";
import QuizForm from "@/components/QuizForm";
import AdminMaterials from "@/components/AdminMaterials";
import LogoutButton from "@/components/LogoutButton";
import VideoActions from "@/components/VideoActions";
import NetworkLabSimulator from "@/components/NetworkLabSimulator";
import TroubleshootingCase from "@/components/TroubleshootingCase";
import AiTutorChat from "@/components/AiTutorChat";
import MaterialsBrowser from "@/components/MaterialsBrowser";
import AdminVideos from "@/components/AdminVideos";
import AdminQuizzes from "@/components/AdminQuizzes";
import AdminStudents from "@/components/AdminStudents";
import AdminAnalytics from "@/components/AdminAnalytics";
import ProfilePanel from "@/components/ProfilePanel";
import PasswordForm from "@/components/PasswordForm";
import ThreeDModelCatalog from "@/components/ThreeDModelCatalog";
import MaterialAiQuestion from "@/components/MaterialAiQuestion";
import MaterialContent from "@/components/MaterialContent";
import DownloadMaterial from "@/components/DownloadMaterial";
import AdminTroubleshooting from "@/components/AdminTroubleshooting";
import AdminThreeDModels from "@/components/AdminThreeDModels";
import VideoPlayer from "@/components/VideoPlayer";
import AppSidebar from "@/components/AppSidebar";
import RegisterForm from "@/components/RegisterForm";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import GlobalSearch from "@/components/GlobalSearch";
import RelatedResources from "@/components/RelatedResources";
import VideosBrowser from "@/components/VideosBrowser";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LearningJourney, { type LearningJourneyState } from "@/components/LearningJourney";
import { findRelatedContent } from "@/lib/content-links";
import { localizeDifficulty, localizeMaterial } from "@/lib/material-locales";
import { buildLearningJourney, LEARNING_MATERIAL_SEQUENCE } from "@/lib/learning-journey.mjs";

function getPages(t: (key: string) => string): Record<string, { title: string; desc: string; links: [string, string][] }> {
  return {
    dashboard: { title: t("dashboard.title"), desc: t("dashboard.subtitle"), links: [[t("dashboard.pretest"), "/quizzes/pretest-jaringan-dasar"], [t("dashboard.materials"), "/materials"], [t("dashboard.posttest"), "/quizzes/posttest-jaringan-dasar"]] },
    materials: { title: t("materials.title"), desc: t("materials.subtitle"), links: [[t("landing.materials.items.0.title"), "/materials/dasar-jaringan-komputer"], [t("landing.materials.items.1.title"), "/materials/osi-layer"], [t("landing.materials.items.3.title") + " & " + t("landing.materials.items.4.title"), "/materials/ipv4-subnetting"], [t("landing.materials.items.5.title"), "/materials/troubleshooting-jaringan"]] },
    videos: { title: t("videos.title"), desc: t("videos.subtitle"), links: [[t("videos.l1"), "/videos/pengenalan-jaringan"], [t("videos.l2"), "/videos/model-osi"], [t("videos.l3"), "/videos/subnetting-ipv4"]] },
    quizzes: { title: t("quizzes.title"), desc: t("quizzes.subtitle"), links: [[t("quizzes.pretest"), "/quizzes/pretest-jaringan-dasar"], [t("quizzes.posttest"), "/quizzes/posttest-jaringan-dasar"], [t("landing.materials.items.0.title"), "/quizzes/dasar-jaringan"], ["OSI & TCP/IP", "/quizzes/osi-tcp-ip"], [t("landing.materials.items.3.title"), "/quizzes/ipv4"]] },
    "learning-path": { title: t("nav.learningPath"), desc: t("pages.pathLede"), links: [["01 · " + t("landing.materials.items.0.title"), "/materials/dasar-jaringan-komputer"], ["02 · " + t("landing.materials.items.1.title"), "/materials/osi-layer"], ["03 · " + t("landing.materials.items.2.title"), "/materials/tcp-ip"], ["04 · " + t("landing.materials.items.3.title"), "/materials/ipv4-addressing"], ["05 · " + t("landing.materials.items.4.title"), "/materials/ipv4-subnetting"], ["06 · " + t("landing.materials.items.5.title"), "/materials/troubleshooting-jaringan"]] },
    "manual-book": { title: t("manualBook.title"), desc: t("manualBook.intro"), links: [] },
    "3d": { title: t("threeD.title"), desc: t("threeD.subtitle"), links: [["Router", "/3d/router"], ["Switch", "/3d/switch"], ["Access point", "/3d/access-point"]] },
    "network-lab": { title: t("labs.networkLab"), desc: t("labs.subtitle"), links: [["Star topology", "/network-lab/star"], ["Bus topology", "/network-lab/bus"], ["Mesh topology", "/network-lab/mesh"]] },
    troubleshooting: { title: t("labs.troubleshooting"), desc: t("labs.troubleshootingSubtitle"), links: [["No internet connection", "/troubleshooting/no-internet"], ["IP address conflict", "/troubleshooting/ip-conflict"], ["Slow Wi-Fi", "/troubleshooting/slow-wifi"]] },
    progress: { title: t("nav.progress"), desc: t("pages.genericDesc"), links: [[t("dashboard.materials"), "/materials"], [t("nav.learningPath"), "/learning-path"]] },
    "ai-tutor": { title: t("nav.aiTutor"), desc: t("pages.genericDesc"), links: [[t("dashboard.materials"), "/materials"], [t("quizzes.title"), "/quizzes"]] },
    profile: { title: t("nav.profile"), desc: t("pages.genericDesc"), links: [[t("pages.toDashboard"), "/dashboard"]] },
    settings: { title: t("nav.settings"), desc: t("pages.genericDesc"), links: [[t("pages.toDashboard"), "/dashboard"]] },
    login: { title: t("auth.welcome"), desc: t("auth.subtitle"), links: [[t("pages.toDashboard"), "/dashboard"], [t("dashboard.materials"), "/materials"]] },
    admin: { title: t("admin.dashboard"), desc: t("pages.adminDashLede"), links: [[t("admin.materials"), "/admin/materials"], [t("admin.videos"), "/admin/videos"], [t("admin.quizzes"), "/admin/quizzes"], [t("admin.analytics"), "/admin/analytics"]] },
  };
}

function titleize(slug: string) { return slug.split("-").map(part => part === "ipv4" ? "IPv4" : part === "tcp" ? "TCP" : part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }

async function getLearningJourneyForUser(userId: string): Promise<LearningJourneyState> {
  const [materials, attempts, savedLabs] = await Promise.all([
    db.materialProgress.findMany({
      where: { userId, material: { slug: { in: LEARNING_MATERIAL_SEQUENCE } } },
      select: { status: true, material: { select: { slug: true } } },
    }),
    db.quizAttempt.findMany({
      where: { userId, quiz: { slug: { in: ["pretest-jaringan-dasar", "posttest-jaringan-dasar"] } } },
      select: { quiz: { select: { slug: true } } },
    }),
    db.activity.count({ where: { userId, kind: "lab-simulation" } }),
  ]);
  return buildLearningJourney({
    pretestComplete: attempts.some(({ quiz }) => quiz.slug === "pretest-jaringan-dasar"),
    materials: materials.map(({ status, material }) => ({ slug: material.slug, status })),
    posttestComplete: attempts.some(({ quiz }) => quiz.slug === "posttest-jaringan-dasar"),
    networkLabSaved: savedLabs > 0,
  }) as LearningJourneyState;
}

function renderLearningJourney(journey: LearningJourneyState, materialRows: { slug: string; title: string }[], t: (key: string) => string) {
  const materialTitle = journey.nextAction.slug
    ? materialRows.find(({ slug }) => slug === journey.nextAction.slug)?.title ?? titleize(journey.nextAction.slug)
    : "";
  const nextActionLabel = journey.nextAction.kind === "pretest" ? t("pages.journeyContinuePretest")
    : journey.nextAction.kind === "material" ? `${t("pages.journeyContinueMaterial")}: ${materialTitle}`
    : journey.nextAction.kind === "posttest" ? t("pages.journeyContinuePosttest")
    : journey.nextAction.kind === "network-lab" ? t("pages.journeyContinueNetworkLab")
    : t("pages.journeyContinueTroubleshooting");
  return <LearningJourney
    journey={journey}
    title={t("pages.journeyTitle")}
    intro={t("pages.journeyIntro")}
    nextStepLabel={t("pages.journeyNextStep")}
    nextActionLabel={nextActionLabel}
    completedLabel={t("pages.stCompleted")}
    inProgressLabel={t("pages.stInProgress")}
    notStartedLabel={t("pages.stNotStarted")}
    materialsProgressLabel={t("pages.journeyMaterialsProgress")}
    stages={[
      { title: t("quizzes.pretest"), description: t("pages.journeyPretestDesc"), href: "/quizzes/pretest-jaringan-dasar" },
      { title: t("dashboard.materials"), description: t("pages.journeyMaterialsDesc"), href: "/learning-path#materi" },
      { title: t("quizzes.posttest"), description: t("pages.journeyPosttestDesc"), href: "/quizzes/posttest-jaringan-dasar" },
      { title: `${t("labs.networkLab")} → ${t("labs.troubleshooting")}`, description: t(journey.networkLabSaved ? "pages.journeyLabsSavedDesc" : "pages.journeyLabsDesc"), href: journey.networkLabSaved ? "/troubleshooting" : "/network-lab" },
    ]}
  />;
}

export default async function FeaturePage({ params, searchParams }: { params: Promise<{ segments: string[] }>; searchParams: Promise<{ token?: string; next?: string }> }) {
  const { segments } = await params;
  const query = await searchParams;
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("locale")?.value;
  const locale: Locale = savedLocale === "en" ? "en" : "id";
  const t = (key: string) => getTranslation(locale, key);
  const pages = getPages(t);
  const [section, ...rest] = segments;
  const config = pages[section] ?? { title: titleize(rest.at(-1) ?? section), desc: t("pages.genericDesc"), links: [[t("pages.backList"), `/${section}`], [t("pages.toDashboard"), "/dashboard"]] as [string, string][] };
  const nested = rest.length > 0;
  const user = await getSessionUser();
  const requestedPath = `/${segments.join("/")}`;
  if ((section === "dashboard" || section === "progress" || section === "profile" || section === "settings") && !user) redirect(`/login?next=${encodeURIComponent(requestedPath)}`);
  if (section === "admin" && !user) redirect(`/login?next=${encodeURIComponent(requestedPath)}`);
  if (section === "admin" && user && user.role !== "ADMIN" && user.role !== "TEACHER") redirect("/dashboard");
  if (section === "materials" && !nested) {
    const materials = await db.material.findMany({ where: { published: true }, select: { slug: true, title: true, description: true, category: true, difficulty: true, durationMins: true, progress: { where: { userId: user?.id ?? "" }, select: { status: true, percent: true }, take: 1 } }, orderBy: { title: "asc" } });
    const browserItems=materials.map(({progress: records,...item})=>({ ...item,status:records[0]?.status??"NOT_STARTED",percent:records[0]?.percent??0 }));
    return <Shell section={section} user={user} t={t}><h1>{config.title}</h1><p className="app-lede">{config.desc}</p>{browserItems.length?<MaterialsBrowser materials={browserItems}/>:<div className="demo-callout">{t("pages.emptyMaterials")}</div>}</Shell>;
  }
  if (section === "materials" && nested) {
    const material = await db.material.findFirst({ where: { slug: rest[0], published: true } });
    if (!material) notFound();
    const localizedMaterial = localizeMaterial(material, locale);
    const progress = user ? await db.materialProgress.findUnique({ where: { userId_materialId: { userId: user.id, materialId: material.id } } }) : null;
    const [videos,quizzes,threeDModels]=await Promise.all([db.video.findMany({where:{published:true},select:{id:true,title:true,description:true}}),db.quiz.findMany({where:{published:true},select:{slug:true,title:true,description:true}}),db.threeDModel.findMany({where:{published:true},select:{slug:true,title:true,description:true}})]);
    const related=findRelatedContent(`${localizedMaterial.title} ${localizedMaterial.description} ${localizedMaterial.category}`,[...videos.map(item=>({...item,href:`/videos/${item.id}`,type:"Video"})),...quizzes.map(item=>({...item,id:item.slug,href:`/quizzes/${item.slug}`,type:"Quiz"})),...threeDModels.map(item=>({...item,id:item.slug,href:`/3d/${item.slug}`,type:"3D Model"}))],6);
    const objectives = localizedMaterial.objectives.split(";").map(item=>item.trim());
    return <Shell section={section} user={user} t={t}><div className="section-kicker">{localizedMaterial.category} · {localizeDifficulty(material.difficulty, locale)} · {material.durationMins} {t("videos.minSuffix")}</div><h1>{localizedMaterial.title}</h1><p className="app-lede">{localizedMaterial.description}</p><nav className="material-toc" aria-label={t("pages.toc")}><a href="#tujuan">{t("pages.objectivesTitle")}</a><a href="#isi-materi">{t("pages.contentTitle")}</a><a href="#konten-terkait">{t("pages.relatedDefault")}</a></nav><article className="demo-callout material-article"><section className="material-objectives"><b id="tujuan">{t("pages.objectivesTitle")}</b><ul>{objectives.map(item=><li key={item}>{item}</li>)}</ul></section><section className="material-reading"><h2 id="isi-materi">{t("pages.contentTitle")}</h2><MaterialContent content={localizedMaterial.content}/></section><DownloadMaterial title={localizedMaterial.title} description={localizedMaterial.description} objectives={objectives} content={localizedMaterial.content} label={locale === "en" ? "Download material" : "Unduh materi"} objectivesLabel={t("pages.objectivesTitle")} materialLabel={t("pages.contentTitle")}/></article><p className="progress-copy">{t("pages.progressSaved")}: {progress?.percent ?? 0}%</p><CompleteMaterial slug={material.slug}/><MaterialAiQuestion slug={material.slug}/><div id="konten-terkait"><RelatedResources resources={related} title={t("pages.relatedDefault")}/></div></Shell>;
  }
  if (section === "videos" && !nested) {
    const videos = await db.video.findMany({ where: { published: true }, select: { id: true, title: true, description: true, durationMins: true }, orderBy: { title: "asc" } });
    return <Shell section={section} user={user} t={t}><h1>{config.title}</h1><p className="app-lede">{config.desc}</p><VideosBrowser videos={videos}/></Shell>;
  }
  if (section === "videos" && nested) {
    const video = await db.video.findFirst({ where: { id: rest[0], published: true } });
    if (!video) notFound();
    return <Shell section={section} user={user} t={t}><div className="section-kicker">{t("videos.kicker")} · {video.durationMins} {t("videos.minSuffix")}</div><h1>{video.title}</h1><p className="app-lede">{video.description}</p><VideoPlayer url={video.videoUrl} title={video.title}/><VideoActions id={video.id}/><Link className="text-link" href="/materials">{t("videos.readRelated")} <span>→</span></Link></Shell>;
  }
  if (section === "quizzes" && !nested) {
    const quizzes = await db.quiz.findMany({ where: { published: true }, select: { slug: true, title: true, description: true, _count: { select: { questions: true } } } });
    const ordered = [...quizzes].sort((a, b) => (a.slug === "pretest-jaringan-dasar" ? -1 : b.slug === "pretest-jaringan-dasar" ? 1 : a.slug === "posttest-jaringan-dasar" ? -1 : b.slug === "posttest-jaringan-dasar" ? 1 : a.title.localeCompare(b.title)));
    return <Shell section={section} user={user} t={t}><div className="section-kicker">{t("pages.quizKickerPractice")}</div><h1>{config.title}</h1><p className="app-lede">{config.desc}</p><div className="recommend-card"><span>{t("pages.quizRecommendTitle")}</span><b>{t("pages.quizRecommendSub")}</b><Link href="/quizzes/pretest-jaringan-dasar">{t("pages.quizRecommendCta")}</Link></div><div className="quiz-library-grid">{ordered.map((quiz,index)=>{const kind=quiz.slug==="pretest-jaringan-dasar"?"pretest":quiz.slug==="posttest-jaringan-dasar"?"posttest":"practice";return <Link className="quiz-library-card" data-quiz-kind={kind} href={`/quizzes/${quiz.slug}`} key={quiz.slug}><div className="quiz-library-art"><span>{locale==="en"?`ASSESSMENT ${String(index+1).padStart(2,"0")}`:`LATIHAN ${String(index+1).padStart(2,"0")}`}</span><b aria-hidden="true">{kind==="pretest"?"◷":kind==="posttest"?"✓":"✳"}</b><small>{kind==="pretest"?t("quizzes.pretest"):kind==="posttest"?t("quizzes.posttest"):t("quizzes.title")}</small></div><div className="quiz-library-copy"><div><span>{kind==="pretest"?t("quizzes.pretest"):kind==="posttest"?t("quizzes.posttest"):locale==="en"?"PRACTICE":"LATIHAN"}</span><small>{quiz._count.questions} {t("pages.questionsSuffix")}</small></div><h2>{quiz.title}</h2><p>{quiz.description}</p><span className="quiz-library-action">{locale==="en"?"Start quiz":"Mulai kuis"}<b aria-hidden="true">→</b></span></div></Link>})}</div></Shell>;
  }
  if (section === "quizzes" && nested) {
    const quiz = await db.quiz.findFirst({ where: { slug: rest[0], published: true }, include: { questions: { select: { id: true, prompt: true, options: true } } } });
    if (!quiz) notFound();
    const questions = quiz.questions.map(question=>({ ...question, options: JSON.parse(question.options) as string[] }));
    const isPre = quiz.slug === "pretest-jaringan-dasar";
    const isPost = quiz.slug === "posttest-jaringan-dasar";
    return <Shell section={section} user={user} t={t}><div className="section-kicker">{isPre ? t("pages.quizKickerPre") : isPost ? t("pages.quizKickerPost") : t("pages.quizKickerPractice")} · {questions.length} {t("pages.questionsWord")}</div><h1>{quiz.title}</h1><p className="app-lede">{quiz.description}</p>{(isPre || isPost) && <div className="demo-note quiz-intro-note"><span>i</span><p>{isPre ? t("pages.notePre") : t("pages.notePost")}</p></div>}<QuizForm slug={quiz.slug} questions={questions}/></Shell>;
  }
  if (section === "network-lab" && !nested) return <Shell section={section} user={user} t={t}><div className="section-kicker">{t("labs.title")} / {t("labs.subtitle")}</div><h1>{t("labs.networkLab")}</h1><p className="app-lede">{t("labs.subtitle")}</p><NetworkLabSimulator/></Shell>;
  if (section === "3d") {
    const models = await db.threeDModel.findMany({ where: { published: true }, include: { hotspots: { orderBy: { sortOrder: "asc" } } }, orderBy: { title: "asc" } });
    const builtInModels: Record<string, string> = {
      "access-point": "/models/access-point.glb",
      "ethernet-cable": "/models/ethernet-cable.glb",
      "network-card": "/models/network-card.glb",
      "rj45-connector": "/models/rj45-connector.glb",
      router: "/models/router.glb",
      switch: "/models/switch.glb",
    };
    const modelViews = models.map(item => ({ ...item, components: JSON.parse(item.components) as string[], modelUrl: item.modelUrl ?? builtInModels[item.slug] ?? null }));
    return <Shell section={section} user={user} t={t}><ThreeDModelCatalog key={rest[0] ?? "catalog"} models={modelViews} initialSlug={rest[0]}/></Shell>;
  }
  if (section === "troubleshooting" && !nested) {
    const cases = await db.troubleshootingCase.findMany({ where: { published: true }, select: { slug: true, title: true, description: true }, orderBy: { title: "asc" } });
    const symbols: Record<string,string>={"no-internet":"⌁","ip-conflict":"⇄","slow-wifi":"◔","no-dhcp-address":"⌗","dns-failure":"⌕"};
    return <Shell section={section} user={user} t={t}><div className="section-kicker">{t("quizzes.pretest")} / {t("labs.troubleshooting")}</div><h1>{config.title}</h1><p className="app-lede">{config.desc}</p><div className="troubleshooting-catalog">{cases.map((item,index)=><Link className="trouble-catalog-card" href={`/troubleshooting/${item.slug}`} key={item.slug}><div className="trouble-catalog-art" data-case-index={index%5}><span>{locale==="en"?`CASE ${String(index+1).padStart(2,"0")}`:`KASUS ${String(index+1).padStart(2,"0")}`}</span><b aria-hidden="true">{symbols[item.slug]??"⌁"}</b><small>{locale==="en"?"NETWORK DIAGNOSTICS":"DIAGNOSTIK JARINGAN"}</small></div><div className="trouble-catalog-copy"><h2>{item.title}</h2><p>{item.description}</p><span>{locale==="en"?"Open investigation":"Mulai investigasi"}<b aria-hidden="true">→</b></span></div></Link>)}</div>{!cases.length && <div className="demo-callout">{t("admin.noMaterials")}</div>}</Shell>;
  }
  if (section === "troubleshooting" && nested) {
    const item = await db.troubleshootingCase.findFirst({ where: { slug: rest[0], published: true } });
    if (!item) notFound();
    return <Shell section={section} user={user} t={t}><div className="section-kicker">{t("labs.troubleshooting")} / {t("quizzes.pretest")}</div><TroubleshootingCase key={item.slug} item={{ ...item, symptoms: JSON.parse(item.symptoms) as string[], steps: JSON.parse(item.steps) as { prompt: string; yes: string; no: string; check?: string; evidence?: string }[] }}/></Shell>;
  }
  if (section === "interactive") notFound();
  if (section === "ai-tutor") return <Shell section={section} user={user} t={t}><div className="section-kicker">{t("nav.aiTutor")}</div><h1>{config.title}</h1><p className="app-lede">{config.desc}</p><AiTutorChat/></Shell>;
  if (section === "manual-book") return <Shell section={section} user={user} t={t}>
    <div className="section-kicker">{t("manualBook.kicker")}</div>
    <h1>{t("manualBook.title")}</h1>
    <p className="app-lede">{t("manualBook.intro")}</p>
    <article className="manual-book-panel">
      <section className="manual-book-overview">
        <h2>{t("manualBook.contentsHeading")}</h2>
        <ul>
          {["contents1", "contents2", "contents3", "contents4"].map((key) => <li key={key}>{t(`manualBook.${key}`)}</li>)}
        </ul>
      </section>
      <h2 className="manual-book-formats-title">{t("manualBook.formatsHeading")}</h2>
      <div className="manual-book-download-grid">
        <section className="manual-book-download-card">
          <span className="manual-book-file-badge docx">DOCX</span>
          <h3>{t("manualBook.wordTitle")}</h3>
          <p>{t("manualBook.wordDescription")}</p>
          <a className="manual-book-download-action" href="/downloads/Manual-Pengguna-NexaNet.docx" download="Manual-Pengguna-NexaNet.docx">{t("manualBook.wordAction")} <span aria-hidden="true">↓</span></a>
        </section>
        <section className="manual-book-download-card">
          <span className="manual-book-file-badge pdf">PDF</span>
          <h3>{t("manualBook.pdfTitle")}</h3>
          <p>{t("manualBook.pdfDescription")}</p>
          <a className="manual-book-download-action" href="/downloads/Manual-Pengguna-NexaNet.pdf" download="Manual-Pengguna-NexaNet.pdf">{t("manualBook.pdfAction")} <span aria-hidden="true">↓</span></a>
        </section>
      </div>
      <p className="manual-book-note">{t("manualBook.note")}</p>
    </article>
  </Shell>;
  if (section === "dashboard") {
    if (!user) redirect(`/login?next=${encodeURIComponent("/dashboard")}`);
    const [[materials, videos, attempts, progress, recommended, recent], journey, journeyMaterialRows] = await Promise.all([
      Promise.all([
        db.materialProgress.count({ where: { userId: user.id, status: "COMPLETED" } }),
        db.activity.count({ where: { userId: user.id, kind: "VIDEO_WATCHED" } }),
        db.quizAttempt.findMany({ where: { userId: user.id }, select: { score: true }, orderBy: { completedAt: "desc" } }),
        db.materialProgress.findMany({ where: { userId: user.id, status: "IN_PROGRESS" }, include: { material: { select: { slug: true, title: true } } }, take: 1 }),
        db.material.findFirst({ where: { published: true, progress: { none: { userId: user.id } } }, select: { slug: true, title: true }, orderBy: { title: "asc" } }),
        db.activity.findMany({ where: { userId: user.id }, select: { id: true, kind: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 4 }),
      ]),
      getLearningJourneyForUser(user.id),
      db.material.findMany({ where: { slug: { in: LEARNING_MATERIAL_SEQUENCE } }, select: { slug: true, title: true } }),
    ]);
    const average = attempts.length ? Math.round(attempts.reduce((sum,item)=>sum+item.score,0)/attempts.length) : 0;
    return <Shell section={section} user={user} t={t}>
      <div className="dashboard-page">
        <section className="dashboard-welcome">
          <div><div className="section-kicker">{t("pages.dashboardKicker")}</div><h1>{t("pages.dashboardHello")} {user.name} 👋</h1><p className="app-lede">{t("pages.dashboardLede")}</p></div>
          <div className="dashboard-welcome-mark" aria-hidden="true"><span>{String(journey.completedMaterials).padStart(2, "0")}</span><small>/ 06</small></div>
        </section>
        <div className="dashboard-columns">
          <div className="dashboard-primary">
            {renderLearningJourney(journey, journeyMaterialRows, t)}
            <section className="dashboard-metrics" aria-label={t("dashboard.stats.completed")}>
              <Stat label={t("dashboard.stats.completed")} value={`${materials}/6`}/><Stat label={t("dashboard.stats.videos")} value={videos}/><Stat label={t("dashboard.stats.quizzes")} value={attempts.length}/><Stat label={t("dashboard.stats.average")} value={`${average}%`}/>
            </section>
            <section className="dashboard-activity"><div className="dashboard-section-heading"><div><span>{t("pages.dashboardKicker")}</span><h2>{t("pages.dashboardRecent")}</h2></div><Link href="/progress">{t("dashboard.quickLinks")} →</Link></div>
              {recent.length ? <div className="dashboard-activity-list">{recent.map(item=><div className="activity-row" key={item.id}><span>{item.kind==="QUIZ_COMPLETED"?t("pages.actQuizTaken"):item.kind==="VIDEO_WATCHED"?t("pages.actVideoWatched"):item.kind==="MATERIAL_STARTED"?t("pages.actMaterialStarted"):item.kind==="lab-simulation"?t("pages.actLabSaved"):t("pages.actMaterialDone")}</span><time>{item.createdAt.toLocaleDateString(locale==="id"?"id-ID":"en-US")}</time></div>)}</div> : <div className="dashboard-empty"><span aria-hidden="true">✦</span><p>{t("pages.dashboardEmptyActivity")}</p></div>}
            </section>
          </div>
          <aside className="dashboard-side">
            <section className="dashboard-continue"><span>{t("pages.dashboardContinue")}</span><h2>{progress[0] ? progress[0].material.title : t("pages.dashboardContinueDefault")}</h2><p>{progress[0] ? `${progress[0].percent}% · ${t("pages.dashboardContinueDone")}` : t("dashboard.startFrom")}</p><Link className="button button-dark" href={progress[0] ? `/materials/${progress[0].material.slug}` : "/materials/dasar-jaringan-komputer"}>{t("pages.dashboardStartLearning")} <span aria-hidden="true">→</span></Link></section>
            {recommended && <section className="dashboard-recommend"><span>{t("pages.dashboardRecommend")}</span><b>{recommended.title}</b><Link href={`/materials/${recommended.slug}`}>{t("pages.dashboardStartLearning")} →</Link></section>}
            <Link className="dashboard-lab-card" href="/network-lab"><span aria-hidden="true">⌘</span><div><b>{t("pages.dashboardLabTitle")}</b><small>{t("pages.dashboardLabDesc")}</small></div><strong aria-hidden="true">↗</strong></Link>
            <nav className="dashboard-quick-links" aria-label={t("dashboard.quickLinks")}><span>{t("dashboard.quickLinks")}</span>{[[t("dashboard.pretest"),"/quizzes/pretest-jaringan-dasar"],[t("dashboard.posttest"),"/quizzes/posttest-jaringan-dasar"],[t("labs.troubleshooting"),"/troubleshooting"],[t("dashboard.materials"),"/materials"]].map(([label,href])=><Link href={href} key={href}>{label}<span aria-hidden="true">→</span></Link>)}</nav>
          </aside>
        </div>
      </div>
    </Shell>;
  }
  if (section === "learning-path") {
    const sequence = LEARNING_MATERIAL_SEQUENCE;
    const [rows, journey] = await Promise.all([
      db.material.findMany({ where: { slug: { in: sequence }, published: true }, select: { id: true, slug: true, title: true, category: true, progress: { where: { userId: user?.id ?? "" }, select: { status: true } } } }),
      user ? getLearningJourneyForUser(user.id) : Promise.resolve(buildLearningJourney() as LearningJourneyState),
    ]);
    const bySlug=new Map(rows.map(item=>[item.slug,item]));
    return <Shell section={section} user={user} t={t}><div className="section-kicker">{t("pages.pathKicker")}</div><h1>{config.title}</h1><p className="app-lede">{t("pages.pathLede")}</p>{renderLearningJourney(journey, rows, t)}<div id="materi" className="learning-path-list">{sequence.map((slug,index)=>{const item=bySlug.get(slug);const status=item?.progress[0]?.status??"NOT_STARTED";return <div className={`path-node ${status.toLowerCase()}`} key={slug}><span className="path-index">{String(index+1).padStart(2,"0")}</span><div><b>{item?.title??titleize(slug)}</b><small>{item?.category??t("quizzes.question")} · {status==="COMPLETED"?t("pages.stCompleted"):status==="IN_PROGRESS"?t("pages.stInProgress"):t("pages.stNotStarted")}</small></div>{item&&<Link href={`/materials/${slug}`} aria-label={`${t("pages.openLabel")} ${item.title}`}>→</Link>}</div>})}</div></Shell>;
  }
  if (section === "progress") {
    if(!user) redirect("/login");
    const [materials,attempts,activities,quizCount,quizAverage]=await Promise.all([db.material.findMany({where:{published:true},select:{id:true,slug:true,title:true,category:true,progress:{where:{userId:user.id},select:{status:true,percent:true,updatedAt:true},take:1}},orderBy:{title:"asc"}}),db.quizAttempt.findMany({where:{userId:user.id},include:{quiz:{select:{title:true}}},orderBy:{completedAt:"desc"},take:8}),db.activity.findMany({where:{userId:user.id},orderBy:{createdAt:"desc"},take:8}),db.quizAttempt.count({where:{userId:user.id}}),db.quizAttempt.aggregate({where:{userId:user.id},_avg:{score:true}})]);
    const items=materials.map(({progress:records,...material})=>({ ...material,progress:records[0]??null }));
    const completedMaterials=items.filter(item=>item.progress?.status==="COMPLETED").length;
    const inProgressMaterials=items.filter(item=>item.progress?.status==="IN_PROGRESS").length;
    const overallPercent=items.length?Math.round(items.reduce((sum,item)=>sum+(item.progress?.percent??0),0)/items.length):0;
    const avg=Math.round(quizAverage._avg.score??0);
    const nextMaterial=items.find(item=>item.progress?.status==="IN_PROGRESS")??items.find(item=>item.progress?.status!=="COMPLETED");
    const statusLabel=(status:string|undefined)=>status==="COMPLETED"?t("pages.stCompleted"):status==="IN_PROGRESS"?t("pages.stInProgress"):t("pages.stNotStarted");
    return <Shell section={section} user={user} t={t}>
      <div className="section-kicker">{t("pages.progressKicker")}</div>
      <h1>{config.title}</h1>
      <p className="app-lede">{t("pages.progressLede")}</p>
      <section className="progress-overview">
        <div className="progress-overview-copy"><span>{locale==="en"?"YOUR LEARNING JOURNEY":"PERJALANAN BELAJARMU"}</span><h2>{locale==="en"?"Small steps add up.":"Terus maju, selangkah demi selangkah."}</h2><p>{locale==="en"?`${completedMaterials} of ${items.length} materials completed · ${inProgressMaterials} in progress`:`${completedMaterials} dari ${items.length} materi selesai · ${inProgressMaterials} sedang dipelajari`}</p><Link className="progress-continue-button" href={nextMaterial?`/materials/${nextMaterial.slug}`:"/materials"}>{nextMaterial?(locale==="en"?"Continue learning":"Lanjutkan belajar"):(locale==="en"?"Explore materials":"Jelajahi materi")} <span aria-hidden="true">→</span></Link></div>
        <div className="progress-ring" style={{background:`conic-gradient(#fff ${overallPercent}%,#ffffff32 0)`}}><div><b>{overallPercent}%</b><span>{locale==="en"?"overall":"keseluruhan"}</span></div></div>
        <div className="progress-overview-track" role="progressbar" aria-label={locale==="en"?"Overall learning progress":"Progres belajar keseluruhan"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={overallPercent}><span style={{width:`${overallPercent}%`}}/></div>
      </section>
      <div className="progress-stats">
        <article><span>{locale==="en"?"MATERIALS COMPLETED":"MATERI SELESAI"}</span><b>{completedMaterials}<small> / {items.length}</small></b><i>{locale==="en"?"learning resources":"materi pembelajaran"}</i></article>
        <article><span>{locale==="en"?"IN PROGRESS":"SEDANG DIPELAJARI"}</span><b>{inProgressMaterials}</b><i>{locale==="en"?"active materials":"materi aktif"}</i></article>
        <article><span>{t("dashboard.stats.quizzes").toUpperCase()}</span><b>{quizCount}</b><i>{locale==="en"?"total quiz attempts":"total percobaan kuis"}</i></article>
        <article><span>{t("dashboard.stats.average").toUpperCase()}</span><b>{avg}<small>%</small></b><i>{locale==="en"?"recent quiz average":"rata-rata kuis terbaru"}</i></article>
      </div>
      <div className="progress-columns">
        <section className="progress-panel progress-materials-panel"><div className="progress-panel-heading"><div><span>{locale==="en"?"LEARNING LIBRARY":"RUANG BELAJAR"}</span><h2>{t("pages.progressHProgress")}</h2></div><span className="progress-panel-count">{items.length}</span></div>
          {items.length?items.map((item,index)=><Link className="progress-material-item" href={`/materials/${item.slug}`} key={item.id}><span className="progress-material-index">{String(index+1).padStart(2,"0")}</span><span className="progress-material-main"><span className="progress-material-title">{item.title}</span><span className="progress-material-meta">{item.category} · <i className={`progress-status-dot ${item.progress?.status?.toLowerCase()??"not_started"}`}/>{statusLabel(item.progress?.status)}</span><span className="progress-item-track"><i style={{width:`${item.progress?.percent??0}%`}}/></span></span><b className="progress-material-percent">{item.progress?.percent??0}%</b></Link>):<div className="progress-empty">{t("pages.progressEmptyProgress")} <Link href="/materials">{t("dashboard.materials")} →</Link></div>}
        </section>
        <div className="progress-side-panels">
          <section className="progress-panel"><div className="progress-panel-heading"><div><span>{locale==="en"?"ASSESSMENT":"EVALUASI"}</span><h2>{t("pages.progressHResults")}</h2></div></div>{attempts.length?attempts.map(item=><div className="progress-quiz-item" key={item.id}><span className="progress-quiz-icon">✓</span><span><b>{item.quiz.title}</b><small>{item.completedAt.toLocaleDateString(locale==="id"?"id-ID":"en-US")}</small></span><strong>{item.score}%</strong></div>):<p className="progress-panel-empty">{t("pages.progressEmptyResults")}</p>}</section>
          <section className="progress-panel"><div className="progress-panel-heading"><div><span>{locale==="en"?"RECENT UPDATES":"AKTIVITAS TERBARU"}</span><h2>{t("pages.progressHActivity")}</h2></div></div>{activities.length?<div className="progress-timeline">{activities.map(item=><div className="progress-timeline-item" key={item.id}><i/><span><b>{item.kind==="QUIZ_COMPLETED"?t("pages.actQuizCompleted"):item.kind==="VIDEO_WATCHED"?t("pages.actVideoWatched"):item.kind==="MATERIAL_STARTED"?t("pages.actMaterialStarted"):t("pages.actMaterialDone")}</b><time>{item.createdAt.toLocaleDateString(locale==="id"?"id-ID":"en-US")}</time></span></div>)}</div>:<p className="progress-panel-empty">{t("pages.progressEmptyActivity")}</p>}</section>
        </div>
      </div>
    </Shell>;
  }
  if (section === "profile") { if(!user)redirect("/login");const profile=await db.user.findUnique({where:{id:user.id},select:{name:true,email:true,role:true,className:true,major:true,createdAt:true}});if(!profile)redirect("/login");return <Shell section={section} user={user} t={t}><div className="section-kicker">{t("pages.profileKicker")}</div><h1>{t("pages.profileTitle")}</h1><p className="app-lede">{t("pages.profileLede")}</p><ProfilePanel {...profile} joinedAt={profile.createdAt.toLocaleDateString(locale==="id"?"id-ID":"en-US")}/></Shell>; }
  if (section === "settings") { if(!user)redirect("/login");return <Shell section={section} user={user} t={t}><div className="section-kicker">{t("pages.settingsKicker")}</div><h1>{t("pages.settingsTitle")}</h1><p className="app-lede">{t("pages.settingsLede")}</p><PasswordForm/></Shell>; }
  if (section === "login") return <Shell section={section} user={user} t={t}><div className="section-kicker">{t("pages.loginKicker")}</div><h1>{config.title}</h1><p className="app-lede">{config.desc}</p><LoginForm nextPath={query.next ?? ""}/><div className="demo-callout"><b>{t("pages.loginDemoTitle")}</b><p>{t("pages.loginDemoDesc")}</p></div></Shell>;
  if (section === "register") return <Shell section={section} user={user} t={t}><div className="section-kicker">{t("pages.registerKicker")}</div><h1>{t("pages.registerTitle")}</h1><p className="app-lede">{t("pages.registerLede")}</p><RegisterForm/></Shell>;
  if (section === "forgot-password") return <Shell section={section} user={user} t={t}><div className="section-kicker">{t("pages.forgotKicker")}</div><h1>{t("pages.forgotTitle")}</h1><p className="app-lede">{t("pages.forgotLede")}</p><ForgotPasswordForm/></Shell>;
  if (section === "reset-password") return <Shell section={section} user={user} t={t}><div className="section-kicker">{t("pages.resetKicker")}</div><h1>{t("pages.resetTitle")}</h1><p className="app-lede">{t("pages.resetLede")}</p><ResetPasswordForm token={query.token ?? ""}/></Shell>;
  if (section.startsWith("admin")) {
    if (section === "admin" && rest[0] === "materials") return <Shell section="admin" user={user} t={t}><div className="section-kicker">{t("pages.adminKickerContent")}</div><h1>{t("pages.adminMatTitle")}</h1><p className="app-lede">{t("pages.adminMatLede")}</p><AdminMaterials/></Shell>;
    if (section === "admin" && rest[0] === "videos") return <Shell section="admin" user={user} t={t}><div className="section-kicker">{t("pages.adminKickerContent")}</div><h1>{t("pages.adminVidTitle")}</h1><p className="app-lede">{t("pages.adminVidLede")}</p><AdminVideos/></Shell>;
    if (section === "admin" && ["quizzes","questions"].includes(rest[0]??"")) return <Shell section="admin" user={user} t={t}><div className="section-kicker">{t("pages.adminKickerAssess")}</div><h1>{rest[0]==="questions"?t("pages.adminQuizBankTitle"):t("pages.adminQuizTitle")}</h1><p className="app-lede">{t("pages.adminQuizLede")}</p><AdminQuizzes/></Shell>;
    if (section === "admin" && rest[0] === "students") return <Shell section="admin" user={user} t={t}><div className="section-kicker">{t("pages.adminKickerUsers")}</div><h1>{t("pages.adminStuTitle")}</h1><p className="app-lede">{t("pages.adminStuLede")}</p><AdminStudents/></Shell>;
    if (section === "admin" && rest[0] === "troubleshooting") return <Shell section="admin" user={user} t={t}><div className="section-kicker">{t("pages.adminKickerContent")}</div><h1>{t("pages.adminCaseTitle")}</h1><p className="app-lede">{t("pages.adminCaseLede")}</p><AdminTroubleshooting/></Shell>;
    if (section === "admin" && rest[0] === "3d-models") return <Shell section="admin" user={user} t={t}><div className="section-kicker">{t("pages.adminKickerThreeD")}</div><h1>{t("pages.adminThreeDTitle")}</h1><p className="app-lede">{t("pages.adminThreeDLede")}</p><AdminThreeDModels/></Shell>;
    if (section === "admin" && rest[0] === "analytics") return <Shell section="admin" user={user} t={t}><div className="section-kicker">{t("pages.adminKickerAnalytics")}</div><h1>{t("pages.adminAnaTitle")}</h1><p className="app-lede">{t("pages.adminAnaLede")}</p><AdminAnalytics/></Shell>;
    const materials = section === "admin" || section === "materials" ? await db.material.count() : null;
    const students = section === "admin" ? await db.user.count({ where: { role: "STUDENT" } }) : null;
    return <Shell section={section} user={user} t={t}><div className="section-kicker">{t("pages.adminKickerContent")}</div><h1>{section === "admin" ? t("pages.adminDashTitle") : titleize(rest.at(-1) ?? section)}</h1><p className="app-lede">{t("pages.adminDashLede")}</p>{section === "admin" && <div className="stats-grid"><Stat label={t("pages.adminStatMaterials")} value={materials ?? 0}/><Stat label={t("pages.adminStatStudents")} value={students ?? 0}/></div>}<div className="app-link-grid">{[[t("pages.adminMatTitle"),"/admin/materials"],[t("pages.adminVidTitle"),"/admin/videos"],[t("pages.adminQuizTitle"),"/admin/quizzes"],[t("pages.adminQuizBankTitle"),"/admin/questions"],[t("pages.adminCaseTitle"),"/admin/troubleshooting"],[t("pages.adminThreeDTitle"),"/admin/3d-models"],[t("pages.adminStuTitle"),"/admin/students"],[t("pages.adminAnaTitle"),"/admin/analytics"]].map(([label,href])=><Link className="app-link-card" href={href} key={href}><span className="app-link-number">↗</span><span>{label}</span><b>→</b></Link>)}</div></Shell>;
  }
  return <Shell section={section} user={user} t={t}><div className="section-kicker">NEXANET / {section.toUpperCase().replaceAll("-", " ")}</div><h1>{nested ? titleize(rest.at(-1)!) : config.title}</h1><p className="app-lede">{config.desc}</p>{nested && <div className="demo-callout"><b>{t("pages.fallbackPreviewTitle")}</b><p>{t("pages.fallbackPreviewLede")}</p><h2>{t("pages.fallbackPreviewH2")}</h2><ul><li>{t("pages.fallbackB1")}</li><li>{t("pages.fallbackB2")}</li><li>{t("pages.fallbackB3")}</li></ul></div>}<div className="app-link-grid">{config.links.map(([label, href], index)=><Link className="app-link-card" href={href} key={href}><span className="app-link-number">{String(index + 1).padStart(2, "0")}</span><span>{label}</span><b>↗</b></Link>)}</div><div className="demo-note"><span>i</span><p>{t("pages.fallbackNote")}</p></div></Shell>;
}

function Shell({ children, section, user, t }: { children: React.ReactNode; section: string; user: { name: string; role: string } | null; t: (key: string) => string }) {
  return <main className={`app-page${user ? " has-sidebar" : ""}`}><header className="app-header"><Link className="brand" href="/"><span className="brand-mark"><i/><i/><i/><i/><b/></span><span>NEXA<span className="brand-light">NET</span></span></Link><GlobalSearch/><LanguageSwitcher/><nav><Link href="/dashboard">{t("nav.dashboard")}</Link><Link href="/materials">{t("nav.materials")}</Link><Link href="/learning-path">{t("nav.learningPath")}</Link><Link className="ai-tutor-nav" href="/ai-tutor" aria-current={section === "ai-tutor" ? "page" : undefined}>{t("nav.aiTutor")}</Link>{user ? <><span className="user-chip">{user.name}</span>{(user.role==="ADMIN"||user.role==="TEACHER")&&<Link href="/admin">{t("nav.admin")}</Link>}<LogoutButton/></> : <Link className="button button-dark" href="/login">{t("shell.signIn")} <span>↗</span></Link>}</nav></header>{user && <AppSidebar role={user.role} section={section}/>}<section className="app-content">{children}<Link className="text-link" href="/">{t("shell.backHome")}</Link></section><footer><Link href="/" className="brand">NEXA<span className="brand-light">NET</span></Link><span className="footer-copy">{section.toUpperCase().replaceAll("-", " ")} · {t("shell.footerLine")}</span></footer></main>;
}

function Stat({ label, value }: { label: string; value: number | string }) { return <div className="stat-card"><span>{label}</span><b>{value}</b></div>; }
