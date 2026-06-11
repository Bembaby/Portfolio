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

/* ── Battle BGM ──────────────────────────────────────────────────
   Synthesized anime-battle track (no audio files): a 16-step sequencer
   at 162 BPM arranged as a real song so it never wears you down:

     VERSE (8 bars)  groovy syncopated beat, sparse low melody
     BUILD (4 bars)  four-on-the-floor + rising arp + snare roll
     CHORUS (8 bars) full battle energy with the written hook melody
     BREAK (4 bars)  half-time, sustained pads, dreamy delayed lead

   Progression: Am → F → G → E. Loop ≈ 36s with constant variation. */

let bgmOn = false;
let bgmNodes = null;
let bgmStep = 0;
let bgmNextAt = 0;

const BGM_LEVEL = 0.35;
const BPM = 162;
const STEP = 60 / BPM / 4; // one 16th note

// One chord per bar (16 steps). intervals = chord tones above root.
const PROG = [
  { root: 45, intervals: [0, 3, 7] },  // Am
  { root: 41, intervals: [0, 4, 7] },  // F
  { root: 43, intervals: [0, 4, 7] },  // G
  { root: 40, intervals: [0, 4, 8] },  // E aug color for drama
];

// Song arrangement, in bars.
const SECTIONS = [
  { name: "verse",  bars: 8 },
  { name: "build",  bars: 4 },
  { name: "chorus", bars: 8 },
  { name: "break",  bars: 4 },
];
const SONG_BARS = SECTIONS.reduce((n, s) => n + s.bars, 0);

function sectionAt(songBar) {
  let acc = 0;
  for (const sec of SECTIONS) {
    if (songBar < acc + sec.bars) return { section: sec.name, barIn: songBar - acc };
    acc += sec.bars;
  }
  return { section: "verse", barIn: 0 };
}

// Melodies: 4-bar phrases, each bar a list of [step, midi, durSteps, vel].
// The chorus hook — the bit that should stick in your head.
const CHORUS_MEL = [
  [[0, 81, 2, 0.1], [2, 84, 2, 0.09], [4, 83, 2, 0.09], [6, 79, 2, 0.08], [8, 81, 4, 0.1], [12, 76, 4, 0.08]],
  [[0, 77, 2, 0.1], [2, 81, 2, 0.09], [4, 84, 3, 0.1], [8, 83, 2, 0.08], [10, 81, 2, 0.08], [12, 79, 4, 0.09]],
  [[0, 79, 2, 0.1], [2, 83, 2, 0.09], [4, 86, 3, 0.1], [8, 84, 2, 0.09], [10, 83, 2, 0.08], [12, 81, 4, 0.09]],
  [[0, 80, 2, 0.1], [2, 83, 2, 0.09], [4, 81, 2, 0.08], [6, 80, 2, 0.08], [8, 76, 7, 0.1]],
];
// Verse: lower, sparser, conversational.
const VERSE_MEL = [
  [[0, 69, 3, 0.06], [4, 72, 2, 0.055], [8, 71, 2, 0.05], [12, 67, 2, 0.05]],
  [[0, 69, 2, 0.06], [4, 72, 4, 0.06], [10, 71, 2, 0.05], [12, 69, 2, 0.05]],
  [[0, 71, 2, 0.06], [4, 74, 3, 0.06], [8, 72, 2, 0.05], [12, 71, 2, 0.05]],
  [[0, 68, 4, 0.06], [8, 64, 6, 0.055]],
];
// Breakdown: long dreamy notes that ride the delay.
const BREAK_MEL = [
  [[0, 76, 8, 0.07], [8, 81, 8, 0.06]],
  [[0, 77, 12, 0.07]],
  [[0, 79, 8, 0.07], [8, 83, 8, 0.06]],
  [[0, 80, 14, 0.07]],
];

const midiHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

function applyBgmGain() {
  if (!bgmNodes) return;
  const c = ac();
  const target = bgmOn && !muted ? BGM_LEVEL : 0.0001;
  bgmNodes.master.gain.cancelScheduledValues(c.currentTime);
  bgmNodes.master.gain.setTargetAtTime(target, c.currentTime, 0.2);
}

