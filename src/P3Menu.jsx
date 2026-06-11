import { useState, useEffect, useRef, useCallback } from "react";
import { playHover, playConfirm } from "./sfx";
import { PROFILE, TICKER } from "./content";
import { useViewport } from "./useViewport";

const ITEMS = [
  { id: "about",   label: "ABOUT ME",      desc: "THE STORY SO FAR",          page: "about",   fontSize: 80, offsetX: 0,  offsetY: 0,  skew: -6,  skewY: 10  },
  { id: "resume",  label: "RESUME",        desc: "STATS · SKILLS · RECORD",   page: "resume",  fontSize: 66, offsetX: 20, offsetY: 8,  skew: -11, skewY: -10 },
  { id: "github",  label: "GITHUB LINK",   desc: "READ THE SOURCE",           page: "github",  fontSize: 68, offsetX: 8,  offsetY: 6,  skew: 0,   skewY: -4  },
  { id: "socials", label: "SOCIALS",       desc: "FORM A SOCIAL LINK",        page: "socials", fontSize: 74, offsetX: 16, offsetY: 8,  skew: -3,  skewY: 5   },
  { id: "sideproj",label: "SIDE PROJECTS", desc: "THINGS I'VE SHIPPED",       page: "projects",fontSize: 56, offsetX: 10, offsetY: 6,  skew: -4,  skewY: 7   },
];

const CLIP = (w, h) => `polygon(0px 0px, ${w}px ${h * 0.5}px, 0px ${h}px)`;

