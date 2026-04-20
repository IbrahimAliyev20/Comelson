import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { PartnershipsResponse } from '@/types/types'
import { PricingCheckIcon, PricingManatIcon } from './home/pricing-icons'

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

function normalizePriceParts(
  price: string
): { amount: string; periodText: string } | { raw: string } {
  const trimmed = price.trim()
  if (!trimmed) return { raw: trimmed }

  const amountMatch = trimmed.match(/(\d+(?:[.,]\d+)?)/)
  if (!amountMatch) return { raw: trimmed }

  const hasPeriod = /\/\s*ay/i.test(trimmed)
  const periodText = hasPeriod ? '/aylıq' : '/aylıq'

  return { amount: amountMatch[1] ?? trimmed, periodText }
}

export default async function PricePackagesSection({
  partnerships,
}: {
  partnerships: PartnershipsResponse[] | undefined
}) {
  const t = await getTranslations('home')
  const packages = partnerships ?? []

  return (
    <section className="bg-[#f4f6fa] py-8 md:py-[70px]">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="flex max-w-[575px] flex-col text-2xl font-semibold leading-tight min-[360px]:text-3xl md:text-[40px] md:leading-[56px]">
              <span className="text-[#6b6e71]">{t('pricePackages.titleLine2')}</span>
              <span className="text-black">{t('pricePackages.titleLine1')}</span>
            </h2>

            <Link
              href="/members"
              className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium leading-5 text-black transition-opacity hover:opacity-80 min-[400px]:h-12 min-[400px]:w-auto min-[400px]:gap-3 min-[400px]:px-6 min-[400px]:py-3 min-[400px]:text-base min-[400px]:leading-6"
            >
              {t('pricePackages.headerCta')}
              <ArrowRight className="size-5 shrink-0 min-[400px]:size-6" aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
            {packages.map((pkg, index) => {
              const isFeatured = pkg.most_popular === 1
              const features = extractListItems(pkg.description)
              const priceValue = String(pkg.price ?? '')
              const priceParts = normalizePriceParts(priceValue)

              return (
                <article
                  key={`${pkg.plan}-${index}`}
                  className={
                    isFeatured
                      ? 'flex w-full flex-col justify-between rounded-2xl bg-[#0f477d] p-4 text-white shadow-sm sm:p-6'
                      : 'flex w-full flex-col justify-between rounded-2xl bg-white p-4 text-[#14171a] shadow-sm sm:p-6'
                  }
                >
                  <div className="flex flex-col gap-9">
                    <div className="flex flex-col gap-10">
                      <div className="flex flex-col gap-6">
                        {isFeatured ? (
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-2xl font-semibold leading-8 text-white">
                              {pkg.plan}
                            </p>
                            <span className="shrink-0 rounded-lg bg-[#3bbae9] px-3.5 py-1.5 text-base font-medium leading-6 text-white">
                              {t('pricePackages.badge')}
                            </span>
                          </div>
                        ) : (
                          <p className="text-2xl font-semibold leading-8 text-[#14171a]">
                            {pkg.plan}
                          </p>
                        )}

                        <p
                          className={
                            isFeatured
                              ? 'text-base leading-6 text-[#eaf1fa]'
                              : 'text-base leading-6 text-[#6b6e71]'
                          }
                        >
                          {pkg.title}
                        </p>

                        <div
                          className={
                            isFeatured
                              ? 'h-px w-full bg-[#175585]'
                              : 'h-px w-full bg-[#eaf1fa]'
                          }
                        />
                      </div>

                      <div className="flex flex-wrap items-end gap-1">
                        {'raw' in priceParts ? (
                          <span
                            className={
                              isFeatured
                                ? 'text-5xl font-semibold leading-[48px] text-white'
                                : 'text-5xl font-semibold leading-[48px] text-[#14171a]'
                            }
                          >
                            {priceParts.raw}
                          </span>
                        ) : (
                          <>
                            <span
                              className={
                                isFeatured
                                  ? 'text-5xl font-semibold leading-[48px] text-white'
                                  : 'text-5xl font-semibold leading-[48px] text-[#14171a]'
                              }
                            >
                              {priceParts.amount}
                            </span>
                            <span
                              className={isFeatured ? 'text-white' : 'text-[#14171a]'}
                            >
                              <span className="flex items-end gap-0.5">
                                <PricingManatIcon className="size-8 shrink-0 translate-y-[2px]" />
                                <span className="text-2xl font-normal leading-8">
                                  {priceParts.periodText}
                                </span>
                              </span>
                            </span>
                          </>
                        )}
                      </div>

                      <Link
                        href="/register"
                        className="flex h-12 w-full items-center justify-center gap-4 rounded-2xl bg-[#e6eff6] px-6 py-3 text-base font-medium leading-6 text-[#0f477d] transition-opacity hover:opacity-90"
                      >
                        {t('pricePackages.button')}
                      </Link>
                    </div>

                    <ul className="flex flex-col gap-4">
                      {features.map((feature, i) => (
                        <li key={`${pkg.plan}-${i}`} className="flex gap-2.5">
                          <PricingCheckIcon
                            className={
                              isFeatured
                                ? 'mt-0.5 size-6 shrink-0 text-[#3bbae9]'
                                : 'mt-0.5 size-6 shrink-0 text-[#1577d5]'
                            }
                          />
                          <span
                            className={
                              isFeatured
                                ? 'text-base leading-6 text-[#eaf1fa]'
                                : 'text-base leading-6 text-[#6b6e71]'
                            }
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
