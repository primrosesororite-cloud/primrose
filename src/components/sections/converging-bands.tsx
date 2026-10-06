/** Deux bandes qui convergent vers la pointe du chevron (fond statique). */
export function ConvergingBands() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <span className="absolute bottom-10 right-1/2 h-1 w-[58%] rotate-[7deg] rounded-full bg-primrose-green/40 md:bottom-16 md:h-1.5" />
      <span className="absolute bottom-10 left-1/2 h-1 w-[58%] -rotate-[7deg] rounded-full bg-primrose-green/40 md:bottom-16 md:h-1.5" />
    </div>
  );
}
