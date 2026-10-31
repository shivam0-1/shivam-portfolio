import { useState } from "react";
import { motion } from "framer-motion";

// Explorable architecture sketches, built only from what each project contains.
// Dashed boxes are planned extensions, not shipped features.

const diagrams = {
  rozgarwala: {
    label: "Architecture of RozgarWala",
    intro: "Customers and workers share one interface; requests flow through OTP sign-in and a Node API into MongoDB.",
    nodes: [
      { id: "customer", x: 8, y: 40, label: "Customer", sub: "find · hire", info: "Customers use the platform to find and hire skilled workers." },
      { id: "worker", x: 8, y: 140, label: "Worker", sub: "listed skills", info: "Skilled labourers are listed so customers can find them." },
      { id: "ui", x: 180, y: 40, label: "React UI", sub: "Tailwind CSS", strong: true, info: "One responsive React + Tailwind interface used by both customers and workers." },
      { id: "otp", x: 352, y: 40, label: "OTP auth", sub: "sign-in", info: "OTP-based authentication, so users sign in without passwords." },
      { id: "api", x: 352, y: 140, label: "Node API", sub: "roles · requests", strong: true, info: "Node.js backend that handles user roles and job requests." },
      { id: "db", x: 300, y: 224, w: 236, h: 84, label: "MongoDB", items: ["Worker", "JobRequest", "User/role"], info: "Backend models for workers, job requests and user roles." },
      { id: "pay", x: 500, y: 140, w: 110, label: "Payments", planned: true, info: "Planned — the models were structured so digital payments can be added later." },
      { id: "lang", x: 500, y: 190, w: 110, label: "Multilingual", planned: true, info: "Planned — the models were structured so multilingual support can be added later." },
    ],
    wires: [
      { d: "M 140 60 H 180", from: "customer", to: "ui" },
      { d: "M 140 160 H 246 V 80", from: "worker", to: "ui" },
      { d: "M 312 60 H 352", from: "ui", to: "otp" },
      { d: "M 418 80 V 140", from: "otp", to: "api" },
      { d: "M 418 180 V 224", from: "api", to: "db" },
      { d: "M 484 160 H 500", from: "api", to: "pay", planned: true },
      { d: "M 492 160 V 210 H 500", from: "api", to: "lang", planned: true },
    ],
  },
  cleen: {
    label: "Structure of the Cleen Foundation site",
    intro: "Four pages, one shared set of components, laid out for every screen size.",
    nodes: [
      ...["Home", "About", "Contact", "Donations"].map((p, i) => ({
        id: p.toLowerCase(),
        x: 8 + i * 150,
        y: 40,
        w: 110,
        label: `/${p.toLowerCase()}`,
        sub: "page",
        info:
          p === "Donations"
            ? "Donations page, built from the same shared components as the rest of the site."
            : `${p} page, built from the shared component set.`,
      })),
      { id: "shared", x: 200, y: 150, w: 220, h: 50, label: "Shared components", sub: "reused on every page", strong: true, info: "Reusable UI components shared by every page, so the site stays consistent and easy to extend." },
      { id: "responsive", x: 120, y: 240, w: 380, h: 64, label: "React · Tailwind layouts", items: [["mobile", 72], ["tablet", 104], ["desktop", 156]], info: "Responsive layouts so every page works on phones, tablets and desktops." },
    ],
    wires: [
      ...["home", "about", "contact", "donations"].map((id, i) => ({ d: `M ${62 + i * 150} 80 V 120 H 310 V 150`, from: id, to: "shared" })),
      { d: "M 310 200 V 240", from: "shared", to: "responsive" },
    ],
  },
};

const Node = ({ node, active, dim, onActivate, delay }) => {
  const { x, y, w = 132, h = 40, label, sub, items, planned, strong } = node;
  const stroke = active || strong ? "var(--signal)" : "var(--line-strong)";
  let cursor = x + 12;

  return (
    <motion.g
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      tabIndex={0}
      role="button"
      aria-pressed={active}
      aria-label={`${label}: ${node.info}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onActivate();
        }
      }}
      className="cursor-pointer outline-none"
    >
      <g style={{ opacity: dim ? 0.5 : 1, transition: "opacity .25s" }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="8"
        fill={active ? "color-mix(in oklab, var(--signal) 14%, var(--surface))" : "var(--surface)"}
        stroke={stroke}
        strokeWidth={active ? 1.5 : 1}
        strokeDasharray={planned ? "4 4" : undefined}
      />
      <text
        x={x + 12}
        y={sub || items ? y + 18 : y + h / 2 + 4}
        fill={planned && !active ? "var(--muted)" : "var(--text)"}
        fontSize="12"
        fontWeight="500"
        fontFamily="var(--font-sans)"
      >
        {label}
      </text>
      {sub && (
        <text x={x + 12} y={y + 32} fill="var(--muted)" fontSize="10" fontFamily="var(--font-sans)">
          {sub}
        </text>
      )}
      {items?.map((item) => {
        const [name, iw] = Array.isArray(item) ? item : [item, 66];
        const ix = cursor;
        cursor += iw + 8;
        return (
          <g key={name}>
            <rect x={ix} y={y + h - 34} width={iw} height={24} rx="5" fill="var(--bg)" stroke="var(--line)" />
            <text x={ix + 7} y={y + h - 18} fill="var(--muted)" fontSize="10" fontFamily="var(--font-sans)">
              {name}
            </text>
          </g>
        );
      })}
      </g>
    </motion.g>
  );
};

const Schematic = ({ id, hint }) => {
  const { label, intro, nodes, wires } = diagrams[id];
  const [active, setActive] = useState(null);
  const current = nodes.find((n) => n.id === active);
  const linked = new Set(
    active ? wires.flatMap((w) => (w.from === active || w.to === active ? [w.from, w.to] : [])) : []
  );

  return (
    <div onMouseLeave={() => setActive(null)}>
      {/* Keeps diagram text legible on phones; scrolls sideways instead of shrinking */}
      <div className="overflow-x-auto [mask-image:linear-gradient(to_right,black_80%,transparent)] lg:[mask-image:none]">
        <svg viewBox="0 0 620 320" role="group" aria-label={`${label}. ${intro}`} className="h-auto w-full min-w-130">
          {wires.map((w) => {
            const hot = active && (w.from === active || w.to === active);
            return (
              <path
                key={w.d}
                d={w.d}
                fill="none"
                stroke={w.planned && !hot ? "var(--line-strong)" : "var(--signal)"}
                strokeOpacity={active && !hot ? 0.2 : w.planned ? 1 : 0.75}
                strokeWidth={hot ? 1.75 : 1}
                strokeDasharray={w.planned ? "2 4" : "4 4"}
                className={w.planned ? undefined : "flow-line"}
                style={{ transition: "stroke-opacity .25s" }}
              />
            );
          })}
          {nodes.map((n, i) => (
            <Node
              key={n.id}
              node={n}
              delay={i * 0.04}
              active={n.id === active}
              dim={active && n.id !== active && !linked.has(n.id)}
              onActivate={() => setActive(n.id)}
            />
          ))}
        </svg>
      </div>
      <div className="mt-4 min-h-14 rounded-xl border border-line bg-surface px-4 py-3 text-sm" aria-live="polite">
        {current ? (
          <p>
            <span className="font-medium">{current.label}</span>
            <span className="text-muted"> — {current.info}</span>
          </p>
        ) : (
          <p className="text-muted">
            {hint}
            <span className="lg:hidden"> Swipe to see the full diagram.</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Schematic;
