import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/{}[]=+*#";

// Text that "decodes" from random characters into the real word, left to right,
// the first time it scrolls into view. Screen readers always get the real text.
const Scramble = ({ text, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!inView || reduced) return;
    let frame = 0;
    const frames = 18;
    const id = setInterval(() => {
      frame += 1;
      const settled = Math.floor((frame / frames) * text.length);
      setOutput(
        text
          .split("")
          .map((ch, i) => (i < settled || ch === " " ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]))
          .join("")
      );
      if (frame >= frames) {
        clearInterval(id);
        setOutput(text);
      }
    }, 40);
    return () => clearInterval(id);
  }, [inView, reduced, text]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{reduced ? text : output}</span>
    </span>
  );
};

export default Scramble;
