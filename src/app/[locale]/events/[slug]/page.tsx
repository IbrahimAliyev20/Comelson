import Image from 'next/image'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { getServerQueryClient } from '@/providers/server'
import { getEventQuery } from '@/services/events/queries'

function stripHtml(value?: string | null) {
  if (!value) return ''
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function parseApiDate(value: string): Date | null {
  // API returns either ISO-ish or `DD-MM-YYYY`
  const raw = value.trim()
  const m = raw.match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (m) {
    const [, dd, mm, yyyy] = m
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
    return Number.isNaN(d.getTime()) ? null : d
  }
  const d = new Date(raw)
  return Number.isNaN(d.getTime()) ? null : d
}

function formatDate(value: string, locale: string) {
  const d = parseApiDate(value)
  if (!d) return value
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

type EventLike = {
  name: string
  slug: string
  image: string
  created_at: string
  description?: string | null
  category?: { id: number } | null
  join_link?: string | null
}

function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

function parseEventLike(value: unknown): EventLike | null {
  const obj = asObject(value)
  if (!obj) return null
  const name = obj.name
  const slug = obj.slug
  const image = obj.image
  const created_at = obj.created_at
  if (
    typeof name !== 'string' ||
    typeof slug !== 'string' ||
    typeof image !== 'string' ||
    typeof created_at !== 'string'
  ) {
    return null
  }

  const description = typeof obj.description === 'string' ? obj.description : null
  const join_link = typeof obj.join_link === 'string' ? obj.join_link : null
  const categoryObj = asObject(obj.category)
  const categoryId = categoryObj?.id
  const category =
    typeof categoryId === 'number' ? ({ id: categoryId } as const) : null

  return { name, slug, image, created_at, description, join_link, category }
}

function parseEventDetailPayload(value: unknown): { event: EventLike; otherEvents: EventLike[] } | null {
  const base = asObject(value)
  if (!base) return null

  const payload = asObject(base.data) ?? base
  const event = parseEventLike(payload.event ?? payload)
  if (!event) return null

  const otherRaw = payload.other_events
  const otherEvents = Array.isArray(otherRaw)
    ? otherRaw.map(parseEventLike).filter((x): x is EventLike => x != null)
    : []

  return { event, otherEvents }
}

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const queryClient = getServerQueryClient()

  let event: EventLike | null = null
  let otherEvents: EventLike[] = []
  try {
    const singleResponse = await queryClient.fetchQuery(getEventQuery(locale, slug))
    const parsed = parseEventDetailPayload(singleResponse)
    event = parsed?.event ?? null
    otherEvents = parsed?.otherEvents ?? []
  } catch {
    event = null
  }

  if (!event) notFound()

  const picked = otherEvents.filter((item) => item.slug !== slug).slice(0, 2)

  const h = await headers()
  const forwardedProto = h.get('x-forwarded-proto')
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (host ? `${forwardedProto ?? 'https'}://${host}` : '')
  const pageUrl = `${baseUrl}/${locale}/events/${event.slug}`

  const encodedUrl = encodeURIComponent(pageUrl)
  const encodedText = encodeURIComponent(event.name)

  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${event.name} ${pageUrl}`)}`,
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
              <Link href="/events" className="text-[#6b6e71] hover:underline">
                Tədbirlər və Forumlar
              </Link>
              <span className="text-[#6b6e71]">/</span>
              <span className="line-clamp-1 font-medium text-[#32393f]">
                {event.name}
              </span>
            </nav>

            <div className="flex flex-col gap-7">
              <h1 className="text-balance text-2xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
                {event.name}
              </h1>

              <div className="relative h-[260px] w-full overflow-hidden rounded-2xl sm:h-[420px] md:h-[480px]">
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  priority
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-white px-2.5 py-2 text-sm leading-5 text-[#1d212a]">
                    <Image src="/icons/calendar-event.svg" alt="" width={20} height={20} aria-hidden />
                    <span className="text-sm leading-5">Dərc edildi:</span>
                    <span className="text-sm leading-5">{formatDate(event.created_at, locale)}</span>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-white px-2.5 py-2 text-sm leading-5 text-[#1d212a]">
                    <span className="text-sm leading-5">Paylaş:</span>
                    <div className="flex items-center gap-1.5">
                      <a className="hover:opacity-70" href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                        <Image src="/icons/brand-whatsapp.svg" alt="WhatsApp" width={16} height={16} />
                      </a>
                      <a className="hover:opacity-70" href={shareUrls.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                        <Image src="/icons/brand-telegram.svg" alt="Telegram" width={16} height={16} />
                      </a>
                      <a className="hover:opacity-70" href={shareUrls.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <Image src="/icons/brand-facebook.svg" alt="Facebook" width={16} height={16} />
                      </a>
                      <a className="hover:opacity-70" href={shareUrls.x} target="_blank" rel="noopener noreferrer" aria-label="X">
                        <Image src="/icons/brand-x.svg" alt="X" width={16} height={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <article className="flex flex-col gap-6">
              <h2 className="text-balance text-2xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
                Tədbir haqqında
              </h2>
              <div className="flex flex-col gap-4 text-sm leading-6 text-[#6b6e71] sm:text-base">
                <p>{stripHtml(event.description)}</p>
              </div>
            </article>

            {picked.length > 0 ? (
              <div className="flex flex-col gap-6 pt-2">
                <p className="text-balance text-2xl font-semibold leading-tight text-[#6b6e71] sm:text-[40px] sm:leading-[56px]">
                  <span>{`Sizin üçün `}</span>
                  <span className="text-[#14171a]">Seçdiklərimiz</span>
                </p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {picked.map((item) => (
                    <Link
                      key={`${item.slug}-${item.created_at}`}
                      href={`/events/${item.slug}`}
                      className="group flex flex-col gap-4 rounded-2xl border border-[#eaf1fa] bg-[#fafdff] px-2 pb-5 pt-2"
                    >
                      <div className="relative h-[220px] w-full overflow-hidden rounded-xl sm:h-[320px]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 1024px) 100vw, 484px"
                        />
                      </div>

                      <div className="flex flex-col gap-3 px-2">
                        <div className="flex items-center gap-[5px] text-[#6b6e71]">
                          <Image src="/icons/calendar-event.svg" alt="" width={20} height={20} aria-hidden />
                          <span className="text-base leading-6">{formatDate(item.created_at, locale)}</span>
                        </div>
                        <p className="line-clamp-2 text-xl font-semibold leading-7 text-[#14171a]">
                          {item.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}
