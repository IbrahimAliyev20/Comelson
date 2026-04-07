import PricePackagesSection from '@/components/sections/PricePackagesSection'
import GenericPageHeroSection from '@/components/shared/GenericPageHeroSection'
import React from 'react'

export default function PartnershipPage() {
  return (
    <div>
        <GenericPageHeroSection
        image="/images/genericherobg.png"
        title="Tərəfdaşlıq Paketlərimiz"
        description="Comelson şirkətləri bir araya gətirərək əməkdaşlıq, tərəfdaşlıq və yeni imkanlar üçün güclü bir biznes şəbəkəsi yaradır."
      />
      <PricePackagesSection />
    </div>
  )
}
