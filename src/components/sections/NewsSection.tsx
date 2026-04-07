'use client'

import Image from 'next/image'
import { Calendar, ChevronDown, Clock, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import Container from '@/components/shared/container'
import { Input } from '@/components/ui/input'
import { Link } from '@/i18n/navigation'
import type { BlogHomePost } from '@/utils/blogsdata'
import {
  blogHomePosts,
  formatBlogPostDate,
  getBlogHomeUi,
  getBlogPostContent,
  getNewsUi
} from '@/utils/blogsdata'

type NewsTab = 'all' | BlogHomePost['category']

export default function NewsSection() {
  const ui = getNewsUi()
  const homeUi = getBlogHomeUi()

  const [tab, setTab] = useState<NewsTab>('all')
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(9)

  const tabs = useMemo(
    () =>
      [
        { id: 'all' as const, label: ui.tabs.all },
        { id: 'networking' as const, label: ui.tabs.networking },
        { id: 'tender' as const, label: ui.tabs.tender },
        { id: 'events' as const, label: ui.tabs.events },
        { id: 'news' as const, label: ui.tabs.news }
      ] as const,
    [ui]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return blogHomePosts
      .filter((p) => (tab === 'all' ? true : p.category === tab))
      .filter((p) => {
        if (!q) return true
        const content = getBlogPostContent(p)
        const title = content.title.toLowerCase()
        const excerpt = content.excerpt.toLowerCase()
        return title.includes(q) || excerpt.includes(q)
      })
  }, [query, tab])

  const shown = filtered.slice(0, visible)
  const canLoadMore = visible < filtered.length

  return (
    <section className="bg-[#f8fafc] pb-16 pt-10 sm:pb-24 sm:pt-12">
      <Container>
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="flex w-full gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((x) => {
              const isActive = tab === x.id
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => {
                    setTab(x.id)
                    setVisible(9)
                  }}
                  className={`shrink-0 rounded-xl border px-4 py-2 text-base leading-6 transition-colors ${
                    isActive
                      ? 'border-[#f8fafc] bg-[#0f477d] font-medium text-white'
                      : 'border-[#eaf1fa] bg-white text-[#32393f]'
                  }`}
                >
                  {x.label}
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="relative w-full sm:max-w-[380px]">
              <Search
                className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#889097]"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={ui.searchPlaceholder}
                className="h-12 rounded-xl border-[#dadee2] bg-white pl-10 pr-3 text-base text-[#32393f] placeholder:text-[#889097] focus-visible:ring-0"
              />
            </div>

            <button
              type="button"
              className="inline-flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-[#dadee2] bg-white px-4 text-base leading-6 text-[#32393f] sm:w-[200px]"
              aria-label={ui.filterDate}
            >
              <span>{ui.filterDate}</span>
              <Calendar className="size-5 text-[#32393f]" aria-hidden />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {shown.map((post) => {
              const content = getBlogPostContent(post)
              const title = content.title
              const excerpt = content.excerpt

              return (
                <Link
                  key={`${post.key}-${post.slug}`}
                  href={`/news/${post.slug}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-[#eaf1fa] bg-white px-2 pb-5 pt-2"
                >
                  <div className="relative h-[220px] w-full overflow-hidden rounded-xl min-[400px]:h-[280px] sm:h-[320px]">
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
                      <p className="line-clamp-1 text-xl font-semibold leading-7 text-[#14171a]">
                        {title}
                      </p>
                      <p className="line-clamp-2 text-base leading-6 text-[#6b6e71]">
                        {excerpt}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                      <div className="flex items-center gap-1.5 text-[#6b6e71]">
                        <Clock className="size-4 shrink-0 sm:size-5" aria-hidden />
                        <span className="text-sm leading-5 sm:text-base sm:leading-6">
                          {homeUi.readTime(post.readTimeMinutes)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#6b6e71]">
                        <Calendar className="size-4 shrink-0 sm:size-5" aria-hidden />
                        <span className="text-sm leading-5 sm:text-base sm:leading-6">
                          {formatBlogPostDate(post.dateISO, 'az')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {canLoadMore ? (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + 9)}
                className="inline-flex items-center gap-1 text-base font-medium leading-6 text-[#64717c] transition-opacity hover:opacity-80"
              >
                {ui.loadMore}
                <ChevronDown className="size-6" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
