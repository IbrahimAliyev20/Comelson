import Image from 'next/image'
import { headers } from 'next/headers'
import { Info } from 'lucide-react'
import { notFound } from 'next/navigation'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { getServerLocale } from '@/lib/utils'
import { getPublicTender } from '@/services/tenders/api'

function formatDetailDateTime(value: string): string {
  const m = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}:\d{2})/)
  if (!m) return value
  const [, yyyy, mm, dd, hhmm] = m
  return `${dd}.${mm}.${yyyy}, ${hhmm}`
}

export default async function TenderDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const locale = await getServerLocale()
  const response = await getPublicTender(locale, slug)
  const tender = response?.data?.tender
  if (!tender) notFound()

  const h = await headers()
  const forwardedProto = h.get('x-forwarded-proto')
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (host ? `${forwardedProto ?? 'https'}://${host}` : '')
  const pageUrl = `${baseUrl}/tenders/${tender.slug || String(tender.id)}`

  const startAt = formatDetailDateTime(tender.start_date)
  const endAt = formatDetailDateTime(tender.end_date)
  const category =
    tender.category?.name?.[locale] ?? tender.category?.name?.az ?? '—'

  const contactName = tender.contact_name?.trim() || '—'
  const contactPosition = tender.contact_position?.trim() || '—'
  const contactEmail = tender.contact_email?.trim() || '—'
  const contactPhone = tender.contact_phone?.trim() || '—'

  const instagram = tender.contact_instagram?.trim() || ''
  const facebook = tender.contact_facebook?.trim() || ''
  const linkedin = tender.contact_linkedin?.trim() || ''

  // NOTE: Figma shows company, but public tender response currently doesn't include it.
  const companyName = 'Comelson MMC'

  return (
    <section className="bg-[#f8fafc] py-8 md:py-[70px]">
      <Container>
        <div className="overflow-hidden rounded-2xl border border-[#eaf1fa] bg-white px-6 pb-12 pt-8 sm:px-12">
          <div className="mx-auto w-full max-w-[1000px]">
            <nav className="flex items-center gap-1 text-xs leading-4">
              <Link href="/tenders" className="text-[#6b6e71] hover:underline">
                Tender elanları
              </Link>
              <span className="text-[#6b6e71]">/</span>
              <span className="line-clamp-1 font-medium text-[#32393f]">
                {tender.title}
              </span>
            </nav>

            <div className="mt-8 flex flex-col gap-9">
              <h1 className="text-balance text-3xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
                {tender.title}
              </h1>

              <div className="flex flex-col gap-3 text-[16px] leading-[26px] sm:text-[18px]">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-12">
                  <p className="w-full text-[#6b6e71] sm:w-[200px]">
                    Başlama tarixi və saatı
                  </p>
                  <p className="w-full font-medium text-[#14171a] sm:w-[200px]">
                    {startAt}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-12">
                  <p className="w-full text-[#6b6e71] sm:w-[200px]">
                    Bitmə tarixi və saatı
                  </p>
                  <p className="w-full font-medium text-[#14171a] sm:w-[200px]">
                    {endAt}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-12">
                  <p className="w-full text-[#6b6e71] sm:w-[200px]">Kateqoriya</p>
                  <p className="w-full font-medium text-[#14171a] sm:w-[200px]">
                    {category}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-12">
                  <p className="w-full text-[#6b6e71] sm:w-[200px]">Şirkət</p>
                  <p className="w-full font-medium text-[#14171a] sm:w-[200px]">
                    {companyName}
                  </p>
                </div>
              </div>

              <section className="flex flex-col gap-5">
                <h2 className="text-2xl font-semibold leading-8 text-[#14171a]">
                  Tender haqqında
                </h2>
                <div
                  className="prose max-w-none text-[#32393f] prose-p:leading-6"
                  dangerouslySetInnerHTML={{ __html: tender.description }}
                />
              </section>

              <section className="flex flex-col gap-5">
                <h2 className="text-2xl font-semibold leading-8 text-[#14171a]">
                  Tələb olunan sənədlər
                </h2>
                <div
                  className="prose max-w-none text-[#32393f] prose-p:leading-6"
                  dangerouslySetInnerHTML={{ __html: tender.required_documents }}
                />
              </section>

              <section className="flex flex-col gap-5">
                <h2 className="text-2xl font-semibold leading-8 text-[#14171a]">
                  Əlaqə məlumatları
                </h2>

                <div className="w-full overflow-hidden rounded-[14px] border border-[#eaf1fa] bg-white">
                  <div className="hidden w-full items-stretch sm:flex">
                    <div className="flex w-[204px] items-center justify-center border-r border-[#eaf1fa] px-6 py-5 text-sm leading-5 text-[#1d212a]">
                      {contactName}
                    </div>
                    <div className="flex flex-1 items-center justify-center border-r border-[#eaf1fa] px-6 py-5 text-sm leading-5 text-[#1d212a]">
                      {contactPosition}
                    </div>
                    <div className="flex flex-1 items-center justify-center border-r border-[#eaf1fa] px-6 py-5 text-sm leading-5 text-[#0f477d]">
                      {contactEmail}
                    </div>
                    <div className="flex flex-1 items-center justify-center border-r border-[#eaf1fa] px-6 py-5 text-sm leading-5 text-[#0f477d]">
                      {contactPhone}
                    </div>
                    <div className="flex w-[194px] items-center justify-center gap-3 px-6 py-4">
                      {instagram ? (
                        <a
                          href={instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex size-8 items-center justify-center rounded-[26px] bg-[#e6eff6] p-[6px] hover:opacity-80"
                          aria-label="Instagram"
                        >
                          <Image src="/icons/brand-instagram.svg" alt="" width={20} height={20} />
                        </a>
                      ) : null}
                      {facebook ? (
                        <a
                          href={facebook}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex size-8 items-center justify-center rounded-[26px] bg-[#e6eff6] p-[6px] hover:opacity-80"
                          aria-label="Facebook"
                        >
                          <Image src="/icons/brand-facebook.svg" alt="" width={20} height={20} />
                        </a>
                      ) : null}
                      {linkedin ? (
                        <a
                          href={linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex size-8 items-center justify-center rounded-[26px] bg-[#e6eff6] p-[6px] hover:opacity-80"
                          aria-label="LinkedIn"
                        >
                          <Image src="/icons/brand-linkedin.svg" alt="" width={20} height={20} />
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:hidden">
                    <div className="flex items-center justify-center border-b border-[#eaf1fa] px-6 py-4 text-sm leading-5 text-[#1d212a]">
                      {contactName}
                    </div>
                    <div className="flex items-center justify-center border-b border-[#eaf1fa] px-6 py-4 text-sm leading-5 text-[#1d212a]">
                      {contactPosition}
                    </div>
                    <div className="flex items-center justify-center border-b border-[#eaf1fa] px-6 py-4 text-sm leading-5 text-[#0f477d]">
                      {contactEmail}
                    </div>
                    <div className="flex items-center justify-center border-b border-[#eaf1fa] px-6 py-4 text-sm leading-5 text-[#0f477d]">
                      {contactPhone}
                    </div>
                    <div className="flex items-center justify-center gap-3 px-6 py-4">
                      {instagram ? (
                        <a
                          href={instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex size-8 items-center justify-center rounded-[26px] bg-[#e6eff6] p-[6px] hover:opacity-80"
                          aria-label="Instagram"
                        >
                          <Image src="/icons/brand-instagram.svg" alt="" width={20} height={20} />
                        </a>
                      ) : null}
                      {facebook ? (
                        <a
                          href={facebook}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex size-8 items-center justify-center rounded-[26px] bg-[#e6eff6] p-[6px] hover:opacity-80"
                          aria-label="Facebook"
                        >
                          <Image src="/icons/brand-facebook.svg" alt="" width={20} height={20} />
                        </a>
                      ) : null}
                      {linkedin ? (
                        <a
                          href={linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex size-8 items-center justify-center rounded-[26px] bg-[#e6eff6] p-[6px] hover:opacity-80"
                          aria-label="LinkedIn"
                        >
                          <Image src="/icons/brand-linkedin.svg" alt="" width={20} height={20} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </section>

              <div className="rounded-[12px] bg-[#e6eff6] p-6">
                <div className="flex gap-3">
                  <span
                    className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-[#0f477d] text-xs font-semibold text-white"
                    aria-hidden
                  >
                    i
                  </span>
                  <p className="text-base leading-6 text-[#32393f]">
                    Təchizatçılar təklifləri təqdim etmək üçün iştirak haqqı
                    ödəməlidirlər. Təchizatçıların sayının üçdən az olmasına görə
                    satınalmanın baş tutmadığı hallar istisna olmaqla, iştirak
                    haqqı heç bir halda geri qaytarılmır.
                  </p>
                </div>
              </div>

              <p className="sr-only">{pageUrl}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
