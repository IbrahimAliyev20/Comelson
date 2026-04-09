import Image from 'next/image'
import { AboutResponse } from '@/types/types'

export default async function AboutSection({ about }: { about: AboutResponse | undefined }) {

  return (
    <section className="bg-[#f8fafc] pb-16 pt-12 sm:pb-24 sm:pt-12 md:pb-24 md:pt-12">
      <div className="mx-auto w-full max-w-[1040px] px-3 sm:px-4 md:px-0">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-10">
            <div className="shrink-0">
              <div className="h-full w-[3px] rounded-full bg-[#3bbae9]" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-4 sm:gap-6" dangerouslySetInnerHTML={{ __html: about?.description ?? '' }} />
            
            </div>
          </div>

          <div className="relative h-[240px] w-full overflow-hidden rounded-2xl sm:h-[320px] md:h-[480px] md:rounded-[20px]">
            <Image
              src={about?.image_2 ?? ""}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1040px) 100vw, 1040px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
