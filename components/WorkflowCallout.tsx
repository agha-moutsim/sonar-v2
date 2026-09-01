"use client";

import { motion } from "framer-motion";

type WorkflowCalloutProps = {
  side: "left" | "right";
  lines: [string, string];
  delay?: number;
};

/**
 * Renders the two-line label plus a short elbowed connector line that draws
 * itself (via SVG stroke-dashoffset) and ends in a small filled node.
 * Positioned by the parent (WorkflowScene) via absolute inset classes.
 */
export function WorkflowCallout({ side, lines, delay = 0 }: WorkflowCalloutProps) {
  const isLeft = side === "left";

  // A simple elbow: horizontal run out from the text, then a short diagonal
  // down/across toward the platform, ending in a node.
  const path = isLeft ? "M0,4 H34 L64,34" : "M64,4 H30 L0,34";

  return (
    <div
      className={`flex items-start gap-3 ${isLeft ? "flex-row" : "flex-row-reverse text-right"}`}
    >
      <p className="max-w-[150px] text-[12.5px] leading-snug text-white/60">
        {lines.map((line, li) => (
          <span key={li} className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: delay + li * 0.09 }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </p>

      <svg
        viewBox="0 0 64 40"
        className="mt-1 h-10 w-16 flex-shrink-0 overflow-visible"
        fill="none"
      >
        <motion.path
          d={path}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
          strokeDasharray="1 1"
          pathLength={1}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.7, ease: "easeInOut", delay: delay + 0.1 }}
        />
        {[0, 1].map((ring) => (
          <motion.circle
            key={`pulse-${ring}`}
            cx={isLeft ? 64 : 0}
            cy="34"
            r="3"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ scale: 1, opacity: 0 }}
            whileInView={{ scale: 2.8, opacity: [0, 0.5, 0] }}
            viewport={{ once: false, margin: "-20% 0px" }}
            transition={{
              duration: 2.4,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 1.6,
              delay: delay + 1 + ring * 1.2,
              opacity: { duration: 2.4, times: [0, 0.2, 1], repeat: Infinity, repeatDelay: 1.6, delay: delay + 1 + ring * 1.2 },
            }}
          />
        ))}
        <motion.circle
          cx={isLeft ? 64 : 0}
          cy="34"
          r="3"
          fill="white"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.3, delay: delay + 0.7 }}
        />
      </svg>
    </div>
  );
}
