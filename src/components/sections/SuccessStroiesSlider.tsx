'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import Container from '../shared/container'
import { SuccessStoriesResponse } from '@/types/types'
import Image from 'next/image'

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
      return id ? `https://www.youtube.com/embed/${id}` : null
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

  return null
}

export default function SuccessStroiesSlider({
  successStories
}: {
  successStories: SuccessStoriesResponse[] | undefined
}) {
  const t = useTranslations('home')
  const stories = successStories ?? []
  const [active, setActive] = useState(0)

  const slide = stories[active]
  const canPrev = active > 0
  const canNext = active < stories.length - 1

  const title = useMemo(() => {
    return {
      black: 'Uğur',
      mid: ' Hekayələrimizi ',
      gray: 'Dinləyin'
    } as const
  }, [])

  if (stories.length === 0) return null

  const normalizedLink = normalizeExternalUrl(slide.link)
  const embedSrc = getEmbedSrc(slide.link) ?? normalizedLink

  return (
    <Container>
      <div className="flex flex-col gap-10 sm:gap-12">
        <div className="flex items-center justify-between">
          <h1 className="text-balance text-3xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
            <span>{title.black}</span>
            <span>{title.mid}</span>
            <span className="text-[#6b6e71]">{title.gray}</span>
          </h1>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-12">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl lg:aspect-auto lg:h-[426px] lg:flex-1">
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

            <div className="w-full rounded-[14px] bg-[#f5fbff] p-6 sm:p-8 lg:h-[426px] lg:w-[680px]">
              <div className="flex min-h-0 h-full flex-col justify-between gap-8">
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

                  <blockquote className="text-xl font-normal leading-8 text-[#32393f] sm:text-[28px] sm:leading-9">
                    {slide.comment}
                  </blockquote>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-lg font-medium leading-7 text-[#14171a] sm:text-xl">
                    {slide.name}
                  </p>
                  <p className="text-base leading-6 text-[#6b6e71]">
                    {slide.profession}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActive((v) => Math.max(0, v - 1))}
              disabled={!canPrev}
              aria-label="Previous"
              className={cn(
                'inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-[#eaf1fa] bg-[#e6eff6] transition-opacity',
                canPrev ? 'hover:opacity-80' : 'opacity-40'
              )}
            >
              <ChevronLeft className="size-7 text-[#0f477d]" aria-hidden />
            </button>

            <div className="flex items-center gap-2" aria-label={t('successStoriesSliderLabel')}>
              {stories.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActive(index)}
                  className={cn(
                    'h-[4px] rounded-full transition-all',
                    index === active ? 'w-10 bg-[#0f477d]' : 'w-6 bg-[#c7d8e8]'
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActive((v) => Math.min(stories.length - 1, v + 1))}
              disabled={!canNext}
              aria-label="Next"
              className={cn(
                'inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-[#eaf1fa] bg-[#e6eff6] transition-opacity',
                canNext ? 'hover:opacity-80' : 'opacity-40'
              )}
            >
              <ChevronRight className="size-7 text-[#0f477d]" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </Container>
  )
}
