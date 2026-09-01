const paragraphs = [
  "SONAR IDs are decentralized Web3 identities that let you send and receive crypto using simple and unique usernames instead of lengthy 0x wallet addresses.",
  "A SONAR ID allows you to manage wallet addresses across multiple chains by linking them all to one easy-to-remember username. Simply enter the recipient username when sending funds, and it will automatically recognize the correct chain for the transaction.",
  "Forget about the confusion of Web3 identities that rely on domain extensions like .ETH, .XYZ, or .NFT and enjoy a seamless and secure transaction experience.",
  "Plus, SONAR IDs can help shield you from common crypto-related scams like address poisoning, making every on-chain transaction safer and more secure.",
];

export function SonarIds() {
  return (
    <section id="sonar-ids" className="relative overflow-hidden bg-black">
      <div className="relative mx-auto w-full max-w-[1440px] px-6 py-20 sm:px-10 lg:px-16 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-10 xl:gap-12">
          {/* left — content */}
          <div className="lg:order-1">
            <h2 className="font-display text-[clamp(3.2rem,9.5vw,8.5rem)] font-black uppercase leading-[0.86] tracking-[-0.045em]">
              <span className="block text-white">Sonar</span>
              <span
                className="block text-transparent"
                style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.28)" }}
              >
                IDs
              </span>
            </h2>

            <div className="mt-8 max-w-[54ch] space-y-6 lg:mt-10">
              <p className="text-lg leading-relaxed text-white/75">
                {paragraphs[0]}
              </p>
              <p className="text-[15px] leading-[1.8] text-white/50">
                {paragraphs[1]}
              </p>
              <p className="text-[15px] leading-[1.8] text-white/50">
                {paragraphs[2]}
              </p>
              <p className="text-[15px] leading-[1.8] text-white/50">
                {paragraphs[3]}
              </p>
            </div>
          </div>

          {/* right — free video */}
          <div className="relative order-first lg:order-2">
            <video
              className="w-full lg:scale-[1.08] lg:origin-right"
              src="/videos/sonar-ids.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
