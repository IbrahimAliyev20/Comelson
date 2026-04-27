'use client'

import Image from 'next/image'
import { ArrowUpDown, Calendar, ChevronDown, Clock, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'

import Container from '@/components/shared/container'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Link } from '@/i18n/navigation'
import { getBlogsQuery } from '@/services/blogs/queries'
import { BlogCategoryResponse, BlogResponse } from '@/types/types'

function formatBlogPostDate(value: string, locale: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

function extractReadTime(value: string) {
  const match = value.match(/\d+/)
  return match?.[0] ?? value
}

export default function NewsSection({
  blogCategories,
  blogs
}: {
  blogCategories: BlogCategoryResponse[] | undefined
  blogs: BlogResponse[] | undefined
}) {
  const locale = useLocale()
  const t = useTranslations('home')
  const categories = useMemo(() => blogCategories ?? [], [blogCategories])
  const initialBlogs = useMemo(() => blogs ?? [], [blogs])

  const tabs = useMemo(() => {
    return [
      { key: 'all', label: t('news.tabs.all'), categoryId: null },
      ...categories.map((category, index) => ({
        key: category.slug || `${category.name}-${index}`,
        label: category.name,
        categoryId: index + 1
      }))
    ]
  }, [categories, t])

  const initialTabKey = tabs[0]?.key ?? 'all'
  const [activeTabKey, setActiveTabKey] = useState<string>(initialTabKey)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const [visible, setVisible] = useState(9)

  const activeTab = useMemo(() => {
    return tabs.find((tab) => tab.key === activeTabKey) ?? tabs[0]
  }, [activeTabKey, tabs])

  const categoryId = activeTab?.categoryId ?? null

  const blogsQuery = useQuery({
    ...getBlogsQuery(locale, categoryId, query.trim(), sort),
    initialData:
      activeTabKey === initialTabKey && query.trim() === ''
        ? { status: true, message: '', data: initialBlogs }
        : undefined,
    enabled: categoryId === null || Number.isFinite(categoryId)
  })

  const list = blogsQuery.data?.data ?? []
  const shown = list.slice(0, visible)
  const canLoadMore = visible < list.length
  const isLoading = blogsQuery.isLoading
  const isError = blogsQuery.isError

  return (
    <section className="bg-[#f8fafc] py-8 md:py-[70px]">
      <Container>
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="flex w-full gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((x) => {
              const isActive = activeTabKey === x.key
              return (
                <button
                  key={x.key}
                  type="button"
                  onClick={() => {
                    setActiveTabKey(x.key)
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

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
            <div className="relative w-full md:max-w-[380px]">
              <Search
                className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#889097]"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setVisible(9)
                }}
                placeholder={t('news.searchPlaceholder')}
                className="h-12 rounded-xl border-[#dadee2] bg-white pl-10 pr-3 text-base text-[#32393f] placeholder:text-[#889097] focus-visible:ring-0"
              />
            </div>

            <Select value={sort} onValueChange={(v) => setSort(v as 'asc' | 'desc')}>
              <SelectTrigger className="inline-flex h-12 w-auto items-center gap-3 rounded-xl border-[#dadee2] bg-white px-4 text-base leading-6 text-[#32393f] focus-visible:ring-0">
                <ArrowUpDown
                  className="size-5 shrink-0 text-[#32393f]"
                  aria-hidden
                />
                <SelectValue placeholder="Ən yeni paylaşılanlar" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem
                  value="desc"
                  className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                >
                  Ən yeni paylaşılanlar
                </SelectItem>
                <SelectItem
                  value="asc"
                  className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                >
                  Ən köhnə paylaşılanlar
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full py-10 text-center text-sm text-[#6b6e71]">Loading...</div>
            ) : isError ? (
              <div className="col-span-full py-10 text-center text-sm text-red-600">Failed to load blogs</div>
            ) : shown.length === 0 ? (
              <div className="col-span-full py-10 text-center text-sm text-[#6b6e71]">No blogs found</div>
            ) : (
              shown.map((post) => (
                <Link
                  key={post.slug}
                  href={`/news/${post.slug}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-[#eaf1fa] bg-white px-2 pb-5 pt-2"
                >
                  <div className="relative h-[220px] w-full overflow-hidden rounded-xl min-[400px]:h-[280px] sm:h-[320px]">
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
                      <p className="line-clamp-1 text-xl font-semibold leading-7 text-[#14171a]">
                        {post.title}
                      </p>
                      <p className="line-clamp-2 text-base leading-6 text-[#6b6e71]">
                        {post.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                      <div className="flex items-center gap-1.5 text-[#6b6e71]">
                        <Clock className="size-4 shrink-0 sm:size-5" aria-hidden />
                        <span className="text-sm leading-5 sm:text-base sm:leading-6">
                          {t('blogReadTime', { minutes: extractReadTime(post.read_time) })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#6b6e71]">
                        <Calendar className="size-4 shrink-0 sm:size-5" aria-hidden />
                        <span className="text-sm leading-5 sm:text-base sm:leading-6">
                          {formatBlogPostDate(post.created_at ?? '', locale)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {canLoadMore ? (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + 9)}
                className="inline-flex items-center gap-1 text-base font-medium leading-6 text-[#64717c] transition-opacity hover:opacity-80"
              >
                {t('news.loadMore')}
                <ChevronDown className="size-6" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
