import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiCheck, FiCopy, FiGithub, FiLinkedin, FiMail, FiPhone, FiSend } from "react-icons/fi";
import { profile, sectionIndex } from "../data/portfolio";
import SectionHeader from "./ui/SectionHeader";
import Reveal from "./ui/Reveal";
import Accent from "./ui/Accent";
import Magnetic from "./ui/Magnetic";

const { VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY } = import.meta.env;
const emailConfigured = [VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY].every((value) => value?.trim());

const channels = [
  { icon: FiLinkedin, label: "LinkedIn", value: profile.linkedinHandle, href: profile.linkedin },
  { icon: FiGithub, label: "GitHub", value: profile.githubHandle, href: profile.github },
  { icon: FiPhone, label: "Phone", value: profile.phone, href: profile.phoneHref },
];

const topics = [
  { label: "Internship", placeholder: "Tell me about the internship — team, stack and dates…" },
  { label: "Full-time role", placeholder: "Tell me about the role and the team…" },
  { label: "Freelance project", placeholder: "What are you building, and by when?" },
  { label: "Just saying hi", placeholder: "Hello! What’s on your mind?" },
];

// A check mark that draws itself inside a circle.
const DrawnCheck = () => {
  const reduced = useReducedMotion();
  return (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <motion.circle
      cx="12"
      cy="12"
      r="10"
      initial={reduced ? false : { pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: reduced ? 0 : 0.5, ease: "easeOut" }}
    />
    <motion.path
      d="M7.5 12.5l3 3 6-6.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={reduced ? false : { pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.45, ease: "easeOut" }}
    />
  </svg>
  );
};

const MAX = 1000;
const empty = { from_name: "", from_email: "", message: "" };

// `user-invalid` only applies after the visitor has interacted, so the form never starts out red.
const fieldClass =
  "peer mt-3 w-full resize-y rounded-lg border border-line-strong bg-bg/60 px-4 py-3 text-base outline-none transition-colors placeholder:text-muted/60 focus:border-signal focus:ring-2 focus:ring-signal/10 disabled:opacity-60 user-invalid:border-warm";

const Field = ({ label, id, textarea, error, ...props }) => {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className="group">
      <label htmlFor={id} className="font-mono text-xs text-muted transition-colors group-focus-within:text-text">
        {label}
      </label>
      <Tag id={id} name={id} aria-describedby={`${id}-error${textarea ? " message-count" : ""}`} {...props} className={fieldClass} />
      {error && <p id={`${id}-error`} className="mt-2 hidden text-xs text-warm peer-user-invalid:block">{error}</p>}
    </div>
  );
};

