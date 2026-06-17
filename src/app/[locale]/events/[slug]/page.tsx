import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar1, Clock } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import EventShareLinks from '@/components/events/EventShareLinks'
import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { stripHtmlToText, toRenderableHtml } from '@/lib/html'
import { getServerQueryClient } from '@/providers/server'
import { getEventQuery } from '@/services/events/queries'
import type { ApiResponse, EventResponse } from '@/types/types'

type EventDetail = EventResponse & {
  join_link?: string | null
}

type EventDetailPayload = {
  event: EventDetail
  other_events: EventResponse[]
}

async function getEventDetail(locale: string, slug: string): Promise<EventDetailPayload | null> {
  const queryClient = getServerQueryClient()

  try {
    const response = (await queryClient.fetchQuery(getEventQuery(locale, slug))) as
      | ApiResponse<unknown>
      | null

    if (!response?.status) return null
    const data = response.data
    if (!data || typeof data !== 'object') return null
    if (!('event' in data) || !('other_events' in data)) return null
    return data as EventDetailPayload
  } catch {
    return null
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const tStatic = await getTranslations({ locale, namespace: 'staticText' })
  const tEventsPage = await getTranslations({ locale, namespace: 'eventsPage' })

  const payload = await getEventDetail(locale, slug)

  if (!payload?.event) notFound()

  const event = payload.event
  const joinLink = event.join_link?.trim() || null
  const picked = (payload.other_events ?? [])
    .filter((item) => item.slug !== slug)
    .slice(0, 2)

  return (
    <section className="bg-[#f8fafc] py-8 md:py-[70px]">
      <Container>
        <div className="rounded-2xl border border-[#eaf1fa] bg-white p-6 sm:p-10">
          <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 sm:gap-12">
            <nav className="flex items-center gap-1 text-xs leading-4">
              <Link href="/events" className="text-[#6b6e71] hover:underline">
                {tStatic('events.breadcrumb')}
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
                    <span className="text-sm leading-5">{tEventsPage('publishedAt')}</span>
                    <span className="text-sm leading-5">{event.created_at}</span>
                  </div>

                  {event.read_time ? (
                    <div className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-white px-2.5 py-2 text-sm leading-5 text-[#1d212a]">
                      <Clock className="size-5 shrink-0" aria-hidden />
                      <span className="text-sm leading-5">{event.read_time}</span>
                    </div>
                  ) : null}

                  <EventShareLinks locale={locale} slug={event.slug} title={event.name} />
                </div>

                {joinLink ? (
                  <Link
                    href={joinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tEventsPage('registrationLink')}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-[#0c3a66] px-2.5 py-2 text-sm leading-5 text-white"
                  >
                    <span>{tEventsPage('registrationLink')}</span>
                  </Link>
                ) : null}
              </div>
            </div>

            <article className="flex flex-col gap-6">
              <h2 className="text-balance text-2xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
                {tStatic('events.about')}
              </h2>
              <div className="flex flex-col gap-4 text-sm leading-6 text-[#6b6e71] sm:text-base">
                <div
                  // API returns HTML (e.g. <div>...</div>).
                  // Rendering it preserves formatting from the backend CMS.
                  dangerouslySetInnerHTML={{ __html: toRenderableHtml(event.description) }}
                />
              </div>
            </article>

            {picked.length > 0 ? (
              <div className="flex flex-col gap-6 pt-2">
                <p className="text-balance text-2xl font-semibold leading-tight text-[#6b6e71] sm:text-[40px] sm:leading-[56px]">
                  <span>{tEventsPage('selectedForYou')} </span>
                  <span className="text-[#14171a]">{tEventsPage('picks')}</span>
                </p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {picked.map((item) => {
                    const plain = stripHtmlToText(item.description)

                    return (
                      <Link
                        key={`${item.slug}-${item.created_at}`}
                        href={`/events/${item.slug}`}
                        className="group flex size-full flex-col items-start gap-4 rounded-2xl border border-[#eaf1fa] bg-[#fafdff] px-2 pb-5 pt-2"
                      >
                        <div className="relative h-[320px] w-full shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 1024px) 100vw, 484px"
                          />
                        </div>

                        <div className="flex w-full shrink-0 flex-col items-start gap-6 px-2">
                          <div className="flex w-full flex-col items-center gap-3">
                            <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[20px] font-semibold leading-7 text-[#14171a]">
                              {item.name}
                            </p>
                            {plain ? (
                              <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal leading-6 text-[#6b6e71]">
                                {plain}
                              </p>
                            ) : null}
                          </div>

                          <div className="flex w-full items-center justify-between">
                            {item.read_time ? (
                              <div className="flex items-center gap-[5px]">
                                <Clock className="size-5 shrink-0" aria-hidden />
                                <p className="whitespace-nowrap text-base font-normal leading-6 text-[#6b6e71]">
                                  {item.read_time}
                                </p>
                              </div>
                            ) : <div />}

                            <div className="flex items-center gap-[5px]">
                             <Calendar1 className="size-5 shrink-0" aria-hidden />
                              <p className="text-base font-normal leading-6 text-[#6b6e71]">
                                {item.created_at}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}
