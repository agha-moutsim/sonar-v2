"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Target, ShieldCheck, Heart } from "lucide-react";
import { featureHighlights, type FeatureHighlightData } from "../data/content";

const iconMap: Record<FeatureHighlightData["icon"], typeof Clock> = {
  clock: Clock,
  target: Target,
  shield: ShieldCheck,
  heart: Heart,
};

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1100;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {n}
    </span>
  );
}

function renderLine(line: string) {
  return line.split(/(\d+)/).map((part, i) =>
    /^\d+$/.test(part) ? <AnimatedNumber key={i} value={parseInt(part, 10)} /> : part
  );
}

export function FeatureHighlights() {
  return (
    <div className="mx-auto mt-10 grid w-full max-w-[840px] grid-cols-2 gap-x-6 gap-y-9 px-6 sm:grid-cols-4 sm:gap-x-4">
      {featureHighlights.map((item, i) => {
        const Icon = iconMap[item.icon];
        const lines = [item.title, item.subtitle];
        return (
          <motion.div
            key={item.id}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col items-center gap-2.5 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.09 }}
              whileHover={{ scale: 1.12 }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors duration-300 group-hover:border-white/25 group-hover:text-white/90"
            >
              <Icon size={14} strokeWidth={1.75} />
            </motion.div>
            <p className="text-[13px] leading-snug text-white/60 transition-colors duration-300 group-hover:text-white/90">
              {lines.map((line, li) => (
                <span key={li} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    whileInView={{ y: "0%" }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{
                      duration: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.09 + 0.12 + li * 0.08,
                    }}
                  >
                    {renderLine(line)}
                  </motion.span>
                </span>
              ))}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
