'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { SuccessStoriesResponse } from '@/types/types'

function normalizeExternalUrl(url: string) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

function getEmbedSrc(url: string) {
  const normalized = normalizeExternalUrl(url)
  if (!normalized) return null

  try {
    const parsed = new URL(normalized)

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '').trim()
      return id ? `https://www.youtube.com/embed/${id}` : normalized
    }

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`

      const parts = parsed.pathname.split('/').filter(Boolean)
      const embedIndex = parts.findIndex((part) => part === 'embed')
      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        return `https://www.youtube.com/embed/${parts[embedIndex + 1]}`
      }
    }
  } catch {
    return null
  }

  return normalized
}

export default function SuccessHomeStories({
  successStories
}: {
  successStories: SuccessStoriesResponse[] | undefined
}) {
  const t = useTranslations('home')
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const stories = successStories ?? []
  const hasStories = stories.length > 0

  useEffect(() => {
    if (stories.length <= 1) return
    if (isPaused) return
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    )?.matches
    if (prefersReducedMotion) return

    const clear = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    const tick = () => {
      if (document.visibilityState === 'hidden') return
      setActive((v) => (v + 1) % stories.length)
    }

    clear()
    intervalRef.current = window.setInterval(tick, 7000)
    return clear
  }, [isPaused, stories.length])

  if (!hasStories) return null

  const slide = stories[active]
  const embedSrc = getEmbedSrc(slide.link)

  return (
    <section className="bg-white py-8 md:py-[60px]">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="max-w-[720px] text-balance text-3xl font-semibold leading-tight text-[#14171a] md:text-[40px] md:leading-[56px]">
              <span className="text-[#14171a]">{t('successStoriesTitleBlack')}</span>
              <span className="text-[#14171a]">{t('successStoriesTitleMid')}</span>
              <span className="text-[#6b6e71]">{t('successStoriesTitleGray')}</span>
            </h2>

            <Link
              href="/success-stories"
              className="hidden h-12 shrink-0 items-center justify-center gap-3 rounded-2xl px-6 py-3 text-base font-medium leading-6 text-[#14171a] transition-colors hover:text-[#0f477d] lg:inline-flex"
            >
              {t('successStoriesCta')}
              <ArrowRight className="size-6 shrink-0 transition-colors" aria-hidden />
            </Link>
          </div>

          <div
            className="flex flex-col items-center gap-8 overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
          >
            <div className="flex w-full flex-col gap-8 md:flex-row md:items-stretch md:gap-8 lg:gap-12 ">
              <div className="relative aspect-video w-full flex-1 overflow-hidden rounded-xl md:aspect-auto md:min-h-[360px] lg:h-[426px] lg:min-h-[426px]">
                {embedSrc ? (
                  <iframe
                    key={slide.slug}
                    src={embedSrc}
                    title={slide.name}
                    className="absolute inset-0 h-full w-full rounded-xl border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : null}
              </div>

              <div className="flex w-full shrink-0 flex-col rounded-[14px] bg-[#f4f6fa] p-6 sm:p-8 md:max-w-[46%] lg:h-[426px] lg:w-[min(100%,680px)] lg:max-w-[680px]">
                <div className="flex min-h-0 flex-1 flex-col justify-between gap-8">
                  <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-4">
                      <div className="relative size-16 overflow-hidden rounded-full">
                        <Image
                          src={slide.image}
                          alt={slide.name}
                          width={64}
                          height={64}
                          className="h-16 w-16 object-cover"
                        />
                      </div>
                      <p className="text-xl font-medium leading-6 text-[#0f477d]">
                        {slide.name}
                      </p>
                    </div>
                    <blockquote className="text-xl font-normal leading-8 text-[#1d212a] sm:text-[28px] sm:leading-9">
                      {slide.comment}
                    </blockquote>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-medium leading-7 text-[#1d212a] sm:text-xl sm:leading-7">
                      {slide.name}
                    </p>
                    <p className="text-base leading-6 text-[#64717c]">{slide.profession}</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label={t('successStoriesSliderLabel')}
            >
                {stories.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={active === index}
                    onClick={() => setActive(index)}
                    className={`h-[3px] w-10 rounded-[1px] transition-colors ${
                      active === index ? 'bg-[#0f477d]' : 'bg-[#0f477d]/32'
                    }`}
                  />
                ))}
            </div>

            <div className="flex justify-center lg:hidden">
              <Link
                href="/success-stories"
                className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl px-6 py-3 text-base font-medium leading-6 text-[#14171a] transition-colors hover:text-[#0f477d]"
              >
                {t('successStoriesCta')}
                <ArrowRight className="size-6 shrink-0 transition-colors" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
