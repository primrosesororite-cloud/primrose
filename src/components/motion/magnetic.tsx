"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer } from "@/components/motion/use-fine-pointer";

const MAGNET_SPRING = { stiffness: 260, damping: 18, mass: 0.5 };

/** Élément attiré par le curseur quand il s'en approche (boutons d'appel à l'action). */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const x = useSpring(useMotionValue(0), MAGNET_SPRING);
  const y = useSpring(useMotionValue(0), MAGNET_SPRING);

  function onMove(event: PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  if (!fine) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
