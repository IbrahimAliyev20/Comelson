'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef } from 'react'

import { Link } from '@/i18n/navigation'
import type { MemberResponse } from '@/types/types'

const AUTOPLAY_MS = 2600

function getMemberName(member: MemberResponse): string {
  return member.name ?? member.company ?? 'Company'
}

function getMemberImage(member: MemberResponse): string {
  return member.logo_url ?? member.image ?? '/images/Logo.svg'
}

export default function MembersCarousel({
  members,
}: {
  members: MemberResponse[]
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const items = useMemo(() => members.slice(0, 8), [members])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const id = window.setInterval(() => {
      const first = el.querySelector<HTMLElement>('[data-carousel-item]')
      if (!first) return

      const gapPx = 20
      const step = first.offsetWidth + gapPx
      const maxLeft = el.scrollWidth - el.clientWidth

      if (el.scrollLeft + step >= maxLeft - 2) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
        return
      }

      el.scrollBy({ left: step, behavior: 'smooth' })
    }, AUTOPLAY_MS)

    return () => window.clearInterval(id)
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex w-full gap-5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ scrollSnapType: 'x mandatory' }}
    >
      {items.map((member, idx) => (
        <Link
          key={member.id ?? member.slug ?? idx}
          href={`/members/${member.slug}`}
          data-carousel-item
          className="group w-[82%] shrink-0 overflow-hidden rounded-[10px] border border-[#e8eaed] bg-white p-6 transition-shadow hover:shadow-[0_14px_40px_rgba(15,71,125,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f477d]/40 min-[420px]:w-[70%] sm:w-[46%] md:w-[32%]"
          style={{ scrollSnapAlign: 'start' }}
        >
          <div className="flex h-[188px] items-center justify-center overflow-hidden rounded-[10px] bg-white">
            <Image
              src={getMemberImage(member)}
              alt={getMemberName(member)}
              width={360}
              height={240}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 82vw, (max-width: 768px) 46vw, 360px"
            />
          </div>
        </Link>
      ))}
    </div>
  )
}

