import { Component } from "react";

// Keep the introduction available if an optional lazy-loaded visual fails.
export default class VisualBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="workspace-panel flex min-h-[420px] flex-col justify-center rounded-2xl border border-line-strong p-7 sm:min-h-[500px] sm:p-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">The stack / at a glance</span>
        <svg viewBox="0 0 300 210" className="mx-auto my-7 w-full max-w-[260px]" aria-hidden="true" focusable="false">
          <path d="M 55 130 L 150 78 L 245 130 L 150 182 Z" fill="var(--bg-raised)" stroke="var(--line-strong)" />
          <path d="M 55 110 L 150 58 L 245 110 L 150 162 Z" fill="var(--surface)" stroke="var(--line-strong)" />
          <path d="M 55 90 L 150 38 L 245 90 L 150 142 Z" fill="var(--surface)" stroke="var(--signal)" />
          <path d="M 134 79 L 120 89 L 134 97 M 165 80 L 179 89 L 165 98 M 155 73 L 143 105" fill="none" stroke="var(--signal)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-lg font-medium">One connected stack.</p>
        <p className="mt-3 font-mono text-xs leading-7 text-muted">React → Node.js → MongoDB<br />Connected through REST APIs.</p>
        <p className="mt-6 text-xs text-muted">The interactive preview couldn’t load.</p>
        <a href={typeof window === "undefined" ? "/" : window.location.href} onClick={(event) => { event.preventDefault(); window.location.reload(); }} className="mt-3 w-fit rounded-md border border-line-strong px-3 py-2 font-mono text-[11px] transition-colors hover:border-signal hover:text-signal">Reload workspace ↗</a>
      </div>
    );
  }
}
