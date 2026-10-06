"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Titre révélé mot à mot (remontée depuis un masque) au défilement. */
export function RevealText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  const shouldReduceMotion = useReducedMotion();
  const state = shouldReduceMotion ? "visible" : "hidden";

  return (
    <motion.span
      className={className}
      initial={state}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.06 }}
    >
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "105%", opacity: 0 },
                visible: shouldReduceMotion
                  ? { y: "0%", opacity: 1 }
                  : { y: "0%", opacity: 1, transition: { duration: 0.65, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 && " "}
        </Fragment>
      ))}
    </motion.span>
  );
}
