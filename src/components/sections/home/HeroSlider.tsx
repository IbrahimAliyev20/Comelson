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

  const ctaClassName = useMemo(
    () =>
      cn(
        'mt-5 flex  items-center justify-center rounded-2xl bg-white font-medium text-[#0f477d] transition-opacity hover:opacity-90',
        'h-[47px] w-[55%] gap-3 px-6 text-base ',
        'sm:h-[44px] sm:w-fit',
        'md:h-14 md:min-w-[220px] md:gap-4 md:px-8 md:text-[17px]',
        'lg:h-12 lg:min-w-0 lg:px-6'
      ),
    []
  )

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
      {/* Background images */}
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
              alt="Slider"
              fill
              priority={index === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-[rgba(6,28,52,0.48)]"
        aria-hidden
      />

      {/* Main content wrapper */}
      <div className="relative z-10 flex w-full flex-1 flex-col">

        {/* Text section — always vertically centered */}
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex max-w-[628px] flex-col gap-8 md:max-w-[760px] md:gap-8 lg:gap-[56px]">
            <div className="relative min-h-[270px] sm:min-h-[260px] md:min-h-[300px] lg:min-h-[320px]">
              {normalizedSlides.map((slide, index) => (
                <div
                  key={`${slide.title}-${index}`}
                  className={cn(
                    'absolute inset-0 flex flex-col gap-4 transition-all duration-500 ease-out sm:gap-6',
                    index === activeIndex
                      ? 'translate-y-0 opacity-100'
                      : 'pointer-events-none translate-y-4 opacity-0'
                  )}
                  aria-hidden={index !== activeIndex}
                >
                  <h1 className="max-w-[14ch] text-balance text-[34px] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl sm:leading-[1.04] md:max-w-[17ch] md:text-[64px] md:leading-[1.02] lg:max-w-[680px] lg:text-[64px] lg:leading-[80px]">
                    {slide.title}
                  </h1>
                  <p className="max-w-[620px] text-sm leading-7 text-[#d8dfea] sm:text-base sm:leading-7 md:max-w-[620px] md:text-[17px] md:leading-8 lg:max-w-full lg:leading-6">
                    {slide.description}
                  </p>
                  <a
                    href={normalizeUrl(slide.btn_link)}
                    target={slide.btn_link.startsWith('/') ? undefined : '_blank'}
                    rel={slide.btn_link.startsWith('/') ? undefined : 'noopener noreferrer'}
                    className={ctaClassName}
                  >
                    {slide.btn || fallback.cta}
                    <ArrowRight className="size-5 shrink-0 sm:size-6" aria-hidden />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Children (e.g. logo strip) */}
        {children}

        {/* Dots — mobile */}
        <div
          className="mt-10   flex justify-center gap-2  md:hidden"
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

        {/* Dots — desktop */}
        <div
          className="mt-6 hidden justify-center gap-2 pb-2 md:flex lg:mt-8"
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