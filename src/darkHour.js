// "Dark Hour" easter egg state. Toggled via the HUD clock or the Konami code.
// Subscribers (canvas background, HUD) re-render when it flips.

let darkHour = false;
try {
  darkHour = sessionStorage.getItem("p3-dark-hour") === "1";
} catch { /* private mode */ }

const listeners = new Set();

export function isDarkHour() {
  return darkHour;
}

export function setDarkHour(value) {
  darkHour = value;
  try { sessionStorage.setItem("p3-dark-hour", value ? "1" : "0"); } catch { /* private mode */ }
  listeners.forEach((fn) => fn(darkHour));
}

export function toggleDarkHour() {
  setDarkHour(!darkHour);
  return darkHour;
}

export function onDarkHourChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
