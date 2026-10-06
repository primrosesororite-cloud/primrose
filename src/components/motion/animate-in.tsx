"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { fadeUp, reducedMotionVariant } from "@/lib/motion";

export function AnimateIn({
  children,
  variants = fadeUp,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      variants={shouldReduceMotion ? reducedMotionVariant : variants}
    >
      {children}
    </motion.div>
  );
}
