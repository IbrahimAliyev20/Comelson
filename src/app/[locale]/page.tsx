import AboutHomeSection from "@/components/sections/home/AboutHomeSection";
import CtaBanner from "@/components/sections/home/CtaBanner";
import HeroHomeSection from "@/components/sections/home/HeroHomeSection";
import MembersHomeSection from "@/components/sections/home/MembersHomeSection";
import NewsHomeSection from "@/components/sections/home/NewsHomeSection";
  import StatisticsSection from "@/components/sections/home/StatisticsSection";
import SuccessHomeStories from "@/components/sections/home/SuccessHomeStories";
import TendersHomeSection from "@/components/sections/home/TendersHomeSection";
import { getServerLocale } from "@/lib/utils";
import { getServerQueryClient } from "@/providers/server";
import { getAboutQuery } from "@/services/about/queries";
import { getBlogsQuery } from "@/services/blogs/queries";
import { getFormLogoQuery } from "@/services/form-logo/queries";
import { getMembersQuery } from "@/services/members/queries";
import { getSlidersQuery } from "@/services/sliders/queries";
import { getStatisticsQuery } from "@/services/statistics/queries";
import { getSuccessStoriesQuery } from "@/services/success-stories/queries";

export default async function Home() {
  const locale = await getServerLocale();
  const queryClient = getServerQueryClient();


  await Promise.all([

     queryClient.prefetchQuery(getStatisticsQuery(locale)),
     queryClient.prefetchQuery(getAboutQuery(locale)),
     queryClient.prefetchQuery(getSlidersQuery(locale)),
     queryClient.prefetchQuery(getFormLogoQuery(locale)),
     queryClient.prefetchQuery(getSuccessStoriesQuery(locale)),
     queryClient.prefetchQuery(getMembersQuery(locale)),
     queryClient.prefetchQuery(getBlogsQuery(locale, null, '')),
    
    ]);
    
  const blogs = queryClient.getQueryData(getBlogsQuery(locale, null, '').queryKey)?.data;
  const members = queryClient.getQueryData(getMembersQuery(locale).queryKey)?.data;
  const formLogo = queryClient.getQueryData(getFormLogoQuery(locale).queryKey)?.data;
  const statistics = queryClient.getQueryData(getStatisticsQuery(locale).queryKey)?.data;
  const sliders = queryClient.getQueryData(getSlidersQuery(locale).queryKey)?.data;
  const about = queryClient.getQueryData(getAboutQuery(locale).queryKey)?.data;
  const successStories = queryClient.getQueryData(getSuccessStoriesQuery(locale).queryKey)?.data;
  return (
    <div className="flex flex-col ">
      <HeroHomeSection sliders={sliders} formLogo={formLogo} />
      <AboutHomeSection about={about} />
      <MembersHomeSection members={members} />
      <StatisticsSection statistics={statistics} />
      <TendersHomeSection />
      <NewsHomeSection blogs={blogs} />
      <SuccessHomeStories successStories={successStories} />
      <CtaBanner />
    </div>
  );
}
