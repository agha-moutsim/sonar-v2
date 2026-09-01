"use client";

import { motion } from "framer-motion";
import { problemCards } from "../data/content";
import { ProblemCard } from "./ProblemCard";

export function ProblemGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto mt-14 w-full max-w-[920px] rounded-2xl border border-dashed border-white/[0.14] bg-white/[0.015]"
    >
      <div className="flex flex-col sm:flex-row">
        {problemCards.map((card, i) => (
          <ProblemCard
            key={card.id}
            card={card}
            index={i}
            isLast={i === problemCards.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
}
