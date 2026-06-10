// Persona-style day phases based on the visitor's local time.

export function getDayPhase(date = new Date()) {
  const h = date.getHours();
  if (h === 0) return { label: "DARK HOUR", tint: "rgba(60, 255, 190, 0.05)" };
  if (h < 5) return { label: "LATE NIGHT", tint: "rgba(8, 6, 48, 0.28)" };
  if (h < 11) return { label: "MORNING", tint: "rgba(255, 226, 160, 0.06)" };
  if (h < 16) return { label: "DAYTIME", tint: "rgba(255, 255, 255, 0.05)" };
  if (h < 20) return { label: "EVENING", tint: "rgba(255, 130, 70, 0.08)" };
  return { label: "NIGHT", tint: "rgba(10, 8, 52, 0.22)" };
}

export function getDateStamp(date = new Date()) {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return { date: `${mm}/${dd}`, day: days[date.getDay()] };
}
