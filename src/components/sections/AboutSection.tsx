import Container from '@/components/shared/container'
import { toRenderableHtml } from '@/lib/html'
import type { AboutResponse } from '@/types/types'
import Image from 'next/image'

export default function AboutSection({ about }: { about: AboutResponse | undefined }) {
  if (!about) return null

  const image1 = about.image_1?.trim() || null

  return (
    <section className="bg-[#f8fafc] py-4 md:py-[40px]">
      <Container>
        <div className="mx-auto w-full max-w-[1040px] flex flex-col gap-6 sm:gap-8 md:gap-10">
          <div className="flex items-start gap-4 sm:gap-6 md:items-center md:gap-10">
            <div className="self-stretch">
              <div className="h-full w-[3px] bg-[#3bbae9]" aria-hidden />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-6">
         
              <div
                className="text-base font-normal leading-6 text-[#6b6e71] [&_p]:mb-6 [&_p:last-child]:mb-0 [&_p:empty]:hidden"
                dangerouslySetInnerHTML={{ __html: toRenderableHtml(about.description) }}
              />
            </div>
          </div>

          {image1 ? (
            <Image
              src={image1}
              alt={about.title ?? ''}
              width={1040}
              height={480}
              className="h-[220px] w-full rounded-[16px] object-cover sm:h-[280px] sm:rounded-[20px] lg:h-[480px]"
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 1040px, 1040px"
            />
          ) : null}

          <div className="flex items-start gap-4 sm:gap-6 md:items-center md:gap-10">
            <div className="self-stretch">
              <div className="h-full w-[3px] bg-[#3bbae9]" aria-hidden />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-6">
         
              <div
                className="text-base font-normal leading-6 text-[#6b6e71] [&_p]:mb-6 [&_p:last-child]:mb-0 [&_p:empty]:hidden"
                dangerouslySetInnerHTML={{ __html: toRenderableHtml(about.short_description_2) }}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
