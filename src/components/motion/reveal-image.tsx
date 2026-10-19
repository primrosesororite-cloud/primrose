"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Image dévoilée par un rideau vertical, avec un léger dézoom, à son entrée à l'écran. */
export function RevealImage({ children, className }: { children: React.ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={shouldReduceMotion ? false : { clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <motion.div
        className="relative h-full w-full"
        initial={shouldReduceMotion ? false : { scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