function buildBgm() {
  const c = ac();
  const master = c.createGain();
  master.gain.value = 0.0001;
  master.connect(c.destination);

  // Light compression glues the mix and keeps peaks tame.
  const bus = c.createDynamicsCompressor();
  bus.threshold.value = -20;
  bus.knee.value = 18;
  bus.ratio.value = 7;
  bus.attack.value = 0.004;
  bus.release.value = 0.16;
  bus.connect(master);

  // Dotted-eighth feedback delay for the lead — instant anime energy.
  const delay = c.createDelay(1);
  delay.delayTime.value = STEP * 6;
  const fb = c.createGain();
  fb.gain.value = 0.34;
  const wet = c.createGain();
  wet.gain.value = 0.3;
  delay.connect(fb); fb.connect(delay);
  delay.connect(wet); wet.connect(bus);

  return { master, bus, delay };
}

function hitKick(c, t) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(150, t);
  o.frequency.exponentialRampToValueAtTime(42, t + 0.1);
  o.connect(g); g.connect(bgmNodes.bus);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.5, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  o.start(t); o.stop(t + 0.18);
}

function hitSnare(c, t, vel = 0.26) {
  const n = noise(c);
  const nf = c.createBiquadFilter();
  const g = c.createGain();
  nf.type = "bandpass";
  nf.frequency.value = 1900;
  nf.Q.value = 0.8;
  n.connect(nf); nf.connect(g); g.connect(bgmNodes.bus);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vel, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  n.start(t); n.stop(t + 0.16);
  // body
  const o = c.createOscillator();
  const og = c.createGain();
  o.type = "triangle";
  o.frequency.setValueAtTime(210, t);
  o.frequency.exponentialRampToValueAtTime(140, t + 0.06);
  o.connect(og); og.connect(bgmNodes.bus);
  og.gain.setValueAtTime(0.0001, t);
  og.gain.exponentialRampToValueAtTime(vel * 0.6, t + 0.003);
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  o.start(t); o.stop(t + 0.1);
}

function hitCrash(c, t) {
  const n = noise(c);
  const nf = c.createBiquadFilter();
  const g = c.createGain();
  nf.type = "highpass";
  nf.frequency.value = 5600;
  n.connect(nf); nf.connect(g); g.connect(bgmNodes.bus);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.11, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
  // noise buffer is 0.2s; loop it so the crash can ring out
  n.loop = true;
  n.start(t); n.stop(t + 0.72);
}

function hitHat(c, t, open, vel) {
  const n = noise(c);
  const nf = c.createBiquadFilter();
  const g = c.createGain();
  nf.type = "highpass";
  nf.frequency.value = 8200;
  n.connect(nf); nf.connect(g); g.connect(bgmNodes.bus);
  const dur = open ? 0.12 : 0.035;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vel, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  n.start(t); n.stop(t + dur + 0.02);
}

function playBassNote(c, t, midi, dur) {
  const o = c.createOscillator();
  const f = c.createBiquadFilter();
  const g = c.createGain();
  o.type = "sawtooth";
  o.frequency.value = midiHz(midi);
  f.type = "lowpass";
  f.frequency.setValueAtTime(1500, t);
  f.frequency.exponentialRampToValueAtTime(420, t + dur);
  f.Q.value = 1.2;
  o.connect(f); f.connect(g); g.connect(bgmNodes.bus);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.2, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t); o.stop(t + dur + 0.02);
}

function playLeadNote(c, t, midi, vel, dur = 0.14) {
  const g = c.createGain();
  [-7, 7].forEach((cents) => {
    const o = c.createOscillator();
    o.type = "square";
    o.frequency.value = midiHz(midi);
    o.detune.value = cents;
    o.connect(g);
    o.start(t); o.stop(t + dur + 0.05);
  });
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 3600;
  g.connect(f); f.connect(bgmNodes.bus); f.connect(bgmNodes.delay);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vel, t + 0.005);
  g.gain.setValueAtTime(vel, t + Math.max(0.005, dur - 0.05));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
}

function playStab(c, t, chord) {
  chord.intervals.forEach((iv) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sawtooth";
    o.frequency.value = midiHz(chord.root + 12 + iv);
    o.connect(g); g.connect(bgmNodes.bus);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o.start(t); o.stop(t + 0.24);
  });
}

