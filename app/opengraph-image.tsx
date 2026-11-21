import { ImageResponse } from "next/og";
import { facts, profile } from "@/content/portfolio";

// The preview card shown when the site is shared (generated at build time).
export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ink = "#0b0b0a";
const paper = "#ede8df";
const muted = "#9c968b";
const line = "#262520";

export default function OpengraphImage() {
  const education = facts.find((f) => f.label === "Education")?.value ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: ink,
          color: paper,
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: muted }}>
          {profile.role}, {profile.location}
        </div>

        <div style={{ display: "flex", fontSize: 150, lineHeight: 1, letterSpacing: -6 }}>{profile.name}</div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${line}`,
            paddingTop: 30,
            fontSize: 26,
            color: muted,
          }}
        >
          <span>{education}</span>
          {profile.available && (
            <span style={{ display: "flex", color: paper }}>Open to opportunities</span>
          )}
        </div>
      </div>
    ),
    size,
  );
}
