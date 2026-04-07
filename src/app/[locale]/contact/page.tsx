import GenericPageHeroSection from '@/components/shared/GenericPageHeroSection'
import ContactSection from '@/components/sections/ContactSection'

export default function ContactPage() {
  return (
    <div>
      <GenericPageHeroSection
        image="/images/genericherobg.png"
        title="Əlaqə"
        description="Bizimlə əlaqə saxlayın və müraciət edin"
      />
      <ContactSection />
    </div>
  )
}
