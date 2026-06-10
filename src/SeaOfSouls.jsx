import { useEffect, useRef } from "react";
import { getDayPhase } from "./dayPhase";
import { isDarkHour } from "./darkHour";

// Procedural Persona 3 Reload "Sea of Souls" background.
// Layered flowing ink waves + moon + starfield + shooting stars + drifting
// souls + a wandering butterfly + grain + vignette, all on one canvas.
// Subtle pointer parallax on desktop. "Dark Hour" easter egg recolors
// everything sickly green with a huge ominous moon.

const THEMES = {
  menu: {
    sky: ["#02030f", "#071a4d", "#0b2f86"],
    bands: ["#0a2a78", "#1448b8", "#2f7ce0", "#56b9f0"],
    glow: "rgba(90, 170, 255, 0.55)",
    particle: "rgba(170, 215, 255,",
    moon: "#dce9ff",
    moonGlow: "rgba(150, 200, 255, 0.5)",
  },
  resume: {
    sky: ["#02080d", "#04304a", "#06557c"],
    bands: ["#074a66", "#0a7d9e", "#16b3cf", "#5ee9f2"],
    glow: "rgba(80, 230, 255, 0.5)",
    particle: "rgba(170, 250, 255,",
    moon: "#d8fbff",
    moonGlow: "rgba(110, 235, 255, 0.45)",
  },
  about: {
    sky: ["#0c0207", "#3d0617", "#75102c"],
    bands: ["#5e0a20", "#a01230", "#d83050", "#ff7a8c"],
    glow: "rgba(255, 90, 120, 0.5)",
    particle: "rgba(255, 190, 200,",
    moon: "#ffe3e8",
    moonGlow: "rgba(255, 130, 150, 0.45)",
  },
  socials: {
    sky: ["#070213", "#1d0a47", "#3a1583"],
    bands: ["#2a0f66", "#4b22ac", "#7a48e0", "#b48cf5"],
    glow: "rgba(170, 120, 255, 0.5)",
    particle: "rgba(215, 190, 255,",
    moon: "#ece1ff",
    moonGlow: "rgba(190, 150, 255, 0.5)",
  },
  projects: {
    sky: ["#03100b", "#06301f", "#0a5436"],
    bands: ["#08402a", "#0f7048", "#1fae6e", "#5fe8a8"],
    glow: "rgba(90, 255, 180, 0.45)",
    particle: "rgba(185, 255, 220,",
    moon: "#e2ffef",
    moonGlow: "rgba(140, 255, 200, 0.45)",
  },
  darkhour: {
    sky: ["#010503", "#06231a", "#0a3f2c"],
    bands: ["#06301f", "#0a4f33", "#11804f", "#2fc77e"],
    glow: "rgba(190, 255, 120, 0.5)",
    particle: "rgba(210, 255, 180,",
    moon: "#eaffb8",
    moonGlow: "rgba(214, 255, 130, 0.62)",
  },
};

function makeGrain() {
  const c = document.createElement("canvas");
  c.width = 160;
  c.height = 160;
  const g = c.getContext("2d");
  const img = g.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 16;
  }
  g.putImageData(img, 0, 0);
  return c;
}

