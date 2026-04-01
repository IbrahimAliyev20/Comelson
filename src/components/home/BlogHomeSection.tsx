import Image from 'next/image'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import type { BlogHomePost } from '@/utils/blogsdata'
import { blogHomePosts } from '@/utils/blogsdata'

function blogPostMessageKeys(key: BlogHomePost['key']) {
  switch (key) {
    case 'opportunities':
      return {
        title: 'blogPosts.opportunities.title' as const,
        excerpt: 'blogPosts.opportunities.excerpt' as const
      }
    case 'sectorNews':
      return {
        title: 'blogPosts.sectorNews.title' as const,
        excerpt: 'blogPosts.sectorNews.excerpt' as const
      }
    case 'networking':
      return {
        title: 'blogPosts.networking.title' as const,
        excerpt: 'blogPosts.networking.excerpt' as const
      }
  }
}

function formatPostDate(iso: string, locale: string) {
  const d = new Date(`${iso}T12:00:00`)
  const loc = locale === 'az' ? 'az-AZ' : 'en-GB'
  return new Intl.DateTimeFormat(loc, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d)
}

export default async function BlogHomeSection() {
  const t = await getTranslations('home')
  const locale = await getLocale()

  return (
    <section className="bg-white pb-16 pt-20 md:pb-[90px] md:pt-[100px]">
      <Container>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="max-w-[498px] text-balance text-3xl font-semibold leading-tight md:text-[40px] md:leading-[56px]">
              <span className="text-black">{t('blogTitleBlack')}</span>
              <span className="text-[#6b6e71]">{t('blogTitleGray')}</span>
            </h2>

            <Link
              href="/news"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-2xl px-6 py-3 text-base font-medium leading-6 text-black transition-opacity hover:opacity-80"
            >
              {t('blogCta')}
              <ArrowRight className="size-6 shrink-0" aria-hidden />
            </Link>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:flex-wrap lg:gap-6">
            {blogHomePosts.map((post) => {
              const keys = blogPostMessageKeys(post.key)
              const title = t(keys.title)
              return (
              <Link
                key={post.key}
                href={`/news/${post.slug}`}
                className="group flex w-full max-w-[421px] flex-col gap-4 rounded-2xl border border-[#e5e6e5] bg-white p-2 pb-5 transition-shadow hover:shadow-md lg:shrink-0"
              >
                <div className="relative h-[320px] w-full overflow-hidden rounded-xl">
                  <Image
                    src={post.imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 421px"
                  />
                </div>

                <div className="flex flex-col gap-6 px-2">
                  <div className="flex flex-col gap-3">
                    <p className="line-clamp-1 text-xl font-semibold leading-7 text-[#161e17]">
                      {title}
                    </p>
                    <p className="line-clamp-3 text-base leading-6 tracking-[0.16px] text-[#494f4a]">
                      {t(keys.excerpt)}
                    </p>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-[5px] text-[#494f4a]">
                      <Clock className="size-5 shrink-0" aria-hidden />
                      <span className="whitespace-nowrap text-base font-medium leading-6">
                        {t('blogReadTime', { minutes: post.readTimeMinutes })}
                      </span>
                    </div>
                    <div className="flex items-center gap-[5px] text-[#494f4a]">
                      <Calendar className="size-5 shrink-0" aria-hidden />
                      <span className="whitespace-nowrap text-base font-medium leading-6">
                        {formatPostDate(post.dateISO, locale)}
                      </span>
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
  )
}
