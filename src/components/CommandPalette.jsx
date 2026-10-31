import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiCopy, FiDownload, FiGithub, FiLinkedin, FiMoon, FiSearch, FiX } from "react-icons/fi";
import { profile, sections } from "../data/portfolio";
import { scrollToTarget } from "../lib/smoothScroll";

// Mounted fresh on every open, so query and selection always start clean.
const Palette = ({ onClose, onToggleTheme }) => {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const destinationRef = useRef(null);
  const reduced = useReducedMotion();

  const commands = useMemo(
    () => [
      ...sections.map((s) => ({
        id: s.id,
        group: "Go to",
        label: s.label,
        hint: s.note,
        keywords: s.keywords,
        icon: FiArrowRight,
        run: () => {
          destinationRef.current = document.getElementById(s.id);
          scrollToTarget(destinationRef.current, { focus: false });
          window.history.replaceState(null, "", `#${s.id}`);
        },
      })),
      {
        id: "copy",
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        icon: FiCopy,
        keepOpen: true,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
          } catch {
            window.location.href = `mailto:${profile.email}`;
          }
        },
      },
      {
        id: "resume",
        group: "Actions",
        label: "Download résumé",
        keywords: "cv resume pdf",
        hint: "PDF",
        icon: FiDownload,
        run: () => {
          const a = document.createElement("a");
          a.href = profile.resume;
          a.download = "";
          a.click();
        },
      },
      { id: "theme", group: "Actions", label: "Toggle light / dark theme", icon: FiMoon, run: onToggleTheme },
      {
        id: "github",
        group: "Elsewhere",
        label: "GitHub",
        hint: profile.githubHandle,
        icon: FiGithub,
        run: () => window.open(profile.github, "_blank", "noopener,noreferrer"),
      },
      {
        id: "linkedin",
        group: "Elsewhere",
        label: "LinkedIn",
        hint: profile.linkedinHandle,
        icon: FiLinkedin,
        run: () => window.open(profile.linkedin, "_blank", "noopener,noreferrer"),
      },
    ],
    [onToggleTheme],
  );

  const q = query.trim().toLowerCase();
  const results = q
    ? commands.filter((c) => `${c.label} ${c.hint ?? ""} ${c.group} ${c.keywords ?? ""}`.toLowerCase().includes(q))
    : commands;

  useEffect(() => {
    const previous = document.activeElement;
    inputRef.current?.focus();
    const content = document.getElementById("app-content");
    const wasInert = content?.inert;
    if (content) content.inert = true;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const keepFocus = (e) => {
      if (!dialogRef.current?.contains(e.target)) inputRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("focusin", keepFocus);
    return () => {
      document.removeEventListener("focusin", keepFocus);
      document.body.style.overflow = overflow;
      if (content) content.inert = wasInert;
      const destination = destinationRef.current;
      if (destination) destination.setAttribute("tabindex", "-1");
      const target = destination || previous;
      if (target?.isConnected) target.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    // Keep the active descendant visible without scrolling the page behind the dialog.
    const option = document.getElementById(`cmd-${results[index]?.id}`);
    const list = document.getElementById("palette-list");
    if (!option || !list) return;
    const top = option.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (top + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = top + option.offsetHeight - list.clientHeight;
    }
  }, [index, results]);

  const run = (cmd) => {
    if (!cmd) return;
    cmd.run();
    if (!cmd.keepOpen) onClose();
  };

  const onKeyDown = (e) => {
    if (!e.ctrlKey && !e.metaKey) e.stopPropagation();
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      const controls = [...dialogRef.current.querySelectorAll("input, button")];
      const position = controls.indexOf(document.activeElement);
      e.preventDefault();
      controls[(position + (e.shiftKey ? -1 : 1) + controls.length) % controls.length]?.focus();
    } else if (e.target !== inputRef.current || e.nativeEvent.isComposing) {
      return;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[index]);
    } else if (e.key === "Home" && !query) {
      e.preventDefault();
      setIndex(0);
    } else if (e.key === "End" && !query) {
      e.preventDefault();
      setIndex(Math.max(results.length - 1, 0));
    }
  };

  let lastGroup = null;

  return (
    <motion.div
      className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-bg/80 px-4 pb-6 pt-[8dvh] backdrop-blur-md sm:pt-[14dvh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
      data-lenis-prevent
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: reduced ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl shadow-black/40"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <FiSearch className="shrink-0 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Type a command or search…"
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted"
            role="combobox"
            aria-label="Search pages and commands"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[index] ? `cmd-${results[index].id}` : undefined}
            aria-autocomplete="list"
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:bg-raised hover:text-text">
            <FiX aria-hidden="true" />
          </button>
        </div>

        <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li role="presentation" className="px-3 py-6 text-center text-sm text-muted">No commands found. Try “projects” or “email”.</li>}
          {results.map((cmd, i) => {
            const header = cmd.group !== lastGroup;
            lastGroup = cmd.group;
            const Icon = cmd.icon;
            const selected = i === index;
            return (
              <li key={cmd.id} role="presentation">
                {header && (
                  <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-wider text-muted">
                    {cmd.group}
                  </p>
                )}
                <div
                  id={`cmd-${cmd.id}`}
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseMove={() => setIndex(i)}
                  onClick={() => run(cmd)}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                    selected ? "bg-signal text-signal-ink" : "text-text"
                  }`}
                >
                  <Icon aria-hidden="true" className="shrink-0" />
                  <span className="min-w-0 flex-1">{cmd.id === "copy" && copied ? "Copied to clipboard ✓" : cmd.label}</span>
                  {cmd.hint && (
                    <span className={`hidden max-w-[45%] truncate font-mono text-xs sm:block ${selected ? "opacity-70" : "text-muted"}`}>{cmd.hint}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center justify-between gap-4 border-t border-line bg-raised/60 px-4 py-3 font-mono text-[10px] text-muted">
          <span><span aria-hidden="true">↑ ↓</span> Navigate · Enter to select</span>
          <span>ESC to close</span>
        </div>
        <span role="status" className="sr-only">{copied ? "Email address copied to clipboard." : `${results.length} commands available.`}</span>
      </motion.div>
    </motion.div>
  );
};

// ⌘K / Ctrl+K: jump anywhere, grab the résumé, copy the email.
const CommandPalette = ({ open, ...props }) => <AnimatePresence>{open && <Palette {...props} />}</AnimatePresence>;

export default CommandPalette;
