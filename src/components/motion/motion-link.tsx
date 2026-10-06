"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";

/** `Link` (i18n-aware) animable avec les props Framer Motion (whileTap, whileHover…). */
export const MotionLink = motion.create(Link);
