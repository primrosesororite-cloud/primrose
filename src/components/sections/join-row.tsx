import { ArrowRight, type LucideIcon } from "lucide-react";

/** Contenu d'une rangée « rejoindre » : le fond sauge balaie la ligne au survol/focus. */
export function JoinRowContent({
  Icon,
  titre,
  texte,
}: {
  Icon: LucideIcon;
  titre: string;
  texte: string;
}) {
  return (
  <>
  <span
  aria-hidden
  className="absolute inset-0 bg-primrose-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
  />
  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primrose-forest/20 text-primrose-forest transition-colors duration-300 group-hover:border-primrose-forest/40 group-hover:bg-primrose-white">
  <Icon aria-hidden className="h-5 w-5" strokeWidth={1.7} />
  </span>
  <span className="relative flex-1 text-left">
  <span className="block font-serif text-2xl text-primrose-ink md:text-[1.9rem]">{titre}</span>
  <span className="mt-1 block text-sm leading-relaxed text-primrose-ink/80 md:text-base">{texte}</span>
  </span>
  <span className="relative hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primrose-forest/25 text-primrose-forest transition-all duration-300 group-hover:border-primrose-forest group-hover:bg-primrose-forest group-hover:text-primrose-white sm:flex">
  <ArrowRight aria-hidden className="h-4 w-4" />
  </span>
  </>
  );
}

export const joinRowClass =
"group relative flex w-full items-center gap-5 overflow-hidden px-3 py-6 md:gap-8 md:px-5 md:py-7";
