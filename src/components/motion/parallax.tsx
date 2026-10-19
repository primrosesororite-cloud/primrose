"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Parallaxe douce liée au défilement : l'élément glisse de `distance` px
 * (et s'estompe légèrement) pendant que sa section quitte l'écran. Seuls
 * transform et opacity sont animés, sans écouteur de scroll manuel.
 */
export function Parallax({
  children,
  distance = 60,
  fade = false,
  className,
}: {
  children: React.ReactNode;
  distance?: number;
  fade?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const y = useTransform(progress, [0, 1], [0, distance]);
  const opacity = useTransform(progress, [0, 0.8], [1, fade ? 0.35 : 1]);

  return (
    <motion.div ref={ref} style={shouldReduceMotion ? undefined : { y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}
