"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useFinePointer } from "@/components/motion/use-fine-pointer";

const RESSORT = { stiffness: 110, damping: 18, mass: 0.8 };

/**
 * L'élément suit doucement la souris et s'incline en 3D vers elle, comme un
 * objet posé devant la page. Souris uniquement, jamais sous mouvement réduit.
 */
export function PointerParallax({
  children,
  profondeur = 16,
  className,
}: {
  children: React.ReactNode;
  profondeur?: number;
  className?: string;
}) {
  const fine = useFinePointer();
  const x = useSpring(0, RESSORT);
  const y = useSpring(0, RESSORT);
  const rotateY = useTransform(x, (v) => v * 0.5);
  const rotateX = useTransform(y, (v) => -v * 0.5);

  useEffect(() => {
    if (!fine) return;
    function bouge(event: PointerEvent) {
      x.set((event.clientX / window.innerWidth - 0.5) * profondeur * 2);
      y.set((event.clientY / window.innerHeight - 0.5) * profondeur * 2);
    }
    window.addEventListener("pointermove", bouge, { passive: true });
    return () => window.removeEventListener("pointermove", bouge);
  }, [fine, profondeur, x, y]);

  return (
    <motion.div
      style={fine ? { x, y, rotateX, rotateY, transformPerspective: 800 } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
