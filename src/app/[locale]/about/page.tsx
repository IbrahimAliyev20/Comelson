import GenericPageHeroSection from '@/components/shared/GenericPageHeroSection'
import AboutSection from '@/components/sections/AboutSection'
import StatisticsSection from '@/components/sections/home/StatisticsSection'
import { getServerQueryClient } from '@/providers/server'
import { getBreadcrumbsQuery } from '@/services/hero/queries'
import { getServerLocale } from '@/lib/utils'
import { getAboutQuery } from '@/services/about/queries'
import { getStatisticsQuery } from '@/services/statistics/queries'
  
export default async function AboutPage() {
  const locale = await getServerLocale()
  const queryClient = getServerQueryClient()

  await Promise.all([

    queryClient.prefetchQuery(getBreadcrumbsQuery(locale)), 
    queryClient.prefetchQuery(getStatisticsQuery(locale)),  
    queryClient.prefetchQuery(getAboutQuery(locale))
  
  ])



  const about = queryClient.getQueryData(getAboutQuery(locale).queryKey)?.data
  const statistics = queryClient.getQueryData(getStatisticsQuery(locale).queryKey)?.data  
  const heroData = queryClient.getQueryData(getBreadcrumbsQuery(locale).queryKey)
  const hero = heroData?.data?.find((x) => x.name?.toLowerCase?.() === 'about')
  const image = hero?.image || '/images/genericherobg.png'
  const title = hero?.title || 'Haqqımızda'
  const description =
    hero?.desciption ||
    'Comelson şirkətləri bir araya gətirən, tərəfdaşlıqları gücləndirən və tender proseslərini daha əlçatan edən networking platformasıdır'

  return (
    <div className="flex flex-col gap-10">
      <GenericPageHeroSection image={image} title={title} description={description} />
      <AboutSection about={about} />
      <StatisticsSection statistics={statistics} />
    </div>
  )
}
