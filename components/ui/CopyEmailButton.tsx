"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: fall back to the email app.
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <>
      <button type="button" onClick={copy} className="btn">
        <Icon name={copied ? "check" : "copy"} className={`size-4 ${copied ? "text-accent" : ""}`} />
        {copied ? "Copied" : "Copy email"}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </>
  );
}
