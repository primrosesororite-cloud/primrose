"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { BrandText } from "@/components/brand-text";

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
              className="inline-block origin-bottom-left"
              variants={{
                hidden: { y: "110%", rotate: 6, opacity: 0, filter: "blur(8px)" },
                visible: shouldReduceMotion
                  ? { y: "0%", rotate: 0, opacity: 1, filter: "blur(0px)" }
                  : {
                      y: "0%",
                      rotate: 0,
                      opacity: 1,
                      filter: "blur(0px)",
                      transition: { duration: 0.7, ease: EASE },
                    },
              }}
            >
              <BrandText>{word}</BrandText>
            </motion.span>
          </span>
          {index < words.length - 1 && " "}
        </Fragment>
      ))}
    </motion.span>
  );
}
