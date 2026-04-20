import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { tendersHomeRows } from '@/utils/tenders-data'

export default async function TendersHomeSection() {
  const t = await getTranslations('home')

  return (
    <section className="bg-[#f4f6fa] py-12 sm:py-16 md:py-[72px]">
      <Container>
        <div className="flex flex-col gap-6 sm:gap-10">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end sm:gap-6">
            <h2 className="min-w-0 text-balance text-2xl font-semibold leading-tight text-black min-[360px]:text-3xl md:text-[40px] md:leading-[56px]">
              <span>{t('tenders.titleBlack')}</span>
              <span className="text-[#6b6e71]">{t('tenders.titleGray')}</span>
            </h2>

            <Link
              href="/tender"
              className="hidden h-11 w-full shrink-0 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium leading-5 text-[#0f477d] transition-opacity hover:opacity-80 min-[400px]:h-12 min-[400px]:w-auto min-[400px]:gap-3 min-[400px]:px-6 min-[400px]:py-3 min-[400px]:text-base min-[400px]:leading-6 lg:inline-flex"
            >
              {t('tenders.cta')}
              <ChevronRight className="size-5 shrink-0 min-[400px]:size-6" aria-hidden />
            </Link>
          </div>

          <div className="overflow-hidden rounded-[8px] border border-[#f2f9ff] bg-white px-4 py-6 md:px-6 md:py-8">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[980px] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="border-b border-[#f2f9ff]">
                    <th className="px-4 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      {t('tenders.columns.no')}
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      {t('tenders.columns.buyer')}
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      {t('tenders.columns.subject')}
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      {t('tenders.columns.start')}
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      {t('tenders.columns.end')}
                    </th>
                    <th className="px-4 py-4" />
                    <th className="px-4 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {tendersHomeRows.map((row) => (
                    <tr key={row.id} className="border-t border-[#eaf1fa]">
                      <td className="px-4 py-5 align-middle text-sm leading-5 text-[#1d212a]">
                        {row.id}
                      </td>
                      <td className="px-4 py-5 align-middle text-sm leading-5 text-[#1d212a]">
                        <p className="max-w-[18rem]">{row.buyerName}</p>
                      </td>
                      <td className="px-4 py-5 align-middle text-sm leading-5 text-[#1d212a]">
                        <p className="max-w-[22rem]">{row.subject}</p>
                      </td>
                      <td className="px-4 py-5 align-middle whitespace-pre text-sm leading-5 text-[#1d212a]">
                        {row.startAt}
                      </td>
                      <td className="px-4 py-5 align-middle whitespace-pre text-sm leading-5 text-[#1d212a]">
                        {row.endAt}
                      </td>
                      <td className="px-4 py-5 align-middle">
                        <Link
                          href={`/tenders/${row.slug}`}
                          className="inline-flex items-center gap-2 text-sm leading-5 text-[#0f477d] transition-opacity hover:opacity-80"
                        >
                          {t('tenders.rowCta')}
                          <ChevronRight className="size-5" aria-hidden />
                        </Link>
                      </td>
                      <td className="px-4 py-5 align-middle">
                        <div className="flex items-center justify-center">
                          <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#e6eff6] text-[#0f477d]">
                            <Image src="/icons/share.svg" alt="tenders-icon" width={20} height={20} />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-[#f2f9ff] bg-white px-4 py-3 text-xs text-[#64717c] sm:hidden">
              <span className="inline-flex items-center gap-2">
                <ArrowUpRight className="size-4" aria-hidden />
                Scroll edin (sağa) - cədvəl tam görünəcək.
              </span>
            </div>
          </div>

          <div className="flex justify-center lg:hidden">
            <Link
              href="/tender"
              className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium leading-5 text-[#0f477d] transition-opacity hover:opacity-80 min-[400px]:h-12 min-[400px]:w-auto min-[400px]:gap-3 min-[400px]:px-6 min-[400px]:py-3 min-[400px]:text-base min-[400px]:leading-6"
            >
              {t('tenders.cta')}
              <ChevronRight className="size-5 shrink-0 min-[400px]:size-6" aria-hidden />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
