import EventsSection from '@/components/sections/EventsSection'
import GenericPageHeroSection from '@/components/shared/GenericPageHeroSection'

export default function EventsPage() {
  return (
    <div>
        <GenericPageHeroSection
        image="/images/genericherobg.png"
        title="Tədbirlər və Forumlar"
        description="Comelson şirkətləri bir araya gətirərək əməkdaşlıq, tərəfdaşlıq və yeni imkanlar üçün güclü bir biznes şəbəkəsi yaradır."
      />
      <EventsSection />
    </div>
  )
}
