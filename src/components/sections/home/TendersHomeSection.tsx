import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

import Container from '@/components/shared/container'
import { TenderSharePopover } from '@/components/tenders/TenderSharePopover'
import { Link } from '@/i18n/navigation'
import type { PublicTenderResponse } from '@/types/types'

type TendersHomeSectionProps = {
  locale: string
  tenders: PublicTenderResponse[]
}

function getLocalizedCategoryName(
  name: Record<string, string> | string | null | undefined,
  locale: string
): string {
  if (!name) return '—'
  if (typeof name === 'string') return name
  return name[locale] ?? name.az ?? Object.values(name)[0] ?? '—'
}

function formatApiDateTime(value: string): string {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}:\d{2})/)
  if (!match) return value

  const [, year, month, day, hourMinute] = match
  return `${day}.${month}.${year}   ${hourMinute}`
}

export default async function TendersHomeSection({
  locale,
  tenders,
}: TendersHomeSectionProps) {
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
              href="/tenders"
              className="hidden h-11 w-full shrink-0 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium leading-5 text-[#0f477d] transition-opacity hover:opacity-80 min-[400px]:h-12 min-[400px]:w-auto min-[400px]:gap-3 min-[400px]:px-6 min-[400px]:py-3 min-[400px]:text-base min-[400px]:leading-6 lg:inline-flex"
            >
              {t('tenders.cta')}
              <ChevronRight className="size-5 shrink-0 min-[400px]:size-6" aria-hidden />
            </Link>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#f2f9ff] bg-white px-6 py-8">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[1100px] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="border-b border-[#eaf1fa]">
                    <th className="w-16 px-6 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      №
                    </th>
                    <th className="min-w-[236px] px-6 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      Tender başlığı
                    </th>
                    <th className="min-w-[212px] px-6 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      Şirkət
                    </th>
                    <th className="min-w-[208px] px-6 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      Tenderin kateqoriyası
                    </th>
                    <th className="min-w-[178px] px-6 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      Başlama tarixi
                    </th>
                    <th className="min-w-[178px] px-6 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      Bitmə tarixi
                    </th>
                    <th className="min-w-[120px] px-6 py-4" />
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {tenders.map((row, index) => (
                    <tr key={row.id}>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle text-center text-sm font-normal leading-5 text-[#1d212a]">
                        {index + 1}
                      </td>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle text-sm font-normal leading-5 text-[#1d212a]">
                        <p className="max-w-[18rem]">{row.title}</p>
                      </td>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle">
                        <div className="flex items-center justify-center gap-3">
                          <span className="relative inline-flex size-10 shrink-0 overflow-hidden rounded-full border border-[rgba(69,136,183,0.12)] bg-white">
                            <Image
                              src={row.company?.logo_url || '/images/Logo.svg'}
                              alt=""
                              width={40}
                              height={40}
                              className="object-cover"
                              aria-hidden
                            />
                          </span>
                          <span className="text-sm font-medium leading-5 text-[#1d212a]">
                            {row.company?.name || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle text-sm font-normal leading-5 text-[#1d212a]">
                        <p className="max-w-[18rem]">
                          {getLocalizedCategoryName(row.category?.name, locale)}
                        </p>
                      </td>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle whitespace-pre text-sm font-normal leading-5 text-[#1d212a]">
                        {formatApiDateTime(row.start_date)}
                      </td>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle whitespace-pre text-sm font-normal leading-5 text-[#1d212a]">
                        {formatApiDateTime(row.end_date)}
                      </td>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle">
                        <Link
                          href={`/tenders/${row.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-normal leading-5 text-[#0f477d] transition-opacity hover:opacity-80"
                        >
                          Ətraflı
                          <ChevronRight className="size-6 shrink-0" aria-hidden />
                        </Link>
                      </td>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle">
                        <div className="flex items-center justify-center gap-3">
                          <TenderSharePopover
                            slug={row.slug}
                            tenderTitle={row.title}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!tenders.length ? (
              <div className="border-t border-[#f2f9ff] px-4 py-6 text-center text-sm text-[#64717c]">
                Tender tapılmadı
              </div>
            ) : null}

            <div className="border-t border-[#f2f9ff] bg-white px-4 py-3 text-xs text-[#64717c] sm:hidden">
              <span className="inline-flex items-center gap-2">
                <ArrowUpRight className="size-4" aria-hidden />
                Scroll edin (sağa) - cədvəl tam görünəcək.
              </span>
            </div>
          </div>

          <div className="flex justify-center lg:hidden">
            <Link
              href="/tenders"
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
