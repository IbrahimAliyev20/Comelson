import Image from 'next/image'
import { headers } from 'next/headers'
import { Info, Mail, Phone } from 'lucide-react'
import { notFound } from 'next/navigation'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { tendersHomeRows } from '@/utils/tenders-data'

function normalizeTel(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

export default async function TenderDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const tender = tendersHomeRows.find((x) => x.slug === slug)
  if (!tender) notFound()

  const h = await headers()
  const forwardedProto = h.get('x-forwarded-proto')
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (host ? `${forwardedProto ?? 'https'}://${host}` : '')
  const pageUrl = `${baseUrl}/tenders/${tender.slug}`

  const encodedUrl = encodeURIComponent(pageUrl)
  const encodedText = encodeURIComponent(tender.buyerName)

  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${tender.buyerName} ${pageUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
  } as const

  return (
    <section className="bg-[#f8fafc] py-8 md:py-[70px]">
      <Container>
        <div className="rounded-2xl border border-[#eaf1fa] bg-white p-6 sm:p-10">
          <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 sm:gap-12">
            <nav className="flex items-center gap-1 text-xs leading-4">
              <Link href="/tenders" className="text-[#6b6e71] hover:underline">
                Tender elanları
              </Link>
              <span className="text-[#6b6e71]">/</span>
              <span className="line-clamp-1 font-medium text-[#32393f]">
                {tender.subject}
              </span>
            </nav>

            <div className="flex flex-col gap-8">
              <h1 className="text-balance text-2xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
                {tender.buyerName}
              </h1>

              <div className="flex flex-col gap-3 text-[16px] leading-[26px] sm:text-[18px]">
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-12">
                  <p className="w-full text-[#6b6e71] sm:w-[200px]">Başlama tarixi və saatı</p>
                  <p className="w-full font-medium text-[#14171a] sm:w-[200px]">
                    {tender.startAt.replace(/\s+/g, ' ').replace('   ', ', ')}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-12">
                  <p className="w-full text-[#6b6e71] sm:w-[200px]">Bitmə tarixi və saatı</p>
                  <p className="w-full font-medium text-[#14171a] sm:w-[200px]">
                    {tender.endAt.replace(/\s+/g, ' ').replace('   ', ', ')}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-12">
                  <p className="w-full text-[#6b6e71] sm:w-[200px]">Kateqoriya</p>
                  <p className="w-full font-medium text-[#14171a] sm:w-[200px]">
                    {tender.category}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-semibold leading-8 text-[#14171a]">
                  Tender haqqında
                </h2>
                <div className="flex flex-col gap-4 text-base leading-6 text-[#32393f]">
                  {tender.about.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-semibold leading-8 text-[#14171a]">
                  Tələb olunan sənədlər
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-base leading-6 text-[#32393f]">
                  {tender.requiredDocuments.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-[#e6eff6] p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex size-6 items-center justify-center text-[#0f477d]" aria-hidden>
                      <Info className="size-5" />
                    </span>
                    <p className="text-base leading-6 text-[#32393f]">
                      Təchizatçılar təklifləri təqdim etmək üçün iştirak haqqı ödəməlidirlər. Təchizatçıların sayının
                      üçdən az olmasına görə satınalmanın baş tutmadığı hallar istisna olmaqla, iştirak haqqı heç bir
                      halda geri qaytarılmır.
                    </p>
                  </div>

                  <p className="text-2xl font-semibold leading-8 text-[#14171a]">
                    İştirak haqqı: {tender.participationFeeAzN} AZN
                  </p>

                  <div className="h-px w-full bg-[#dadee2]" />

                  <div className="flex flex-col gap-5">
                    <p className="text-xl font-medium leading-7 text-[#14171a]">
                      Əlaqə vasitələri
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-12">
                      <a
                        href={`tel:${normalizeTel(tender.contactPhone)}`}
                        className="inline-flex items-center gap-3 text-sm font-medium leading-5 text-[#14171a] hover:opacity-80"
                      >
                        <Phone className="size-5 text-[#0f477d]" aria-hidden />
                        {tender.contactPhone}
                      </a>
                      <a
                        href={`mailto:${tender.contactEmail}`}
                        className="inline-flex items-center gap-3 text-sm font-medium leading-5 text-[#14171a] hover:opacity-80"
                      >
                        <Mail className="size-5 text-[#0f477d]" aria-hidden />
                        {tender.contactEmail}
                      </a>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-white px-2.5 py-2 text-sm leading-5 text-[#1d212a]">
                        <span className="text-sm leading-5">Paylaş:</span>
                        <div className="flex items-center gap-1.5">
                          <a
                            className="hover:opacity-70"
                            href={shareUrls.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                          >
                            <Image src="/icons/brand-whatsapp.svg" alt="WhatsApp" width={16} height={16} />
                          </a>
                          <a
                            className="hover:opacity-70"
                            href={shareUrls.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Telegram"
                          >
                            <Image src="/icons/brand-telegram.svg" alt="Telegram" width={16} height={16} />
                          </a>
                          <a
                            className="hover:opacity-70"
                            href={shareUrls.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                          >
                            <Image src="/icons/brand-facebook.svg" alt="Facebook" width={16} height={16} />
                          </a>
                          <a
                            className="hover:opacity-70"
                            href={shareUrls.x}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X"
                          >
                            <Image src="/icons/brand-x.svg" alt="X" width={16} height={16} />
                          </a>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
