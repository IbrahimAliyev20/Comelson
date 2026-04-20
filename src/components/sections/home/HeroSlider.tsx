'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { type ReactNode, useEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import type { SliderResponse } from '@/types/types'

type HeroSliderProps = {
  slides: SliderResponse[]
  fallback: {
    title: string
    description: string
    cta: string
  }
  children?: ReactNode
}

const AUTO_PLAY_MS = 5000

function normalizeUrl(url: string) {
  if (!url) return '/contact'
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return url
  return `https://${url}`
}

export default function HeroSlider({
  slides,
  fallback,
  children
}: HeroSliderProps) {
  const normalizedSlides = useMemo<SliderResponse[]>(() => {
    if (slides.length > 0) return slides

    return [
      {
        title: fallback.title,
        description: fallback.description,
        btn: fallback.cta,
        btn_link: '/contact',
        image: '/images/herobg.jpg',
        thumb_image: '/images/herobg.jpg'
      }
    ]
  }, [fallback, slides])

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (normalizedSlides.length <= 1) return

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % normalizedSlides.length)
    }, AUTO_PLAY_MS)

    return () => window.clearInterval(interval)
  }, [normalizedSlides.length])

  useEffect(() => {
    if (activeIndex <= normalizedSlides.length - 1) return
    setActiveIndex(0)
  }, [activeIndex, normalizedSlides.length])

  return (
    <>
      <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2">
        {normalizedSlides.map((slide, index) => (
          <div
            key={`${slide.image}-${index}`}
            className={cn(
              'absolute inset-0 transition-opacity duration-700 ease-out',
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            )}
            aria-hidden={index !== activeIndex}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={index === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      <div
        className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-[rgba(6,28,52,0.48)]"
        aria-hidden
      />

      <div className="relative z-10 flex w-full flex-1 flex-col justify-start gap-6 md:justify-between  lg:gap-[32px]">
        <div className="flex max-w-[628px] flex-col gap-7 md:gap-12 lg:gap-[56px]">
          <div className="relative min-h-[230px] sm:min-h-[260px] md:min-h-[300px] lg:min-h-[320px]">
            {normalizedSlides.map((slide, index) => (
              <div
                key={`${slide.title}-${index}`}
                className={cn(
                  'absolute inset-0 flex flex-col gap-5 transition-all duration-500 ease-out sm:gap-6',
                  index === activeIndex
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-4 opacity-0'
                )}
                aria-hidden={index !== activeIndex}
              >
                <h1 className="max-w-[14ch] text-balance text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl sm:leading-[1.04] md:max-w-[12ch] md:text-[56px] md:leading-[1.08] lg:max-w-[680px] lg:text-[64px] lg:leading-[80px]">
                  {slide.title}
                </h1>
                <p className="max-w-[620px] text-sm leading-6 text-[#d8dfea] sm:text-base sm:leading-7 md:max-w-[540px] lg:max-w-full lg:leading-6">
                  {slide.description}
                </p>
                <a
                  href={normalizeUrl(slide.btn_link)}
                  target={slide.btn_link.startsWith('/') ? undefined : '_blank'}
                  rel={slide.btn_link.startsWith('/') ? undefined : 'noopener noreferrer'}
                  className="mt-2 inline-flex h-11 w-[60%] items-center justify-center gap-3 rounded-2xl bg-white px-5 text-sm font-medium leading-6 text-[#0f477d] transition-all hover:opacity-90 sm:mt-3 sm:h-12 sm:w-fit sm:px-6 sm:text-base lg:h-12 lg:gap-4 lg:px-6"
                >
                  {slide.btn || fallback.cta}
                  <ArrowRight className="size-5 shrink-0 sm:size-6" aria-hidden />
                </a>
              </div>
            ))}
          </div>
        </div>

        {children}

        <div
          className="absolute bottom-5 left-1/2 flex -translate-x-1/2 justify-center gap-2 md:hidden"
          aria-hidden
        >
          {normalizedSlides.map((slide, index) => (
            <button
              key={`${slide.thumb_image}-${index}-mobile`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'h-[3px] rounded-[1px] transition-all duration-300',
                index === activeIndex ? 'w-10 bg-white' : 'w-10 bg-white/30'
              )}
            />
          ))}
        </div>

        <div
          className="mt-8 hidden justify-center gap-2 md:flex lg:mt-[32px]"
          aria-hidden
        >
          {normalizedSlides.map((slide, index) => (
            <button
              key={`${slide.thumb_image}-${index}-desktop`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'h-[3px] rounded-[1px] transition-all duration-300',
                index === activeIndex ? 'w-10 bg-white' : 'w-10 bg-white/30'
              )}
            />
          ))}
        </div>
      </div>
    </>
  )
}
