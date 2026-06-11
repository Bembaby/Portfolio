import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import char1 from "./assets/char1.png";
import char2 from "./assets/char2.png";
import char3 from "./assets/char3.png";
import icon1 from "./assets/icon1.png";
import icon2 from "./assets/icon2.png";
import icon3 from "./assets/icon3.png";
import SeaOfSouls from "./SeaOfSouls";
import { playHover, playConfirm, playBack, playRankUp } from "./sfx";
import { PROFILE } from "./content";

const CHARS = [char1, char2, char3];

const ROLES = [
  { text: "CODE", color: "#e8c100", bg: "rgba(232,193,0,0.12)", border: "rgba(232,193,0,0.5)" },
  { text: "LIFE", color: "#4a8fff", bg: "rgba(74,143,255,0.12)", border: "rgba(74,143,255,0.5)" },
  { text: "MAIL", color: "#4a8fff", bg: "rgba(74,143,255,0.12)", border: "rgba(74,143,255,0.5)" },
];

const ITEMS = [
  {
    id: "github", label: "GITHUB", handle: PROFILE.github.handle, href: PROFILE.github.url,
    icon: "</>", barIcon: icon1, bars: 1, newBars: [], counts: ["►"], boxLabel: "OPEN",
    links: [`github.com/${PROFILE.github.handle}`],
    stats: [
      { tag: "USR", value: "BEMBABY", color: "#a78bfa" },
    ],
  },
  {
    id: "instagram", label: "INSTAGRAM", handle: PROFILE.instagram.handle, href: PROFILE.instagram.url,
    icon: "◆", barIcon: icon2, bars: 1, newBars: [], counts: ["►"], boxLabel: "OPEN",
    links: [`instagram.com/${PROFILE.instagram.handle.replace("@", "")}`],
    stats: [
      { tag: "IG", value: "@BELALWHO", color: "#e1306c" },
    ],
  },
  {
    id: "email", label: "EMAIL", handle: PROFILE.email, href: `mailto:${PROFILE.email}`,
    icon: "@", barIcon: icon3, bars: 2, newBars: [], counts: ["►", "⧉"],
    boxLabels: ["WRITE", "COPY"],
    links: [PROFILE.email, PROFILE.email],
    stats: [
      { tag: "TO", value: "BELAL919", color: "#00f2ea" },
    ],
  },
];

