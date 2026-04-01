import AboutSection from "@/components/home/AboutSection";
import BlogHomeSection from "@/components/home/BlogHomeSection";
import HeroHomeSection from "@/components/home/HeroHomeSection";
import MembersSection from "@/components/home/MembersSection";
import PricePackagesSection from "@/components/home/PricePackagesSection";
import StatisticsSection from "@/components/home/StatisticsSection";
import SuccesStories from "@/components/home/SuccesStories";

export default function Home() {
  return (
    <div className="flex flex-col ">
      <HeroHomeSection />
      <AboutSection />
      <MembersSection />
      <StatisticsSection />
      <BlogHomeSection />
      <SuccesStories />
      <PricePackagesSection />
    </div>
  );
}
