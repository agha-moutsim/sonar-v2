import TopNav from "@/components/TopNav";
import ScrollWorld from "@/components/ScrollWorld";
import { SonarIdClaim } from "@/components/SonarIdClaim";
import EcosystemIntegration from "@/components/EcosystemIntegration";
import SonarWallet from "@/components/SonarWallet";
import WalletFeatures from "@/components/WalletFeatures";
import SonarRoadmap from "@/components/SonarRoadmap";
import TeamSection from "@/components/TeamSection";
import Partners from "@/components/Partners";
import SonarFooter from "@/components/SonarFooter";

export default function Home() {
  return (
    <>
      <TopNav />
      <main id="main">
        <ScrollWorld />
        <SonarIdClaim />
        <EcosystemIntegration />
        <SonarWallet />
        <WalletFeatures />
        <SonarRoadmap />
        <TeamSection />
        <Partners />
        <SonarFooter />
      </main>
    </>
  );
}
