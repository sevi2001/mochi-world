
"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

export default function MagicalPageTransition({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      className="magical-page-transition"
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 16 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
