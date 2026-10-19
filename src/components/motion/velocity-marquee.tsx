"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

/** Ramène v dans [min, max[ (boucle infinie sans saut visible). */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/**
 * Bandeau typographique géant qui défile en continu et accélère avec la
 * vitesse de défilement de la page (il change de sens quand on remonte).
 */
export function VelocityMarquee({
  children,
  baseSpeed = 2.2,
  className,
}: {
  children: React.ReactNode;
  baseSpeed?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const direction = useRef(-1);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (shouldReduceMotion) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = 1;
    else if (factor > 0) direction.current = -1;
    const move = direction.current * baseSpeed * (delta / 1000) * (1 + Math.abs(factor));
    baseX.set(baseX.get() + move);
  });

  return (
    <div className={className}>
      <motion.div aria-hidden style={{ x }} className="flex w-max whitespace-nowrap">
        {[0, 1, 2, 3].map((copy) => (
          <span key={copy} className="flex shrink-0">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
