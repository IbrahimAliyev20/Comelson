 'use client'

import Image from 'next/image'
import { Calendar, ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { EventCategory } from '@/utils/events-data'
import { eventsList } from '@/utils/events-data'

type TabId = 'events' | 'forums' | 'exhibitions'

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'events', label: 'Tədbirlər' },
  { id: 'forums', label: 'Forumlar' },
  { id: 'exhibitions', label: 'Sərgilər' }
]

function isCategory(tab: TabId, category: EventCategory) {
  return tab === category
}

export default function EventsSection() {
  const [tab, setTab] = useState<TabId>('events')
  const [visible, setVisible] = useState(9)

  const filtered = useMemo(() => {
    return eventsList.filter((x) => isCategory(tab, x.category))
  }, [tab])

  const shown = filtered.slice(0, visible)
  const canLoadMore = visible < filtered.length

  return (
    <section className="bg-[#f8fafc] pb-16 pt-6 sm:pb-24">
      <Container>
        <div className="flex flex-col items-center gap-10">
          <div className="w-full border-b border-[#dadee2]">
            <div className="flex items-center">
              {tabs.map((x) => {
                const isActive = tab === x.id
                return (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => {
                      setTab(x.id)
                      setVisible(9)
                    }}
                    className={cn(
                      'inline-flex items-center justify-center px-5 pb-3 pt-2 text-base font-medium leading-6',
                      isActive
                        ? 'border-b-2 border-[#0f477d] text-[#0f477d]'
                        : 'border-b border-transparent text-[#6b6e71]'
                    )}
                  >
                    {x.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((item) => (
              <Link
                key={item.id}
                href={`/events/${item.slug}`}
                className="flex w-full flex-col gap-4 rounded-2xl border border-[#eaf1fa] bg-white px-2 pb-5 pt-2"
              >
                <div className="relative h-[240px] w-full overflow-hidden rounded-xl sm:h-[280px] md:h-[320px]">
                  <Image
                    src={item.imageSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 421px"
                  />
                </div>

                <div className="flex flex-col gap-3 px-2">
                  <div className="flex items-center gap-[5px] text-[#6b6e71]">
                    <Calendar className="size-5 shrink-0" aria-hidden />
                    <span className="text-base leading-6">{item.date}</span>
                  </div>
                  <p className="line-clamp-2 text-xl font-semibold leading-7 text-[#14171a]">
                    {item.title}
                  </p>
                </div>
              </Link>
            ))}
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
