import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { PROFILE, EDUCATION, EXPERIENCE, PROJECTS, SKILLS } from "./content";
import { setSiteMode } from "./siteMode";

const SECTIONS = [
  { id: "brief", label: "Brief" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const METRICS = [
  { n: "2,000+", label: "App downloads" },
  { n: "200+", label: "Active users" },
  { n: "3", label: "Products shipped" },
  { n: "3", label: "Languages spoken" },
];

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export default function ProfessionalSite() {
  const [active, setActive] = useState("brief");

  useEffect(() => {
    document.title = "Belal Embaby — Software Engineer";
  }, []);

  useEffect(() => {
    const root = document.querySelector(".pro-root");
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit?.target?.id) setActive(hit.target.id.replace("pro-", ""));
      },
      { root, threshold: [0.2, 0.45, 0.7], rootMargin: "-20% 0px -55% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(`pro-${s.id}`);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const jump = (id) => {
    document.getElementById(`pro-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pro-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap');

        .pro-root {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          grid-template-columns: 248px 1fr;
          grid-template-areas: "rail main";
          overflow: hidden;
          background: #ece8df;
          color: #1a1814;
          font-family: 'Newsreader', Georgia, 'Times New Roman', serif;
          -webkit-font-smoothing: antialiased;
          cursor: auto;
        }
        .pro-root * { cursor: auto; box-sizing: border-box; }
        .pro-root a, .pro-root button { cursor: pointer; }
        .pro-root ::selection { background: #c41e2a; color: #fff; }

        /* paper grain */
        .pro-root::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.35;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
        }

        /* ── sidebar ── */
        .pro-rail {
          grid-area: rail;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 28px 22px 24px;
          background: #1a1814;
          color: #ece8df;
          border-right: 3px solid #c41e2a;
        }
        .pro-rail-mark {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #8a8478;
          margin-bottom: 22px;
        }
        .pro-rail-name {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: 34px;
          line-height: 0.95;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .pro-rail-name em {
          font-style: italic;
          color: #c41e2a;
        }
        .pro-rail-role {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #b8b0a4;
          margin-bottom: 28px;
        }
        .pro-rail-status {
          font-size: 14px;
          line-height: 1.5;
          color: #d4cdc0;
          padding-left: 12px;
          border-left: 2px solid #c41e2a;
          margin-bottom: 32px;
        }
        .pro-rail-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .pro-rail-nav button {
          display: flex;
          align-items: baseline;
          gap: 10px;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          font: inherit;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #7a7468;
          padding: 9px 0;
          border-bottom: 1px solid #2e2b26;
          transition: color 0.15s ease, padding-left 0.15s ease;
        }
        .pro-rail-nav button:hover,
        .pro-rail-nav button.on { color: #ece8df; padding-left: 6px; }
        .pro-rail-nav button.on .pro-rail-num { color: #c41e2a; }
        .pro-rail-num { color: #5a554c; min-width: 22px; }

        .pro-rail-foot {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          color: #6a6458;
          line-height: 1.7;
        }
        .pro-rail-foot a {
          color: #d4cdc0;
          text-decoration: none;
          border-bottom: 1px solid #4a453c;
        }
        .pro-rail-foot a:hover { color: #fff; border-color: #c41e2a; }
        .pro-persona {
          display: block;
          width: 100%;
          margin-top: 18px;
          padding: 11px 14px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #1a1814;
          background: #ece8df;
          border: none;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .pro-persona:hover { background: #c41e2a; color: #fff; }

        /* ── main scroll ── */
        .pro-main {
          grid-area: main;
          position: relative;
          z-index: 1;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }
        .pro-sheet {
          max-width: 780px;
          margin: 0 auto;
          padding: 48px 40px 80px;
        }

        .pro-stamp {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #c41e2a;
          border: 2px solid #c41e2a;
          padding: 5px 12px;
          margin-bottom: 28px;
          transform: rotate(-2deg);
        }
        .pro-lede {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(42px, 6vw, 68px);
          line-height: 1.02;
          letter-spacing: -1px;
          margin-bottom: 18px;
        }
        .pro-lede i { font-style: italic; color: #5a4a3a; }
        .pro-thesis {
          font-size: clamp(18px, 2.2vw, 22px);
          line-height: 1.55;
          color: #3a3530;
          max-width: 58ch;
          margin-bottom: 28px;
        }
        .pro-thesis strong { font-weight: 600; color: #1a1814; }

        .pro-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          border-top: 2px solid #1a1814;
          border-bottom: 1px solid #1a1814;
          margin-bottom: 40px;
        }
        .pro-links a {
          flex: 1 1 auto;
          min-width: 140px;
          padding: 14px 18px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-decoration: none;
          color: #1a1814;
          border-right: 1px solid #1a1814;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .pro-links a:last-child { border-right: none; }
        .pro-links a:hover { background: #1a1814; color: #ece8df; }

        .pro-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border: 2px solid #1a1814;
          margin-bottom: 52px;
        }
        .pro-metric {
          padding: 18px 16px;
          border-right: 1px solid #1a1814;
          background: #fff;
        }
        .pro-metric:last-child { border-right: none; }
        .pro-metric-n {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(26px, 3vw, 34px);
          line-height: 1;
          margin-bottom: 6px;
        }
        .pro-metric-l {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #6a6458;
        }

        .pro-block { margin-bottom: 56px; }
        .pro-block-head {
          display: flex;
          align-items: baseline;
          gap: 16px;
          padding-bottom: 12px;
          margin-bottom: 24px;
          border-bottom: 2px solid #1a1814;
        }
        .pro-block-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          color: #c41e2a;
          min-width: 28px;
        }
        .pro-block-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(28px, 3.5vw, 36px);
          line-height: 1;
        }
        .pro-block-note {
          margin-left: auto;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #8a8478;
          white-space: nowrap;
        }

        /* experience */
        .pro-entry {
          padding: 22px 0 22px 20px;
          border-left: 3px solid #1a1814;
          margin-bottom: 20px;
        }
        .pro-entry:last-child { margin-bottom: 0; }
        .pro-entry-top {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 8px 14px;
          margin-bottom: 14px;
        }
        .pro-entry-role {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .pro-entry-co { font-size: 17px; font-weight: 600; }
        .pro-entry-when {
          margin-left: auto;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          color: #6a6458;
        }
        .pro-entry ul {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pro-entry li {
          position: relative;
          padding-left: 18px;
          font-size: 16px;
          line-height: 1.65;
          color: #3a3530;
        }
        .pro-entry li::before {
          content: "—";
          position: absolute;
          left: 0;
          color: #c41e2a;
          font-weight: 600;
        }

        /* projects */
        .pro-proj {
          display: grid;
          grid-template-columns: 52px 1fr;
          gap: 0 20px;
          padding: 24px 0;
          border-bottom: 1px solid #c8c2b6;
        }
        .pro-proj:first-of-type { border-top: 1px solid #1a1814; }
        .pro-proj:last-child { border-bottom: 2px solid #1a1814; }
        .pro-proj-idx {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: 36px;
          line-height: 1;
          color: #c41e2a;
          padding-top: 4px;
        }
        .pro-proj-top {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 6px;
        }
        .pro-proj-name {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 1.5px;
        }
        .pro-proj-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          color: #c41e2a;
          border: 1px solid #c41e2a;
          padding: 3px 8px;
        }
        .pro-proj-sub { font-size: 15px; color: #6a6458; margin-bottom: 12px; }
        .pro-proj-stats {
          display: flex;
          gap: 24px;
          margin-bottom: 12px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 1px;
        }
        .pro-proj-stats strong { color: #1a1814; font-weight: 600; }
        .pro-proj-stats span { color: #8a8478; }
        .pro-proj ul {
          margin: 0 0 14px;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pro-proj li {
          font-size: 15px;
          line-height: 1.6;
          color: #3a3530;
          padding-left: 14px;
          border-left: 2px solid #d4cdc0;
        }
        .pro-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
        .pro-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 4px 8px;
          background: #1a1814;
          color: #ece8df;
        }
        .pro-proj-link {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #c41e2a;
          text-decoration: none;
          border-bottom: 1px solid #c41e2a;
        }
        .pro-proj-link:hover { color: #1a1814; border-color: #1a1814; }

        /* skills matrix */
        .pro-matrix {
          width: 100%;
          border-collapse: collapse;
          font-size: 15px;
        }
        .pro-matrix th,
        .pro-matrix td {
          text-align: left;
          padding: 14px 12px;
          border-bottom: 1px solid #c8c2b6;
          vertical-align: top;
        }
        .pro-matrix th {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #6a6458;
          border-bottom: 2px solid #1a1814;
        }
        .pro-matrix tr:last-child td { border-bottom: 2px solid #1a1814; }
        .pro-matrix-group {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          white-space: nowrap;
        }
        .pro-bar {
          display: flex;
          gap: 3px;
          margin-top: 4px;
        }
        .pro-bar i {
          display: block;
          width: 18px;
          height: 4px;
          background: #d4cdc0;
        }
        .pro-bar i.on { background: #c41e2a; }
        .pro-matrix-items { color: #3a3530; line-height: 1.5; }

        /* education + contact */
        .pro-duo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .pro-fact {
          padding: 20px;
          background: #fff;
          border: 2px solid #1a1814;
        }
        .pro-fact h3 {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .pro-fact p {
          margin: 0;
          font-size: 16px;
          line-height: 1.6;
          color: #3a3530;
        }
        .pro-fact-meta {
          margin-top: 10px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          color: #6a6458;
        }

        .pro-contact-box {
          margin-top: 8px;
          padding: 32px 28px;
          background: #1a1814;
          color: #ece8df;
          text-align: center;
        }
        .pro-contact-box h2 {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 400;
          margin-bottom: 10px;
        }
        .pro-contact-box p {
          font-size: 16px;
          line-height: 1.6;
          color: #b8b0a4;
          max-width: 42ch;
          margin: 0 auto 24px;
        }
        .pro-contact-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }
        .pro-contact-row a {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-decoration: none;
          color: #1a1814;
          background: #ece8df;
          padding: 12px 18px;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .pro-contact-row a:hover { background: #c41e2a; color: #fff; }

        .pro-end {
          margin-top: 48px;
          padding-top: 20px;
          border-top: 1px solid #c8c2b6;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 12px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          color: #8a8478;
        }

        /* ── mobile top bar ── */
        .pro-mob-bar {
          display: none;
        }

        @media (max-width: 900px) {
          .pro-root {
            grid-template-columns: 1fr;
            grid-template-areas:
              "mob"
              "main";
          }
          .pro-rail { display: none; }
          .pro-mob-bar {
            grid-area: mob;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 14px 18px;
            background: #1a1814;
            color: #ece8df;
            border-bottom: 3px solid #c41e2a;
            position: sticky;
            top: 0;
            z-index: 5;
          }
          .pro-mob-name {
            font-family: 'Instrument Serif', Georgia, serif;
            font-size: 22px;
            line-height: 1;
          }
          .pro-mob-name em { font-style: italic; color: #c41e2a; }
          .pro-mob-actions { display: flex; gap: 8px; }
          .pro-mob-btn {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 10px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            padding: 8px 12px;
            border: 1px solid #4a453c;
            background: none;
            color: #ece8df;
          }
          .pro-mob-btn.accent {
            background: #ece8df;
            color: #1a1814;
            border-color: #ece8df;
          }
          .pro-sheet { padding: 28px 20px 64px; }
          .pro-metrics { grid-template-columns: repeat(2, 1fr); }
          .pro-metric:nth-child(2) { border-right: none; }
          .pro-metric:nth-child(1),
          .pro-metric:nth-child(2) { border-bottom: 1px solid #1a1814; }
          .pro-duo { grid-template-columns: 1fr; }
          .pro-block-note { display: none; }
          .pro-entry-when { margin-left: 0; width: 100%; }
          .pro-proj { grid-template-columns: 40px 1fr; gap: 0 14px; }
          .pro-proj-idx { font-size: 28px; }
          .pro-links a { min-width: 100%; border-right: none; border-bottom: 1px solid #1a1814; }
          .pro-links a:last-child { border-bottom: none; }
        }

        @media (max-width: 480px) {
          .pro-matrix { font-size: 13px; }
          .pro-matrix th, .pro-matrix td { padding: 10px 6px; }
          .pro-matrix-group { font-size: 10px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pro-rail-nav button { transition: none; }
        }
      `}</style>

      <aside className="pro-rail">
        <div>
          <div className="pro-rail-mark">Personnel file · Rev. 2025</div>
          <div className="pro-rail-name">Belal<em>.</em></div>
          <div className="pro-rail-role">Software Engineer</div>
          <p className="pro-rail-status">
            Open to work · {PROFILE.location}
          </p>
          <nav className="pro-rail-nav" aria-label="Sections">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                className={active === s.id ? "on" : ""}
                onClick={() => jump(s.id)}
              >
                <span className="pro-rail-num">{String(i + 1).padStart(2, "0")}</span>
                {s.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="pro-rail-foot">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <br />
          <a href={PROFILE.github.url} target="_blank" rel="noreferrer">github.com/{PROFILE.github.handle}</a>
          <button className="pro-persona" onClick={() => setSiteMode("persona")}>
            ✦ Persona Mode
          </button>
        </div>
      </aside>

      <div className="pro-mob-bar">
        <div className="pro-mob-name">Belal<em>.</em></div>
        <div className="pro-mob-actions">
          <a className="pro-mob-btn" href={`mailto:${PROFILE.email}`}>Email</a>
          <button className="pro-mob-btn accent" onClick={() => setSiteMode("persona")}>Persona</button>
        </div>
      </div>

      <div className="pro-main">
        <div className="pro-sheet">
          <Motion.section id="pro-brief" className="pro-block" {...reveal}>
            <span className="pro-stamp">Field dossier</span>
            <h1 className="pro-lede">
              {PROFILE.name.split(" ")[0]} builds things<br />
              people <i>actually open.</i>
            </h1>
            <p className="pro-thesis">
              B.S. Computer Science from <strong>NJIT</strong>. Leading engineering on a
              revenue-generating real estate platform at <strong>RANCS Capital</strong>.
              Side project <strong>FitTrack+</strong> — 2,000+ downloads across web, iOS, and Android.
              I care about shipping, not slide decks.
            </p>
            <div className="pro-links">
              <a href={`mailto:${PROFILE.email}`}>Email me</a>
              <a href={PROFILE.resumePdf} download>Resume PDF</a>
              <a href={PROFILE.github.url} target="_blank" rel="noreferrer">GitHub</a>
            </div>
            <div className="pro-metrics" aria-label="Key metrics">
              {METRICS.map((m) => (
                <div className="pro-metric" key={m.label}>
                  <div className="pro-metric-n">{m.n}</div>
                  <div className="pro-metric-l">{m.label}</div>
                </div>
              ))}
            </div>
          </Motion.section>

          <Motion.section id="pro-experience" className="pro-block" {...reveal}>
            <div className="pro-block-head">
              <span className="pro-block-num">§01</span>
              <h2 className="pro-block-title">Experience</h2>
              <span className="pro-block-note">Current role</span>
            </div>
            {EXPERIENCE.map((xp) => (
              <article className="pro-entry" key={xp.company}>
                <div className="pro-entry-top">
                  <span className="pro-entry-role">{xp.role}</span>
                  <span className="pro-entry-co">{xp.company}</span>
                  <span className="pro-entry-when">{xp.span}</span>
                </div>
                <ul>
                  {xp.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </article>
            ))}
          </Motion.section>

          <Motion.section id="pro-projects" className="pro-block" {...reveal}>
            <div className="pro-block-head">
              <span className="pro-block-num">§02</span>
              <h2 className="pro-block-title">Projects</h2>
              <span className="pro-block-note">In production</span>
            </div>
            {PROJECTS.map((p, i) => (
              <article className="pro-proj" key={p.id}>
                <div className="pro-proj-idx">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className="pro-proj-top">
                    <span className="pro-proj-name">{p.name}</span>
                    <span className="pro-proj-tag">{p.status}</span>
                  </div>
                  <div className="pro-proj-sub">{p.subtitle}</div>
                  {i === 0 && (
                    <div className="pro-proj-stats">
                      <span><strong>2,000+</strong> downloads</span>
                      <span><strong>200+</strong> users</span>
                      <span><strong>3</strong> platforms</span>
                    </div>
                  )}
                  <ul>
                    {p.bullets.slice(0, i === 0 ? 4 : 3).map((b) => <li key={b}>{b}</li>)}
                  </ul>
                  <div className="pro-tags">
                    {p.tech.map((t) => <span className="pro-tag" key={t}>{t}</span>)}
                  </div>
                  {p.link && (
                    <a className="pro-proj-link" href={p.link} target="_blank" rel="noreferrer">
                      {p.linkLabel} →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </Motion.section>

          <Motion.section id="pro-skills" className="pro-block" {...reveal}>
            <div className="pro-block-head">
              <span className="pro-block-num">§03</span>
              <h2 className="pro-block-title">Competencies</h2>
              <span className="pro-block-note">Self-assessed</span>
            </div>
            <table className="pro-matrix">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Level</th>
                  <th>Tools</th>
                </tr>
              </thead>
              <tbody>
                {SKILLS.map((s) => (
                  <tr key={s.group}>
                    <td className="pro-matrix-group">{s.group}</td>
                    <td>
                      <div className="pro-bar" aria-label={`Rank ${s.rank} of 5`}>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <i key={r} className={r <= s.rank ? "on" : ""} />
                        ))}
                      </div>
                    </td>
                    <td className="pro-matrix-items">{s.items.join(" · ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Motion.section>

          <Motion.section id="pro-contact" className="pro-block" {...reveal}>
            <div className="pro-block-head">
              <span className="pro-block-num">§04</span>
              <h2 className="pro-block-title">Background</h2>
            </div>
            <div className="pro-duo">
              <div className="pro-fact">
                <h3>Education</h3>
                <p>
                  {EDUCATION.degree}<br />
                  {EDUCATION.school}<br />
                  {EDUCATION.college}
                </p>
                <div className="pro-fact-meta">{EDUCATION.span} · {EDUCATION.location}</div>
              </div>
              <div className="pro-fact">
                <h3>Languages</h3>
                <p>{PROFILE.languages.join(", ")} — useful for global teams and client work.</p>
              </div>
            </div>

            <div className="pro-contact-box">
              <h2>Write me a line.</h2>
              <p>
                Open to full-time roles and projects worth doing.
                Email is fastest — I read every message.
              </p>
              <div className="pro-contact-row">
                <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                <a href={`tel:${PROFILE.phone.replace(/[^+\d]/g, "")}`}>{PROFILE.phone}</a>
                <a href={PROFILE.instagram.url} target="_blank" rel="noreferrer">Instagram</a>
              </div>
            </div>

            <footer className="pro-end">
              <span>© {new Date().getFullYear()} {PROFILE.name}</span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  font: "inherit",
                  color: "#c41e2a",
                  cursor: "pointer",
                  letterSpacing: "1px",
                }}
                onClick={() => setSiteMode("persona")}
              >
                Enter Persona Mode ✦
              </button>
            </footer>
          </Motion.section>
        </div>
      </div>
    </div>
  );
}
