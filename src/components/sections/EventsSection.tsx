 'use client'

import Image from 'next/image'
import { Calendar, Calendar1, ChevronDown, Clock } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocale } from 'next-intl'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { getEventsQuery } from '@/services/events/queries'
import { EventResponse } from '@/types/types'

function formatEventDate(value: string) {
  const raw = value.trim()
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (match) {
    const [, year, month, day] = match
    return `${day}.${month}.${year}`
  }

  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return value

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}

export default function EventsSection({
  events
}: {
  events: EventResponse[] | undefined
}) {
  const locale = useLocale()
  const initialEvents = useMemo(() => events ?? [], [events])
  const [visible, setVisible] = useState(9)

  const eventsQuery = useQuery({
    ...getEventsQuery(locale),
    initialData: { status: true, message: '', data: initialEvents },
  })

  const list = eventsQuery.data?.data ?? []
  const shown = list.slice(0, visible)
  const canLoadMore = visible < list.length

  const isLoading = eventsQuery.isLoading
  const isError = eventsQuery.isError

  return (
    <section className="bg-[#f8fafc] py-8 md:py-[70px]">
      <Container>
        <div className="flex flex-col items-center gap-10">
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full py-10 text-center text-sm text-[#6b6e71]">Loading...</div>
            ) : isError ? (
              <div className="col-span-full py-10 text-center text-sm text-red-600">Failed to load events</div>
            ) : shown.length === 0 ? (
              <div className="col-span-full py-10 text-center text-sm text-[#6b6e71]">No events found</div>
            ) : (
              shown.map((item) => (
                <Link
                  key={`${item.slug}-${item.created_at}`}
                  href={`/${locale}/events/${item.slug}`}
                  className="group flex w-full flex-col gap-4 rounded-2xl border border-[#eaf1fa] bg-white px-2 pb-5 pt-2"
                >
                  <div className="relative h-[240px] w-full overflow-hidden rounded-xl sm:h-[280px] md:h-[320px]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 421px"
                    />
                  </div>

                  <div className="flex w-full flex-col gap-6 px-2">
                    <div className="flex flex-col gap-3">
                      <p className="line-clamp-1 text-xl font-semibold leading-7 text-[#14171a]">
                      {item.name}
                      </p>
                    </div>

                    <div className="flex w-full items-start justify-between text-[#6b6e71]">
                      <div className="flex items-center gap-[5px]">
                        <Clock className="size-5 shrink-0" aria-hidden />
                        <span className="text-base leading-6">{item.read_time}  oxuma vaxtı</span>
                      </div>
                      <div className="flex items-center gap-[5px]">
                        <Calendar1 className="size-5 shrink-0" aria-hidden />
                        <span className="text-base leading-6">{formatEventDate(item.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {canLoadMore ? (
            <button
              type="button"
              onClick={() => setVisible((v) => v + 9)}
              className="inline-flex items-center justify-center gap-1 text-base font-medium leading-6 text-[#64717c] transition-opacity hover:opacity-80"
            >
              Daha çox
              <ChevronDown className="size-6" aria-hidden />
            </button>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
