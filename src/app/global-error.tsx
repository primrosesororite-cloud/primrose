"use client";

/**
 * Filet de secours ultime (remplace même le layout racine). Volontairement
 * minimal et sans dépendance (next-intl, styles) puisqu'il peut se déclencher
 * avant que ce contexte soit disponible.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
        <p>Une erreur est survenue — Something went wrong</p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "1rem",
            borderRadius: "9999px",
            background: "#3F5B45",
            color: "#FFFFFF",
            padding: "0.75rem 1.5rem",
            border: "none",
          }}
        >
          Réessayer — Try again
        </button>
      </body>
    </html>
  );
}
