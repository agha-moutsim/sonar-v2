"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { PainBadge } from "./PainBadge";

const headingLines = ["Meet SONAR.", "Simple workflow that just works."];

export function SolutionIntro() {
  return (
    <div className="relative z-10 mx-auto flex max-w-[620px] flex-col items-center px-6 text-center">
      <PainBadge icon={Sparkles} label="Here's A Solution" />

      <h2 className="mt-5 flex flex-col text-[clamp(28px,5vw,46px)] font-medium leading-[1.1] tracking-tight text-white">
        {headingLines.map((line, i) => (
          <span key={line} className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block"
              initial={{ y: "105%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h2>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="mt-4 text-[14px] leading-relaxed text-white/50"
      >
        SONAR is revolutionizing Web3 with a decentralized identity protocol
        designed to make crypto easy and accessible for everyone. We&rsquo;re
        building cutting-edge solutions to break down barriers to Web3. At the
        heart of our mission are SONAR IDs, enabling seamless crypto
        transactions with easy-to-remember usernames, ditching those confusing
        and long wallet addresses. Learn more below.
      </motion.p>
    </div>
  );
}