export default function Socials() {
  const [active, setActive]               = useState(0);
  const [mounted, setMounted]             = useState(false);
  const [activeInfoBar, setActiveInfoBar] = useState(0);
  const [focus, setFocus]                 = useState("left"); // "left" | "right"
  const [toast, setToast]                 = useState(null);
  const toastTimer = useRef(null);
  const navigate = useNavigate();

  const showToast = useCallback((text) => {
    clearTimeout(toastTimer.current);
    setToast(text);
    toastTimer.current = setTimeout(() => setToast(null), 1700);
  }, []);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      playRankUp();
      showToast("EMAIL COPIED");
    } catch {
      showToast(PROFILE.email);
    }
  }, [showToast]);

  // The email item's second info bar copies instead of opening mailto.
  const fireInfoBar = useCallback((item, barIdx) => {
    if (item.id === "email" && barIdx === 1) { copyEmail(); return; }
    playConfirm();
    window.open(item.href, "_blank");
  }, [copyEmail]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (focus === "left") {
        if (e.key === "ArrowUp")    setActive(i => { if (i > 0) playHover(); return Math.max(0, i - 1); });
        if (e.key === "ArrowDown")  setActive(i => { if (i < ITEMS.length - 1) playHover(); return Math.min(ITEMS.length - 1, i + 1); });
        if (e.key === "ArrowRight") { playHover(); setFocus("right"); setActiveInfoBar(0); }
        if (e.key === "Enter")      { playConfirm(); window.open(ITEMS[active].href, "_blank"); }
      } else {
        const barCount = ITEMS[active].bars;
        if (e.key === "ArrowUp")   setActiveInfoBar(i => { if (i > 0) playHover(); return Math.max(0, i - 1); });
        if (e.key === "ArrowDown") setActiveInfoBar(i => { if (i < barCount - 1) playHover(); return Math.min(barCount - 1, i + 1); });
        if (e.key === "ArrowLeft") { playBack(); setFocus("left"); }
        if (e.key === "Enter")     fireInfoBar(ITEMS[active], activeInfoBar);
      }
      if ((e.key === "ArrowLeft" && focus === "left") || e.key === "Escape" || e.key === "Backspace") { playBack(); navigate(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate, focus, activeInfoBar, fireInfoBar]);

  return (
    <div id="menu-screen">
      <SeaOfSouls theme="socials" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,700;1,700&display=swap');

        .sc-root {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 6px;
          padding-left: 0;
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

        /* mid-size viewports: the portrait eats into the centered label,
           so shrink it and push the label clear of it */
        @media (min-width: 981px) and (max-width: 1380px) {
          .sc-char { left: 90px; max-width: 118px; }
          .sc-main { padding-left: 120px; }
          .sc-label { font-size: 24px; letter-spacing: 3px; }
        }

        /* lb/rb nav row */
        @keyframes sc-arrow-left {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50%       { transform: translateX(-5px); opacity: 0.4; }
        }
        @keyframes sc-arrow-right {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50%       { transform: translateX(5px); opacity: 0.4; }
        }
        .sc-nav-btn {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          color: #111;
          border: 1px solid rgba(0,0,0,0.35);
          padding: 1px 7px;
          line-height: 1.5;
          user-select: none;
        }
        .sc-nav-arrow {
          font-size: 12px;
          color: #c4001a;
          display: inline-block;
        }
        .sc-nav-arrow.left  { animation: sc-arrow-left  0.8s ease-in-out infinite; }
        .sc-nav-arrow.right { animation: sc-arrow-right 0.8s ease-in-out infinite; }

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

        /* right-side nav bar */
        @keyframes sc-right-nav-pop {
          0%   { opacity: 0; transform: scale(0.55) translateY(-10px); }
          65%  { opacity: 1; transform: scale(1.1) translateY(2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .sc-right-nav {
          position: fixed;
          top: 40px;
          right: 40px;
          display: flex;
          align-items: center;
          gap: 6px;
          pointer-events: none;
          z-index: 50;
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
        .sc-right-nav .sc-nav-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 3px;
          line-height: 1;
          user-select: none;
          color: #ffffff;
          -webkit-text-stroke: 1px rgba(0,0,0,0.6);
          paint-order: stroke fill;
          padding: 0 8px;
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

        /* info bar under nav */
        @keyframes sc-infobar-in {
          0%   { opacity: 0; transform: translateX(40px); }
          60%  { opacity: 1; transform: translateX(-4px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .sc-info-bar-wrap {
          position: fixed;
          right: 0;
          left: 65%;
          top: calc(155px + var(--bar-i, 0) * 52px);
          height: 46px;
          background: transparent;
          pointer-events: all;
          cursor: pointer;
          z-index: 50;
          padding: 0;
          animation: sc-infobar-in 0.35s cubic-bezier(0.22,1,0.36,1) both;
        }
        .sc-info-bar-wrap.selected {
          background: #111;
          padding: 1.5px;
          border-radius: 8px;
        }
        .sc-info-bar {
          position: relative;
          width: 100%;
          height: 100%;
          background: transparent;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .sc-info-bar-wrap.selected .sc-info-bar {
          background: #fff;
          border-radius: 7px;
        }
        .sc-info-bar-new {
          position: absolute;
          left: -40px;
          bottom: 0;
          height: 65%;
          width: auto;
          pointer-events: none;
          z-index: 3;
        }
        .sc-info-bar-wrap.selected .sc-info-bar::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: #c4001a;
          z-index: 1;
        }
        .sc-info-bar-text {
          flex: 1;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.85);
          padding: 0 14px;
          user-select: none;
          transition: color 0.15s ease;
        }
        .sc-info-bar-wrap.selected .sc-info-bar-text { color: #111; }
        .sc-info-bar-box {
          height: 70%;
          background: #000;
          display: flex;
          align-items: center;
          padding: 0 12px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 1px;
          color: #fff;
          flex-shrink: 0;
          border-radius: 6px;
          margin-right: 4px;
          user-select: none;
        }

        .sc-info-bar-icon {
          height: 55%;
          width: auto;
          flex-shrink: 0;
          margin-left: 14px;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
        }

        .sc-info-bar-count {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.85);
          margin-right: 80px;
          flex-shrink: 0;
          user-select: none;
          transition: color 0.15s ease;
        }
        .sc-info-bar-wrap.selected .sc-info-bar-count { color: #111; }

        /* footer hints */
        .sc-footer {
          position: fixed;
          bottom: 20px; right: 28px;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 5px;
          font-family: 'Bebas Neue', sans-serif;
          z-index: 50;
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

        /* copy toast */
        @keyframes sc-toast-in {
          0%   { opacity: 0; transform: skewX(-10deg) translateY(26px) scale(0.9); }
          55%  { opacity: 1; transform: skewX(-10deg) translateY(-4px) scale(1.04); }
          100% { opacity: 1; transform: skewX(-10deg) translateY(0) scale(1); }
        }
        .sc-toast {
          position: fixed;
          bottom: 86px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 700;
          pointer-events: none;
        }
        .sc-toast-inner {
          font-family: 'Anton', sans-serif;
          font-size: 28px;
          letter-spacing: 2px;
          color: #0a0a14;
          background: #ffffff;
          padding: 12px 34px 10px;
          clip-path: polygon(14px 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: 8px 8px 0 #c4001a;
          animation: sc-toast-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          white-space: nowrap;
        }
        .sc-toast-inner span { color: #c4001a; }

        /* ── mobile / narrow ── */
        @media (max-width: 980px) {
          .sc-root { justify-content: flex-start; padding-top: 31vh; gap: 10px; }
          .sc-info-bar-wrap { left: 6vw; right: 6vw; top: calc(92px + var(--bar-i, 0) * 50px); }
          .sc-bar, .sc-bar-red { width: 88vw; }
          .sc-bar { height: 58px; }
          .sc-bar-outer.active .sc-bar,
          .sc-bar-outer.active .sc-bar-red { height: 76px; }
          .sc-role { font-size: 30px; padding: 0 8px 0 4px; }
          .sc-label { font-size: 18px; letter-spacing: 2px; }
          .sc-char { left: 52px; max-width: 80px; }
          /* keep the centered label clear of the portrait */
          .sc-main { padding-left: 108px; padding-right: 6px; }
          .sc-stats { padding-right: 8px; }
          .sc-stat-num { font-size: 18px; }
          .sc-bar-outer.active .sc-bar-fill {
            clip-path: polygon(30% 0, 100% 0, calc(100% - 14px) 100%, calc(30% + 80px) 100%);
          }
          .sc-right-nav { top: 14px; right: 12px; gap: 3px; }
          .sc-right-nav .sc-nav-btn { font-size: 44px; -webkit-text-stroke: 1px #000; }
          .sc-right-nav .sc-nav-label { font-size: 18px; letter-spacing: 2px; }
          .sc-info-bar-wrap { height: 42px; }
          .sc-info-bar-text { font-size: 16px; letter-spacing: 1px; }
          .sc-info-bar-count { margin-right: 14px; font-size: 18px; }
          .sc-info-bar-box { font-size: 16px; padding: 0 10px; }
          .sc-info-bar-icon { margin-left: 10px; }
          .sc-toast-inner { font-size: 20px; padding: 10px 22px 8px; }
        }
      `}</style>

      <div className="sc-root" role="navigation">
        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            className={`sc-bar-outer${active === i ? " active" : ""}${mounted ? " mounted" : ""}`}
            onClick={() => {
              if (active === i) { playConfirm(); window.open(item.href, "_blank"); }
              else setActive(i);
            }}
            onMouseEnter={() => { if (active !== i) playHover(); setActive(i); }}
          >
            <div className="sc-bar-red" />
            <div className="sc-bar">
              <img className="sc-char" src={CHARS[i]} alt="" />
              <div className="sc-bar-fill" />
              <div className="sc-bar-shade" />
              <div className="sc-bar-content">
                <div className="sc-role">{ROLES[i].text}</div>
                <div className="sc-main">
                  <div className="sc-main-top">
                    <div className="sc-icon">{item.icon}</div>
                    <div className="sc-label">{item.label}</div>
                  </div>
                </div>
                <div className="sc-stats">
                  {item.stats.map(s => (
                    <div className="sc-stat" key={s.tag}>
                      <div className="sc-stat-top">
                        <span className="sc-stat-tag" style={{ color: s.color, borderColor: s.color }}>{s.tag}</span>
                        <span className="sc-stat-num">{s.value}</span>
                      </div>
                      <div className="sc-stat-bars">
                        <div className="sc-stat-bar-color" style={{ background: s.color }} />
                        <div className="sc-stat-bar-black" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mounted && (
        <div className="sc-right-nav" key={active}>
          <span className="sc-nav-arrow left">◄</span>
          <span className="sc-nav-btn">LB</span>
          <span className="sc-nav-label">{ITEMS[active].label}</span>
          <span className="sc-nav-btn">RB</span>
          <span className="sc-nav-arrow right">►</span>
        </div>
      )}

      {mounted && Array.from({ length: ITEMS[active].bars }).map((_, i) => (
        <div
          className={`sc-info-bar-wrap${activeInfoBar === i ? " selected" : ""}`}
          key={`bar-${active}-${i}`}
          style={{ "--bar-i": i, animationDelay: `${i * 50}ms` }}
          onClick={() => fireInfoBar(ITEMS[active], i)}
          onMouseEnter={() => { if (activeInfoBar !== i) playHover(); setActiveInfoBar(i); }}
        >
          <div className="sc-info-bar">
            <img className="sc-info-bar-icon" src={ITEMS[active].barIcon} alt="" />
            <span className="sc-info-bar-text">{ITEMS[active].links[i]}</span>
            <span className="sc-info-bar-box">{ITEMS[active].boxLabels?.[i] ?? ITEMS[active].boxLabel}</span>
            <span className="sc-info-bar-count">{ITEMS[active].counts[i]}</span>
          </div>
        </div>
      ))}

      {toast && (
        <div className="sc-toast" role="status">
          <div className="sc-toast-inner">
            {toast} <span>— GET!</span>
          </div>
        </div>
      )}

      <div className={`sc-footer${mounted ? " mounted" : ""}`}>
        <div className="sc-footer-row"><span className="sc-footer-key">↑↓</span><span>SELECT</span></div>
        <div className="sc-footer-row"><span className="sc-footer-key">↵</span><span>OPEN</span></div>
        <div className="sc-footer-row"><span className="sc-footer-key">ESC</span><span>BACK</span></div>
      </div>
    </div>
  );
}
