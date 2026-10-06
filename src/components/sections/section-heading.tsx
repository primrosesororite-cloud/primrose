import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow && (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.18em]",
            dark ? "text-primrose-white/80" : "text-primrose-forest"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "mt-3 font-serif text-3xl leading-[1.12] md:text-[2.6rem]",
          dark ? "text-primrose-white" : "text-primrose-forest"
        )}
      >
        {title}
      </h2>
      {text && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            dark ? "text-primrose-white/85" : "text-primrose-ink/80"
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}
