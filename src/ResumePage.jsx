import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SeaOfSouls from "./SeaOfSouls";
import { playHover, playConfirm, playBack } from "./sfx";
import { PROFILE, EDUCATION, EXPERIENCE, PROJECTS, SKILLS } from "./content";

const ITEMS = [
  { id: "i", badge: "I", title: "EDUCATION", subtitle: "NJIT — B.S. Computer Science", rank: 5 },
  { id: "ii", badge: "II", title: "SKILLS", subtitle: "Languages / Web / Backend / Cloud", rank: 5 },
  { id: "iii", badge: "III", title: "PROJECTS", subtitle: "FitTrack+ & Client Work", rank: 4 },
  { id: "iv", badge: "IV", title: "EXPERIENCE", subtitle: "Software Engineer @ RANCS Capital", rank: 4 },
];

const DETAILS = [
  {
    index: "01",
    title: "EDUCATION LOG",
    progress: EDUCATION.span.split("— ")[1],
    rows: [
      { index: "01", title: "New Jersey Institute of Technology", status: "2021 — 2025" },
      { index: "02", title: EDUCATION.college, status: EDUCATION.location.toUpperCase() },
      { index: "03", title: EDUCATION.degree, status: "DEC 2025" },
    ],
    bottomTitle: "DETAILS",
    bullets: [
      "Bachelor of Science in Computer Science.",
      "Focus on data structures, algorithms, and full-stack software development.",
      `Fluent in ${PROFILE.languages.join(", ")} — three languages, one codebase at a time.`,
    ],
  },
  {
    index: "02",
    title: "SKILL MATRIX",
    progress: `${SKILLS.length}/4`,
    rows: SKILLS.map((s, i) => ({
      index: String(i + 1).padStart(2, "0"),
      title: s.group,
      status: `RANK ${s.rank}`,
    })),
    bottomTitle: "LOADOUT",
    bullets: SKILLS.map((s) => `${s.group}: ${s.items.join(" · ")}`),
  },
  {
    index: "03",
    title: "PROJECT LOG",
    progress: `${PROJECTS.length}/3`,
    rows: PROJECTS.map((p, i) => ({
      index: String(i + 1).padStart(2, "0"),
      title: p.name,
      status: p.status,
    })),
    bottomTitle: "HIGHLIGHTS",
    bullets: [
      "FitTrack+ — 2,000+ downloads, 200+ active users across web, iOS, and Android.",
      "Shared Spring Boot backend serving Next.js web and React Native mobile.",
      "Client and production work: security firm site, CRM systems, outreach bots.",
    ],
  },
  {
    index: "04",
    title: "WORK RECORD",
    progress: "NOW",
    rows: [
      { index: "01", title: EXPERIENCE[0].role, status: "2025 — NOW" },
      { index: "02", title: "RANCS Capital", status: "REAL ESTATE" },
    ],
    bottomTitle: "FIELD REPORT",
    bullets: EXPERIENCE[0].bullets,
  },
];

