import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SeaOfSouls from "./SeaOfSouls";
import { playBack, playHover } from "./sfx";

// 404 — swallowed by the Dark Hour.
export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === "Backspace") {
        playBack();
        navigate("/");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div id="menu-screen">
      <SeaOfSouls theme="projects" />
      <style>{`
        .nf-wrap {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          text-align: center;
          padding: 0 16px;
          background: #021008;
        }
        @keyframes nf-glitch {
          0%, 100% { transform: rotate(-5deg) translate(0, 0); text-shadow: 8px 8px 0 #0a5436, -4px -4px 0 rgba(95, 232, 168, 0.5); }
          20% { transform: rotate(-5deg) translate(-3px, 2px); text-shadow: -8px 4px 0 #0a5436, 4px -6px 0 rgba(95, 232, 168, 0.5); }
          40% { transform: rotate(-5deg) translate(2px, -2px); text-shadow: 6px -8px 0 #0a5436, -6px 4px 0 rgba(95, 232, 168, 0.5); }
        }
        .nf-code {
          font-family: 'Anton', sans-serif;
          font-style: italic;
          font-size: clamp(110px, 24vw, 280px);
          line-height: 0.85;
          color: #eaffb8;
          animation: nf-glitch 2.4s steps(1) infinite;
          user-select: none;
        }
        .nf-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(22px, 4vw, 44px);
          letter-spacing: 3px;
          color: #ffffff;
        }
        .nf-sub {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(15px, 2vw, 20px);
          letter-spacing: 4px;
          color: rgba(184, 255, 122, 0.75);
        }
        .nf-btn {
          margin-top: 18px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #5fe8a8;
          color: #02150c;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          letter-spacing: 3px;
          border: none;
          padding: 13px 32px 10px 24px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          box-shadow: 6px 6px 0 rgba(1, 14, 8, 0.7);
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease;
        }
        .nf-btn:hover { background: #ffffff; }
      `}</style>
      <div className="nf-wrap">
        <div className="nf-code">404</div>
        <div className="nf-title">LOST IN THE DARK HOUR</div>
        <div className="nf-sub">THIS PAGE WAS DEVOURED BY SHADOWS — OR NEVER EXISTED AT ALL</div>
        <button
          className="nf-btn"
          onMouseEnter={() => playHover()}
          onClick={() => { playBack(); navigate("/"); }}
        >
          <span>◄ BACK TO REALITY</span>
        </button>
      </div>
    </div>
  );
}
