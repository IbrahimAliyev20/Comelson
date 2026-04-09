import AboutHomeSection from "@/components/sections/home/AboutHomeSection";
import CtaBanner from "@/components/sections/home/CtaBanner";
import HeroHomeSection from "@/components/sections/home/HeroHomeSection";
import MembersHomeSection from "@/components/sections/home/MembersHomeSection";
import NewsHomeSection from "@/components/sections/home/NewsHomeSection";
  import StatisticsSection from "@/components/sections/home/StatisticsSection";
import SuccessHomeStories from "@/components/sections/home/SuccessHomeStories";
import TendersHomeSection from "@/components/sections/home/TendersHomeSection";

export default function Home() {
  return (
    <div className="flex flex-col ">
      <HeroHomeSection />
      <AboutHomeSection />
      <MembersHomeSection />
      <StatisticsSection />
      <TendersHomeSection />
      <NewsHomeSection />
      <SuccessHomeStories />
      <CtaBanner />
    </div>
  );
}
