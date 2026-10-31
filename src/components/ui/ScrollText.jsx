import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const Word = ({ children, progress, range, reduced }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity: reduced ? 1 : opacity }} className="inline-block whitespace-pre">
      {children}
    </motion.span>
  );
};

// Words brighten one by one as the paragraph scrolls through the viewport.
// `accent` words are set in the serif italic, in the signal colour.
const ScrollText = ({ text, accent = [], className = "" }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} reduced={reduced} range={[i / words.length, (i + 1) / words.length]}>
            <span className={accent.includes(w.replace(/[.,]/g, "")) ? "text-signal" : ""}>
              {w}
            </span>
            {i < words.length - 1 ? " " : ""}
          </Word>
        ))}
      </span>
    </p>
  );
};

export default ScrollText;
