/** Chevron sauge et deux bandes qui convergent vers le sceau (fond statique). */
export function HeroBands() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] overflow-hidden sm:h-[27rem]">
      <div className="absolute inset-0 bg-primrose-green/75 [clip-path:polygon(0_0,100%_0,100%_60%,50%_100%,0_60%)]" />
      <div className="absolute left-1/2 top-[52%] h-3 w-[72%] -translate-x-[80%] -translate-y-1/2 -rotate-[15deg] rounded-full bg-primrose-forest/45 sm:h-4" />
      <div className="absolute left-1/2 top-[52%] h-3 w-[72%] translate-x-[8%] -translate-y-1/2 rotate-[15deg] rounded-full bg-primrose-forest/45 sm:h-4" />
    </div>
  );
}
