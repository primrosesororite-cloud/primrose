"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { fadeUp, reducedMotionVariant } from "@/lib/motion";

/**
 * Enfant d'un `<AnimateIn variants={stagger}>`. Contrairement à AnimateIn, il
 * ne déclenche pas sa propre animation : il hérite de l'état du parent, ce
 * qui produit une vraie cascade (un élément après l'autre) au lieu d'une
 * apparition simultanée.
 */
export function StaggerItem({
  children,
  variants = fadeUp,
  className,
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div className={className} variants={shouldReduceMotion ? reducedMotionVariant : variants}>
      {children}
    </motion.div>
  );
}
