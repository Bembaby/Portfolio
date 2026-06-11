// Global site mode: the full Persona experience or a clean professional
// view of the same content. Persisted so recruiters who pick "professional"
// land back there on refresh.

let mode = "persona";
try {
  const saved = localStorage.getItem("site-mode");
  if (saved === "pro" || saved === "persona") mode = saved;
} catch { /* private mode */ }

const listeners = new Set();

export function getSiteMode() {
  return mode;
}

export function setSiteMode(value) {
  if (value !== "pro" && value !== "persona") return;
  mode = value;
  try { localStorage.setItem("site-mode", value); } catch { /* private mode */ }
  listeners.forEach((fn) => fn(mode));
}

export function onSiteModeChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
