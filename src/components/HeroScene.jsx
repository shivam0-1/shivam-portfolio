import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { FiCode, FiDatabase, FiGlobe, FiPlay, FiRefreshCw, FiTerminal } from "react-icons/fi";
import { profile } from "../data/portfolio";
import { useFinePointer, useMediaQuery, usePageVisible } from "../hooks/useMediaQuery";

// A full-stack request, made visible: a browser asks for data, an Express route
// queries MongoDB, the server logs it, and the response renders back in the page.

const response = {
  name: profile.name,
  role: profile.role,
  stack: ["React", "Node.js", "MongoDB"],
  available: profile.available,
};

const LOG_LINE = "GET /api/developer?name=Shivam  →  200 OK";

// Which editor line is "running" in each phase.
const activeLine = { request: 0, handler: 1, query: 2, respond: 3 };
const timeline = [
  ["request", 0],
  ["handler", 700],
  ["query", 1250],
  ["respond", 1800],
  ["done", 2750],
];

// Packet route across the scene (viewBox 560 × 500): button → route → terminal → page.
const outbound = { cx: [488, 232], cy: [92, 262] };
const inbound = { cx: [232, 360, 250], cy: [262, 440, 120] };

const kw = "text-[var(--syn-kw)]";
const str = "text-[var(--syn-str)]";
const fn = "text-[var(--syn-attr)]";
const code = [
  <>
    app.<span className={fn}>get</span>(<span className={str}>"/api/developer"</span>, <span className={kw}>async</span> (req, res) =&gt; {"{"}
  </>,
  <>
    {"  "}<span className={kw}>const</span> {"{ name }"} = req.query;
  </>,
  <>
    {"  "}<span className={kw}>const</span> dev = <span className={kw}>await</span> Developer.<span className={fn}>findOne</span>({"{ name }"});
  </>,
  <>
    {"  "}res.<span className={fn}>json</span>(dev);
  </>,
  <>{"});"}</>,
];

const Chrome = ({ icon: Icon, title, children }) => (
  <div className="flex h-9 items-center gap-3 border-b border-line px-3.5">
    <div className="flex gap-1.5" aria-hidden="true">
      <span className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
      <span className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
      <span className="h-2 w-2 rounded-full bg-[#28c840]/80" />
    </div>
    <span className="flex min-w-0 items-center gap-1.5 truncate font-mono text-[10px] text-muted">
      <Icon aria-hidden="true" className="shrink-0" /> {title}
    </span>
    <div className="ml-auto">{children}</div>
  </div>
);

// One floating window. `depth` places it in 3D; hovering brings it forward.
const Window = ({ depth, className, flat, children, delay }) => (
  <motion.div
    className={flat ? "relative" : `pointer-events-auto absolute ${className}`}
    style={flat ? undefined : { z: depth, transformStyle: "preserve-3d" }}
    whileHover={flat ? undefined : { z: depth + 28 }}
    transition={{ type: "spring", stiffness: 220, damping: 22 }}
  >
    <div className="scene-float glass-window overflow-hidden rounded-xl" style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  </motion.div>
);

export default function HeroScene({ autoplay = true, phase: controlled = null, onPhase }) {
  const ref = useRef(null);
  const timers = useRef([]);
  const played = useRef(false);
  const inView = useInView(ref, { amount: 0.3 });
  const visible = usePageVisible();
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const wide = useMediaQuery("(min-width: 640px)");
  const flat = !wide;
  const [phase, setPhase] = useState("idle");
  const [view, setView] = useState("preview");
  const [logs, setLogs] = useState([]);
  // Scrolling (Process section) may drive the scene; a run started with Send always plays through first.
  const running = phase !== "idle" && phase !== "done";
  const shown = running ? phase : controlled ?? phase;
  const loaded = shown === "done";
  const busy = shown !== "idle" && shown !== "done";
  const shownLogs = logs.length || (!loaded && shown !== "respond") ? logs : [LOG_LINE];

  // Tilt toward the pointer for real depth (mouse/trackpad, full motion only).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(px, { stiffness: 90, damping: 18 });
  const rotateX = useSpring(py, { stiffness: 90, damping: 18 });
  const tilt = !flat && !reduced;

  const send = () => {
    if (running) return;
    timers.current.forEach(clearTimeout);
    const log = () => setLogs((l) => [...l, LOG_LINE].slice(-3));
    if (reduced) {
      log();
      setPhase("done");
      return;
    }
    timers.current = timeline.map(([name, at]) =>
      setTimeout(() => {
        setPhase(name);
        if (name === "respond") log();
      }, at)
    );
  };

  // Play the round trip once, the first time the scene is on screen after the intro.
  useEffect(() => {
    if (!autoplay || !inView || !visible || played.current) return;
    played.current = true;
    const id = setTimeout(send, reduced ? 0 : 900);
    return () => clearTimeout(id);
    // `send` is stable enough for a one-shot trigger; re-running on its identity would replay it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, inView, visible, reduced]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    onPhase?.(shown);
  }, [shown, onPhase]);

  const onMove = (e) => {
    if (!tilt || !fine) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    py.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const status = {
    idle: "Press Send to follow a request through the stack.",
    request: "The page sends GET /api/developer…",
    handler: "Express picks up the route…",
    query: "MongoDB looks up the developer…",
    respond: "The server responds with JSON…",
    done: "Round trip complete. The page rendered the response.",
  }[shown];

  /* ---------------------------------------------------------------- windows */

  const browser = (
    <Window flat={flat} depth={-50} delay={0} className="right-0 top-[1%] w-[72%]">
      <Chrome icon={FiGlobe} title="localhost:5173">
        <div role="group" aria-label="Response view" className="flex rounded-md border border-line p-0.5 font-mono text-[9px]">
          {["preview", "json"].map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`rounded px-2 py-0.5 transition-colors ${view === v ? "bg-text text-bg" : "text-muted hover:text-text"}`}
            >
              {v === "json" ? "JSON" : "Preview"}
            </button>
          ))}
        </div>
      </Chrome>
      <div className="flex min-h-[150px] items-center gap-4 p-4">
        <div className="min-w-0 flex-1">
          {view === "json" ? (
            <pre className="overflow-hidden font-mono text-[10px] leading-[1.6] text-muted">
              {loaded ? (
                <code>
                  {"{\n"}
                  {Object.entries(response).map(([k, v], i, all) => (
                    <span key={k}>
                      {"  "}
                      <span className={fn}>"{k}"</span>: <span className={str}>{JSON.stringify(v).replaceAll(",", ", ")}</span>
                      {i < all.length - 1 ? ",\n" : "\n"}
                    </span>
                  ))}
                  {"}"}
                </code>
              ) : (
                <code>{busy ? "// waiting for response…" : "// no response yet"}</code>
              )}
            </pre>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              {loaded ? (
                <motion.div
                  key="card"
                  initial="hidden"
                  animate="shown"
                  variants={{ shown: { transition: { staggerChildren: 0.07 } } }}
                  className="flex items-center gap-3.5"
                >
                  <motion.span
                    variants={{ hidden: { scale: 0.5, opacity: 0 }, shown: { scale: 1, opacity: 1 } }}
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-signal text-sm font-semibold text-signal-ink"
                  >
                    SK
                  </motion.span>
                  <div className="min-w-0">
                    <motion.p variants={{ hidden: { opacity: 0, y: 6 }, shown: { opacity: 1, y: 0 } }} className="truncate text-sm font-semibold">
                      {response.name}
                    </motion.p>
                    <motion.p variants={{ hidden: { opacity: 0, y: 6 }, shown: { opacity: 1, y: 0 } }} className="text-xs text-muted">
                      {response.role}
                    </motion.p>
                    <motion.div variants={{ hidden: { opacity: 0, y: 6 }, shown: { opacity: 1, y: 0 } }} className="mt-2 flex flex-wrap gap-1">
                      {response.stack.map((s) => (
                        <span key={s} className="rounded border border-signal/40 px-1.5 py-px font-mono text-[9px] text-signal">
                          {s}
                        </span>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="skeleton" exit={{ opacity: 0 }} className="flex items-center gap-3.5" aria-hidden="true">
                  <span className={`h-12 w-12 shrink-0 rounded-xl bg-line ${busy ? "animate-pulse" : ""}`} />
                  <div className="flex-1 space-y-2">
                    <span className={`block h-3 w-3/4 rounded bg-line ${busy ? "animate-pulse" : ""}`} />
                    <span className={`block h-2.5 w-1/2 rounded bg-line ${busy ? "animate-pulse" : ""}`} />
                    <span className={`block h-2.5 w-2/3 rounded bg-line ${busy ? "animate-pulse" : ""}`} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
        <button
          type="button"
          onClick={send}
          disabled={running}
          className="shine flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-signal px-3 py-2 font-mono text-[10px] font-medium text-signal-ink transition-opacity disabled:opacity-60"
        >
          {loaded ? <FiRefreshCw aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
          {running ? "Sending…" : loaded ? "Send again" : "Send request"}
        </button>
      </div>
    </Window>
  );

  const editor = (
    <Window flat={flat} depth={0} delay={1.2} className="left-0 top-[40%] w-[78%]">
      <Chrome icon={FiCode} title="routes/developer.js">
        <AnimatePresence>
          {shown === "query" && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 rounded bg-signal/15 px-1.5 py-0.5 font-mono text-[9px] text-signal"
            >
              <FiDatabase aria-hidden="true" /> querying
            </motion.span>
          )}
        </AnimatePresence>
      </Chrome>
      <pre className="overflow-x-auto py-3 font-mono text-[11.5px] leading-[1.9]">
        <code>
          {code.map((line, i) => {
            const on = activeLine[shown] === i;
            return (
              <span
                key={i}
                className={`relative block whitespace-pre pr-4 transition-colors duration-300 ${on ? "bg-signal/10" : ""}`}
              >
                <span
                  className={`absolute inset-y-0 left-0 w-0.5 transition-colors duration-300 ${on ? "bg-signal" : "bg-transparent"}`}
                  aria-hidden="true"
                />
                <span className="inline-block w-8 select-none pr-3 text-right text-muted/50" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="text-text">{line}</span>
              </span>
            );
          })}
        </code>
      </pre>
    </Window>
  );

  const terminal = (
    <Window flat={flat} depth={55} delay={2.4} className="right-[2%] top-[72%] w-[60%]">
      <Chrome icon={FiTerminal} title="server · npm run dev" />
      <div className="min-h-[96px] space-y-1 p-3.5 font-mono text-[11px] leading-relaxed">
        <p className="text-muted">
          <span className="text-signal">➜</span> server listening on :5000
        </p>
        <AnimatePresence initial={false}>
          {shownLogs.map((line, i) => (
            <motion.p key={`${i}-${shownLogs.length}`} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="text-text">
              <span className="text-signal">✓</span> {line}
            </motion.p>
          ))}
        </AnimatePresence>
        <p className="text-muted">
          <span className="text-signal">$</span>
          <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-muted/70" aria-hidden="true" />
        </p>
      </div>
    </Window>
  );

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Interactive demo: a request travels from a React page through an Express route and MongoDB, then the response renders back in the page."
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`${flat ? "space-y-3" : "relative aspect-[560/500] w-full [perspective:1400px]"} ${
        inView && visible && !reduced ? "scene-live" : ""
      }`}
    >
      {flat ? (
        <>
          {browser}
          {editor}
          {terminal}
        </>
      ) : (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            rotateX: tilt ? rotateX : 0,
            rotateY: tilt ? rotateY : 0,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Base tilt sits on a wrapper so the pointer tilt adds to it */}
          {/* Wrapper planes are click-through: in 3D they sit in front of the rear window */}
          <div className="pointer-events-none absolute inset-0 [transform:rotateX(6deg)_rotateY(-9deg)] [transform-style:preserve-3d]">
            {browser}
            {editor}
            {terminal}
            {!reduced && (
              <svg
                viewBox="0 0 560 500"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full"
                style={{ transform: "translateZ(80px)" }}
                aria-hidden="true"
              >
                <AnimatePresence>
                  {(shown === "request" || shown === "respond") && (
                    <motion.g key={shown} exit={{ opacity: 0 }}>
                      {[14, 5].map((r) => (
                        <motion.circle
                          key={r}
                          r={r}
                          fill="var(--signal)"
                          opacity={r > 6 ? 0.22 : 1}
                          initial={{ cx: (shown === "request" ? outbound : inbound).cx[0], cy: (shown === "request" ? outbound : inbound).cy[0] }}
                          animate={shown === "request" ? outbound : inbound}
                          transition={{ duration: shown === "request" ? 0.7 : 0.95, ease: "easeInOut" }}
                        />
                      ))}
                    </motion.g>
                  )}
                </AnimatePresence>
              </svg>
            )}
          </div>
        </motion.div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>
      <p
        aria-hidden="true"
        className={`text-center font-mono text-[10px] text-muted ${flat ? "pt-1" : "absolute -bottom-9 left-0 right-0"}`}
      >
        {status}
      </p>
    </div>
  );
}
