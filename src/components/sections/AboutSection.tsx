import { getTranslations } from 'next-intl/server'

import Container from '@/components/shared/container'

export default async function AboutSection() {
  const t = await getTranslations('home')

  return (
    <section className="bg-white pt-10 sm:pt-12 md:pt-12 max-w-6xl mx-auto">
        <div className="flex items-stretch gap-6 sm:gap-8 md:gap-10">
          <div className="shrink-0">
            <div className="h-full w-[3px] rounded-full bg-[#3bbae9]" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 sm:gap-6">
              <h2 className="text-balance text-2xl font-semibold leading-tight text-[#14171a] sm:text-[32px] sm:leading-[44px] md:text-[40px] md:leading-[56px]">
                {t('aboutPage.whoTitle')}
              </h2>
              <p className="whitespace-pre-wrap text-sm leading-6 text-[#6b6e71] sm:text-base">
                {t('aboutPage.whoBody')}
              </p>
            </div>
          </div>
        </div>
    </section>
  )
}
