"use client";

import { useRef } from "react";
import { BrandText } from "@/components/brand-text";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

function Word({
  children,
  progress,
  range,
  still,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  still: boolean;
}) {
  const opacity = useTransform(progress, range, still ? [1, 1] : [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      <BrandText>{children}</BrandText>
    </motion.span>
  );
}

/**
 * Texte qui « s'allume » mot à mot au fil du défilement : la lecture suit
 * le geste de l'utilisateur. Le texte reste entier pour les lecteurs d'écran.
 * Même structure DOM avec ou sans mouvement réduit (pas d'écart d'hydratation).
 */
export function ScrollHighlightText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, index) => (
          <span key={`${word}-${index}`}>
            <Word
              progress={scrollYProgress}
              range={[index / words.length, (index + 1) / words.length]}
              still={!!shouldReduceMotion}
            >
              {word}
            </Word>
            {index < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </span>
  );
}
