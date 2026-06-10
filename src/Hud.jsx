import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDayPhase, getDateStamp } from "./dayPhase";
import { getMuted, setMuted, getBgm, setBgm, playBack, playHover, playRankUp } from "./sfx";
import { isDarkHour, toggleDarkHour, onDarkHourChange } from "./darkHour";

// Persistent P3-style HUD: date/time widget, sfx + bgm toggles, back button
// on sub-pages. Clicking the phase chip flips the hidden "Dark Hour" theme.
export default function Hud() {
  const [now, setNow] = useState(() => new Date());
  const [muted, setMutedState] = useState(getMuted());
  const [bgm, setBgmState] = useState(getBgm());
  const [dark, setDark] = useState(isDarkHour());
  const location = useLocation();
  const navigate = useNavigate();
  const onSubPage = location.pathname !== "/";

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => onDarkHourChange(setDark), []);

  const phase = getDayPhase(now);
  const stamp = getDateStamp(now);
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) playHover();
  };

  const toggleBgm = () => {
    const next = !bgm;
    setBgm(next);
    setBgmState(next);
  };

  const flipDarkHour = () => {
    const on = toggleDarkHour();
    if (on) playRankUp();
    else playBack();
  };

  return (
    <>
      <style>{`
        .hud-dock {
          position: fixed;
          bottom: 22px;
          left: 22px;
          z-index: 600;
          display: flex;
          align-items: stretch;
          gap: 10px;
          user-select: none;
          filter: drop-shadow(0 4px 14px rgba(0,0,0,0.6));
          transform: skewX(-8deg);
        }
        @media (max-width: 760px) {
          .hud-dock { bottom: 12px; left: 12px; gap: 8px; }
        }

        .hud-clock {
          display: flex;
          align-items: stretch;
          pointer-events: none;
        }
        .hud-clock-date {
          background: #ffffff;
          color: #0a0a14;
          font-family: 'Anton', sans-serif;
          font-size: 26px;
          line-height: 1;
          padding: 9px 14px 7px;
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .hud-clock-day {
          font-size: 14px;
          color: #c4001a;
          letter-spacing: 1px;
        }
        .hud-clock-phase {
          background: #0a0a18;
          color: #7dd4fc;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 3px;
          padding: 0 14px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          line-height: 1.1;
          border-left: 3px solid #c4001a;
          border-top: none;
          border-right: none;
          border-bottom: none;
          pointer-events: all;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .hud-clock-phase:hover { background: #141430; }
        .hud-clock-phase.dark {
          color: #b8ff7a;
          border-left-color: #4f9b1f;
          text-shadow: 0 0 8px rgba(150, 255, 90, 0.6);
        }
        @keyframes hud-dark-flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          94% { opacity: 0.4; }
          96% { opacity: 1; }
          98% { opacity: 0.6; }
        }
        .hud-clock-phase.dark span:first-child {
          animation: hud-dark-flicker 3.2s linear infinite;
        }
        .hud-clock-time {
          color: #ffffff;
          font-size: 17px;
          letter-spacing: 2px;
        }
        @media (max-width: 760px) {
          .hud-clock-date { font-size: 20px; padding: 8px 10px 6px; }
          .hud-clock-phase { font-size: 12px; padding: 0 10px; }
          .hud-clock-time { font-size: 14px; }
        }

        .hud-btn {
          width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(8, 8, 20, 0.78);
          border: 1px solid rgba(255,255,255,0.22);
          color: rgba(255,255,255,0.8);
          font-size: 15px;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .hud-btn:hover {
          background: #c4001a;
          transform: scale(1.06);
        }
        .hud-btn.on {
          color: #ffffff;
          border-color: #7dd4fc;
          box-shadow: inset 0 0 10px rgba(125, 212, 252, 0.35);
        }
        @media (max-width: 760px) {
          .hud-btn { width: 34px; font-size: 13px; }
        }

        .hud-back {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(8, 8, 20, 0.82);
          border: none;
          color: #ffffff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 19px;
          letter-spacing: 3px;
          padding: 9px 20px 7px 14px;
          cursor: pointer;
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          box-shadow: -4px 0 0 #c4001a;
          transform: skewX(-8deg);
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .hud-back:hover {
          background: #c4001a;
          transform: skewX(-8deg) translateX(3px);
        }
        .hud-back-arrow { color: #7dd4fc; font-size: 16px; }
        .hud-back:hover .hud-back-arrow { color: #ffffff; }
        @media (max-width: 760px) {
          .hud-back { top: 12px; left: 12px; font-size: 16px; padding: 8px 16px 6px 12px; }
        }
      `}</style>

      <div className="hud-dock">
        <div className="hud-clock" aria-hidden="true">
          <div className="hud-clock-date">
            <span>{stamp.date}</span>
            <span className="hud-clock-day">{stamp.day}</span>
          </div>
        </div>
        <button
          className={`hud-clock-phase${dark ? " dark" : ""}`}
          onClick={flipDarkHour}
          title="???"
          aria-label="Toggle Dark Hour theme"
        >
          <span>{dark ? "DARK HOUR" : phase.label}</span>
          <span className="hud-clock-time">{dark ? "25:00" : `${hh}:${mm}`}</span>
        </button>
        <button
          className="hud-btn"
          onClick={toggleMute}
          aria-label={muted ? "Unmute sounds" : "Mute sounds"}
          title={muted ? "Unmute SFX" : "Mute SFX"}
        >
          {muted ? "✕" : "♪"}
        </button>
        <button
          className={`hud-btn${bgm ? " on" : ""}`}
          onClick={toggleBgm}
          aria-label={bgm ? "Stop background music" : "Play background music"}
          title={bgm ? "BGM off" : "BGM on"}
        >
          BGM
        </button>
      </div>

      {onSubPage && (
        <button
          className="hud-back"
          onClick={() => { playBack(); navigate("/"); }}
          onMouseEnter={() => playHover()}
        >
          <span className="hud-back-arrow">◄</span>
          <span>BACK</span>
        </button>
      )}
    </>
  );
}
