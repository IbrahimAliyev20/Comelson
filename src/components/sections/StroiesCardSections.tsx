'use client'

import Image from 'next/image'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { SuccessStoriesResponse } from '@/types/types'

export default function StroiesCardSections({
  successStories
}: {
  successStories: SuccessStoriesResponse[] | undefined
}) {
  const stories = successStories ?? []

  if (stories.length === 0) return null

  return (
    <section className="bg-[#f8fafc]  py-8 md:py-[70px]">
      <Container>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, idx) => (
            <Link
              key={`${story.slug}-${idx}`}
              href={`/success-stories/${story.slug}`}
              className="group flex w-full flex-col items-start rounded-[14px] border border-[#eaf1fa] bg-white hover:bg-[#EDF1F7] p-6 transition-shadow  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f477d]/40"
            >
              <div className="flex w-full flex-col  h-full gap-10">
                <div className="flex w-full flex-col justify-between h-full gap-8">
                  <div className="flex items-center gap-4">
                    <div className="relative size-16 overflow-hidden rounded-full">
                      <Image
                        src={story.image}
                        alt={story.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 object-cover"
                      />
                    </div>
                    <p className="text-xl font-medium leading-6 text-[#0f477d]">
                      {story.name}
                    </p>
                  </div>

                  <blockquote className="line-clamp-3 text-xl font-medium leading-8 text-[#32393f] sm:text-2xl sm:leading-8">
                    {story.comment}
                  </blockquote>

                  <div className="flex flex-col gap-1.5">
                    <p className="text-base font-medium leading-6 text-[#14171a]">
                      {story.name}
                    </p>
                    <p className="text-sm leading-5 text-[#6b6e71]">
                      {story.profession}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
