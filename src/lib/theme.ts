export const DARK: Record<string, string> = {
  "--bg":              "#0c0c0c",
  "--bg-soft":         "#131313",
  "--card":            "#171717",   // lifted above bg
  "--chip":            "#242424",   // UI elements, lifted above card
  "--line":            "#2a2a2a",
  "--line-2":          "#1e1e1e",
  "--ink":             "#eeeeee",   // off-white, less harsh than pure #fff
  "--ink-2":           "#c4c4c4",
  "--muted":           "#6a6a6a",
  "--muted-2":         "#4a4a4a",
  "--mint":            "#172917",
  "--mint-ink":        "#4ade80",
  "--accent":          "#8b7cf8",   // brighter purple for dark surfaces
  "--accent-soft":     "#2a1f6e",   // muted purple tint for loading states
  "--card-border":     "transparent",
  "--tab-pill":        "#2e2e2e",   // elevated above chip container
  "--btn-primary":     "#fff",
  "--btn-primary-text": "#0c0c0c",
  "--tooltip-shadow":  "0 4px 20px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)",
};

export const LIGHT: Record<string, string> = {
  "--bg":              "#fafafa",
  "--bg-soft":         "#efefe9",
  "--card":            "#ffffff",
  "--chip":            "#f1f1ed",
  "--line":            "#e7e7e1",
  "--line-2":          "#ececea",
  "--ink":             "#0d0d0d",
  "--ink-2":           "#2a2a2a",
  "--muted":           "#8a8a85",
  "--muted-2":         "#b8b8b2",
  "--mint":            "#d8f0d8",
  "--mint-ink":        "#2f7a3a",
  "--accent":          "#6c5cf7",
  "--accent-soft":     "#ede9fe",   // light lavender for loading states
  "--card-border":     "transparent",
  "--tab-pill":        "#ffffff",
  "--btn-primary":      "#111111",
  "--btn-primary-text": "#ffffff",
  "--tooltip-shadow":  "0 4px 12px rgba(0,0,0,0.08)",
};

export function applyTheme(isDark: boolean) {
  const vars = isDark ? DARK : LIGHT;
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  root.classList.toggle("dark", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

export function getInitialDark(): boolean {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem("theme");
  if (saved) return saved === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