// Soft sustained chord for the breakdown.
function playPad(c, t, chord, dur) {
  chord.intervals.forEach((iv) => {
    const g = c.createGain();
    [-5, 5].forEach((cents) => {
      const o = c.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = midiHz(chord.root + 12 + iv);
      o.detune.value = cents;
      o.connect(g);
      o.start(t); o.stop(t + dur + 0.1);
    });
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 1100;
    g.connect(f); f.connect(bgmNodes.bus);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.022, t + 0.4);
    g.gain.setValueAtTime(0.022, t + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  });
}

function scheduleStep(c, step, t) {
  const songBar = Math.floor(step / 16) % SONG_BARS;
  const s = step % 16;
  const chord = PROG[songBar % PROG.length];
  const { section, barIn } = sectionAt(songBar);

  // Crash announces every new section.
  if (s === 0 && barIn === 0) hitCrash(c, t);

  /* drums */
  if (section === "verse") {
    // syncopated groove — energy without the relentless stomp
    if (s === 0 || s === 7 || s === 10) hitKick(c, t);
    if (s === 4 || s === 12) hitSnare(c, t, 0.22);
    if (s % 2 === 0) hitHat(c, t, false, s % 4 === 0 ? 0.07 : 0.038);
  } else if (section === "build") {
    if (s % 4 === 0) hitKick(c, t);
    if (s === 4 || s === 12) hitSnare(c, t, 0.22);
    hitHat(c, t, false, s % 2 === 0 ? 0.07 : 0.04);
    // snare roll through the final bar, growing into the chorus
    if (barIn === 3 && s % 2 === 0) hitSnare(c, t, 0.08 + (s / 16) * 0.22);
  } else if (section === "chorus") {
    if (s % 4 === 0) hitKick(c, t);
    if (s === 4 || s === 12) hitSnare(c, t);
    if (s === 14 && barIn === 7) hitSnare(c, t + STEP / 2); // fill out
    hitHat(c, t, s % 4 === 2, s % 2 === 0 ? 0.09 : 0.045);
  } else {
    // breakdown: half-time, lots of air
    if (s === 0) hitKick(c, t);
    if (s === 8) hitSnare(c, t, 0.2);
    if (s % 4 === 0) hitHat(c, t, false, 0.045);
  }

  /* bass */
  if (section === "break") {
    if (s === 0) playBassNote(c, t, chord.root - 12, STEP * 14);
  } else if (section === "verse") {
    // sparser, syncopated with the kick
    if (s === 0 || s === 4 || s === 7 || s === 10 || s === 12) {
      playBassNote(c, t, chord.root - 12, STEP * 1.8);
    }
  } else {
    // build + chorus: pumping 8ths with octave jumps
    if (s % 2 === 0) {
      const oct = s === 6 || s === 14 ? 12 : 0;
      playBassNote(c, t, chord.root - 12 + oct, STEP * 1.8);
    }
  }

  /* harmony */
  if (section === "chorus" && (s === 0 || s === 10)) playStab(c, t, chord);
  if (section === "break" && s === 0) playPad(c, t, chord, STEP * 16);

  /* lead */
  if (section === "build") {
    // rising arpeggio cranks the tension
    if (s % 2 === 0) {
      const i = s / 2;
      const tone = chord.intervals[i % 3] + 12 * Math.floor(i / 3);
      playLeadNote(c, t, chord.root + 24 + tone, 0.045 + i * 0.004, 0.12);
    }
  } else {
    const mel =
      section === "chorus" ? CHORUS_MEL :
      section === "verse" ? VERSE_MEL :
      BREAK_MEL;
    for (const [st, midi, dur, vel] of mel[barIn % 4]) {
      if (st === s) playLeadNote(c, t, midi, vel, dur * STEP);
    }
  }
}

function scheduleBgm() {
  if (!bgmNodes || !bgmOn || muted) return;
  const c = ac();
  if (bgmNextAt < c.currentTime) {
    // Resync after a pause/mute so we don't burst-schedule missed steps.
    bgmNextAt = c.currentTime + 0.05;
  }
  while (bgmNextAt < c.currentTime + 0.3) {
    scheduleStep(c, bgmStep, bgmNextAt);
    bgmStep++;
    bgmNextAt += STEP;
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
      setInterval(scheduleBgm, 90);
    } catch { bgmNodes = null; return; }
  }
  applyBgmGain();
}
