import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { criticalResources } from "../lib/readiness";

// One deadline for all preparation. A slow network must never prevent access
// to the portfolio's already-rendered content.
const READINESS_DEADLINE = 3000;

const BootLoader = ({ onDone }) => {
  const reduced = useReducedMotion();
  const dialog = useRef(null);
  const skipButton = useRef(null);
  const finish = useRef(() => {});
  const [states, setStates] = useState(() => criticalResources.map(() => "pending"));
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    let finished = false;
    let interacted = false;
    let deadline;
    let settled = 0;

    const complete = () => {
      if (finished || controller.signal.aborted) return;
      finished = true;
      window.clearTimeout(deadline);
      setOpening(true);
      controller.abort();
      onDone();
    };

    finish.current = () => {
      interacted = true;
      complete();
    };

    // The only control remains reachable with Tab in either direction.
    // Escape is an explicit skip; ordinary typing does not dismiss the screen.
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        finish.current();
      } else if (event.key === "Tab") {
        interacted = true;
        event.preventDefault();
        skipButton.current?.focus({ preventScroll: true });
      }
    };
    const keepFocus = (event) => {
      if (!dialog.current?.contains(event.target)) {
        skipButton.current?.focus({ preventScroll: true });
      }
    };

    document.body.style.overflow = "hidden";
    skipButton.current?.focus({ preventScroll: true });
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("focusin", keepFocus);

    deadline = window.setTimeout(() => {
      setStates((current) => current.map((state) => state === "pending" ? "fallback" : state));
      complete();
    }, READINESS_DEADLINE);

    // Start independent work together. Progress counts checked resources,
    // never time-based percentages or an invented compilation sequence.
    criticalResources.forEach(({ prepare }, index) => {
      Promise.resolve()
        .then(() => prepare(controller.signal))
        .then((available) => available ? "ready" : "fallback", () => "fallback")
        .then((state) => {
          if (finished || controller.signal.aborted) return;
          setStates((current) => current.map((value, i) => i === index ? state : value));
          settled += 1;
          if (settled === criticalResources.length) complete();
        });
    });

    return () => {
      finished = true;
      controller.abort();
      window.clearTimeout(deadline);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("focusin", keepFocus);
      // Do not move focus after an automatic cached load. For an intentional
      // skip, restore a meaningful target once the overlay leaves the DOM.
      if (interacted) {
        const target = previousFocus instanceof HTMLElement && previousFocus !== document.body && previousFocus.isConnected
          ? previousFocus
          : document.getElementById("main");
        window.requestAnimationFrame(() => target?.focus({ preventScroll: true }));
      }
    };
  }, [onDone]);

  const completed = states.filter((state) => state !== "pending").length;
  const percentage = Math.round(completed / criticalResources.length * 100);

  return (
    <motion.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby="boot-title"
      aria-describedby="boot-description"
      className="fixed inset-0 z-[300] grid place-items-center overflow-y-auto bg-bg px-5 py-8"
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.22, ease: "easeOut" }}
    >
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div aria-hidden="true" className="glow pointer-events-none absolute h-[32rem] w-[min(32rem,100%)] opacity-60" />

      <div className="relative w-full max-w-lg">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-signal/30 bg-signal/10 font-mono text-sm font-semibold text-signal" aria-hidden="true">SK.</span>
            <div>
              <p id="boot-title" className="text-sm font-medium">Shivam Kumar</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Developer portfolio</p>
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Initializing</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line-strong bg-surface/90 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between border-b border-line bg-raised/70 px-5 py-3.5">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-warm/80" />
              <span className="h-2 w-2 rounded-full bg-muted/50" />
              <span className="h-2 w-2 rounded-full bg-signal/70" />
            </div>
            <span className="font-mono text-[10px] tracking-wide text-muted">portfolio / startup</span>
            <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
          </div>

          <div className="p-6 font-mono text-xs sm:p-8 sm:text-[13px]">
            <p className="mb-6 flex items-center gap-2 text-text">
              <span className="text-signal" aria-hidden="true">&gt;</span>
              <span>Preparing your experience</span>
              <span className="inline-block h-3.5 w-1.5 bg-signal/70" aria-hidden="true" />
            </p>
            <ul className="space-y-4" aria-label="Resource readiness">
              {criticalResources.map(({ id, label }, index) => (
                <li key={id} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-3 text-muted">
                    <span className="text-[10px] opacity-55" aria-hidden="true">0{index + 1}</span>
                    {label}
                  </span>
                  <span className={states[index] === "ready" ? "text-signal" : states[index] === "fallback" ? "text-warm" : "text-muted"}>
                    {states[index] === "ready" ? "ready" : states[index] === "fallback" ? "fallback" : "loading"}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex items-center justify-between gap-3 border-t border-line pt-5 text-[10px] text-muted">
              <p id="boot-description" role="status" aria-live="polite">
                {opening ? "Opening portfolio" : `${completed} of ${criticalResources.length} resource groups checked`}
              </p>
              <span aria-hidden="true" className="text-signal">{percentage}%</span>
            </div>
          </div>

          <div
            role="progressbar"
            aria-label="Essential resources checked"
            aria-valuemin={0}
            aria-valuemax={criticalResources.length}
            aria-valuenow={completed}
            className="h-0.5 bg-raised"
          >
            <motion.div
              className="h-full origin-left bg-signal"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: completed / criticalResources.length }}
              transition={{ duration: reduced ? 0 : 0.16, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 font-mono text-[10px] text-muted">
          <span>Built with intention.</span>
          <button
            ref={skipButton}
            type="button"
            onClick={() => finish.current()}
            className="rounded-md px-3 py-2.5 transition-colors hover:bg-surface hover:text-text"
          >
            Skip intro <span aria-hidden="true" className="ml-2 text-muted/70">Esc ↵</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BootLoader;
