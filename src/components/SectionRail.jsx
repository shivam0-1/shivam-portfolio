import { AnimatePresence, motion } from "framer-motion";
import { sections } from "../data/portfolio";

// Wide screens only: a quiet vertical rail showing where you are, with labels on hover/focus.
const SectionRail = ({ active }) => (
  <AnimatePresence>
    {active && (
      <motion.nav
        aria-label="Section progress"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 12 }}
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      >
        <ul className="flex flex-col items-end gap-3">
          {sections.map((s) => {
            const on = s.id === active;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-label={s.label}
                  aria-current={on ? "location" : undefined}
                  className="group flex min-h-8 items-center gap-3 py-1"
                >
                  <span
                    aria-hidden="true"
                    className={`rounded-full bg-surface/90 px-2.5 py-1 text-xs opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                      on ? "translate-x-0 text-text" : "translate-x-2 text-muted"
                    }`}
                  >
                    {s.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`block h-1.5 rounded-full transition-all duration-500 ${
                      on ? "w-6 bg-signal" : "w-1.5 bg-line-strong group-hover:bg-text"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    )}
  </AnimatePresence>
);

export default SectionRail;
