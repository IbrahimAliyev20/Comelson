'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import type { SuccessStoryKey } from '@/utils/success-stories-data'
import { successStoriesSlides, youtubeEmbedSrc } from '@/utils/success-stories-data'
import Image from 'next/image'

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

export default function SuccesStories() {
  const t = useTranslations('home')
  const [active, setActive] = useState(0)

  const slide = successStoriesSlides[active]
  const keys = storyMessageKeys(slide.key)
  const embedSrc = youtubeEmbedSrc(slide.youtubeVideoId)

  return (
    <section className="bg-white pb-[72px] pt-20 md:pt-[100px]">
      <Container>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="max-w-[720px] text-balance text-3xl font-semibold leading-tight text-[#14171a] md:text-[40px] md:leading-[56px]">
              <span className="text-[#14171a]">{t('successStoriesTitleBlack')}</span>
              <span className="text-[#14171a]">{t('successStoriesTitleMid')}</span>
              <span className="text-[#6b6e71]">{t('successStoriesTitleGray')}</span>
            </h2>

            <Link
              href="/success-stories"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-2xl px-6 py-3 text-base font-medium leading-6 text-black transition-opacity hover:opacity-80"
            >
              {t('successStoriesCta')}
              <ArrowRight className="size-6 shrink-0" aria-hidden />
            </Link>
          </div>

          <div className="flex flex-col items-center gap-8 overflow-hidden rounded-2xl">
            <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-12">
              <div className="relative aspect-video w-full flex-1 overflow-hidden rounded-xl lg:aspect-auto lg:h-[426px] lg:min-h-[426px]">
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

              <div className="flex w-full shrink-0 flex-col rounded-[14px] bg-[#f4f6fa] p-6 sm:p-8 lg:h-[426px] lg:w-[min(100%,680px)] lg:max-w-[680px]">
                <div className="flex min-h-0 flex-1 flex-col justify-between gap-8">
                  <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-2.5">
                <Image src={keys.logo} alt={t(keys.company)} width={100} height={100} />
                    </div>
                    <blockquote className="text-xl font-normal leading-8 text-[#1d212a] sm:text-[28px] sm:leading-9">
                      {t(keys.quote)}
                    </blockquote>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-medium leading-7 text-[#1d212a] sm:text-xl sm:leading-7">
                      {t(keys.author)}
                    </p>
                    <p className="text-base leading-6 text-[#64717c]">{t(keys.role)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label={t('successStoriesSliderLabel')}
            >
              {successStoriesSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  onClick={() => setActive(index)}
                  className={`h-[3px] w-10 rounded-[1px] transition-colors ${
                    active === index
                      ? 'bg-[#0f477d]'
                      : 'bg-[#0f477d]/32'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