const Contact = () => {
  const [form, setForm] = useState(empty);
  const [topic, setTopic] = useState(topics[0]);
  const [status, setStatus] = useState("idle");
  const [copied, setCopied] = useState(false);
  const sending = useRef(false);
  const copyTimer = useRef(null);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const onChange = (e) => {
    e.target.setCustomValidity("");
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (!sending.current) setStatus("idle");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending.current) return;
    for (const name of ["from_name", "message"]) {
      if (!form[name].trim()) {
        const field = e.currentTarget.elements.namedItem(name);
        field.setCustomValidity(name === "from_name" ? "Please tell me your name." : "Please write a short message.");
        field.reportValidity();
        return;
      }
    }
    const values = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
    if (!emailConfigured) {
      const subject = encodeURIComponent(`${topic.label} — ${values.from_name}`);
      const body = encodeURIComponent(`${values.message}\n\nFrom: ${values.from_name}\nEmail: ${values.from_email}`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus("draft");
      return;
    }
    sending.current = true;
    setStatus("sending");
    try {
      // Same template variables as before; the topic is prefixed so it shows up without template changes.
      // Loaded on demand so the email SDK never weighs down the first page load.
      const { default: emailjs } = await import("@emailjs/browser");
      await emailjs.send(
        VITE_EMAILJS_SERVICE_ID,
        VITE_EMAILJS_TEMPLATE_ID,
        { ...values, topic: topic.label, message: `[${topic.label}]\n\n${values.message}` },
        { publicKey: VITE_EMAILJS_PUBLIC_KEY }
      );
      setStatus("success");
      setForm(empty);
    } catch {
      setStatus("error");
    } finally {
      sending.current = false;
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate mx-auto max-w-7xl overflow-x-clip px-4 py-28 sm:px-6 md:py-40 lg:px-10">
      <div aria-hidden="true" className="glow absolute -right-20 bottom-0 -z-10 h-[36rem] w-[36rem] opacity-70" />
      <SectionHeader
        id="contact-title"
        index={sectionIndex("contact")}
        label="Contact"
        note="Say hello"
        title={
          <>
            Let’s build something <Accent className="text-signal">worth shipping.</Accent>
          </>
        }
      >
        Hiring for an internship or junior role, or have a project in mind? Drop me a message.
      </SectionHeader>

      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-signal/25 bg-signal/5 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-signal"><span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" /> Open to opportunities</div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Start a conversation</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="break-all font-display text-2xl font-extrabold tracking-[-0.05em] underline decoration-line-strong decoration-1 underline-offset-8 transition-colors hover:text-signal hover:decoration-signal sm:text-3xl"
              >
                {profile.email}
              </a>
              <motion.button
                type="button"
                onClick={copyEmail}
                whileTap={{ scale: 0.92 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 font-mono text-xs text-muted transition-colors hover:border-signal hover:text-signal"
              >
                {copied ? <FiCheck className="text-signal" /> : <FiCopy />}
                <span aria-live="polite">{copied ? "Copied!" : "Copy"}</span>
              </motion.button>
            </div>
          </Reveal>

          <ul className="mt-12 divide-y divide-line border-y border-line">
            {channels.map(({ icon: Icon, label, value, href }, i) => (
              <Reveal as="li" key={label} delay={i * 0.05}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-5 transition-[padding] duration-300 hover:pl-2"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-muted transition-colors group-hover:border-signal/40 group-hover:text-signal"><Icon aria-hidden="true" /></span>
                  <span className="w-20 text-sm text-muted">{label}</span>
                  <span className="flex-1 truncate">{value}</span>
                  <FiArrowUpRight
                    aria-hidden="true"
                    className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
                  />
                </a>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            className="ticket overflow-hidden rounded-2xl p-6 sm:p-8"
            aria-describedby="form-status"
            aria-busy={status === "sending"}
          >
            <div className="mb-8 flex items-center justify-between gap-3 border-b border-line pb-5 font-mono text-[11px] text-muted"><span className="flex items-center gap-2"><FiMail className="text-signal" aria-hidden="true" /> New message</span><span>To: Shivam</span></div>
            <fieldset disabled={status === "sending"}>
              <legend className="font-mono text-xs text-muted">What’s this about?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {topics.map((t) => {
                  const on = t.label === topic.label;
                  return (
                    <button
                      key={t.label}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setTopic(t)}
                      className={`rounded-full border px-4 py-2 font-mono text-xs transition-colors ${
                        on ? "border-signal bg-signal text-signal-ink" : "border-line-strong text-muted hover:text-text"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label="Your name"
                  id="from_name"
                  autoComplete="name"
                  value={form.from_name}
                  onChange={onChange}
                  placeholder="Jane Doe"
                  required
                  disabled={status === "sending"}
                  maxLength={100}
                  error="Please tell me your name."
                />
                <Field
                  label="Your email"
                  id="from_email"
                  type="email"
                  autoComplete="email"
                  value={form.from_email}
                  onChange={onChange}
                  placeholder="jane@company.com"
                  required
                  disabled={status === "sending"}
                  maxLength={254}
                  error="That email doesn’t look quite right."
                />
              </div>
              <div>
                <Field
                  textarea
                  rows={4}
                  label="Message"
                  id="message"
                  value={form.message}
                  onChange={onChange}
                  placeholder={topic.placeholder}
                  maxLength={MAX}
                  required
                  disabled={status === "sending"}
                  error="A short message helps me reply properly."
                />
                <p
                  id="message-count"
                  className={`mt-2 text-right text-xs tabular-nums ${
                    form.message.length > MAX * 0.9 ? "text-warm" : "text-muted"
                  }`}
                >
                  {form.message.length} / {MAX}
                </p>
              </div>
            </div>

            {!emailConfigured && <p className="mt-5 text-xs leading-relaxed text-muted">This opens a draft in your email app. Review your message and send it there.</p>}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div id="form-status" role="status" aria-live="polite" className="min-h-6 text-sm">
                <AnimatePresence mode="wait">
                  {status === "sending" && <motion.p key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-muted">Sending your message…</motion.p>}
                  {status === "draft" && <motion.p key="draft" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-muted">Your email app can send this message. If it didn’t open, <a href={`mailto:${profile.email}`} className="text-text underline underline-offset-4">email me directly</a>.</motion.p>}
                  {status === "success" && (
                    <motion.p
                      key="ok"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-signal"
                    >
                      <DrawnCheck /> Message sent — thank you! I’ll get back to you soon.
                    </motion.p>
                  )}
                  {status === "error" && (
                    <motion.p key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-warm">
                      Couldn’t confirm delivery. Your message is still here — try again or <a href={`mailto:${profile.email}`} className="underline underline-offset-4">email me directly</a>.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <Magnetic>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn btn-accent group"
                >
                  {status === "sending" ? "Sending…" : emailConfigured ? "Send message" : "Open email draft"}
                  {/* The plane takes off while sending and lands back once done */}
                  <motion.span
                    aria-hidden="true"
                    className="inline-flex"
                    animate={
                      status === "sending"
                        ? { x: 28, y: -28, opacity: 0, rotate: -12 }
                        : { x: 0, y: 0, opacity: 1, rotate: 0 }
                    }
                    transition={{ duration: status === "sending" ? 0.5 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <FiSend className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </motion.span>
                </button>
              </Magnetic>
            </div>

          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
