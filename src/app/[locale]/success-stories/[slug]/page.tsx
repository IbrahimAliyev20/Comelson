import Image from 'next/image'
import { notFound } from 'next/navigation'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { getServerQueryClient } from '@/providers/server'
import {
  getSuccessStoriesBySlugQuery,
  getSuccessStoriesQuery
} from '@/services/success-stories/queries'

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
      return id ? `https://www.youtube.com/embed/${id}` : normalized
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

  return normalized
}

export default async function SuccessStoryDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const queryClient = getServerQueryClient()
  const storiesResponse = await queryClient.fetchQuery(getSuccessStoriesQuery(locale))
  const stories = storiesResponse?.data ?? []

  let story = null

  try {
    const storyResponse = await queryClient.fetchQuery(
      getSuccessStoriesBySlugQuery(slug, locale)
    )
    story = storyResponse?.data ?? null
  } catch {
    story = stories.find((item) => item.slug === slug) ?? null
  }

  if (!story) {
    story = stories.find((item) => item.slug === slug) ?? null
  }

  if (!story) notFound()

  const embedSrc = getEmbedSrc(story.link)
  const relatedStories = stories.filter((item) => item.slug !== slug).slice(0, 3)

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
                  {embedSrc ? (
                    <iframe
                      src={embedSrc}
                      title={story.name}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : null}
                </div>
              </div>

              <div className="w-full rounded-[14px] bg-[#f5fbff] p-5 sm:p-8 lg:col-span-3">
                <div className="flex h-full flex-col justify-between gap-8">
                  <div className="flex flex-col gap-6 sm:gap-8">
                    <div className="flex items-center gap-4">
                      <div className="relative size-16 overflow-hidden rounded-full bg-white">
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

                    <blockquote className="text-pretty text-[20px] font-normal leading-8 text-[#32393f] sm:text-[28px] sm:leading-9">
                      {story.comment}
                    </blockquote>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <p className="text-base font-medium leading-7 text-[#14171a] sm:text-xl sm:leading-7">
                      {story.name}
                    </p>
                    <p className="text-sm leading-6 text-[#6b6e71] sm:text-base sm:leading-6">
                      {story.profession}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {relatedStories.length > 0 ? (
        <section className="bg-[#f8fafc] py-8 md:py-[70px]">
          <Container>
            <div className="flex flex-col gap-8 sm:gap-12">
              <h2 className="text-balance text-[28px] font-semibold leading-[36px] text-[#6b6e71] sm:text-[40px] sm:leading-[56px]">
                <span>{`Sizin üçün `}</span>
                <span className="text-[#14171a]">Seçdiklərimiz</span>
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedStories.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/success-stories/${item.slug}`}
                    className="flex flex-col items-start rounded-[14px] border border-[#eaf1fa] bg-white p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f477d]/40"
                  >
                    <div className="flex w-full flex-col gap-10">
                      <div className="flex w-full flex-col gap-8">
                        <div className="flex items-center gap-4">
                          <div className="relative size-16 overflow-hidden rounded-full bg-white">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="h-16 w-16 object-cover"
                            />
                          </div>
                          <p className="text-xl font-medium leading-6 text-[#0f477d]">
                            {item.name}
                          </p>
                        </div>

                        <blockquote className="text-pretty line-clamp-4 text-xl font-medium leading-8 text-[#32393f] sm:text-2xl sm:leading-8">
                          {item.comment}
                        </blockquote>

                        <div className="flex flex-col gap-1.5">
                          <p className="text-base font-medium leading-6 text-[#14171a]">
                            {item.name}
                          </p>
                          <p className="text-sm leading-5 text-[#6b6e71]">
                            {item.profession}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>
      ) : null}
    </div>
  )
}
