'use client'

import { useMemo, useState } from 'react'
import { successStoriesSlides, SuccessStoryKey, youtubeEmbedSrc } from '@/utils/success-stories-data'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Container from '../shared/container'

function storyMessageKeys(key: SuccessStoryKey) {
  switch (key) {
    case 'cubekit':
      return {
        logo: '/images/Logo.svg',
        company: 'successStoriesItems.cubekit.company' as const,
        quote: 'successStoriesItems.cubekit.quote' as const,
        author: 'successStoriesItems.cubekit.author' as const,
        role: 'successStoriesItems.cubekit.role' as const
      }
    case 'ventureOne':
      return {
        logo: '/images/Logo.svg',
        company: 'successStoriesItems.ventureOne.company' as const,
        quote: 'successStoriesItems.ventureOne.quote' as const,
        author: 'successStoriesItems.ventureOne.author' as const,
        role: 'successStoriesItems.ventureOne.role' as const
      }
    case 'biznet':
      return {
        logo: '/images/Logo.svg',
        company: 'successStoriesItems.biznet.company' as const,
        quote: 'successStoriesItems.biznet.quote' as const,
        author: 'successStoriesItems.biznet.author' as const,
        role: 'successStoriesItems.biznet.role' as const
      }
  }
}


export default function SuccessStroiesSlider() {

  const t = useTranslations('home')
  const [active, setActive] = useState(0)

  const slide = successStoriesSlides[active]
  const keys = storyMessageKeys(slide.key)
  const embedSrc = youtubeEmbedSrc(slide.youtubeVideoId)

  const canPrev = active > 0
  const canNext = active < successStoriesSlides.length - 1

  const title = useMemo(() => {
    return {
      black: 'Uğur',
      mid: ' Hekayələrimizi ',
      gray: 'Dinləyin'
    } as const
  }, [])


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
              <iframe
                key={slide.key}
                src={embedSrc}
                title={t(keys.company)}
                className="absolute inset-0 h-full w-full rounded-xl border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            <div className="w-full rounded-[14px] bg-[#f5fbff] p-6 sm:p-8 lg:h-[426px] lg:w-[680px]">
              <div className="flex min-h-0 h-full flex-col justify-between gap-8">
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-4">
                    <div className="relative size-16 overflow-hidden rounded-full">
                      <Image
                        src={keys.logo}
                        alt={t(keys.company)}
                        width={64}
                        height={64}
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                    <p className="text-xl font-medium leading-6 text-[#0f477d]">
                      {t(keys.company)}
                    </p>
                  </div>

                  <blockquote className="text-xl font-normal leading-8 text-[#32393f] sm:text-[28px] sm:leading-9">
                    {t(keys.quote)}
                  </blockquote>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-lg font-medium leading-7 text-[#14171a] sm:text-xl">
                    {t(keys.author)}
                  </p>
                  <p className="text-base leading-6 text-[#6b6e71]">
                    {t(keys.role)}
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
                'cursor-pointer inline-flex size-12 items-center justify-center rounded-full border border-[#eaf1fa] bg-[#e6eff6] transition-opacity',
                canPrev ? 'hover:opacity-80' : 'opacity-40'
              )}
            >
              <ChevronLeft className="size-7 text-[#0f477d]" aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => setActive((v) => Math.min(successStoriesSlides.length - 1, v + 1))}
              disabled={!canNext}
              aria-label="Next"
              className={cn(
                'cursor-pointer inline-flex size-12 items-center justify-center rounded-full border border-[#eaf1fa] bg-[#e6eff6] transition-opacity',
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
