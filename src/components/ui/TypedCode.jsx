import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { usePageVisible } from "../../hooks/useMediaQuery";

// `const focus = "...";` — types each value, pauses, deletes it, moves to the next.
const TypedCode = ({ name = "focus", values, start = true, className = "" }) => {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref);
  const visible = usePageVisible();
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const word = values[index % values.length] || "";

  useEffect(() => {
    if (!start || reduced || !inView || !visible || !values.length) return;
    let delay = deleting ? 28 : 55;
    if (!deleting && length === word.length) delay = 1800; // hold the finished word
    if (deleting && length === 0) delay = 300;
    const id = setTimeout(() => {
      if (!deleting && length === word.length) setDeleting(true);
      else if (deleting && length === 0) {
        setDeleting(false);
        setIndex((i) => (i + 1) % values.length);
      } else setLength((l) => l + (deleting ? -1 : 1));
    }, delay);
    return () => clearTimeout(id);
  }, [start, reduced, deleting, length, word.length, values.length, inView, visible]);

  const shown = reduced ? values[0] : word.slice(0, length);

  return (
    <p ref={ref} className={`font-mono ${className}`}>
      <span className="sr-only">I build {values.join(", ")}.</span>
      <span aria-hidden="true">
        <span className="text-[var(--syn-kw)]">const</span> <span className="text-[var(--syn-attr)]">{name}</span>{" "}
        <span className="text-muted">=</span> <span className="text-[var(--syn-str)]">"{shown}</span>
        {!reduced && <span className={`ml-px inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-signal ${inView && visible ? "animate-pulse" : ""}`} />}
        <span className="text-[var(--syn-str)]">"</span>
        <span className="text-muted">;</span>
      </span>
    </p>
  );
};

export default TypedCode;
