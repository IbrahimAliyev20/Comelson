  import Image from 'next/image'
import { Calendar, Clock, Tag } from 'lucide-react'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import {
  blogHomePosts,
  formatBlogPostDate,
  getBlogCategoryLabel,
  getBlogPostContent,
  getNewsUi
} from '@/utils/blogsdata'

export default async function NewsDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const ui = getNewsUi()

  const post = blogHomePosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const content = getBlogPostContent(post)
  const title = content.title
  const excerpt = content.excerpt

  const h = await headers()
  const forwardedProto = h.get('x-forwarded-proto')
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (host ? `${forwardedProto ?? 'https'}://${host}` : '')
  const postUrl = `${baseUrl}/news/${post.slug}`

  const encodedUrl = encodeURIComponent(postUrl)
  const encodedText = encodeURIComponent(title)

  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${postUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
  } as const

  const picked = blogHomePosts.filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <section className="bg-[#f8fafc]  pb-16 pt-10 sm:pb-24 sm:pt-12">
      <Container className='bg-white p-6 rounded-2xl' >
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-8 sm:gap-10">
          <nav className="flex items-center gap-1 text-xs leading-4">
            <Link href="/news" className="text-[#6b6e71] hover:underline">
              {ui.breadcrumbBase}
            </Link>
            <span className="text-[#6b6e71]">/</span>
            <span className="line-clamp-1 font-medium text-[#32393f]">
              {title}
            </span>
          </nav>

          <div className="flex flex-col gap-6 sm:gap-7">
            <h1 className="text-balance text-2xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
              {title}
            </h1>

            <div className="relative h-[260px] w-full overflow-hidden rounded-2xl sm:h-[420px] md:h-[480px]">
              <Image
                src={post.imageSrc}
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
                {ui.readTime(post.readTimeMinutes)}
              </div>

              <div className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-white px-2.5 py-2 text-sm leading-5 text-[#1d212a]">
                <Tag className="size-5" aria-hidden />
                {getBlogCategoryLabel(post.category)}
              </div>

              <div className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-white px-2.5 py-2 text-sm leading-5 text-[#1d212a]">
                <Calendar className="size-5" aria-hidden />
                <span>{ui.publishedLabel}</span>
                <span>{formatBlogPostDate(post.dateISO, 'az')}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-white px-2.5 py-2 text-sm leading-5 text-[#1d212a]">
                <span>{ui.shareLabel}</span>
                <div className="flex items-center gap-1.5 text-[#1d212a]">
                  <a
                    className="hover:opacity-70"
                    href={shareUrls.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                  >
                     <Image src="/icons/brand-whatsapp.svg" alt="WhatsApp" width={20} height={20} />
                  </a>
                  <a
                    className="hover:opacity-70"
                    href={shareUrls.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                  >
                    <Image src="/icons/brand-telegram.svg" alt="Telegram" width={20} height={20} />
                  </a>
                  <a
                    className="hover:opacity-70"
                    href={shareUrls.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <Image src="/icons/brand-facebook.svg" alt="Facebook" width={20} height={20} />
                  </a>
                  <a
                    className="hover:opacity-70"
                    href={shareUrls.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X"
                  >
                    <Image src="/icons/brand-x.svg" alt="X" width={20} height={20} />
                  </a>
                </div>
              </div>
            </div>

            <p className="text-base leading-6 text-[#6b6e71]">{excerpt}</p>
          </div>

          <article className="flex flex-col gap-10">
            <section className="flex flex-col gap-4">
              <h2 className="text-balance text-2xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
                {content.sections[0].title}
              </h2>
              <p className="text-base leading-6 text-[#6b6e71]">
                {content.sections[0].body}
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-balance text-2xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
                {content.sections[1].title}
              </h2>
              <p className="text-base leading-6 text-[#6b6e71]">
                {content.sections[1].body}
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-balance text-2xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
                {content.sections[2].title}
              </h2>
              <p className="text-base leading-6 text-[#6b6e71]">
                {content.sections[2].body}
              </p>
            </section>
          </article>

          <div className="flex flex-col gap-6 sm:gap-9">
            <p className="text-balance text-2xl font-semibold leading-tight text-[#6b6e71] sm:text-[40px] sm:leading-[56px]">
              <span>{ui.pickedTitlePart1}</span>
              <span className="text-[#14171a]">{ui.pickedTitlePart2}</span>
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {picked.map((p) => {
                const pickedContent = getBlogPostContent(p)
                const cardTitle = pickedContent.title
                const cardExcerpt = pickedContent.excerpt

                return (
                  <Link
                    key={p.slug}
                    href={`/news/${p.slug}`}
                    className="group flex flex-col gap-4 rounded-2xl border border-[#eaf1fa] bg-[#fafdff] px-2 pb-5 pt-2"
                  >
                    <div className="relative h-[220px] w-full overflow-hidden rounded-xl sm:h-[320px]">
                      <Image
                        src={p.imageSrc}
                        alt={cardTitle}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 484px"
                      />
                    </div>
                    <div className="flex flex-col gap-6 px-2">
                      <div className="flex flex-col gap-3">
                        <p className="line-clamp-1 text-xl font-semibold leading-7 text-[#14171a]">
                          {cardTitle}
                        </p>
                        <p className="line-clamp-2 text-base leading-6 text-[#6b6e71]">
                          {cardExcerpt}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        <div className="flex items-center gap-1.5 text-[#6b6e71]">
                          <Clock className="size-4 shrink-0 sm:size-5" aria-hidden />
                          <span className="text-sm leading-5 sm:text-base sm:leading-6">
                            {ui.readTime(p.readTimeMinutes)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#6b6e71]">
                          <Calendar className="size-4 shrink-0 sm:size-5" aria-hidden />
                          <span className="text-sm leading-5 sm:text-base sm:leading-6">
                            {formatBlogPostDate(p.dateISO, 'az')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

