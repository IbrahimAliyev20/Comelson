import GenericPageHeroSection from '@/components/shared/GenericPageHeroSection'
import AboutSection from '@/components/sections/AboutSection'
import StatisticsSection from '@/components/sections/home/StatisticsSection'

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-10">
      <GenericPageHeroSection
        image="/images/genericherobg.png"
        title="Haqqımızda"
        description="Comelson şirkətləri bir araya gətirən, tərəfdaşlıqları gücləndirən və tender proseslərini daha əlçatan edən networking platformasıdır"
      />
      <AboutSection />
      <StatisticsSection />
    </div>
  )
}