export default function ResumePage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") setActive((i) => { if (i > 0) playHover(); return Math.max(0, i - 1); });
      if (e.key === "ArrowDown") setActive((i) => { if (i < ITEMS.length - 1) playHover(); return Math.min(ITEMS.length - 1, i + 1); });
      if (e.key === "ArrowLeft" || e.key === "Escape" || e.key === "Backspace") { playBack(); navigate(-1); }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const detail = DETAILS[active];

  return (
    <div id="menu-screen">
      <SeaOfSouls theme="resume" />
      <style>{`
        .resume-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
        }

        .resume-stack {
          position: absolute;
          top: 9vh;
          left: 2.8vw;
          width: min(47vw, 720px);
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
          transform: scale(0.9);
          transform-origin: top left;
        }

        .resume-list-tag {
          font-family: 'Anton', sans-serif;
          font-size: 92px;
          line-height: 0.9;
          color: #f6fbff;
          letter-spacing: 2px;
          margin: 0 0 6px 12px;
          text-shadow: 0 2px 0 rgba(0,0,0,0.18);
          opacity: 0;
          transform: translateX(-24px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .resume-list-tag.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .resume-card-wrap {
          position: relative;
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: all;
          cursor: pointer;
        }
        .resume-card-wrap.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .resume-card {
          position: relative;
          height: 112px;
          background: #10185f;
          clip-path: polygon(0 0, 97% 0, 100% 100%, 3% 100%);
          box-shadow: 0 8px 0 rgba(5, 13, 59, 0.85);
          transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
          overflow: visible;
        }
        .resume-card-wrap.active .resume-card {
          background: #ffffff;
          box-shadow: 10px 8px 0 #d63232;
          transform: translateX(6px);
        }

        .resume-card-inner {
          position: absolute;
          inset: 0;
          padding: 14px 22px 14px 62px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .resume-badge {
          position: absolute;
          top: 10px;
          left: -10px;
          width: 56px;
          height: 70px;
          background: #0b113d;
          border: 3px solid #9cf7ff;
          clip-path: polygon(14% 0, 100% 0, 84% 100%, 0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-8deg);
          box-shadow: 0 4px 0 rgba(0,0,0,0.28);
          transition: background 0.22s ease, border-color 0.22s ease;
        }
        .resume-badge-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          color: #d2fdff;
          letter-spacing: 1px;
          transform: rotate(8deg);
        }
        .resume-card-wrap.active .resume-badge {
          background: #000;
          border-color: #000;
        }
        .resume-card-wrap.active .resume-badge-text {
          color: #fff;
        }

        .resume-title {
          font-family: 'Anton', sans-serif;
          font-size: 56px;
          line-height: 0.9;
          letter-spacing: 1px;
          color: #a5f6ff;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-title {
          color: #000;
        }

        .resume-rank {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .resume-rank-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 2px;
          color: #9ffbff;
          transition: color 0.22s ease;
        }
        .resume-rank-number {
          font-family: 'Anton', sans-serif;
          font-size: 70px;
          line-height: 0.82;
          color: #9ffbff;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-rank-label,
        .resume-card-wrap.active .resume-rank-number {
          color: #000;
        }

        .resume-subtitle-bar {
          position: absolute;
          left: 64px;
          right: 14px;
          bottom: 12px;
          height: 34px;
          background: #85f4ff;
          clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
          display: flex;
          align-items: center;
          padding: 0 18px;
          transition: background 0.22s ease;
        }
        .resume-card-wrap.active .resume-subtitle-bar {
          background: #000;
        }

        .resume-subtitle {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          line-height: 1;
          letter-spacing: 1px;
          color: #041238;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-subtitle {
          color: #fff;
        }

        .resume-download {
          margin: 14px 0 0 12px;
          pointer-events: all;
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #d63232;
          color: #ffffff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 3px;
          text-decoration: none;
          padding: 12px 30px 9px 22px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          box-shadow: 6px 6px 0 rgba(0, 6, 30, 0.55);
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.4s ease 0.25s, transform 0.4s cubic-bezier(0.22,1,0.36,1) 0.25s, background 0.18s ease;
          cursor: pointer;
        }
        .resume-download.mounted {
          opacity: 1;
          transform: translateX(0);
        }
        .resume-download:hover {
          background: #ffffff;
          color: #d63232;
        }
        .resume-download-arrow { font-size: 18px; }

        .resume-detail-panel {
          position: absolute;
          top: 9.5vh;
          right: 4.5vw;
          width: min(39vw, 620px);
          min-height: 74vh;
          z-index: 12;
          padding: 22px 24px 24px 24px;
          background: linear-gradient(180deg, #0f1c69 0%, #081044 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
          box-shadow:
            inset 0 0 0 1px rgba(133, 244, 255, 0.16),
            16px 16px 0 rgba(0, 6, 30, 0.55);
          overflow: hidden;
        }
        .resume-detail-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(133, 244, 255, 0.08) 0 15%, transparent 15% 100%),
            linear-gradient(180deg, rgba(255,255,255,0.05), transparent 24%);
          pointer-events: none;
        }

        @keyframes resume-panel-in {
          0%   { opacity: 0; transform: translateX(46px) skewX(-2deg); }
          60%  { opacity: 1; transform: translateX(-6px) skewX(0); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .resume-detail-anim {
          animation: resume-panel-in 0.34s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .resume-detail-top {
          position: relative;
          display: grid;
          grid-template-columns: 70px 1fr auto;
          align-items: center;
          gap: 14px;
          min-height: 92px;
          padding: 0 18px;
          background: linear-gradient(90deg, #8ef5ff 0%, #d3fdff 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          color: #08153f;
          box-shadow: 10px 0 0 rgba(255, 94, 136, 0.88);
        }
        .resume-detail-top-index {
          font-family: 'Anton', sans-serif;
          font-size: 46px;
          line-height: 1;
        }
        .resume-detail-top-title {
          font-family: 'Anton', sans-serif;
          font-size: 42px;
          line-height: 0.92;
          letter-spacing: 1px;
        }
        .resume-detail-top-progress {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px;
          letter-spacing: 2px;
          line-height: 1;
        }
        .resume-detail-list {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 18px;
        }
        .resume-detail-row {
          display: grid;
          grid-template-columns: 50px 1fr auto;
          align-items: center;
          gap: 14px;
          min-height: 56px;
          padding: 0 14px;
          background: #081248;
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(140, 239, 255, 0.12);
          transition: transform 0.16s ease, background 0.16s ease;
        }
        .resume-detail-row:hover {
          transform: translateX(4px);
          background: rgba(12, 26, 94, 1);
        }
        .resume-detail-row-index {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 1px;
          color: #94f4ff;
        }
        .resume-detail-row-title {
          font-family: 'Anton', sans-serif;
          font-size: 26px;
          line-height: 1;
          color: #f2fcff;
        }
        .resume-detail-status {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          line-height: 1;
          letter-spacing: 1.1px;
          color: #06133b;
          background: #8df6ff;
          padding: 7px 12px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
          white-space: nowrap;
        }
        .resume-detail-bottom {
          position: relative;
          margin-top: 22px;
          padding: 18px;
          background: #050d39;
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(145, 239, 255, 0.12);
        }
        .resume-detail-bottom-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 30px;
          letter-spacing: 2px;
          color: #91f5ff;
          margin-bottom: 14px;
        }
        .resume-detail-bullets {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .resume-detail-bullet {
          font-family: 'Anton', sans-serif;
          font-size: 19px;
          line-height: 1.2;
          color: #edfaff;
          letter-spacing: 0.4px;
        }

        @keyframes resume-row-in {
          0%   { opacity: 0; transform: translateX(26px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .resume-detail-row { animation: resume-row-in 0.3s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── mobile / narrow ── */
        @media (max-width: 980px) {
          .resume-overlay {
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            pointer-events: all;
            display: flex;
            flex-direction: column;
            gap: 18px;
            padding: 64px 14px 110px;
          }
          .resume-stack {
            position: static;
            width: 100%;
            transform: none;
            gap: 8px;
          }
          .resume-list-tag { font-size: 52px; margin-left: 4px; }
          .resume-card { height: 86px; }
          .resume-card-inner { padding: 10px 14px 10px 48px; }
          .resume-badge { width: 42px; height: 54px; top: 8px; left: -6px; }
          .resume-badge-text { font-size: 26px; }
          .resume-title { font-size: 34px; }
          .resume-rank-label { font-size: 20px; }
          .resume-rank-number { font-size: 46px; }
          .resume-subtitle-bar { left: 48px; right: 10px; bottom: 8px; height: 28px; padding: 0 12px; }
          .resume-subtitle { font-size: 20px; }
          .resume-download { margin-left: 4px; font-size: 22px; }
          .resume-detail-panel {
            position: static;
            width: 100%;
            min-height: 0;
            padding: 16px 14px 18px;
          }
          .resume-detail-top { min-height: 70px; padding: 0 14px; grid-template-columns: 48px 1fr auto; }
          .resume-detail-top-index { font-size: 32px; }
          .resume-detail-top-title { font-size: 28px; }
          .resume-detail-top-progress { font-size: 28px; }
          .resume-detail-row { min-height: 48px; grid-template-columns: 36px 1fr auto; gap: 8px; }
          .resume-detail-row-index { font-size: 20px; }
          .resume-detail-row-title { font-size: 18px; }
          .resume-detail-status { font-size: 17px; padding: 6px 9px; }
          .resume-detail-bottom { margin-top: 16px; padding: 14px; }
          .resume-detail-bottom-title { font-size: 24px; margin-bottom: 10px; }
          .resume-detail-bullet { font-size: 16px; }
        }
      `}</style>

      <div className="resume-overlay">
        <div className="resume-stack">
          <div className={`resume-list-tag${mounted ? " mounted" : ""}`}>RESUME</div>
          {ITEMS.map((item, index) => (
            <div
              key={item.id}
              className={`resume-card-wrap${active === index ? " active" : ""}${mounted ? " mounted" : ""}`}
              style={{ transitionDelay: `${index * 55}ms` }}
              onMouseEnter={() => {
                if (active !== index) playHover();
                setActive(index);
              }}
              onClick={() => setActive(index)}
            >
              <div className="resume-card">
                <div className="resume-badge">
                  <div className="resume-badge-text">{item.badge}</div>
                </div>
                <div className="resume-card-inner">
                  <div className="resume-title">{item.title}</div>
                  <div className="resume-rank">
                    <div className="resume-rank-label">RANK</div>
                    <div className="resume-rank-number">{item.rank}</div>
                  </div>
                </div>
                <div className="resume-subtitle-bar">
                  <div className="resume-subtitle">{item.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
          <a
            className={`resume-download${mounted ? " mounted" : ""}`}
            href={PROFILE.resumePdf}
            download="Belal-Embaby-Resume.pdf"
            onMouseEnter={() => playHover()}
            onClick={() => playConfirm()}
          >
            <span>DOWNLOAD PDF</span>
            <span className="resume-download-arrow">▼</span>
          </a>
        </div>

        <div className="resume-detail-panel resume-detail-anim" key={active}>
          <div className="resume-detail-top">
            <div className="resume-detail-top-index">{detail.index}</div>
            <div className="resume-detail-top-title">{detail.title}</div>
            <div className="resume-detail-top-progress">{detail.progress}</div>
          </div>

          <div className="resume-detail-list">
            {detail.rows.map((row, ri) => (
              <div
                className="resume-detail-row"
                key={row.index + row.title}
                style={{ animationDelay: `${0.06 + ri * 0.05}s` }}
              >
                <div className="resume-detail-row-index">{row.index}</div>
                <div className="resume-detail-row-title">{row.title}</div>
                <div className="resume-detail-status">{row.status}</div>
              </div>
            ))}
          </div>

          <div className="resume-detail-bottom">
            <div className="resume-detail-bottom-title">{detail.bottomTitle}</div>
            <div className="resume-detail-bullets">
              {detail.bullets.map((b) => (
                <div className="resume-detail-bullet" key={b}>- {b}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
