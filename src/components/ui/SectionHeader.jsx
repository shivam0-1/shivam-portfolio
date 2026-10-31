import { Children, cloneElement, isValidElement } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import Scramble from "./Scramble";

const ease = [0.16, 1, 0.3, 1];

// Each word rises out of its own mask; nested elements (e.g. <Accent>) keep their styling.
const Word = ({ children }) => (
  <span className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
    <motion.span
      className="inline-block"
      variants={{ hidden: { y: "110%" }, shown: { y: 0 } }}
      transition={{ duration: 0.9, ease }}
    >
      {children}
    </motion.span>
  </span>
);

const splitWords = (node) =>
  Children.toArray(node).flatMap((child) => {
    if (typeof child === "string") {
      return child.split(/(\s+)/).map((part, i) => (!part || /^\s+$/.test(part) ? part : <Word key={`${part}-${i}`}>{part}</Word>));
    }
    if (isValidElement(child)) return [cloneElement(child, undefined, splitWords(child.props.children))];
    return [child];
  });

// Section opener: index + name on a rule that draws itself in, then a headline whose words rise into place.
const SectionHeader = ({ label, note, title, children, id, index }) => {
  const reduced = useReducedMotion();
  return (
    <header className="mb-14 md:mb-20">
      <div className="relative pt-5">
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px origin-left bg-line-strong"
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease }}
        />
        <Reveal className="flex flex-wrap items-center justify-between gap-3">
          <span className="label flex items-center gap-3">
            <span className="text-signal" aria-hidden="true">{index}</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
            <Scramble text={label} />
          </span>
          {note && <span className="label text-muted">{note}</span>}
        </Reveal>
      </div>
      <motion.h2
        id={id}
        initial={reduced ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.045 } } }}
        className="mt-10 max-w-5xl text-[length:var(--text-heading)] font-extrabold leading-[1.02] tracking-[-0.05em]"
      >
        {reduced ? title : splitWords(title)}
      </motion.h2>
      {children && (
        <Reveal delay={0.2} className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
          {children}
        </Reveal>
      )}
    </header>
  );
};

export default SectionHeader;
