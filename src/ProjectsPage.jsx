import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SeaOfSouls from "./SeaOfSouls";
import { playHover, playBack, playSlash } from "./sfx";
import { PROJECTS } from "./content";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [slashing, setSlashing] = useState(false);
  const slashTimer = useRef(null);

  // All-out-attack style flourish, then open the project.
  const visit = useCallback((link) => {
    if (!link || slashing) return;
    playSlash();
    setSlashing(true);
    slashTimer.current = setTimeout(() => {
      window.open(link, "_blank");
      setSlashing(false);
    }, 320);
  }, [slashing]);

  useEffect(() => () => clearTimeout(slashTimer.current), []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") setActive((i) => { if (i > 0) playHover(); return Math.max(0, i - 1); });
      if (e.key === "ArrowDown") setActive((i) => { if (i < PROJECTS.length - 1) playHover(); return Math.min(PROJECTS.length - 1, i + 1); });
      if (e.key === "Enter") visit(PROJECTS[active]?.link);
      if (e.key === "ArrowLeft" || e.key === "Escape" || e.key === "Backspace") { playBack(); navigate(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate, visit]);

  const project = PROJECTS[active];

  return (
    <div id="menu-screen">
      <SeaOfSouls theme="projects" />
      <style>{`
        .pj-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
        }

        .pj-stack {
          position: absolute;
          top: 10vh;
          left: 3vw;
          width: min(42vw, 640px);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .pj-tag {
          font-family: 'Anton', sans-serif;
          font-size: 84px;
          line-height: 0.9;
          color: #eafff4;
          letter-spacing: 2px;
          margin: 0 0 8px 10px;
          text-shadow: 0 2px 0 rgba(0,0,0,0.25);
          opacity: 0;
          transform: translateX(-24px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .pj-tag.mounted { opacity: 1; transform: translateX(0); }

        .pj-card {
          position: relative;
          pointer-events: all;
          cursor: pointer;
          height: 108px;
          background: #05281a;
          clip-path: polygon(0 0, 97% 0, 100% 100%, 3% 100%);
          box-shadow: 0 8px 0 rgba(2, 18, 11, 0.9);
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1), background 0.2s ease, box-shadow 0.2s ease;
        }
        .pj-card.mounted { opacity: 1; transform: translateX(0); }
        .pj-card.active {
          background: #ffffff;
          box-shadow: 10px 8px 0 #1fae6e;
          transform: translateX(8px);
        }

        .pj-card-inner {
          position: absolute;
          inset: 0;
          padding: 12px 20px 12px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
        }
        .pj-card-name {
          font-family: 'Anton', sans-serif;
          font-size: 42px;
          line-height: 0.95;
          letter-spacing: 1px;
          color: #7df5bd;
          transition: color 0.2s ease;
        }
        .pj-card.active .pj-card-name { color: #03130b; }
        .pj-card-sub {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 2px;
          color: rgba(190, 255, 224, 0.6);
          transition: color 0.2s ease;
        }
        .pj-card.active .pj-card-sub { color: #1fae6e; }

        .pj-card-status {
          position: absolute;
          top: 12px;
          right: 26px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 19px;
          letter-spacing: 2px;
          color: #03130b;
          background: #5fe8a8;
          padding: 5px 12px 3px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
        }

        .pj-detail {
          position: absolute;
          top: 10vh;
          right: 4vw;
          width: min(42vw, 660px);
          min-height: 70vh;
          z-index: 12;
          padding: 24px;
          background: linear-gradient(180deg, #062c1c 0%, #03180f 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
          box-shadow:
            inset 0 0 0 1px rgba(127, 245, 189, 0.18),
            16px 16px 0 rgba(1, 14, 8, 0.6);
          overflow: hidden;
        }

        @keyframes pj-panel-in {
          0%   { opacity: 0; transform: translateX(46px); }
          60%  { opacity: 1; transform: translateX(-6px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .pj-detail-anim { animation: pj-panel-in 0.34s cubic-bezier(0.22,1,0.36,1) both; }

        .pj-detail-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          min-height: 84px;
          padding: 0 20px;
          background: linear-gradient(90deg, #8fffc9 0%, #defff0 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          color: #03200f;
          box-shadow: 10px 0 0 rgba(255, 94, 136, 0.88);
        }
        .pj-detail-title {
          font-family: 'Anton', sans-serif;
          font-size: 42px;
          line-height: 0.92;
          letter-spacing: 1px;
        }
        .pj-detail-stats {
          display: flex;
          gap: 16px;
          flex-shrink: 0;
        }
        .pj-detail-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1;
        }
        .pj-detail-stat-tag {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 2px;
          color: #0a7a48;
        }
        .pj-detail-stat-val {
          font-family: 'Anton', sans-serif;
          font-size: 32px;
        }

        .pj-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
        }
        .pj-tech-chip {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 19px;
          letter-spacing: 2px;
          color: #bfffe0;
          background: #0b4028;
          box-shadow: inset 0 0 0 1px rgba(127, 245, 189, 0.25);
          padding: 6px 14px 4px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
        }

        .pj-bullets {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 22px;
        }
        .pj-bullet {
          font-family: 'Anton', sans-serif;
          font-size: 20px;
          line-height: 1.25;
          letter-spacing: 0.4px;
          color: #ecfff5;
          padding: 12px 16px;
          background: #042215;
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(127, 245, 189, 0.12);
        }

        .pj-open {
          pointer-events: all;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
          background: #1fae6e;
          color: #02150c;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 3px;
          text-decoration: none;
          padding: 12px 30px 9px 22px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          box-shadow: 6px 6px 0 rgba(1, 14, 8, 0.6);
          transition: background 0.18s ease, color 0.18s ease;
          cursor: pointer;
        }
        .pj-open:hover { background: #ffffff; color: #1fae6e; }

        /* giant monogram cut-in behind the detail panel */
        .pj-monogram {
          position: absolute;
          right: -28px;
          bottom: -56px;
          font-family: 'Anton', sans-serif;
          font-style: italic;
          font-size: 340px;
          line-height: 0.8;
          color: rgba(127, 245, 189, 0.07);
          -webkit-text-stroke: 2px rgba(127, 245, 189, 0.14);
          pointer-events: none;
          user-select: none;
          z-index: 0;
          transform: rotate(-8deg);
        }
        .pj-detail > *:not(.pj-monogram) { position: relative; z-index: 1; }

        @keyframes pj-bullet-in {
          0%   { opacity: 0; transform: translateX(26px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .pj-bullet { animation: pj-bullet-in 0.3s cubic-bezier(0.22,1,0.36,1) both; }

        /* full-screen visit slash */
        @keyframes pj-slash-a {
          0%   { transform: translateX(-130%) skewX(-24deg); }
          100% { transform: translateX(130%) skewX(-24deg); }
        }
        @keyframes pj-slash-b {
          0%   { transform: translateX(130%) skewX(18deg); }
          100% { transform: translateX(-130%) skewX(18deg); }
        }
        @keyframes pj-slash-flash {
          0%, 100% { opacity: 0; }
          40% { opacity: 0.9; }
        }
        .pj-slash-overlay {
          position: fixed;
          inset: 0;
          z-index: 900;
          pointer-events: none;
          overflow: hidden;
        }
        .pj-slash-overlay .flash {
          position: absolute;
          inset: 0;
          background: #ffffff;
          animation: pj-slash-flash 0.32s ease both;
        }
        .pj-slash-overlay .blade-a,
        .pj-slash-overlay .blade-b {
          position: absolute;
          top: 30%;
          left: -10%;
          width: 120%;
          height: 12vh;
          background: linear-gradient(90deg, transparent, #ffffff 30%, #ffffff 70%, transparent);
          box-shadow: 0 0 40px rgba(95, 232, 168, 0.9);
        }
        .pj-slash-overlay .blade-a { animation: pj-slash-a 0.3s cubic-bezier(0.6, 0, 0.2, 1) both; }
        .pj-slash-overlay .blade-b {
          top: 56%;
          animation: pj-slash-b 0.3s cubic-bezier(0.6, 0, 0.2, 1) 0.05s both;
        }

        /* ── mobile / narrow ── */
        @media (max-width: 980px) {
          .pj-overlay {
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            pointer-events: all;
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 64px 14px 110px;
          }
          .pj-stack {
            position: static;
            width: 100%;
            gap: 10px;
          }
          .pj-tag { font-size: 46px; margin-left: 2px; }
          .pj-card { height: 84px; }
          .pj-card-inner { padding: 10px 14px; gap: 4px; }
          .pj-card-name { font-size: 28px; }
          .pj-card-sub { font-size: 17px; }
          .pj-card-status { top: 8px; right: 16px; font-size: 15px; }
          .pj-detail {
            position: static;
            width: 100%;
            min-height: 0;
            padding: 16px 14px 18px;
          }
          .pj-detail-top { min-height: 64px; padding: 0 14px; }
          .pj-detail-title { font-size: 27px; }
          .pj-detail-stat-tag { font-size: 11px; }
          .pj-detail-stat-val { font-size: 24px; }
          .pj-tech-chip { font-size: 15px; padding: 5px 10px 3px; }
          .pj-bullet { font-size: 16px; padding: 10px 12px; }
          .pj-open { font-size: 21px; }
          .pj-monogram { font-size: 220px; bottom: -36px; }
        }
      `}</style>

      <div className="pj-overlay">
        <div className="pj-stack">
          <div className={`pj-tag${mounted ? " mounted" : ""}`}>SIDE PROJECTS</div>
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              className={`pj-card${active === i ? " active" : ""}${mounted ? " mounted" : ""}`}
              style={{ transitionDelay: mounted ? "0ms" : `${i * 55}ms` }}
              onMouseEnter={() => { if (active !== i) playHover(); setActive(i); }}
              onClick={() => {
                if (active === i && p.link) visit(p.link);
                else setActive(i);
              }}
            >
              <div className="pj-card-inner">
                <div className="pj-card-name">{p.name}</div>
                <div className="pj-card-sub">{p.subtitle}</div>
              </div>
              <div className="pj-card-status">{p.status}</div>
            </div>
          ))}
        </div>

        <div className="pj-detail pj-detail-anim" key={project.id}>
          <div className="pj-monogram" aria-hidden="true">{project.name[0]}</div>
          <div className="pj-detail-top">
            <div className="pj-detail-title">{project.name}</div>
            <div className="pj-detail-stats">
              {project.stats.map((s) => (
                <div className="pj-detail-stat" key={s.tag}>
                  <span className="pj-detail-stat-tag">{s.tag}</span>
                  <span className="pj-detail-stat-val">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pj-tech">
            {project.tech.map((t) => (
              <span className="pj-tech-chip" key={t}>{t}</span>
            ))}
          </div>

          <div className="pj-bullets">
            {project.bullets.map((b, bi) => (
              <div
                className="pj-bullet"
                key={b}
                style={{ animationDelay: `${0.08 + bi * 0.05}s` }}
              >
                - {b}
              </div>
            ))}
          </div>

          {project.link && (
            <a
              className="pj-open"
              href={project.link}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => playHover()}
              onClick={(e) => { e.preventDefault(); visit(project.link); }}
            >
              <span>VISIT {project.linkLabel.toUpperCase()}</span>
              <span>►</span>
            </a>
          )}
        </div>
      </div>

      {slashing && (
        <div className="pj-slash-overlay">
          <div className="blade-a" />
          <div className="blade-b" />
          <div className="flash" />
        </div>
      )}
    </div>
  );
}
