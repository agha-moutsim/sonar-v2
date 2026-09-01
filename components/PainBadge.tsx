"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type PainBadgeProps = {
  icon: LucideIcon;
  label: string;
};

export function PainBadge({ icon: Icon, label }: PainBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-[7px] text-[12px] text-white/75 backdrop-blur-sm"
    >
      <Icon size={12} strokeWidth={2.25} className="text-white/70" />
      <span>{label}</span>
    </motion.div>
  );
}
