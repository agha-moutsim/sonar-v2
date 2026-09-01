import LandingHero from "@/components/LandingHero";
import { ProblemSolutionSection } from "@/components/ProblemSolutionSection";
import { SonarIds } from "@/components/sonar-ids";
import { SonarIdClaim } from "@/components/SonarIdClaim";
import { ChainVideoSection } from "@/components/ChainVideoSection";
import EcosystemIntegration from "@/components/EcosystemIntegration";
import SonarHub from "@/components/SonarHub";
import SonarWallet from "@/components/SonarWallet";
import WalletFeatures from "@/components/WalletFeatures";
import SonarRoadmap from "@/components/SonarRoadmap";
import TeamSection from "@/components/TeamSection";

export default function Home() {
  return (
    <main>
      <LandingHero />
      <ProblemSolutionSection />
      <SonarIds />
      <ChainVideoSection />
      <SonarIdClaim />
      <EcosystemIntegration />
      <SonarHub />
      <SonarWallet />
      <WalletFeatures />
      <SonarRoadmap />
      <TeamSection />
    </main>
  );
}
