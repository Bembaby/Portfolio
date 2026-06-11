import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import char1 from "./assets/char1.png";
import char2 from "./assets/char2.png";
import char3 from "./assets/char3.png";
import mainm from "./assets/mainm.jpeg";
import mainm2 from "./assets/mainm2.jpeg";
import mainf from "./assets/mainf.jpeg";
import SeaOfSouls from "./SeaOfSouls";
import { playHover, playConfirm, playBack } from "./sfx";
import { STATS } from "./content";

const CHARS = [char1, char2, char3, null];
const MAIN_IMAGES = [mainm, mainm2, mainf, null];

const REVEAL_CONTENT = [
  {
    upper: [
      "Belal Embaby — Software Engineer",
      "B.S. Computer Science @ NJIT, Class of Dec 2025",
      "Currently engineering a real estate platform at RANCS Capital",
    ],
    lower: "newark, new jersey",
  },
  {
    upper: [
      "I'm fluent in Arabic, English, and Spanish —",
      "three human languages on top of Java, JavaScript,",
      "C, Python, and PHP.",
    ],
    lower: "eight languages total, technically",
  },
  {
    upper: [
      "I built FitTrack+ solo: web, iOS, and Android.",
      "2,000+ downloads and 200+ active users later,",
      "it runs on one shared Spring Boot backend.",
    ],
    lower: "shipping beats talking",
  },
  {
    upper: [
      "Attribute scan complete.",
      "Backend, frontend, devops, shipping speed, learning rate —",
      "evaluated the only honest way: a radar chart.",
    ],
    lower: "stats grow every quarter",
  },
];

const ROLES = [
  { text: "LEADER", color: "#e8c100", bg: "rgba(232,193,0,0.12)", border: "rgba(232,193,0,0.5)" },
  { text: "HUMAN",  color: "#4a8fff", bg: "rgba(74,143,255,0.12)", border: "rgba(74,143,255,0.5)" },
  { text: "MAKER",  color: "#4a8fff", bg: "rgba(74,143,255,0.12)", border: "rgba(74,143,255,0.5)" },
  { text: "POWER",  color: "#ff5e88", bg: "rgba(255,94,136,0.12)", border: "rgba(255,94,136,0.5)" },
];

const ITEMS = [
  { id: "whoami", label: "WHO I AM" },
  { id: "funfact", label: "FUN FACT" },
  { id: "shipped", label: "WHAT I'VE SHIPPED" },
  { id: "stats", label: "MY STATS" },
];

// Persona-style animated attribute radar.
function RadarChart() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = canvas.clientWidth;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2 + 6;
    const R = size * 0.32;
    const N = STATS.length;
    const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / N;

    let raf = 0;
    const start = performance.now();
    const DUR = 900;

    function frame(now) {
      const raw = reduceMotion ? 1 : Math.min(1, (now - start) / DUR);
      // overshoot ease
      const k = raw === 1 ? 1 : 1 - Math.pow(2, -10 * raw) * Math.cos(raw * 7);
      ctx.clearRect(0, 0, size, size);

      // rings
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const a = angle(i % N);
          const rr = (R * r) / 4;
          const x = cx + Math.cos(a) * rr;
          const y = cy + Math.sin(a) * rr;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = r === 4 ? "rgba(125, 212, 252, 0.4)" : "rgba(125, 212, 252, 0.14)";
        ctx.lineWidth = r === 4 ? 1.6 : 1;
        ctx.stroke();
      }

      // axes
      for (let i = 0; i < N; i++) {
        const a = angle(i);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.strokeStyle = "rgba(125, 212, 252, 0.16)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // data polygon
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const idx = i % N;
        const a = angle(idx);
        const rr = R * (STATS[idx].value / 99) * k;
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(60, 226, 255, 0.22)";
      ctx.fill();
      ctx.strokeStyle = "#3ce2ff";
      ctx.lineWidth = 2.2;
      ctx.shadowColor = "rgba(60, 226, 255, 0.8)";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // vertex dots + labels
      for (let i = 0; i < N; i++) {
        const a = angle(i);
        const rr = R * (STATS[i].value / 99) * k;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 3.4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        const lx = cx + Math.cos(a) * (R + 34);
        const ly = cy + Math.sin(a) * (R + 30);
        ctx.textAlign = "center";
        ctx.fillStyle = "#ff5e88";
        ctx.font = `700 ${Math.round(size * 0.052)}px 'Anton', sans-serif`;
        ctx.fillText(STATS[i].stat, lx, ly - 4);
        ctx.fillStyle = "rgba(235, 248, 255, 0.85)";
        ctx.font = `${Math.round(size * 0.034)}px 'Bebas Neue', sans-serif`;
        ctx.fillText(STATS[i].label, lx, ly + Math.round(size * 0.04) - 2);
        ctx.fillStyle = "#7dd4fc";
        ctx.font = `${Math.round(size * 0.04)}px 'Bebas Neue', sans-serif`;
        ctx.fillText(String(Math.round(STATS[i].value * k)), lx, ly + Math.round(size * 0.082));
      }

      if (raw < 1) raf = requestAnimationFrame(frame);
    }

    if (reduceMotion) {
      // Draw the finished chart synchronously; no animation loop needed.
      frame(start + DUR);
    } else {
      raf = requestAnimationFrame(frame);
    }
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="sc-radar-canvas" aria-label="Skill radar chart" />;
}

