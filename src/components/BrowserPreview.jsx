import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiLock, FiRotateCw } from "react-icons/fi";

// The address types into a browser frame; image readiness controls its reveal.
// The screenshot itself links to the live site.
const BrowserPreview = ({ url, image, title }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const display = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const [typed, setTyped] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [replay, setReplay] = useState(0);
  const done = reduced || typed >= display.length;
  const shown = reduced ? display.length : typed;

  // This decorative address animation never delays the screenshot.
  useEffect(() => {
    if (!inView || reduced) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= display.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [inView, reduced, display.length, replay]);

  const reload = (e) => {
    e.preventDefault();
    if (reduced) return;
    setTyped(0);
    setReplay((n) => n + 1);
  };

  return (
    <div ref={ref} className="relative overflow-hidden rounded-xl border border-line-strong bg-bg shadow-[0_16px_48px_-12px_#0008]">
      {/* Chrome */}
      <div className="flex items-center gap-3 border-b border-line bg-surface px-3 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-muted/50" />
          <span className="h-2 w-2 rounded-full bg-muted/30" />
          <span className="h-2 w-2 rounded-full bg-signal/70" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-line bg-bg px-2 py-1.5 font-mono text-[9px] text-muted sm:px-3 sm:text-[10px]">
          <FiLock className="shrink-0" aria-hidden="true" />
          <span className="truncate" aria-label={display}>
            {display.slice(0, shown)}
            {!done && <span className="ml-px inline-block h-3 w-px translate-y-0.5 animate-pulse bg-text" />}
          </span>
        </div>
        <button
          type="button"
          onClick={reload}
          aria-label={`Replay ${title} address animation`}
          disabled={reduced}
          className="grid h-8 w-8 shrink-0 place-items-center rounded text-muted transition-colors hover:bg-raised hover:text-text disabled:opacity-40"
        >
          <FiRotateCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Progress follows actual image readiness. */}
      <div className="h-0.5 bg-transparent">
        {!reduced && (
          <motion.div
            key={replay}
            className="h-full origin-left bg-signal"
            initial={{ scaleX: 0, opacity: 1 }}
            animate={loaded || failed ? { scaleX: 1, opacity: [1, 1, 0] } : { scaleX: 0.2 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        )}
      </div>

      {/* Page */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-[1352/630] overflow-hidden bg-raised"
      >
        {!(loaded || failed) && (
          <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,transparent_30%,var(--line)_50%,transparent_70%)]" />
        )}
        <motion.img
          src={image.src}
          width={image.width}
          height={image.height}
          alt={`Screenshot of the ${title} home page`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          initial={false}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.4 }}
        />
        {failed && <span className="absolute inset-0 grid place-content-center gap-2 p-6 text-center text-sm text-muted"><FiArrowUpRight className="mx-auto text-2xl text-signal" aria-hidden="true" />Preview unavailable. Open the live project.</span>}
        <span className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/50 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black">
            Open live site <FiArrowUpRight aria-hidden="true" />
          </span>
        </span>
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
};

export default BrowserPreview;
