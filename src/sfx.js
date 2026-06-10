// Synthesized Persona-style UI sounds via WebAudio. No audio files, no copyright.

let ctx = null;
let noiseBuf = null;
let muted = typeof localStorage !== "undefined" && localStorage.getItem("p3-muted") === "1";

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noise(c) {
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate * 0.2, c.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  return src;
}

function env(g, t, attack, decay, peak) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

export function playHover() {
  if (muted) return;
  try {
    const c = ac();
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    const f = c.createBiquadFilter();
    o.type = "square";
    o.frequency.setValueAtTime(1900, t);
    o.frequency.exponentialRampToValueAtTime(2600, t + 0.035);
    f.type = "lowpass";
    f.frequency.value = 5200;
    o.connect(f); f.connect(g); g.connect(c.destination);
    env(g, t, 0.004, 0.055, 0.06);
    o.start(t); o.stop(t + 0.09);
  } catch { /* audio unavailable */ }
}

export function playConfirm() {
  if (muted) return;
  try {
    const c = ac();
    const t = c.currentTime;
    // tonal sweep
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(1500, t);
    o.frequency.exponentialRampToValueAtTime(330, t + 0.13);
    o.connect(g); g.connect(c.destination);
    env(g, t, 0.005, 0.16, 0.09);
    o.start(t); o.stop(t + 0.2);
    // slash noise
    const n = noise(c);
    const ng = c.createGain();
    const nf = c.createBiquadFilter();
    nf.type = "bandpass";
    nf.frequency.setValueAtTime(3800, t);
    nf.frequency.exponentialRampToValueAtTime(900, t + 0.12);
    nf.Q.value = 1.1;
    n.connect(nf); nf.connect(ng); ng.connect(c.destination);
    env(ng, t, 0.003, 0.13, 0.07);
    n.start(t); n.stop(t + 0.16);
  } catch { /* audio unavailable */ }
}

export function playBack() {
  if (muted) return;
  try {
    const c = ac();
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(720, t);
    o.frequency.exponentialRampToValueAtTime(230, t + 0.1);
    o.connect(g); g.connect(c.destination);
    env(g, t, 0.004, 0.12, 0.09);
    o.start(t); o.stop(t + 0.15);
  } catch { /* audio unavailable */ }
}

// Quick double-slash for "visit project" all-out-attack flourish.
export function playSlash() {
  if (muted) return;
  try {
    const c = ac();
    [0, 0.07].forEach((off) => {
      const t = c.currentTime + off;
      const n = noise(c);
      const ng = c.createGain();
      const nf = c.createBiquadFilter();
      nf.type = "bandpass";
      nf.frequency.setValueAtTime(5200, t);
      nf.frequency.exponentialRampToValueAtTime(700, t + 0.16);
      nf.Q.value = 0.9;
      n.connect(nf); nf.connect(ng); ng.connect(c.destination);
      env(ng, t, 0.002, 0.15, 0.11);
      n.start(t); n.stop(t + 0.2);
    });
  } catch { /* audio unavailable */ }
}

// Ascending arpeggio — toasts, easter eggs, "rank up" moments.
export function playRankUp() {
  if (muted) return;
  try {
    const c = ac();
    const base = c.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const t = base + i * 0.07;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(freq, t);
      o.connect(g); g.connect(c.destination);
      env(g, t, 0.005, 0.22, 0.085);
      o.start(t); o.stop(t + 0.3);
    });
  } catch { /* audio unavailable */ }
}

export function getMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
  try { localStorage.setItem("p3-muted", value ? "1" : "0"); } catch { /* private mode */ }
  applyBgmGain();
}

/* ── Ambient BGM ─────────────────────────────────────────────────
   Synthesized slow pad loop (no audio files): two detuned saws and
   a sub sine walking an Am–F–C–G progression through a breathing
   lowpass filter. Quiet, moody, Velvet-Room-adjacent. */

let bgmOn = false;
let bgmNodes = null;

const BGM_LEVEL = 0.05;
const CHORDS = [
  [57, 64, 72, 76], // Am: A3 E4 C5 E5
  [53, 60, 69, 72], // F:  F3 C4 A4 C5
  [48, 55, 64, 67], // C:  C3 G3 E4 G4
  [55, 62, 71, 74], // G:  G3 D4 B4 D5
];
const CHORD_DUR = 4.2;

const midiHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

function applyBgmGain() {
  if (!bgmNodes) return;
  const c = ac();
  const target = bgmOn && !muted ? BGM_LEVEL : 0.0001;
  bgmNodes.master.gain.cancelScheduledValues(c.currentTime);
  bgmNodes.master.gain.setTargetAtTime(target, c.currentTime, 0.8);
}

function buildBgm() {
  const c = ac();
  const master = c.createGain();
  master.gain.value = 0.0001;

  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 760;
  filter.Q.value = 0.6;

  // Slow filter breathing.
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.06;
  lfoGain.gain.value = 320;
  lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
  lfo.start();

  filter.connect(master);
  master.connect(c.destination);

  const voices = [];
  for (let v = 0; v < 4; v++) {
    const g = c.createGain();
    g.gain.value = 0.0001;
    const o1 = c.createOscillator();
    const o2 = c.createOscillator();
    o1.type = "sawtooth";
    o2.type = "sawtooth";
    o1.detune.value = -6;
    o2.detune.value = 6;
    o1.connect(g); o2.connect(g);
    g.connect(filter);
    o1.start(); o2.start();
    voices.push({ o1, o2, g });
  }

  // Sub bass.
  const subGain = c.createGain();
  subGain.gain.value = 0.0001;
  const sub = c.createOscillator();
  sub.type = "sine";
  sub.connect(subGain); subGain.connect(master);
  sub.start();

  return { master, filter, voices, sub, subGain, lfo, chordIdx: 0, nextAt: c.currentTime + 0.1 };
}

function scheduleBgm() {
  if (!bgmNodes) return;
  const c = ac();
  // Look ahead one second; schedule the next chord when due.
  while (bgmNodes.nextAt < c.currentTime + 1) {
    const t = bgmNodes.nextAt;
    const chord = CHORDS[bgmNodes.chordIdx % CHORDS.length];
    bgmNodes.voices.forEach((voice, i) => {
      const hz = midiHz(chord[i]);
      voice.o1.frequency.setTargetAtTime(hz, t, 0.35);
      voice.o2.frequency.setTargetAtTime(hz, t, 0.35);
      voice.g.gain.setTargetAtTime(0.05 + (i === 0 ? 0.02 : 0), t, 1.1);
    });
    bgmNodes.sub.frequency.setTargetAtTime(midiHz(chord[0] - 12), t, 0.4);
    bgmNodes.subGain.gain.setTargetAtTime(0.12, t, 1.4);
    bgmNodes.chordIdx++;
    bgmNodes.nextAt += CHORD_DUR;
  }
}

export function getBgm() {
  return bgmOn;
}

export function setBgm(value) {
  bgmOn = value;
  try { localStorage.setItem("p3-bgm", value ? "1" : "0"); } catch { /* private mode */ }
  if (value && !bgmNodes) {
    try {
      bgmNodes = buildBgm();
      scheduleBgm();
      setInterval(scheduleBgm, 500);
    } catch { bgmNodes = null; return; }
  }
  // When turning off we keep nodes alive (cheap) and just duck the master
  // gain, so re-enabling is instant and seamless.
  applyBgmGain();
}