export default function AboutMe() {
  const [active, setActive]   = useState(0);
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") setActive(i => { if (i > 0) playHover(); return Math.max(0, i - 1); });
      if (e.key === "ArrowDown") setActive(i => { if (i < ITEMS.length - 1) playHover(); return Math.min(ITEMS.length - 1, i + 1); });
      if (e.key === "Enter" || e.key === "ArrowRight") { playConfirm(); setRevealed(true); }
      if (e.key === "ArrowLeft") {
        playBack();
        if (revealed) setRevealed(false);
        else navigate(-1);
      }
      if (e.key === "Escape" || e.key === "Backspace") { playBack(); navigate(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate, revealed]);

  return (
    <div id="menu-screen">
      <SeaOfSouls theme="about" />
      {revealed && (
        <div
          key={`dim-${active}`}
          className="sc-dim"
          style={{ pointerEvents: "all", cursor: "pointer" }}
          onClick={() => { playBack(); setRevealed(false); }}
        />
      )}
      {revealed && ITEMS[active].id === "stats" ? (
        <div key={`stats-${active}`} className={`sc-stats-row${mounted ? " mounted" : ""}`}>
          <div className="sc-reveal-panel stats">
            <div className="sc-reveal-upper-bar stats">
              {REVEAL_CONTENT[active].upper.map((line) => (
                <div className="sc-reveal-upper-line" key={line}>{line}</div>
              ))}
            </div>
            <div className="sc-reveal-lower-bar">{REVEAL_CONTENT[active].lower}</div>
          </div>
          <div className="sc-radar-shell">
            <div className="sc-radar-title">ATTRIBUTES</div>
            <RadarChart />
          </div>
        </div>
      ) : revealed && (
        <div
          key={`panel-${active}`}
          className={`sc-reveal-panel${mounted ? " mounted" : ""}`}
        >
          <div className="sc-reveal-upper-bar">
            {REVEAL_CONTENT[active].upper.map((line) => (
              <div className="sc-reveal-upper-line" key={line}>{line}</div>
            ))}
          </div>
          <div className="sc-reveal-lower-bar">{REVEAL_CONTENT[active].lower}</div>
        </div>
      )}
      {revealed && ITEMS[active].id !== "stats" && (
        <div key={`nav-${active}`} className="sc-right-nav">
          <span className="sc-nav-arrow left">◄</span>
          <span className="sc-nav-btn">LB</span>
          <span className="sc-nav-dot" />
          <span className="sc-nav-btn">RB</span>
          <span className="sc-nav-arrow right">►</span>
        </div>
      )}
      {revealed && MAIN_IMAGES[active] && (
        <div key={`portrait-${active}`} className={`sc-main-portrait-shell${mounted ? " mounted" : ""}`}>
          <img
            className="sc-main-portrait"
            src={MAIN_IMAGES[active]}
            alt=""
          />
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,700;1,700&family=Montserrat:wght@300&display=swap');

        .sc-root {
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 6px;
          padding-left: 0;
        }

        .sc-dim {
          position: absolute;
          inset: 0;
          z-index: 12;
          background: rgba(10, 12, 20, 0.88);
          pointer-events: none;
          animation: sc-dim-in 0.32s ease-out;
        }

        /* while a reveal is open the menu disappears entirely —
           no ghost rows behind the panels */
        .sc-root.concealed {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }

        @keyframes sc-dim-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes sc-reveal-bar-in {
          0% {
            opacity: 0;
            transform: translateX(-120px) rotate(var(--panel-rot, -20deg)) scaleX(0.72);
          }
          60% {
            opacity: 1;
            transform: translateX(18px) rotate(var(--panel-rot, -20deg)) scaleX(1.03);
          }
          100% {
            opacity: 1;
            transform: translateX(0) rotate(var(--panel-rot, -20deg)) scaleX(1);
          }
        }

        @keyframes sc-portrait-in {
          0% {
            opacity: 0;
            transform: translateX(78px) skewX(-8deg) scale(0.94);
            filter: blur(8px);
          }
          55% {
            opacity: 0.9;
            transform: translateX(-8px) skewX(-8deg) scale(1.015);
            filter: blur(0);
          }
          100% {
            opacity: 0.96;
            transform: translateX(0) skewX(-8deg) scale(1);
            filter: blur(0);
          }
        }

        @keyframes sc-arrow-left {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(-5px); opacity: 0.4; }
        }

        @keyframes sc-arrow-right {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(5px); opacity: 0.4; }
        }

        .sc-main-portrait-shell {
          position: absolute;
          top: 0;
          right: -3vw;
          z-index: 13;
          pointer-events: none;
          width: 43vw;
          height: 100vh;
          overflow: hidden;
          opacity: 0;
          transform: translateX(24px) skewX(-8deg) scale(0.98);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .sc-main-portrait-shell.mounted {
          opacity: 0.96;
          transform: translateX(0) skewX(-8deg) scale(1);
          animation: sc-portrait-in 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sc-reveal-panel {
          --panel-rot: -20deg;
          position: absolute;
          top: 44vh;
          left: -6vw;
          width: 88vw;
          height: 60vh;
          z-index: 12;
          pointer-events: none;
          background:
            linear-gradient(180deg, #ffffff 0%, #f3f6fc 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 88px) 100%, 0 100%);
          box-shadow:
            0 0 0 2px rgba(255,255,255,0.18),
            18px 0 0 rgba(215, 13, 44, 0.82),
            28px 0 0 rgba(255,255,255,0.26);
          opacity: 0;
          transform: translateX(-40px) rotate(var(--panel-rot));
          transform-origin: left bottom;
          transition: opacity 0.3s ease, transform 0.35s ease;
        }
        .sc-reveal-panel.mounted {
          opacity: 1;
          transform: translateX(0) rotate(var(--panel-rot));
          animation: sc-reveal-bar-in 0.46s cubic-bezier(0.22, 1, 0.36, 1);
        }
        /* stats: slanted bar grows left out of a square attributes card (see sketch) */
        @keyframes sc-stats-in {
          0%   { opacity: 0; transform: translateX(-48px) scaleX(0.94); }
          100% { opacity: 1; transform: translateX(0) scaleX(1); }
        }
        .sc-stats-row {
          --card: clamp(300px, 38vw, 460px);
          --bar-slant: 52px;
          position: absolute;
          left: 0;
          right: 4vw;
          bottom: 26vh;
          height: var(--card);
          display: grid;
          grid-template-columns: minmax(0, 1fr) var(--card);
          gap: 0;
          z-index: 13;
          pointer-events: none;
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.3s ease, transform 0.35s ease;
        }
        .sc-stats-row.mounted {
          opacity: 1;
          transform: translateX(0);
          animation: sc-stats-in 0.46s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sc-stats-row .sc-reveal-panel.stats {
          position: relative;
          top: 0;
          left: 0;
          right: auto;
          bottom: auto;
          width: 100%;
          height: 100%;
          overflow: hidden;
          opacity: 1;
          transform: none;
          animation: none;
          background: linear-gradient(180deg, #ffffff 0%, #f3f6fc 100%);
          /* left edge slopes down — bar grows out of the card */
          clip-path: polygon(var(--bar-slant) 0, 100% 0, 100% 100%, 0 100%);
          box-shadow:
            0 0 0 2px rgba(255,255,255,0.18),
            18px 0 0 rgba(215, 13, 44, 0.82);
        }
        .sc-stats-row .sc-reveal-panel.stats::before {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
        /* fill the top-left wedge so the bar reads edge-to-edge */
        .sc-stats-row .sc-reveal-panel.stats::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #ffffff 0%, #f3f6fc 100%);
          clip-path: polygon(0 0, var(--bar-slant) 0, 0 100%);
          pointer-events: none;
        }
        .sc-reveal-panel::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 8px;
          background: linear-gradient(180deg, #e03d31 0%, #eb3333 100%);
          clip-path: inherit;
        }
        .sc-reveal-upper-bar {
          position: absolute;
          top: 10%;
          left: 0%;
          width: 100%;
          height: 40%;
          background: #07080d;
          clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #fff;
          text-align: center;
        }
        .sc-reveal-upper-line {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: clamp(14px, 1.1vw + 8px, 20px);
          letter-spacing: 0.5px;
          line-height: 1.2;
          /* heavier left padding compensates the leftward shove of the tilt */
          padding: 0 5% 0 10%;
        }
        .sc-reveal-lower-bar {
          position: absolute;
          top: 58%;
          right: 0;
          width: 52%;
          min-height: 20%;
          height: auto;
          background: #07080d;
          clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: clamp(15px, 0.9vw + 8px, 22px);
          letter-spacing: 0.4px;
          line-height: 1.3;
          text-transform: lowercase;
          padding: 10px 32px 10px 22px;
        }
        .sc-stats-row .sc-reveal-upper-bar.stats {
          top: 10%;
          height: 52%;
          width: 100%;
          padding: 0 4vw 0 calc(var(--bar-slant) + 12px);
        }
        .sc-stats-row .sc-reveal-lower-bar {
          top: 68%;
          right: 0;
          width: 100%;
          padding-left: calc(var(--bar-slant) + 12px);
        }

        @keyframes sc-right-nav-pop {
          0%   { opacity: 0; transform: scale(0.55) translateY(-10px); }
          65%  { opacity: 1; transform: scale(1.1) translateY(2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .sc-right-nav {
          position: absolute;
          top: 10vh;
          left: 6vw;
          display: flex;
          align-items: center;
          gap: 6px;
          pointer-events: none;
          z-index: 14;
          transform: translateX(-40px) rotate(-20deg);
          transform-origin: left bottom;
          animation: sc-right-nav-pop 0.38s cubic-bezier(0.22,1,0.36,1) both;
        }
        .sc-right-nav .sc-nav-btn {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 100px;
          letter-spacing: 3px;
          line-height: 1;
          user-select: none;
          color: #fff;
          -webkit-text-stroke: 2px #000;
          paint-order: stroke fill;
          background: none;
          border: none;
          padding: 0 6px;
        }
        .sc-right-nav .sc-nav-dot {
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: #111;
          margin: 0 10px;
          flex-shrink: 0;
        }
        .sc-right-nav .sc-nav-arrow {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          color: #c4001a;
          display: inline-block;
          user-select: none;
        }
        .sc-right-nav .sc-nav-arrow.left  { animation: sc-arrow-left  0.8s ease-in-out infinite; }
        .sc-right-nav .sc-nav-arrow.right { animation: sc-arrow-right 0.8s ease-in-out infinite; }

        .sc-main-portrait {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top right;
          transform: skewX(8deg) scale(1.08);
          transform-origin: top right;
        }

        /* radar chart shell (stats reveal) */
        @keyframes sc-radar-in {
          0%   { opacity: 0; transform: var(--radar-base, rotate(4deg)) translateX(70px) scale(0.92); }
          60%  { opacity: 1; transform: var(--radar-base, rotate(4deg)) translateX(-8px) scale(1.01); }
          100% { opacity: 1; transform: var(--radar-base, rotate(4deg)) translateX(0) scale(1); }
        }
        .sc-stats-row .sc-radar-shell {
          --radar-base: rotate(0deg);
          width: 100%;
          height: 100%;
          position: relative;
          top: 0;
          left: 0;
          right: auto;
          padding: 18px 18px 10px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          background: #04071a;
          clip-path: polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%);
          box-shadow:
            inset 0 0 0 1px rgba(125, 212, 252, 0.25),
            14px 14px 0 rgba(196, 0, 26, 0.85);
          animation: sc-radar-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.08s both;
          pointer-events: none;
        }
        .sc-reveal-upper-bar.stats {
          gap: 8px;
        }
        .sc-stats-row .sc-reveal-upper-line {
          padding: 0;
        }
        .sc-radar-title {
          font-family: 'Anton', sans-serif;
          font-size: 28px;
          letter-spacing: 3px;
          color: #ffffff;
          border-left: 4px solid #ff5e88;
          padding-left: 10px;
          margin-bottom: 4px;
          flex-shrink: 0;
        }
        .sc-radar-canvas {
          width: 100%;
          aspect-ratio: 1;
          display: block;
        }
        .sc-stats-row .sc-radar-canvas {
          flex: 1;
          min-height: 0;
          aspect-ratio: auto;
        }

        /* ── Each bar ── */
        .sc-bar {
          position: relative;
          width: 45vw;
          height: 64px;
          transition: height 0.3s cubic-bezier(0.22,1,0.36,1);
          background: #111;
          cursor: pointer;
          pointer-events: all;
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: 0 6px 24px rgba(0,0,0,0.65);
          z-index: 1;
        }

        /* wrapper holds both the red underlay and the bar */
        .sc-bar-outer {
          position: relative;
          flex-shrink: 0;
          transform: translateX(-100%);
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sc-bar-outer.active .sc-bar     { height: 90px; }
        .sc-bar-outer.active .sc-bar-red { height: 90px; }
        .sc-bar-outer.mounted { transform: translateX(0); }
        .sc-bar-outer:nth-child(1) { transition-delay: 0ms; }
        .sc-bar-outer:nth-child(2) { transition-delay: 80ms; }
        .sc-bar-outer:nth-child(3) { transition-delay: 160ms; }

        /* red underlay — peeks out below the bar when active */
        .sc-bar-red {
          position: absolute;
          top: 0; left: 0;
          width: 45vw;
          height: 64px;
          background: #c4001a;
          clip-path: polygon(50% 0, 100% 0, 100% 100%, calc(50% - 10px) 100%);
          transform: translateY(-7px);
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 0;
          pointer-events: none;
        }
        .sc-bar-outer.active .sc-bar-red { opacity: 1; }

        /* white fill — skewed parallelogram on the right 25% */
        .sc-bar-fill {
          position: absolute;
          inset: 0;
          width: 100%;
          background: #ffffff;
          clip-path: polygon(100% 0, 100% 0, calc(100% - 32px) 100%, calc(100% - 32px) 100%);
          transition: clip-path 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
        }
        .sc-bar-outer.active .sc-bar-fill {
          clip-path: polygon(22% 0, 100% 0, calc(100% - 14px) 100%, calc(22% + 138px) 100%);
        }

        /* shade on the left edge of the white fill */
        .sc-bar-shade {
          position: absolute;
          top: 0; bottom: 0;
          left: 73%;
          width: 6%;
          background: linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 100%);
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .sc-bar-outer.active .sc-bar-shade { opacity: 1; }

        /* bottom shadow line under each bar */
        .sc-bar::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 6px;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%);
          z-index: 10;
          pointer-events: none;
        }

        /* content layout inside each bar */
        .sc-bar-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px 0 20px;
        }

        /* left: role label */
        .sc-role {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          font-family: 'Anton', sans-serif;
          font-size: 50px;
          letter-spacing: -2px;
          color: #ffffff;
          transform: rotate(-30deg);
          user-select: none;
          line-height: 1;
          padding: 0 16px 0 8px;
        }

        /* left: icon + name centered in remaining space */
        .sc-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding-left: 78px;
        }
        .sc-main-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sc-icon {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          width: 32px;
          text-align: center;
          flex-shrink: 0;
          color: rgba(255,255,255,0.15);
          transition: color 0.2s ease;
          user-select: none;
        }
        .sc-bar-outer.active .sc-icon { color: rgba(255,255,255,0.25); }

        .sc-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 4px;
          line-height: 1;
          color: rgba(255,255,255,0.85);
          transition: color 0.2s ease;
          user-select: none;
        }
        .sc-bar-outer.active .sc-label { color: #111111; }

        /* right: stats group */
        .sc-stats {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-right: 24px;
          flex-shrink: 0;
        }

        .sc-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .sc-stat-top {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .sc-stat-tag {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 9px;
          letter-spacing: 1.5px;
          padding: 1px 4px;
          border-width: 1px;
          border-style: solid;
          line-height: 1.4;
          user-select: none;
        }

        .sc-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          font-style: italic;
          line-height: 1;
          color: #ffffff;
          letter-spacing: 1px;
          user-select: none;
          transition: color 0.2s ease;
        }
        .sc-bar-outer.active .sc-stat-num { color: #111111; }

        .sc-stat-bars {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1px;
          margin-top: 2px;
        }
        .sc-stat-bar-color {
          height: 3px;
          width: 100%;
        }
        .sc-stat-bar-black {
          height: 2px;
          width: 100%;
          background: #000;
        }

        /* character portrait */
        .sc-char {
          position: absolute;
          top: 0;
          left: 110px;
          height: 100%;
          width: auto;
          max-width: 160px;
          object-fit: cover;
          object-position: top;
          pointer-events: none;
          z-index: 3;
          clip-path: polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%);
        }

        /* footer hints */
        .sc-footer {
          position: fixed;
          bottom: 20px; right: 28px;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 5px;
          font-family: 'Bebas Neue', sans-serif;
          z-index: 14;
          opacity: 0;
          transition: opacity 0.4s ease 0.6s;
        }
        .sc-footer.mounted { opacity: 1; }
        .sc-footer-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; letter-spacing: 2px;
          color: rgba(255,255,255,0.22);
        }
        .sc-footer-key {
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 3px;
          padding: 1px 6px; font-size: 11px;
        }
        @media (pointer: coarse) { .sc-footer { display: none; } }

        /* ── mobile / narrow ── */
        @media (max-width: 980px) {
          .sc-bar, .sc-bar-red { width: 88vw; }
          .sc-bar { height: 56px; }
          .sc-bar-outer.active .sc-bar,
          .sc-bar-outer.active .sc-bar-red { height: 72px; }
          .sc-role { font-size: 26px; padding: 0 6px 0 2px; }
          .sc-label { font-size: 18px; letter-spacing: 2px; }
          .sc-char { left: 58px; max-width: 92px; }
          .sc-main { padding-left: 0; }
          .sc-bar-outer.active .sc-bar-fill {
            clip-path: polygon(30% 0, 100% 0, calc(100% - 14px) 100%, calc(30% + 80px) 100%);
          }
          /* portrait becomes backdrop art on phones: above the dim but
             UNDER the text panel so copy is never covered */
          .sc-main-portrait-shell {
            width: 80vw;
            right: -10vw;
            z-index: 12;
            opacity: 0.85 !important;
          }
          .sc-stats-row {
            --card: min(78vw, 340px);
            --bar-slant: 28px;
            left: 0;
            right: 0;
            bottom: 20vh;
            height: auto;
            grid-template-columns: 1fr;
            grid-template-rows: var(--card) auto;
          }
          .sc-stats-row .sc-radar-shell {
            grid-row: 1;
            width: var(--card);
            height: var(--card);
            margin: 0 auto;
          }
          .sc-stats-row .sc-reveal-panel.stats {
            grid-row: 2;
            min-height: 34vh;
            clip-path: polygon(0 6%, 100% 0, 100% 100%, 0 100%);
          }
          .sc-stats-row.mounted { transform: none; }
          .sc-reveal-panel {
            --panel-rot: 0deg;
            top: 44vh;
            height: 50vh;
            width: 100vw;
            left: 0;
            z-index: 13;
            transform-origin: left top;
            clip-path: polygon(0 6%, 100% 0, 100% 100%, 0 100%);
          }
          .sc-reveal-upper-line { font-size: 13.5px; padding: 0 5vw; }
          .sc-reveal-upper-bar, .sc-reveal-upper-bar.stats {
            top: 12%;
            height: 52%;
            padding: 0;
            gap: 8px;
          }
          .sc-reveal-lower-bar,
          .sc-stats-row .sc-reveal-lower-bar {
            top: 70%;
            right: 6vw;
            width: 70%;
            font-size: 14px;
            padding: 8px 16px;
          }
          .sc-right-nav { display: none; }
          .sc-radar-title { font-size: 20px; }
        }
      `}</style>

      <div className={`sc-root${revealed ? " concealed" : ""}`} role="navigation">
        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            className={`sc-bar-outer${active === i ? " active" : ""}${mounted ? " mounted" : ""}`}
            onClick={() => {
              playConfirm();
              setActive(i);
              setRevealed(true);
            }}
            onMouseEnter={() => {
              if (active !== i) playHover();
              setActive(i);
            }}
          >
            <div className="sc-bar-red" />
            <div className="sc-bar">
              {CHARS[i] && <img className="sc-char" src={CHARS[i]} alt="" />}
              <div className="sc-bar-fill" />
              <div className="sc-bar-shade" />
              <div className="sc-bar-content">
                <div className="sc-role">{ROLES[i].text}</div>
                <div className="sc-main">
                  <div className="sc-main-top">
                    <div className="sc-label">{item.label}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`sc-footer${mounted ? " mounted" : ""}`}>
        <div className="sc-footer-row"><span className="sc-footer-key">↑↓</span><span>SELECT</span></div>
        <div className="sc-footer-row"><span className="sc-footer-key">↵</span><span>REVEAL</span></div>
        <div className="sc-footer-row"><span className="sc-footer-key">ESC</span><span>BACK</span></div>
      </div>
    </div>
  );
}
