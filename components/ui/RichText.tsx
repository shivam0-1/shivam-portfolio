import { parseRich } from "@/lib/rich-text";

type Props = {
  text: string;
  /** Classes for *emphasised* words. */
  emClassName?: string;
};

export function RichText({ text, emClassName = "not-italic text-text" }: Props) {
  return (
    <>
      {parseRich(text).map((token, i) => {
        if (token.kind === "em") {
          return (
            <em key={i} className={emClassName}>
              {token.value}
            </em>
          );
        }
        if (token.kind === "link") {
          const external = /^https?:\/\//.test(token.href);
          return (
            <a
              key={i}
              href={token.href}
              className="link"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {token.value}
              {external && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          );
        }
        return token.value;
      })}
    </>
  );
}
