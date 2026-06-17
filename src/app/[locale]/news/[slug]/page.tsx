import Image from 'next/image'
import { Calendar, Clock } from 'lucide-react'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { stripHtmlToText, toRenderableHtml } from '@/lib/html'
import { getServerQueryClient } from '@/providers/server'
import { getBlogQuery, getBlogsQuery } from '@/services/blogs/queries'
import { IconFacebook } from '@/../public/iconssvg/İconFacebook'
import { IconTelegram } from '@/../public/iconssvg/IconTelegram'
import { IconWhatsapp } from '@/../public/iconssvg/IconWhatsapp'
import { IconX } from '@/../public/iconssvg/IconX'

function formatBlogPostDate(value: string, locale: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

export default async function NewsDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const tNewsPage = await getTranslations({ locale, namespace: 'newsPage' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const queryClient = getServerQueryClient()

  const blogsResponse = await queryClient.fetchQuery(
    getBlogsQuery(locale, null, '', 'desc')
  )
  const allBlogs = blogsResponse?.data ?? []

  let post = null

  try {
    const singleResponse = await queryClient.fetchQuery(getBlogQuery(locale, slug))
    post = singleResponse ?? null
  } catch {
    post = allBlogs.find((item) => item.slug === slug) ?? null
  }

  if (!post) {
    post = allBlogs.find((item) => item.slug === slug) ?? null
  }

  if (!post) notFound()

  const relatedCategoryId = post.category?.id ?? null
  let relatedSource = allBlogs

  if (relatedCategoryId !== null) {
    try {
      const relatedResponse = await queryClient.fetchQuery(
        getBlogsQuery(locale, relatedCategoryId, '', 'desc')
      )
      relatedSource = relatedResponse?.data ?? allBlogs
    } catch {
      relatedSource = allBlogs
    }
  }

  const related =
    relatedCategoryId !== null
      ? relatedSource
          .filter((x) => x.slug !== slug)
          .slice(0, 2)
      : []

  const title = post.title
  const excerpt = stripHtmlToText(post.description)

  const h = await headers()
  const forwardedProto = h.get('x-forwarded-proto')
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? (host ? `${forwardedProto ?? 'https'}://${host}` : '')
  const postUrl = `${baseUrl}/${locale}/news/${post.slug}`

  const encodedUrl = encodeURIComponent(postUrl)
  const encodedText = encodeURIComponent(title)

  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${postUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
  } as const

  return (
    <section className="bg-[#f8fafc] py-8 md:py-[70px]">
      <Container className="rounded-2xl bg-white p-6">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-8 sm:gap-10">
          <nav className="flex items-center gap-1 text-xs leading-4">
            <Link href="/news" className="text-[#6b6e71] hover:underline">
              {tNewsPage('breadcrumb')}
            </Link>
            <span className="text-[#6b6e71]">/</span>
            <span className="line-clamp-1 font-medium text-[#32393f]">{title}</span>
          </nav>

          <div className="flex flex-col gap-6 sm:gap-7">
            <h1 className="text-balance text-2xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
              {title}
            </h1>

            <div className="relative h-[260px] w-full overflow-hidden rounded-2xl sm:h-[420px] md:h-[480px]">
              <Image
                src={post.image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1000px"
                priority
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-white px-2.5 py-2 text-sm leading-5 text-[#1d212a]">
                <Clock className="size-5" aria-hidden />
                {post.read_time}
              </div>

              <div className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-white px-2.5 py-2 text-sm leading-5 text-[#1d212a]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="size-5 text-[#1d212a]"
                  aria-hidden
                >
                  <path
                    d="M3.33337 3.33337H8.33337V8.33337H3.33337V3.33337Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.6667 3.33337H16.6667V8.33337H11.6667V3.33337Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.33337 11.6667H8.33337V16.6667H3.33337V11.6667Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.6667 14.1667C11.6667 14.8297 11.9301 15.4656 12.3989 15.9345C12.8678 16.4033 13.5037 16.6667 14.1667 16.6667C14.8297 16.6667 15.4656 16.4033 15.9345 15.9345C16.4033 15.4656 16.6667 14.8297 16.6667 14.1667C16.6667 13.5037 16.4033 12.8678 15.9345 12.3989C15.4656 11.9301 14.8297 11.6667 14.1667 11.6667C13.5037 11.6667 12.8678 11.9301 12.3989 12.3989C11.9301 12.8678 11.6667 13.5037 11.6667 14.1667Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {post.category?.name}
              </div>

              {post.created_at ? (
                <div className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-white px-2.5 py-2 text-sm leading-5 text-[#1d212a]">
                  <Calendar className="size-5" aria-hidden />
                  <span>{formatBlogPostDate(post.created_at, locale)}</span>
                </div>
              ) : null}

              <div className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-white px-2.5 py-2 text-sm leading-5 text-[#1d212a]">
                <span>{tNewsPage('share')}</span>
                <div className="flex items-center gap-1.5 text-[#1d212a]">
                  <a
                    className="hover:opacity-70"
                    href={shareUrls.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tCommon('share.whatsappLabel')}
                  >
                    <IconWhatsapp width={20} height={20} aria-hidden />
                  </a>
                  <a
                    className="hover:opacity-70"
                    href={shareUrls.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tCommon('share.telegramLabel')}
                  >
                    <IconTelegram width={20} height={20} aria-hidden />
                  </a>
                  <a
                    className="hover:opacity-70"
                    href={shareUrls.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tCommon('share.facebookLabel')}
                  >
                    <IconFacebook width={20} height={20} aria-hidden />
                  </a>
                  <a
                    className="hover:opacity-70"
                    href={shareUrls.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tCommon('share.xLabel')}
                  >
                    <IconX width={20} height={20} aria-hidden />
                  </a>
                </div>
              </div>
            </div>

            {excerpt ? <p className="text-base leading-6 text-[#6b6e71]">{excerpt}</p> : null}
          </div>

          <article className="prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: toRenderableHtml(post.description) }} />
          </article>

          {related.length > 0 ? (
            <div className="flex flex-col gap-6 sm:gap-9">
              <p className="text-balance text-2xl font-semibold leading-tight text-[#6b6e71] sm:text-[40px] sm:leading-[56px]">
                <span className="text-[#6b6e71]">{tNewsPage('relatedPrefix')} </span>
                <span className="text-[#14171a]">{tNewsPage('relatedTitle')}</span>
              </p>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/news/${p.slug}`}
                    className="group flex flex-col gap-4 rounded-2xl border border-[#eaf1fa] bg-[#fafdff] px-2 pb-5 pt-2"
                  >
                    <div className="relative h-[220px] w-full overflow-hidden rounded-xl sm:h-[320px]">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 484px"
                      />
                    </div>
                    <div className="flex flex-col gap-6 px-2">
                      <div className="flex flex-col gap-3">
                        <p className="line-clamp-1 text-xl font-semibold leading-7 text-[#14171a]">{p.title}</p>
                        <p className="line-clamp-2 text-base leading-6 text-[#6b6e71]">
                          {stripHtmlToText(p.description)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        <div className="flex items-center gap-1.5 text-[#6b6e71]">
                          <Clock className="size-4 shrink-0 sm:size-5" aria-hidden />
                          <span className="text-sm leading-5 sm:text-base sm:leading-6">{p.read_time}</span>
                        </div>
                        {p.created_at ? (
                          <div className="flex items-center gap-1.5 text-[#6b6e71]">
                            <Calendar className="size-4 shrink-0 sm:size-5" aria-hidden />
                            <span className="text-sm leading-5 sm:text-base sm:leading-6">
                              {formatBlogPostDate(p.created_at, locale)}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
