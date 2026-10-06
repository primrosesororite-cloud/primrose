"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SubmitButton({
  pending,
  children,
  className,
  variant = "primary",
}: {
  pending: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "alert";
}) {
  return (
  <motion.button
  type="submit"
  disabled={pending}
  transition={{ duration: 0.15 }}
  className={cn(
"w-full rounded-full px-6 py-3 text-sm font-medium text-primrose-white transition-colors disabled:opacity-60",
  variant === "primary"
  ? "bg-primrose-forest hover:bg-primrose-forest/90"
  : "bg-primrose-alert hover:bg-primrose-alert/90",
  className
  )}
  >
  {children}
  </motion.button>
  );
}
