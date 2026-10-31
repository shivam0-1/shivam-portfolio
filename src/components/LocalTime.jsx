import { useEffect, useState } from "react";

const format = () =>
  new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date());

// Shows visitors what time it is for me, so they know when to expect a reply.
const LocalTime = () => {
  const [time, setTime] = useState(format);

  useEffect(() => {
    const id = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="flex items-center gap-2 text-sm text-muted">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
      </span>
      It’s <time className="tabular-nums text-text">{time}</time> for me in India (IST)
    </p>
  );
};

export default LocalTime;
