import MembersSection from '@/components/sections/MembersSection'
import GenericPageHeroSection from '@/components/shared/GenericPageHeroSection'

export default function MembersPage() {
  return (
    <div>
        <GenericPageHeroSection
        image="/images/genericherobg.png"
        title="Üzvlərimiz"
        description="Comelson şirkətləri bir araya gətirərək əməkdaşlıq, tərəfdaşlıq və yeni imkanlar üçün güclü bir biznes şəbəkəsi yaradır."
      />
      <MembersSection />
    </div>
  )
}
