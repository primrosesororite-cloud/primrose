"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/components/motion/use-fine-pointer";

const TILT_SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

/**
 * Carte qui s'incline en 3D vers le curseur, avec un halo de lumière qui le
 * suit. Uniquement à la souris : au doigt, la carte reste immobile.
 */
export function TiltCard({
  children,
  className,
  intensity = 7,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const glow = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), TILT_SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), TILT_SPRING);
  const glowOpacity = useSpring(glow, { stiffness: 200, damping: 30 });
  const spotX = useTransform(px, (v) => `${v * 100}%`);
  const spotY = useTransform(py, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${spotX} ${spotY}, rgb(255 255 255 / 0.55), transparent 45%)`;

  function onMove(event: PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  function onLeave() {
    px.set(0.5);
    py.set(0.5);
    glow.set(0);
  }

  if (!fine) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={() => glow.set(1)}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn("relative [transform-style:preserve-3d]", className)}
    >
      {children}
      <motion.div
        aria-hidden
        style={{ background: spotlight, opacity: glowOpacity }}
        className="pointer-events-none absolute inset-0 rounded-card mix-blend-soft-light"
      />
    </motion.div>
  );
}
