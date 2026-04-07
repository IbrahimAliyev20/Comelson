import AboutHomeSection from "@/components/sections/home/AboutHomeSection";
import CtaBanner from "@/components/sections/home/CtaBanner";
import HeroHomeSection from "@/components/sections/home/HeroHomeSection";
import MembersHomeSection from "@/components/sections/home/MembersHomeSection";
import NewsHomeSection from "@/components/sections/home/NewsHomeSection";
  import StatisticsSection from "@/components/sections/home/StatisticsSection";
import SuccesStories from "@/components/sections/home/SuccesStories";
import TendersSection from "@/components/sections/home/TendersSection";

export default function Home() {
  return (
    <div className="flex flex-col ">
      <HeroHomeSection />
      <AboutHomeSection />
      <MembersHomeSection />
      <StatisticsSection />
      <TendersSection />
      <NewsHomeSection />
      <SuccesStories />
      <CtaBanner />
    </div>
  );
}
