import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'

export default async function CtaBanner() {
  const t = await getTranslations('home')

  return (
    <section className="bg-white py-8 md:py-[60px]">
        <div className="relative overflow-hidden  ">
          <Image
            src="/images/ctabg.png"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1440px"
            priority={false}
          />
          <div className="absolute inset-0 bg-[rgba(15,71,125,0.72)]" aria-hidden />

          <div className="relative flex flex-col items-center justify-center px-4 py-10 text-center sm:px-10 sm:py-[72px] md:px-[120px]">
            <div className="flex max-w-[680px] flex-col items-center gap-6 sm:gap-12">
              <div className="flex flex-col items-center gap-4 sm:gap-6">
                <h2 className="text-balance text-2xl font-semibold leading-tight text-white min-[360px]:text-3xl md:text-[40px] md:leading-[56px]">
                  <span>{t('ctaBanner.titlePart1')}</span>
                  <span className="text-[#3bbae9]">{t('ctaBanner.titlePart2')}</span>
                  <span>{t('ctaBanner.titlePart3')}</span>
                </h2>
                <p className="max-w-[557px] text-sm leading-6 text-[#dadee2] sm:text-base">
                  {t('ctaBanner.body')}
                </p>
              </div>

              <Link
                href="/register"
                className="inline-flex h-11 w-full max-w-[260px] items-center justify-center rounded-2xl bg-[#e6eff6] px-6 py-3 text-sm font-medium leading-5 text-[#0f477d] transition-opacity hover:opacity-90 min-[400px]:h-12 min-[400px]:text-base min-[400px]:leading-6"
              >
                {t('ctaBanner.button')}
              </Link>
            </div>
          </div>
        </div>
    </section>
  )
}
