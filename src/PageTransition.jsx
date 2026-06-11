import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";

const defaultBlocks = ["#0d1a3a", "#1a6aff", "#7dd4fc"];

function DefaultTransition() {
  return defaultBlocks.map((color, i) => (
    <Motion.div
      key={i}
      style={{
        position: "fixed",
        inset: 0,
        background: color,
        zIndex: 999 - i,
        originX: 0,
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: [0, 1, 1, 0] }}
      transition={{
        duration: 0.45,
        delay: i * 0.05,
        times: [0, 0.4, 0.6, 1],
        ease: [0.76, 0, 0.24, 1],
      }}
    />
  ));
}

function AboutTransition() {
  const panels = [
    { color: "#00184c", top: "-12vh", left: "-18vw", width: "86vw", delay: 0 },
    { color: "#53edff", top: "24vh", left: "-10vw", width: "72vw", delay: 0.05 },
    { color: "#ffffff", top: "58vh", left: "-14vw", width: "82vw", delay: 0.1 },
  ];

  return panels.map((panel, i) => (
    <Motion.div
      key={i}
      style={{
        position: "fixed",
        top: panel.top,
        left: panel.left,
        width: panel.width,
        height: "26vh",
        background: panel.color,
        zIndex: 999 - i,
        clipPath: "polygon(0 0, 100% 0, calc(100% - 120px) 100%, 0 100%)",
        transform: "rotate(-18deg)",
        transformOrigin: "left center",
      }}
      initial={{ x: -500, opacity: 0 }}
      animate={{ x: [-500, 20, 0], opacity: [1, 1, 0] }}
      transition={{
        duration: 0.52,
        delay: panel.delay,
        times: [0, 0.68, 1],
        ease: [0.22, 1, 0.36, 1],
      }}
    />
  ));
}


function SocialsTransition() {
  const stripes = [
    { color: "#00184c", left: "72vw", width: "24vw", delay: 0 },
    { color: "#00dff7", left: "80vw", width: "14vw", delay: 0.06 },
    { color: "#ffffff", left: "88vw", width: "8vw", delay: 0.12 },
  ];

  return stripes.map((stripe, i) => (
    <Motion.div
      key={i}
      style={{
        position: "fixed",
        top: "-6vh",
        left: stripe.left,
        width: stripe.width,
        height: "112vh",
        background: stripe.color,
        zIndex: 999 - i,
        transform: "skewX(-16deg)",
        transformOrigin: "top",
      }}
      initial={{ y: -1200, opacity: 1 }}
      animate={{ y: [-1200, 0, 0, 1200] }}
      transition={{
        duration: 0.56,
        delay: stripe.delay,
        times: [0, 0.42, 0.58, 1],
        ease: [0.76, 0, 0.24, 1],
      }}
    />
  ));
}

function ProjectsTransition() {
  const blades = [
    { color: "#03100b", delay: 0 },
    { color: "#0f7048", delay: 0.06 },
    { color: "#5fe8a8", delay: 0.12 },
  ];

  return blades.map((blade, i) => (
    <Motion.div
      key={i}
      style={{
        position: "fixed",
        inset: "-12vh -12vw",
        background: blade.color,
        zIndex: 999 - i,
        clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)",
      }}
      initial={{ y: "-115%" }}
      animate={{ y: ["-115%", "0%", "0%", "115%"] }}
      transition={{
        duration: 0.56,
        delay: blade.delay,
        times: [0, 0.42, 0.58, 1],
        ease: [0.76, 0, 0.24, 1],
      }}
    />
  ));
}

function NowLoading() {
  return (
    <Motion.div
      style={{
        position: "fixed",
        bottom: 30,
        right: 34,
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        gap: 12,
        pointerEvents: "none",
      }}
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: [0, 1, 1, 0], x: [18, 0, 0, -10] }}
      transition={{ duration: 0.85, times: [0, 0.2, 0.75, 1] }}
    >
      <Motion.div
        style={{
          width: 14,
          height: 14,
          background: "#ffffff",
          boxShadow: "0 0 12px rgba(125, 212, 252, 0.9)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
      />
      <span
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 20,
          letterSpacing: 5,
          color: "#ffffff",
          textShadow: "2px 2px 0 #c4001a",
        }}
      >
        NOW LOADING
      </span>
    </Motion.div>
  );
}

function TransitionOverlay({ variant }) {
  const overlay =
    variant === "about" ? <AboutTransition /> :
    variant === "resume" ? <ResumeTransition /> :
    variant === "socials" ? <SocialsTransition /> :
    variant === "projects" ? <ProjectsTransition /> :
    <DefaultTransition />;
  return (
    <>
      {overlay}
      <NowLoading />
    </>
  );
}

function ResumeTransition() {
  const cards = [
    { top: "14vh", color: "#0f1760", delay: 0 },
    { top: "31vh", color: "#7ff6ff", delay: 0.05 },
    { top: "48vh", color: "#ffffff", delay: 0.1 },
    { top: "65vh", color: "#0f1760", delay: 0.15 },
  ];

  return cards.map((card, i) => (
    <Motion.div
      key={i}
      style={{
        position: "fixed",
        left: "-6vw",
        top: card.top,
        width: "78vw",
        height: "14vh",
        background: card.color,
        zIndex: 999 - i,
        clipPath: "polygon(0 0, 97% 0, 100% 100%, 3% 100%)",
        boxShadow: card.color === "#ffffff" ? "10px 0 0 #d63232" : "none",
      }}
      initial={{ x: -900, opacity: 1 }}
      animate={{ x: [-900, 30, 0, 900] }}
      transition={{
        duration: 0.6,
        delay: card.delay,
        times: [0, 0.48, 0.7, 1],
        ease: [0.76, 0, 0.24, 1],
      }}
    />
  ));
}

// Shows the overlay on mount, then unmounts it once the longest
// variant (~0.8s incl. stagger) has run. PageTransition itself is
// remounted per-route by the keyed <Routes> above, so no keying needed.
function OverlayGate({ variant }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1000);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;
  return <TransitionOverlay variant={variant} />;
}

// Full-screen, opaque wrapper. The opaque background is what prevents
// the previous screen from bleeding through while routes swap, and the
// single top-level AnimatePresence in App.jsx handles enter/exit.
export default function PageTransition({ children, variant = "default" }) {
  return (
    <Motion.div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "#02030a",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
    >
      <OverlayGate variant={variant} />
      {children}
    </Motion.div>
  );
}
