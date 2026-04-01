import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import type { PricePackageKey } from '@/utils/price-packages-data'
import { pricePackagesList } from '@/utils/price-packages-data'

import { PricingCheckIcon, PricingManatIcon } from './pricing-icons'

function packageNameKey(key: PricePackageKey) {
  switch (key) {
    case 'basic':
      return 'pricePackages.names.basic' as const
    case 'business':
      return 'pricePackages.names.business' as const
    case 'premium':
      return 'pricePackages.names.premium' as const
  }
}

export default async function PricePackagesSection() {
  const t = await getTranslations('home')

  return (
    <section className="bg-[#f4f6fa] py-20 md:py-[100px]">
      <Container>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="flex max-w-[575px] flex-col text-3xl font-semibold leading-tight md:text-[40px] md:leading-[56px]">
              <span className="text-black">{t('pricePackages.titleLine1')}</span>
              <span className="text-[#6b6e71]">{t('pricePackages.titleLine2')}</span>
            </h2>

            <Link
              href="/members"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-2xl px-6 py-3 text-base font-medium leading-6 text-black transition-opacity hover:opacity-80"
            >
              {t('pricePackages.headerCta')}
              <ArrowRight className="size-6 shrink-0" aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch lg:gap-6">
            {pricePackagesList.map((pkg) => {
              const isFeatured = pkg.variant === 'featured'
              const nameKey = packageNameKey(pkg.key)

              return (
                <article
                  key={pkg.key}
                  className={`flex w-full flex-col justify-between rounded-2xl p-6 shadow-sm ${
                    isFeatured
                      ? 'bg-[#0f477d] text-white ring-1 ring-[#175585] lg:min-h-[560px]'
                      : 'border border-[#e8eaed] bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-9">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-5">
                        {isFeatured ? (
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-2xl font-semibold leading-8 text-white">
                              {t(nameKey)}
                            </p>
                            <span className="shrink-0 rounded-lg bg-[#3cc3f1] px-3.5 py-1.5 text-base font-medium leading-6 text-white">
                              {t('pricePackages.badge')}
                            </span>
                          </div>
                        ) : (
                          <p className="text-2xl font-semibold leading-8 text-black">
                            {t(nameKey)}
                          </p>
                        )}
                        <p
                          className={
                            isFeatured
                              ? 'text-base leading-6 text-white'
                              : 'text-base leading-6 text-[#64717c]'
                          }
                        >
                          {t('pricePackages.tagline')}
                        </p>
                      </div>

                      <div
                        className={`h-px w-full ${isFeatured ? 'bg-[#175585]' : 'bg-[#e8eaed]'}`}
                      />

                      <div className="flex items-end gap-1">
                        <span
                          className={`text-5xl font-semibold leading-[48px] ${
                            isFeatured ? 'text-white' : 'text-black'
                          }`}
                        >
                          {pkg.price}
                        </span>
                        <div className="flex items-center pb-0.5">
                          <PricingManatIcon
                            className={
                              isFeatured
                                ? 'h-8 w-8 text-white'
                                : 'h-8 w-8 text-black'
                            }
                          />
                          <span
                            className={`text-2xl font-medium leading-8 ${
                              isFeatured ? 'text-white' : 'text-black'
                            }`}
                          >
                            {t('pricePackages.period')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/register"
                      className={`flex h-12 w-full items-center justify-center gap-4 rounded-2xl px-6 text-base font-medium leading-6 transition-opacity hover:opacity-90 ${
                        isFeatured
                          ? 'bg-white text-[#0f477d]'
                          : 'bg-[#e7f1f8] text-[#0f477d]'
                      }`}
                    >
                      {t('pricePackages.button')}
                    </Link>
                  </div>

                  <ul className="mt-9 flex flex-col gap-4">
                    {Array.from({ length: pkg.featureCount }).map((_, i) => (
                      <li key={i} className="flex gap-2.5">
                        <PricingCheckIcon
                          className={`mt-0.5 size-6 shrink-0 ${
                            isFeatured ? 'text-[#3cc3f1]' : 'text-[#1577d5]'
                          }`}
                        />
                        <span
                          className={
                            isFeatured
                              ? 'text-base leading-6 text-white'
                              : 'text-base leading-6 text-[#64717c]'
                          }
                        >
                          {t('pricePackages.featureItem')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
