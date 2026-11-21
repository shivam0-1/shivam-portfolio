// Parses the small markup allowed in content/portfolio.ts:
//   *emphasis*          → emphasised text
//   [text](#id or url)  → link
export type RichToken =
  | { kind: "text"; value: string }
  | { kind: "em"; value: string }
  | { kind: "link"; value: string; href: string };

const TOKEN = /(\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

export function parseRich(text: string): RichToken[] {
  return text
    .split(TOKEN)
    .filter(Boolean)
    .map((part): RichToken => {
      if (part.startsWith("*") && part.endsWith("*")) return { kind: "em", value: part.slice(1, -1) };
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) return { kind: "link", value: link[1], href: link[2] };
      return { kind: "text", value: part };
    });
}
