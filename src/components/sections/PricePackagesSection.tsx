import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { PartnershipsResponse } from '@/types/types'
import { PricingCheckIcon } from './home/pricing-icons'

function extractListItems(description: string) {
  if (!description) return []

  const matches = Array.from(description.matchAll(/<li[^>]*>(.*?)<\/li>/g))

  return matches
    .map((match) =>
      match[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .filter(Boolean)
}

export default async function PricePackagesSection({ partnerships }: { partnerships: PartnershipsResponse[] | undefined }) {
  const t = await getTranslations('home')
  const packages = partnerships ?? []

  return (
    <section className="bg-[#f4f6fa] py-20 md:py-[100px]">
      <Container>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="flex max-w-[575px] flex-col text-3xl font-semibold leading-tight md:text-[40px] md:leading-[56px]">
              <span className="text-[#6b6e71]">{t('pricePackages.titleLine2')}</span>
              <span className="text-black">{t('pricePackages.titleLine1')}</span>
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
            {packages.map((pkg, index) => {
              const isFeatured = pkg.most_popular === 1
              const features = extractListItems(pkg.description)

              return (
                <article
                  key={`${pkg.plan}-${index}`}
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
                              {pkg.plan}
                            </p>
                            <span className="shrink-0 rounded-lg bg-[#3cc3f1] px-3.5 py-1.5 text-base font-medium leading-6 text-white">
                              {t('pricePackages.badge')}
                            </span>
                          </div>
                        ) : (
                          <p className="text-2xl font-semibold leading-8 text-black">
                            {pkg.plan}
                          </p>
                        )}
                        <p
                          className={
                            isFeatured
                              ? 'text-base leading-6 text-white'
                              : 'text-base leading-6 text-[#64717c]'
                          }
                        >
                          {pkg.title}
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
                    {features.map((feature, i) => (
                      <li key={`${pkg.plan}-${i}`} className="flex gap-2.5">
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
                          {feature}
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
