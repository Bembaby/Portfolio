import { useEffect, useMemo, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { PROFILE } from "./content";
import { playSlash } from "./sfx";
import cardImg from "./assets/card.png";

// One-time boot cinematic: blue panel sweep -> spinning tarot card ->
// card shatters into shards -> name slam -> tagline -> fade to menu.
// Click or any key skips.

const CARD_W = 180;
const CARD_H = 252;

// Triangular shards fanning out from the card's center.
const SHARD_POINTS = [
  [[0, 0], [50, 0]], [[50, 0], [100, 0]],
  [[100, 0], [100, 33]], [[100, 33], [100, 66]], [[100, 66], [100, 100]],
  [[100, 100], [50, 100]], [[50, 100], [0, 100]],
  [[0, 100], [0, 66]], [[0, 66], [0, 33]], [[0, 33], [0, 0]],
];
const CENTER = [50, 48];

function shardData() {
  return SHARD_POINTS.map(([a, b], i) => {
    const cx = (a[0] + b[0] + CENTER[0]) / 3;
    const cy = (a[1] + b[1] + CENTER[1]) / 3;
    const dx = cx - 50;
    const dy = cy - 50;
    const mag = Math.max(Math.hypot(dx, dy), 8);
    return {
      clip: `polygon(${a[0]}% ${a[1]}%, ${b[0]}% ${b[1]}%, ${CENTER[0]}% ${CENTER[1]}%)`,
      x: (dx / mag) * (140 + Math.random() * 160),
      y: (dy / mag) * (140 + Math.random() * 160) - 30,
      rot: (Math.random() - 0.5) * 240,
      delay: i * 0.012,
    };
  });
}

export default function Intro({ onDone }) {
  const reduceMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  // phases: card -> burst -> name -> done
  const [phase, setPhase] = useState(reduceMotion ? "name" : "card");
  const shards = useMemo(() => shardData(), []);

  useEffect(() => {
    if (phase === "card") {
      const t = setTimeout(() => setPhase("burst"), 1450);
      return () => clearTimeout(t);
    }
    if (phase === "burst") {
      playSlash();
      const t = setTimeout(() => setPhase("name"), 520);
      return () => clearTimeout(t);
    }
    if (phase === "name") {
      const t = setTimeout(() => setPhase("done"), reduceMotion ? 1400 : 1900);
      return () => clearTimeout(t);
    }
    if (phase === "done") {
      const t = setTimeout(() => onDone?.(), 550);
      return () => clearTimeout(t);
    }
  }, [phase, onDone, reduceMotion]);

  useEffect(() => {
    const skip = () => setPhase("done");
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, []);

  const letters = PROFILE.name.toUpperCase().split("");

  return (
    <AnimatePresence>
      {phase !== "hidden" && (
        <Motion.div
          key="intro"
          onClick={() => setPhase("done")}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "#010208",
            overflow: "hidden",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          animate={{ opacity: phase === "done" ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => { if (phase === "done") onDone?.(); }}
        >
          {/* sweeping blue panels */}
          {!reduceMotion && ["#0a1c6e", "#1a52d8", "#7dd4fc"].map((color, i) => (
            <Motion.div
              key={color}
              style={{
                position: "absolute",
                inset: "-20%",
                background: color,
                transform: "rotate(-14deg)",
                transformOrigin: "left center",
              }}
              initial={{ x: "-130%" }}
              animate={{ x: ["-130%", "0%", "0%", "130%"] }}
              transition={{ duration: 0.9, delay: i * 0.07, times: [0, 0.42, 0.55, 1], ease: [0.76, 0, 0.24, 1] }}
            />
          ))}

          {/* spinning tarot card */}
          {(phase === "card") && (
            <Motion.div
              style={{
                position: "relative",
                width: CARD_W,
                height: CARD_H,
                zIndex: 3,
                perspective: 900,
              }}
              initial={{ opacity: 0, scale: 0.55, y: 50 }}
              animate={{ opacity: 1, scale: [0.55, 0.92, 1.04], y: 0 }}
              transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Motion.img
                src={cardImg}
                alt=""
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 8,
                  boxShadow: "0 0 42px rgba(110, 180, 255, 0.65), 0 0 120px rgba(40, 90, 255, 0.35)",
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 900 }}
                transition={{ delay: 0.55, duration: 1.0, ease: [0.3, 0.6, 0.3, 1] }}
              />
              {/* pulse ring */}
              <Motion.div
                style={{
                  position: "absolute",
                  inset: -22,
                  border: "2px solid rgba(125, 212, 252, 0.7)",
                  borderRadius: 14,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.25, 1.45] }}
                transition={{ delay: 1.0, duration: 0.55, ease: "easeOut" }}
              />
            </Motion.div>
          )}

          {/* card shatter */}
          {phase === "burst" && (
            <div style={{ position: "relative", width: CARD_W, height: CARD_H, zIndex: 3 }}>
              {shards.map((s, i) => (
                <Motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${cardImg})`,
                    backgroundSize: "cover",
                    clipPath: s.clip,
                  }}
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  animate={{ x: s.x, y: s.y, rotate: s.rot, opacity: 0 }}
                  transition={{ duration: 0.5, delay: s.delay, ease: [0.2, 0.8, 0.4, 1] }}
                />
              ))}
              {/* flash */}
              <Motion.div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(125,212,252,0.4) 30%, transparent 70%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.45, times: [0, 0.18, 1] }}
              />
              {/* burst rays */}
              {Array.from({ length: 10 }).map((_, i) => (
                <Motion.div
                  key={`ray-${i}`}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "48%",
                    width: 3,
                    height: 130,
                    background: "linear-gradient(180deg, rgba(255,255,255,0.9), transparent)",
                    transformOrigin: "top center",
                    rotate: `${i * 36}deg`,
                  }}
                  initial={{ scaleY: 0, opacity: 1 }}
                  animate={{ scaleY: [0, 1.5], opacity: [1, 0] }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              ))}
            </div>
          )}

          {/* name slam */}
          {(phase === "name" || phase === "done") && (
            <div style={{ position: "relative", textAlign: "center", zIndex: 4, padding: "0 16px" }}>
              <div
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontStyle: "italic",
                  fontSize: "clamp(40px, 9vw, 128px)",
                  lineHeight: 0.9,
                  letterSpacing: 3,
                  color: "#ffffff",
                  whiteSpace: "nowrap",
                  transform: "rotate(-4deg)",
                }}
              >
                {letters.map((ch, i) => (
                  <Motion.span
                    key={i}
                    style={{
                      display: "inline-block",
                      textShadow: "6px 6px 0 #c4001a, 12px 12px 28px rgba(0,60,255,0.6)",
                      whiteSpace: "pre",
                    }}
                    initial={{ opacity: 0, scale: 2.4, rotate: -14, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.06 + i * 0.032, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch}
                  </Motion.span>
                ))}
              </div>
              <Motion.div
                initial={{ opacity: 0, x: -60, letterSpacing: "26px" }}
                animate={{ opacity: 1, x: 0, letterSpacing: "12px" }}
                transition={{ delay: 0.55, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  marginTop: 18,
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(16px, 2.4vw, 30px)",
                  color: "#7dd4fc",
                }}
              >
                {`// ${PROFILE.tagline}`}
              </Motion.div>
              <Motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.75, duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                style={{
                  margin: "20px auto 0",
                  width: "min(380px, 70vw)",
                  height: 3,
                  background: "linear-gradient(90deg, transparent, #c4001a 18%, #c4001a 82%, transparent)",
                  transformOrigin: "center",
                }}
              />
            </div>
          )}

          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            transition={{ delay: 1.4 }}
            style={{
              position: "absolute",
              bottom: 26,
              width: "100%",
              textAlign: "center",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 13,
              letterSpacing: 4,
              color: "#ffffff",
              zIndex: 4,
            }}
          >
            CLICK OR PRESS ANY KEY TO SKIP
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
