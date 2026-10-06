import { ImageResponse } from "next/og";

export const alt = "Primrose – La Sororité Active";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#EAF4EA",
        }}
      >
        <div
          style={{
            display: "flex",
            height: 140,
            width: 140,
            borderRadius: "50%",
            background: "#3F5B45",
            color: "#FFFFFF",
            fontSize: 72,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          P
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 56,
            color: "#3F5B45",
          }}
        >
          Primrose
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 28,
            color: "#3A2E2A",
          }}
        >
          La Sororité Active
        </div>
      </div>
    ),
    { ...size }
  );
}
