import { useEffect, useState } from "react";
import { sections } from "../data/portfolio";

// Id of the section crossing the middle of the viewport ("" while in the hero).
export function useActiveSection() {
  const [active, setActive] = useState("");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
      const line = window.innerHeight * 0.45;
      let current = "";
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        current = els.at(-1)?.id || current;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return active;
}
