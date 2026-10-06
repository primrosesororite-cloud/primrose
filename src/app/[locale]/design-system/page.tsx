import { setRequestLocale } from "next-intl/server";

/**
 * Page interne de référence (non liée dans la navigation publique).
 * Documente les tokens et composants de base de la charte Primrose,
 * à comparer visuellement à la maquette avant toute livraison.
 */

const SWATCHES = [
  { name: "primrose-green", hex: "#81A484", usage: "Fonds sauge, pastille active, icônes" },
  { name: "primrose-green-dark", hex: "#3F5B45", usage: "Titres, logo, boutons pleins" },
  { name: "primrose-cream", hex: "#EAF4EA", usage: "Fonds de section" },
  { name: "primrose-ink", hex: "#3A2E2A", usage: "Texte courant" },
  { name: "primrose-alert", hex: "#BE3E37", usage: "Bouton Contact – Besoin d'aide UNIQUEMENT" },
  { name: "primrose-white", hex: "#FFFFFF", usage: "Fond des cartes" },
  { name: "primrose-charcoal", hex: "#5F6255", usage: "Bandeau sous le footer (Retour en haut)" },
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
  <section className="border-t border-primrose-ink/10 py-10">
  <h2 className="font-serif text-2xl text-primrose-green-dark">{title}</h2>
  <div className="mt-6">{children}</div>
  </section>
  );
}

export default async function DesignSystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
  <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
  <h1 className="font-serif text-3xl text-primrose-green-dark md:text-4xl">
  Design system – Primrose
  </h1>
  <p className="mt-2 text-primrose-ink/80">
  Référence interne des tokens et composants. Page non listée dans la navigation publique.
  </p>

  <Section title="Couleurs">
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {SWATCHES.map((s) => (
  <div key={s.name} className="overflow-hidden rounded-card shadow-card">
  <div
  className="h-16"
  style={{ backgroundColor: s.hex }}
  aria-hidden
  />
  <div className="bg-primrose-white p-3">
  <p className="font-mono text-sm text-primrose-ink">{s.name}</p>
  <p className="font-mono text-xs text-primrose-ink/60">{s.hex}</p>
  <p className="mt-1 text-xs text-primrose-ink/70">{s.usage}</p>
  </div>
  </div>
  ))}
  </div>
  </Section>

  <Section title="Typographie">
  <div className="space-y-3">
  <h1 className="font-serif text-4xl text-primrose-green-dark">Titre H1 — Playfair Display</h1>
  <h2 className="font-serif text-3xl text-primrose-green-dark">Titre H2 — Playfair Display</h2>
  <h3 className="font-serif text-2xl text-primrose-green-dark">Titre H3 — Playfair Display</h3>
  <p className="font-sans text-base text-primrose-ink">
  Corps de texte — Inter. Un monde sans violences de genre. Ensemble, pour le rétablissement.
  </p>
  <p className="font-sans text-sm text-primrose-ink/70">
  Texte secondaire — Inter, 14px, opacité réduite.
  </p>
  </div>
  </Section>

  <Section title="Boutons">
  <div className="flex flex-wrap items-center gap-3">
  <button className="rounded-full bg-primrose-green-dark px-6 py-3 text-sm font-medium text-primrose-white hover:bg-primrose-green-dark/90">
  Bouton principal
  </button>
  <button className="rounded-full border border-primrose-green-dark px-6 py-3 text-sm font-medium text-primrose-green-dark hover:bg-primrose-cream">
  Bouton secondaire
  </button>
  <button className="rounded-full bg-primrose-alert px-6 py-3 text-sm font-medium text-primrose-white hover:bg-primrose-alert/90">
  Contact – Besoin d&apos;aide
  </button>
  <button disabled className="rounded-full bg-primrose-green-dark px-6 py-3 text-sm font-medium text-primrose-white opacity-60">
  Désactivé
  </button>
  </div>
  </Section>

  <Section title="Cartes">
  <div className="grid gap-6 sm:grid-cols-2">
  <article className="rounded-card bg-primrose-white p-6 shadow-card">
  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primrose-green/15 text-primrose-green-dark">
  ✓
  </span>
  <h3 className="mt-3 font-serif text-lg text-primrose-green-dark">Titre de carte</h3>
  <p className="mt-1 text-sm text-primrose-ink/80">
  Fond blanc, rayon 16px (rounded-card), ombre douce (shadow-card), icône verte.
  </p>
  </article>
  </div>
  </Section>

  <Section title="Badges">
  <div className="flex flex-wrap gap-2">
  <span className="rounded-full bg-primrose-green/15 px-3 py-1 text-xs font-medium text-primrose-green-dark">
  Nouveau
  </span>
  <span className="rounded-full bg-primrose-cream px-3 py-1 text-xs font-medium text-primrose-ink">
  En cours
  </span>
  <span className="rounded-full bg-primrose-green px-3 py-1 text-xs font-medium text-primrose-ink">
  Traité
  </span>
  <span className="rounded-full bg-primrose-alert/15 px-3 py-1 text-xs font-medium text-primrose-alert">
  Urgent
  </span>
  </div>
  </Section>

  <Section title="Champs de formulaire">
  <div className="max-w-sm space-y-4">
  <div>
  <label htmlFor="ds-input" className="text-sm font-medium text-primrose-ink">
  Champ texte
  </label>
  <input
  id="ds-input"
  placeholder="exemple@courriel.com"
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 bg-primrose-white px-3 py-2 text-sm"
  />
  </div>
  <div>
  <label htmlFor="ds-textarea" className="text-sm font-medium text-primrose-ink">
  Zone de texte
  </label>
  <textarea
  id="ds-textarea"
  rows={3}
  className="mt-1 w-full rounded-lg border border-primrose-ink/15 bg-primrose-white px-3 py-2 text-sm"
  />
  </div>
  <p className="text-xs text-primrose-ink/60">
  Focus clavier : contour vert foncé de 2px (voir :focus-visible dans globals.css).
  </p>
  </div>
  </Section>

  <Section title="Alertes">
  <div className="space-y-3">
  <p className="rounded-2xl bg-primrose-cream p-4 text-sm text-primrose-green-dark">
  Message de confirmation — fond crème, texte vert foncé.
  </p>
  <p role="alert" className="rounded-2xl bg-primrose-alert/10 p-4 text-sm text-primrose-alert">
  Message d&apos;erreur — texte rouge, réservé aux formulaires et à l&apos;urgence.
  </p>
  </div>
  </Section>

  <Section title="Bandeau sombre">
  <div className="rounded-card bg-primrose-charcoal p-4 text-center">
  <span className="rounded-full bg-primrose-white px-4 py-2 text-sm font-medium text-primrose-green-dark">
  Retour en haut
  </span>
  </div>
  </Section>
  </div>
  );
}