export default function SeaOfSouls({ theme = "menu" }) {
  const canvasRef = useRef(null);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const grain = makeGrain();
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const particles = [];
    const stars = [];
    const PARTICLE_COUNT = 70;

    // Pointer parallax (lerped).
    const par = { x: 0, y: 0, tx: 0, ty: 0 };
    function onPointer(e) {
      par.tx = (e.clientX / w - 0.5) * 2;
      par.ty = (e.clientY / h - 0.5) * 2;
    }

    // One wandering butterfly.
    const fly = { x: 0, y: 0, t0: 0, dur: 26000, fromLeft: true };
    function resetFly(now) {
      fly.t0 = now + 4000 + Math.random() * 9000;
      fly.dur = 22000 + Math.random() * 14000;
      fly.fromLeft = Math.random() > 0.5;
      fly.baseY = h * (0.18 + Math.random() * 0.3);
    }

    // Shooting stars.
    let shoot = null;
    let nextShootAt = 2500 + Math.random() * 5000;

    function seedStars() {
      stars.length = 0;
      const count = Math.round((w * h) / 16000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.55,
          r: 0.4 + Math.random() * 1.1,
          tw: 0.5 + Math.random() * 2.2,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
    }

    function spawn(p, fresh) {
      p.x = Math.random() * w;
      p.y = fresh ? Math.random() * h : h + 14;
      p.r = 0.8 + Math.random() * 2.4;
      p.speed = 0.12 + Math.random() * 0.45;
      p.drift = (Math.random() - 0.5) * 0.3;
      p.phase = Math.random() * Math.PI * 2;
      p.alpha = 0.25 + Math.random() * 0.6;
    }

    resize();
    resetFly(0);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = {};
      spawn(p, true);
      particles.push(p);
    }

    // Sum-of-sines surface for one wave band.
    function bandY(baseY, amp, x, t, seed) {
      return (
        baseY +
        Math.sin(x * 0.0021 + t * 0.00045 + seed) * amp +
        Math.sin(x * 0.0052 - t * 0.00032 + seed * 2.7) * amp * 0.45 +
        Math.sin(x * 0.011 + t * 0.0008 + seed * 5.1) * amp * 0.18
      );
    }

    function drawButterfly(t) {
      if (t < fly.t0) return;
      const k = (t - fly.t0) / fly.dur;
      if (k > 1) { resetFly(t); return; }
      const dir = fly.fromLeft ? 1 : -1;
      const x = fly.fromLeft ? -30 + k * (w + 60) : w + 30 - k * (w + 60);
      const y = fly.baseY + Math.sin(k * Math.PI * 5) * h * 0.06 + Math.sin(t * 0.0021) * 8;
      const flap = Math.sin(t * 0.02);
      const s = 7 + Math.sin(k * Math.PI) * 3; // bigger mid-flight
      const wing = s * (0.55 + Math.abs(flap) * 0.7);

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(dir, 1);
      ctx.rotate(Math.sin(t * 0.004) * 0.18);
      ctx.globalCompositeOperation = "lighter";
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2.4);
      grad.addColorStop(0, "rgba(120, 200, 255, 0.85)");
      grad.addColorStop(1, "rgba(40, 120, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, s * 2.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(190, 230, 255, 0.95)";
      // upper wings
      ctx.beginPath();
      ctx.ellipse(-s * 0.45, -s * 0.32, wing, s * 0.62, -0.5, 0, Math.PI * 2);
      ctx.ellipse(s * 0.45, -s * 0.32, wing, s * 0.62, 0.5, 0, Math.PI * 2);
      ctx.fill();
      // lower wings
      ctx.beginPath();
      ctx.ellipse(-s * 0.34, s * 0.3, wing * 0.7, s * 0.45, 0.6, 0, Math.PI * 2);
      ctx.ellipse(s * 0.34, s * 0.3, wing * 0.7, s * 0.45, -0.6, 0, Math.PI * 2);
      ctx.fill();
      // body
      ctx.fillStyle = "rgba(235, 248, 255, 1)";
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.14, s * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
    }

    function drawShootingStar(t) {
      if (!shoot) {
        if (t > nextShootAt && !reduceMotion) {
          shoot = {
            x: w * (0.15 + Math.random() * 0.7),
            y: h * (0.04 + Math.random() * 0.18),
            vx: (Math.random() > 0.5 ? 1 : -1) * (4.5 + Math.random() * 3),
            vy: 1.6 + Math.random() * 1.4,
            life: 0,
          };
        }
        return;
      }
      shoot.life += 1;
      shoot.x += shoot.vx;
      shoot.y += shoot.vy;
      const fade = Math.max(0, 1 - shoot.life / 55);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const grad = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.vx * 16, shoot.y - shoot.vy * 16);
      grad.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(shoot.x, shoot.y);
      ctx.lineTo(shoot.x - shoot.vx * 16, shoot.y - shoot.vy * 16);
      ctx.stroke();
      ctx.restore();
      if (fade <= 0 || shoot.x < -60 || shoot.x > w + 60) {
        shoot = null;
        nextShootAt = t + 4000 + Math.random() * 8000;
      }
    }

    function draw(t) {
      const dark = isDarkHour();
      const T = dark ? THEMES.darkhour : (THEMES[themeRef.current] ?? THEMES.menu);

      if (!reduceMotion) {
        par.x += (par.tx - par.x) * 0.04;
        par.y += (par.ty - par.y) * 0.04;
      }

      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, T.sky[0]);
      sky.addColorStop(0.55, T.sky[1]);
      sky.addColorStop(1, T.sky[2]);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // starfield
      for (const s of stars) {
        const tw = 0.35 + Math.abs(Math.sin(t * 0.001 * s.tw + s.phase)) * 0.65;
        ctx.fillStyle = `rgba(255,255,255,${(tw * 0.5).toFixed(3)})`;
        ctx.fillRect(s.x - par.x * 6, s.y - par.y * 4, s.r, s.r);
      }

      drawShootingStar(t);

      // the moon
      const mr = dark ? Math.min(w, h) * 0.21 : Math.min(w, h) * 0.115;
      const mx = w * 0.72 - par.x * w * 0.012;
      const my = h * (dark ? 0.3 : 0.26) - par.y * h * 0.01;

      const halo = ctx.createRadialGradient(mx, my, mr * 0.4, mx, my, mr * 3.2);
      halo.addColorStop(0, T.moonGlow);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      const moon = ctx.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr);
      moon.addColorStop(0, "#ffffff");
      moon.addColorStop(0.55, T.moon);
      moon.addColorStop(1, dark ? "#9ec24f" : "#9eb6e0");
      ctx.fillStyle = moon;
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fill();

      // craters
      ctx.save();
      ctx.globalAlpha = dark ? 0.2 : 0.12;
      ctx.fillStyle = dark ? "#54702a" : "#7c93c4";
      const craters = [
        [-0.34, -0.18, 0.16], [0.2, -0.4, 0.11], [0.32, 0.18, 0.2],
        [-0.08, 0.34, 0.12], [-0.5, 0.3, 0.09], [0.02, -0.06, 0.07],
      ];
      for (const [cxk, cyk, crk] of craters) {
        ctx.beginPath();
        ctx.arc(mx + cxk * mr, my + cyk * mr, crk * mr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // moon-glow behind the waves (original ambient wash)
      const cx = w * 0.72;
      const cy = h * 0.3;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.42);
      glow.addColorStop(0, T.glow);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      // flowing ink bands, back to front
      const bandCount = T.bands.length;
      for (let b = 0; b < bandCount; b++) {
        const parShift = par.x * (b + 1) * 6;
        const baseY = h * (0.38 + (b / bandCount) * 0.52) + par.y * (b + 1) * 3;
        const amp = h * (0.045 + b * 0.02);
        const seed = b * 13.7;
        ctx.beginPath();
        ctx.moveTo(-12, h + 10);
        for (let x = -12; x <= w + 12; x += 8) {
          ctx.lineTo(x, bandY(baseY, amp, x + parShift, t, seed));
        }
        ctx.lineTo(w + 12, h + 10);
        ctx.closePath();

        const fill = ctx.createLinearGradient(0, baseY - amp, 0, h);
        fill.addColorStop(0, T.bands[b] + "f2");
        fill.addColorStop(1, T.sky[0] + "d9");
        ctx.fillStyle = fill;
        ctx.fill();

        // luminous crest line
        ctx.beginPath();
        for (let x = -12; x <= w + 12; x += 8) {
          const y = bandY(baseY, amp, x + parShift, t, seed);
          if (x === -12) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = T.glow;
        ctx.globalAlpha = 0.16 + b * 0.05;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // moonlight glints riding the front band crests
        if (b === bandCount - 1) {
          ctx.globalCompositeOperation = "lighter";
          for (let g = 0; g < 14; g++) {
            const gx = ((g * 97 + (t * 0.02 % 1400)) % (w + 60)) - 30;
            const gy = bandY(baseY, amp, gx + parShift, t, seed);
            const ga = 0.06 + Math.abs(Math.sin(t * 0.002 + g * 2.1)) * 0.1;
            ctx.fillStyle = `rgba(255,255,255,${ga.toFixed(3)})`;
            ctx.beginPath();
            ctx.ellipse(gx, gy + 3, 12, 1.6, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalCompositeOperation = "source-over";
        }
      }

      // drifting souls
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        const sway = Math.sin(t * 0.0011 + p.phase) * 14;
        const flicker = 0.7 + Math.sin(t * 0.004 + p.phase * 3) * 0.3;
        ctx.beginPath();
        ctx.arc(p.x + sway, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${T.particle}${(p.alpha * flicker).toFixed(3)})`;
        ctx.fill();
        if (!reduceMotion) {
          p.y -= p.speed;
          p.x += p.drift;
          if (p.y < -14 || p.x < -20 || p.x > w + 20) spawn(p, false);
        }
      }
      ctx.globalCompositeOperation = "source-over";

      if (!reduceMotion) drawButterfly(t);

      // vignette
      const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.36, w / 2, h / 2, Math.max(w, h) * 0.78);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      // day-phase tint (Dark Hour gets its own sickly cast)
      ctx.fillStyle = dark ? "rgba(120, 255, 120, 0.045)" : getDayPhase().tint;
      ctx.fillRect(0, 0, w, h);

      // film grain
      ctx.save();
      ctx.globalAlpha = 0.5;
      const ox = reduceMotion ? 0 : Math.floor(Math.random() * 160);
      const oy = reduceMotion ? 0 : Math.floor(Math.random() * 160);
      ctx.translate(-ox, -oy);
      ctx.fillStyle = ctx.createPattern(grain, "repeat");
      ctx.fillRect(0, 0, w + 160, h + 160);
      ctx.restore();
    }

    function loop(t) {
      draw(t);
      raf = requestAnimationFrame(loop);
    }

    if (reduceMotion) {
      draw(4000);
    } else {
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    />
  );
}
