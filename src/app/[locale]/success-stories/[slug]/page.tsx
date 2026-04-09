
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import {
  getSuccessStoryBySlug,
  getSuccessStoryMessageKeys,
  successStoriesSlides,
  youtubeEmbedSrc
} from '@/utils/success-stories-data'

export default async function SuccessStoryDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params

  const story = getSuccessStoryBySlug(slug)
  if (!story) notFound()

  const t = await getTranslations('home')
  const keys = getSuccessStoryMessageKeys(story.key)

  return (
    <div className="w-full">
      <section className="bg-white pb-12 pt-8 sm:pb-[72px] sm:pt-8">
        <Container>
          <div className="flex flex-col gap-6 sm:gap-12">
            <div className="flex w-full items-center justify-between">
              <h1 className="text-balance text-[28px] font-semibold leading-[36px] text-[#14171a] sm:text-[40px] sm:leading-[56px]">
                <span>Uğur</span>
                <span className="text-[#14171a]">{` Hekayələrimizi `}</span>
                <span className="text-[#6b6e71]">Dinləyin</span>
              </h1>
            </div>

            <div className="grid w-full grid-cols-1 gap-6 px-0 lg:grid-cols-5 lg:gap-12 lg:px-10">
              <div className="w-full overflow-hidden rounded-[12px] lg:col-span-2">
                <div className="relative h-[240px] w-full sm:h-[320px] lg:h-[426px]">
                  <iframe
                    src={youtubeEmbedSrc(story.youtubeVideoId)}
                    title={t(keys.company)}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="w-full rounded-[14px] bg-[#f5fbff] p-5 sm:p-8 lg:col-span-3">
                <div className="flex h-full flex-col justify-between gap-8">
                  <div className="flex flex-col gap-6 sm:gap-8">
                    <div className="flex items-center gap-4">
                      <div className="relative size-16 overflow-hidden rounded-full bg-white">
                        <Image
                          src={keys.logo}
                          alt={t(keys.company)}
                          width={64}
                          height={64}
                          className="h-16 w-16 object-cover"
                        />
                      </div>
                      <p className="text-xl font-medium leading-6 text-[#0f477d]">
                        {t(keys.company)}
                      </p>
                    </div>

                    <blockquote className="text-pretty text-[20px] font-normal leading-8 text-[#32393f] sm:text-[28px] sm:leading-9">
                      “{t(keys.quote)}”
                    </blockquote>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <p className="text-base font-medium leading-7 text-[#14171a] sm:text-xl sm:leading-7">
                      {t(keys.author)}
                    </p>
                    <p className="text-sm leading-6 text-[#6b6e71] sm:text-base sm:leading-6">
                      {t(keys.role)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#f8fafc] py-12 sm:py-16">
        <Container>
          <div className="flex flex-col gap-8 sm:gap-12">
            <h2 className="text-balance text-[28px] font-semibold leading-[36px] text-[#6b6e71] sm:text-[40px] sm:leading-[56px]">
              <span>{`Sizin üçün `}</span>
              <span className="text-[#14171a]">Seçdiklərimiz</span>
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {successStoriesSlides
                .filter((x) => x.slug !== slug)
                .concat(successStoriesSlides)
                .slice(0, 3)
                .map((item) => {
                  const itemKeys = getSuccessStoryMessageKeys(item.key)

                  return (
                    <Link
                      key={item.slug}
                      href={`/success-stories/${item.slug}`}
                      className="flex flex-col items-start rounded-[14px] border border-[#eaf1fa] bg-white p-6  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f477d]/40"
                    >
                      <div className="flex w-full flex-col gap-10">
                        <div className="flex w-full flex-col gap-8">
                          <div className="flex items-center gap-4">
                            <div className="relative size-16 overflow-hidden rounded-full bg-white">
                              <Image
                                src={itemKeys.logo}
                                alt={t(itemKeys.company)}
                                width={64}
                                height={64}
                                className="h-16 w-16 object-cover"
                              />
                            </div>
                            <p className="text-xl font-medium leading-6 text-[#0f477d]">
                              {t(itemKeys.company)}
                            </p>
                          </div>

                          <blockquote className="text-pretty text-xl font-medium leading-8 text-[#32393f] sm:text-2xl sm:leading-8">
                            “{t(itemKeys.quote)}”
                          </blockquote>

                          <div className="flex flex-col gap-1.5">
                            <p className="text-base font-medium leading-6 text-[#14171a]">
                              {t(itemKeys.author)}
                            </p>
                            <p className="text-sm leading-5 text-[#6b6e71]">
                              {t(itemKeys.role)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
