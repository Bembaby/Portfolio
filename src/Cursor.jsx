import { useEffect, useRef } from "react";

// Custom P3-style cursor: a skewed cyan blade with a red core that lags
// slightly behind a crisp white dot. Desktop / fine pointers only.
const INTERACTIVE = "a, button, [role='button'], .p3-row, .resume-card-wrap, .pj-card, .sc-bar-outer, .sc-info-bar-wrap, .hud-mute, .hud-back, .hud-bgm, .hud-clock-phase";

export default function Cursor() {
  const dotRef = useRef(null);
  const bladeRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;

    document.body.classList.add("p3-cursor-on");

    const dot = dotRef.current;
    const blade = bladeRef.current;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let bx = x;
    let by = y;
    let hot = false;
    let down = false;
    let visible = false;
    let raf = 0;

    function apply() {
      dot.style.transform = `translate(${x}px, ${y}px)`;
      const scale = down ? 0.7 : hot ? 1.65 : 1;
      blade.style.transform = `translate(${bx}px, ${by}px) rotate(-38deg) scale(${scale})`;
    }

    function tick() {
      bx += (x - bx) * (reduceMotion ? 1 : 0.22);
      by += (y - by) * (reduceMotion ? 1 : 0.22);
      apply();
      raf = requestAnimationFrame(tick);
    }

    function onMove(e) {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        blade.style.opacity = "1";
      }
      hot = !!e.target?.closest?.(INTERACTIVE);
      blade.classList.toggle("hot", hot);
    }

    function onDown() { down = true; }
    function onUp() { down = false; }
    function onLeave() {
      visible = false;
      dot.style.opacity = "0";
      blade.style.opacity = "0";
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("p3-cursor-on");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <style>{`
        body.p3-cursor-on, body.p3-cursor-on * { cursor: none !important; }

        .p3-cursor-dot {
          position: fixed;
          top: -3px; left: -3px;
          width: 6px; height: 6px;
          background: #ffffff;
          border-radius: 999px;
          z-index: 4000;
          pointer-events: none;
          opacity: 0;
          box-shadow: 0 0 6px rgba(125, 212, 252, 0.9);
        }

        .p3-cursor-blade {
          position: fixed;
          top: -17px; left: -17px;
          width: 34px; height: 34px;
          z-index: 3999;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.25s ease;
          will-change: transform;
        }
        .p3-cursor-blade::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(125, 212, 252, 0.85);
          clip-path: polygon(50% 0%, 64% 36%, 100% 50%, 64% 64%, 50% 100%, 36% 64%, 0% 50%, 36% 36%);
          transition: background 0.15s ease;
        }
        .p3-cursor-blade::after {
          content: "";
          position: absolute;
          inset: 10px;
          background: #c4001a;
          clip-path: polygon(50% 0%, 64% 36%, 100% 50%, 64% 64%, 50% 100%, 36% 64%, 0% 50%, 36% 36%);
          transition: inset 0.15s ease;
        }
        .p3-cursor-blade.hot::before { background: #ffffff; }
        .p3-cursor-blade.hot::after { inset: 12px; }

        @media (pointer: coarse) {
          .p3-cursor-dot, .p3-cursor-blade { display: none; }
        }
      `}</style>
      <div ref={dotRef} className="p3-cursor-dot" aria-hidden="true" />
      <div ref={bladeRef} className="p3-cursor-blade" aria-hidden="true" />
    </>
  );
}
