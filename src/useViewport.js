import { useEffect, useState } from "react";

// Shared viewport hook for the JS-sized P3 menu typography and layout switches.
export function useViewport() {
  const [vp, setVp] = useState(() => read());

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVp(read()));
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return vp;
}

function read() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return {
    w,
    h,
    isMobile: w < 760,
    isTablet: w >= 760 && w < 1100,
    isTouch: window.matchMedia?.("(pointer: coarse)").matches ?? false,
    // 1 at >=1440px wide, scales down to ~0.36 on small phones.
    scale: Math.min(1.08, Math.max(0.36, w / 1440)),
  };
}
