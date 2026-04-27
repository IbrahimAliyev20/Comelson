import Image from 'next/image'
import { AboutResponse } from '@/types/types'

export default async function AboutSection({ about }: { about: AboutResponse | undefined }) {

  return (
    <section className="bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-[1040px] px-3 sm:px-4 md:px-0">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-10">
            <div className="shrink-0">
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-4 sm:gap-6" dangerouslySetInnerHTML={{ __html: about?.description ?? '' }} />
            
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
