// Pointer handler for `.spotlight` elements: feeds the hover glow position via CSS vars.
export function trackSpotlight(e) {
  if (e.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}
