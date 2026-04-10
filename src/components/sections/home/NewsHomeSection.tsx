import Image from 'next/image'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { BlogResponse } from '@/types/types'
import { getServerLocale } from '@/lib/utils'

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function formatDate(value: string, locale: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

function extractReadTime(value: string) {
  const match = value.match(/\d+/)
  return match?.[0] ?? value
}

export default async function NewsHomeSection({ blogs }: { blogs: BlogResponse[] | undefined }) {
  const t = await getTranslations('home')
  const locale = await getServerLocale()
  const list = (blogs ?? []).slice(0, 3)
  if (list.length === 0) return null

  return (
    <section className="bg-white py-8  md:py-[60px]">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="max-w-[498px] text-balance text-3xl font-semibold leading-tight md:text-[40px] md:leading-[56px]">
              <span className="text-black">{t('blogTitleBlack')}</span>
              <span className="text-[#6b6e71]">{t('blogTitleGray')}</span>
            </h2>

            <Link
              href={`/${locale}/news`}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-2xl px-6 py-3 text-base font-medium leading-6 text-black transition-opacity hover:opacity-80"
            >
              {t('blogCta')}
              <ArrowRight className="size-6 shrink-0" aria-hidden />
            </Link>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:flex-wrap lg:gap-6">
            {list.map((post) => (
              <Link
                key={post.slug}
                href={`/${locale}/news/${post.slug}`}
                className="group flex w-full max-w-[421px] flex-col gap-4 rounded-2xl border border-[#e5e6e5] bg-white p-2 pb-5 transition-shadow hover:shadow-md lg:shrink-0"
              >
                <div className="relative h-[320px] w-full overflow-hidden rounded-xl">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 421px"
                  />
                </div>

                <div className="flex flex-col gap-6 px-2">
                  <div className="flex flex-col gap-3">
                    <p className="line-clamp-1 text-xl font-semibold leading-7 text-[#161e17]">{post.title}</p>
                    <p className="line-clamp-3 text-base leading-6 tracking-[0.16px] text-[#494f4a]">
                      {stripHtml(post.description ?? '')}
                    </p>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-[5px] text-[#494f4a]">
                      <Clock className="size-5 shrink-0" aria-hidden />
                      <span className="whitespace-nowrap text-base font-medium leading-6">
                        {t('blogReadTime', { minutes: Number(extractReadTime(post.read_time)) || 0 })}
                      </span>
                    </div>
                    {post.created_at ? (
                      <div className="flex items-center gap-[5px] text-[#494f4a]">
                        <Calendar className="size-5 shrink-0" aria-hidden />
                        <span className="whitespace-nowrap text-base font-medium leading-6">
                          {formatDate(post.created_at, locale)}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