export default function P3Menu({ onNavigate }) {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [tick, setTick] = useState(0);
  const parRef = useRef(null);
  const vp = useViewport();

  // Typography scale: keep labels readable on phones.
  const menuScale = vp.isMobile ? Math.max(0.5, vp.w / 860) : Math.max(0.62, vp.scale);

  const activate = useCallback((idx) => {
    if (idx !== active) playHover();
    setActive(idx);
    setAnimKey(k => k + 1);
  }, [active]);

  const confirm = useCallback((page) => {
    playConfirm();
    onNavigate?.(page);
  }, [onNavigate]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 350);
    return () => clearTimeout(t);
  }, []);

  // Rotating ticker line.
  useEffect(() => {
    const t = setInterval(() => setTick(i => i + 1), 3400);
    return () => clearInterval(t);
  }, []);

  // Soft pointer parallax on the whole menu block (desktop only).
  useEffect(() => {
    if (vp.isTouch) return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 18;
      ty = (e.clientY / window.innerHeight - 0.5) * 12;
    };
    const tickFn = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (parRef.current) parRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(tickFn);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tickFn);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [vp.isTouch]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp")   activate(Math.max(0, active - 1));
      if (e.key === "ArrowDown") activate(Math.min(ITEMS.length - 1, active + 1));
      if (e.key === "Enter")     confirm(ITEMS[active].page);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, activate, confirm]);

  return (
    <>
      <style>{`
        .p3-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .p3-stripe  { position:absolute; right:0; top:0; bottom:0; width:5px; background:#c4001a; z-index:10; pointer-events:none; }
        .p3-stripe2 { position:absolute; right:9px; top:0; bottom:0; width:2px; background:rgba(245,122,139,0.22); z-index:10; pointer-events:none; }

        .p3-menu {
          position: relative;
          z-index: 20;
          padding: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: all;
        }
        @media (max-width: 760px) {
          .p3-menu { padding: 24px 12px; gap: 16px; }
        }

        .p3-row {
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          text-decoration: none;
          opacity: 0;
          transform: translateX(36px);
          transition: opacity 0.38s ease, transform 0.38s cubic-bezier(0.22,1,0.36,1);
        }
        .p3-row.mounted {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }

        .p3-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 120%; height: 200%;
          background: radial-gradient(ellipse at center, rgba(255,100,180,0.35) 0%, transparent 70%);
          filter: blur(18px);
          z-index: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .p3-row.active .p3-glow { opacity: 1; }

        .p3-skew-wrap {
          position: relative;
          display: flex;
          align-items: center;
          isolation: isolate;
        }

        @keyframes p3-shadow-pop {
          0%   { transform: translateY(-40%) translateX(-12px) scaleX(0) scaleY(1); }
          55%  { transform: translateY(-46%) translateX(-15px) scaleX(1.22) scaleY(1.18); }
          75%  { transform: translateY(-39%) translateX(-11px) scaleX(0.96) scaleY(0.97); }
          100% { transform: translateY(-40%) translateX(-12px) scaleX(1) scaleY(1); }
        }

        .p3-shadow-tri {
          position: absolute;
          top: 50%;
          transform-origin: left center;
          background: rgba(235, 80, 120, 0.85);
          z-index: 1;
          pointer-events: none;
          transform: translateY(-40%) translateX(-12px) scaleX(0);
          transition: transform 0.18s ease;
        }
        .p3-shadow-tri.pop {
          animation: p3-shadow-pop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .p3-highlight {
          position: absolute;
          top: 50%;
          transform-origin: left center;
          background: #ffffff;
          z-index: 2;
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1);
          pointer-events: none;
        }

        .p3-label-wrap {
          position: relative;
          z-index: 3;
        }

        .p3-label-base {
          font-family: 'Anton', sans-serif;
          font-style: italic;
          letter-spacing: 2px;
          line-height: 0.85;
          display: block;
          white-space: nowrap;
          user-select: none;
        }

        .p3-label-dark {
          color: #3ce2ff;
          transition: color 0.12s ease;
        }
        .p3-row.active .p3-label-dark { color: #6b0010; }
        .p3-row:hover:not(.active) .p3-label-dark { color: #00d9ff; }

        .p3-label-bright {
          color: #ff2a2a;
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.12s ease;
        }
        .p3-row.active .p3-label-bright { opacity: 1; }

        /* active item descriptor chip */
        @keyframes p3-desc-in {
          0%   { opacity: 0; transform: skewX(-12deg) translateY(14px); }
          100% { opacity: 1; transform: skewX(-12deg) translateY(0); }
        }
        .p3-desc {
          position: absolute;
          bottom: 7vh;
          left: 50%;
          margin-left: -150px;
          width: 300px;
          z-index: 22;
          text-align: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 19px;
          letter-spacing: 4px;
          color: #04122e;
          background: linear-gradient(90deg, #7dd4fc 0%, #d6f3ff 100%);
          padding: 8px 18px 6px;
          clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          box-shadow: 5px 5px 0 rgba(196, 0, 26, 0.85);
          animation: p3-desc-in 0.22s cubic-bezier(0.22,1,0.36,1) both;
          pointer-events: none;
        }
        @media (max-width: 760px) {
          .p3-desc { bottom: 11vh; font-size: 15px; width: 240px; margin-left: -120px; }
        }

        .p3-hint {
          position: absolute;
          bottom: 24px; right: 28px;
          z-index: 20;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 5px;
          font-family: 'Anton', sans-serif;
          opacity: 0;
          transition: opacity 0.5s ease 0.9s;
        }
        .p3-hint.mounted { opacity: 1; }
        @media (pointer: coarse) { .p3-hint { display: none; } }
        .p3-hint-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; letter-spacing: 2px;
          color: rgba(255,255,255,0.28);
        }
        .p3-hint-key {
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 3px;
          padding: 1px 6px; font-size: 11px;
        }

        .p3-name-tag {
          position: absolute;
          top: 18px;
          left: 22px;
          z-index: 20;
          font-family: 'Anton', sans-serif;
          font-style: italic;
          line-height: 0.88;
          letter-spacing: 2px;
          color: rgba(125, 212, 252, 0.34);
          transform: rotate(18deg);
          transform-origin: left top;
          user-select: none;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-shadow: 0 4px 24px rgba(0, 30, 120, 0.5);
        }
        .p3-name-tag span:first-child {
          color: rgba(255, 255, 255, 0.92);
        }

        /* rotating ticker, top right */
        @keyframes p3-ticker-in {
          0%   { opacity: 0; transform: skewX(-8deg) translateX(26px); }
          12%  { opacity: 1; transform: skewX(-8deg) translateX(0); }
          88%  { opacity: 1; transform: skewX(-8deg) translateX(0); }
          100% { opacity: 0; transform: skewX(-8deg) translateX(-26px); }
        }
        .p3-ticker {
          position: absolute;
          top: 20px;
          right: 26px;
          z-index: 21;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 3px;
          color: rgba(255, 255, 255, 0.82);
          background: rgba(4, 10, 40, 0.66);
          border-left: 3px solid #c4001a;
          padding: 7px 16px 5px 12px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
          animation: p3-ticker-in 3.4s ease both;
          pointer-events: none;
          text-align: right;
          line-height: 1.4;
          max-width: min(76vw, 560px);
        }
        @media (max-width: 760px) {
          .p3-ticker { font-size: 12px; letter-spacing: 2px; right: 12px; top: 14px; max-width: 70vw; }
        }
      `}</style>

      <div className="p3-overlay">
        <div
          className="p3-name-tag"
          style={{ fontSize: Math.round(108 * menuScale) }}
        >
          <span>{PROFILE.firstName}'s</span>
          <span>persona</span>
        </div>
        <div className="p3-stripe" />
        <div className="p3-stripe2" />

        <div className="p3-ticker" key={tick}>
          {TICKER[tick % TICKER.length]}
        </div>

        <div ref={parRef} style={{ pointerEvents: "all" }}>
          <nav className="p3-menu" aria-label="Main menu">
            {ITEMS.map((item, i) => {
              const isActive = active === i;
              const dist = Math.abs(i - active);
              const opacity = isActive ? 1 : Math.max(0.5, 1 - dist * 0.2);
              const fs = Math.round(item.fontSize * menuScale);
              const estW = item.label.length * fs * 0.6 + 80 * menuScale;
              const estH = fs * 0.94;

              return (
                <a
                  key={item.id}
                  href="#"
                  className={`p3-row ${isActive ? "active" : ""} ${mounted ? "mounted" : ""}`}
                  style={{
                    marginRight: item.offsetX * menuScale,
                    marginTop: item.offsetY * menuScale,
                    transitionDelay: mounted ? `${i * 80}ms` : "0ms",
                  }}
                  onClick={(e) => { e.preventDefault(); confirm(item.page); }}
                  onMouseEnter={() => activate(i)}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="p3-glow" />
                  <div
                    className="p3-skew-wrap"
                    style={{ transform: `skewX(${item.skew}deg) skewY(${item.skewY}deg)` }}
                  >
                    <div
                      key={isActive ? `pop-${i}-${animKey}` : `idle-${i}`}
                      className={`p3-shadow-tri${isActive ? ' pop' : ''}`}
                      style={{
                        width: estW,
                        height: estH,
                        clipPath: CLIP(estW, estH),
                      }}
                    />
                    <div
                      className="p3-highlight"
                      style={{
                        width: estW,
                        height: estH,
                        clipPath: CLIP(estW, estH),
                        transform: `translateY(-50%) scaleX(${isActive ? 1 : 0})`,
                      }}
                    />
                    <div className="p3-label-wrap" style={{ opacity }}>
                      <span className="p3-label-base p3-label-dark" style={{ fontSize: fs }}>
                        {item.label}
                      </span>
                      <span
                        className="p3-label-base p3-label-bright"
                        style={{
                          fontSize: fs,
                          clipPath: CLIP(estW, estH),
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </nav>
        </div>

        {mounted && (
          <div className="p3-desc" key={`desc-${active}`}>
            {ITEMS[active].desc}
          </div>
        )}

        <div className={`p3-hint ${mounted ? "mounted" : ""}`}>
          <div className="p3-hint-row"><span className="p3-hint-key">↑↓</span><span>NAVIGATE</span></div>
          <div className="p3-hint-row"><span className="p3-hint-key">↵</span><span>CONFIRM</span></div>
        </div>
      </div>
    </>
  );
}
