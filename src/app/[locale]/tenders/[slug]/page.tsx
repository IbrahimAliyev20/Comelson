import Image from 'next/image'
import { headers } from 'next/headers'
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

function normalizeTel(value: string): string {
  return value.replace(/[^\d+]/g, '')
}

function getLocalizedLabel(
  value: Record<string, string> | string | null | undefined,
  locale: string
): string {
  if (!value) return '—'
  if (typeof value === 'string') return value.trim() || '—'
  return value[locale] ?? value.az ?? Object.values(value)[0] ?? '—'
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.48 1c1.38 0 2.5 1.12 2.5 2.5zM.5 23.5h4V7.98h-4V23.5zM8.5 7.98h3.83v2.12h.05c.53-1 1.83-2.12 3.77-2.12 4.03 0 4.77 2.65 4.77 6.1v9.42h-4v-8.35c0-1.99-.04-4.56-2.78-4.56-2.78 0-3.2 2.17-3.2 4.41v8.5h-4V7.98z" />
    </svg>
  )
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
  const category = getLocalizedLabel(tender.category?.name, locale)

  const contactName = tender.contact_name?.trim() || '—'
  const contactPosition = tender.contact_position?.trim() || '—'
  const rawContactEmail = tender.contact_email?.trim() || ''
  const rawContactPhone = tender.contact_phone?.trim() || ''
  const contactEmail = rawContactEmail || '—'
  const contactPhone = rawContactPhone || '—'

  const instagram = tender.contact_instagram?.trim() || ''
  const facebook = tender.contact_facebook?.trim() || ''
  const linkedin = tender.contact_linkedin?.trim() || ''

  const companyName = tender.company?.name?.trim() || '—'
  const companyLogoUrl = tender.company?.logo_url?.trim() || ''

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
                  <div className="flex w-full items-center gap-3 sm:w-[200px]">
                    {companyLogoUrl ? (
                      <span className="relative inline-flex size-10 shrink-0 overflow-hidden rounded-full border border-[rgba(69,136,183,0.12)] bg-white">
                        <Image
                          src={companyLogoUrl}
                          alt=""
                          width={40}
                          height={40}
                          className="object-cover"
                          aria-hidden
                        />
                      </span>
                    ) : null}
                    <p className="min-w-0 flex-1 truncate font-medium text-[#14171a]">
                      {companyName}
                    </p>
                  </div>
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
                      {rawContactEmail ? (
                        <a
                          href={`mailto:${rawContactEmail}`}
                          className="underline-offset-2 hover:underline"
                        >
                          {contactEmail}
                        </a>
                      ) : (
                        contactEmail
                      )}
                    </div>
                    <div className="flex flex-1 items-center justify-center border-r border-[#eaf1fa] px-6 py-5 text-sm leading-5 text-[#0f477d]">
                      {rawContactPhone ? (
                        <a
                          href={`tel:${normalizeTel(rawContactPhone)}`}
                          className="underline-offset-2 hover:underline"
                        >
                          {contactPhone}
                        </a>
                      ) : (
                        contactPhone
                      )}
                    </div>
                    <div className="flex w-[194px] items-center justify-center gap-3 px-6 py-4">
                      {instagram ? (
                        <a
                          href={instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex size-8 items-center justify-center rounded-[26px] bg-[#e6eff6] p-[6px] text-[#0f477d] hover:opacity-80"
                          aria-label="Instagram"
                        >
                          <InstagramGlyph className="size-5" />
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
                          className="inline-flex size-8 items-center justify-center rounded-[26px] bg-[#e6eff6] p-[6px] text-[#0f477d] hover:opacity-80"
                          aria-label="LinkedIn"
                        >
                          <LinkedInGlyph className="size-5" />
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
                      {rawContactEmail ? (
                        <a
                          href={`mailto:${rawContactEmail}`}
                          className="underline-offset-2 hover:underline"
                        >
                          {contactEmail}
                        </a>
                      ) : (
                        contactEmail
                      )}
                    </div>
                    <div className="flex items-center justify-center border-b border-[#eaf1fa] px-6 py-4 text-sm leading-5 text-[#0f477d]">
                      {rawContactPhone ? (
                        <a
                          href={`tel:${normalizeTel(rawContactPhone)}`}
                          className="underline-offset-2 hover:underline"
                        >
                          {contactPhone}
                        </a>
                      ) : (
                        contactPhone
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-3 px-6 py-4">
                      {instagram ? (
                        <a
                          href={instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex size-8 items-center justify-center rounded-[26px] bg-[#e6eff6] p-[6px] text-[#0f477d] hover:opacity-80"
                          aria-label="Instagram"
                        >
                          <InstagramGlyph className="size-5" />
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
                          className="inline-flex size-8 items-center justify-center rounded-[26px] bg-[#e6eff6] p-[6px] text-[#0f477d] hover:opacity-80"
                          aria-label="LinkedIn"
                        >
                          <LinkedInGlyph className="size-5" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </section>

              <p className="sr-only">{pageUrl}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
