import NewsSection from '@/components/sections/NewsSection'
import GenericPageHeroSection from '@/components/shared/GenericPageHeroSection'



export default function NewsPage() {
  return (
    <div>
        <GenericPageHeroSection
        image="/images/genericherobg.png"
        title="Xəbərlər"
        description="Comelson şirkətləri bir araya gətirərək əməkdaşlıq, tərəfdaşlıq və yeni imkanlar üçün güclü bir biznes şəbəkəsi yaradır."
      />
      <NewsSection />
    </div>
  )
}
