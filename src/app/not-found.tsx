import Link from "next/link";

/**
 * Filet de sécurité pour les chemins qui ne correspondent à aucun segment
 * [locale] (donc sans contexte next-intl disponible). Le 404 réellement vu
 * par les visiteurs est src/app/[locale]/not-found.tsx.
 */
export default function RootNotFound() {
  return (
    <html lang="fr">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          color: "#3A2E2A",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <p style={{ fontSize: "3rem", margin: 0, color: "#81A484" }}>404</p>
        <p style={{ marginTop: "0.5rem" }}>
          Page introuvable — Page not found
        </p>
        <Link href="/" style={{ marginTop: "1rem", color: "#3F5B45" }}>
          Primrose – La Sororité Active
        </Link>
      </body>
    </html>
  );
}
