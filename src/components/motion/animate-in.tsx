"use client";

import { motion, type Variants } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

// prefers-reduced-motion est géré globalement par MotionProvider
// (MotionConfig reducedMotion="user") : déplacements coupés, fondu conservé.
export function AnimateIn({
  children,
  variants = fadeInUp,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
