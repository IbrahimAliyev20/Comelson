import Image from 'next/image'
import { ArrowRight, Calendar, Clock } from 'lucide-react'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import {
  blogHomePosts,
  formatBlogPostDate,
  getBlogHomeUi,
  getBlogPostContent
} from '@/utils/blogsdata'

export default async function NewsHomeSection() {
  const ui = getBlogHomeUi()

  return (
    <section className="bg-white pb-16 pt-20 md:pb-[90px] md:pt-[100px]">
      <Container>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="max-w-[498px] text-balance text-3xl font-semibold leading-tight md:text-[40px] md:leading-[56px]">
              <span className="text-black">{ui.titleBlack}</span>
              <span className="text-[#6b6e71]">{ui.titleGray}</span>
            </h2>

            <Link
              href="/news"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-2xl px-6 py-3 text-base font-medium leading-6 text-black transition-opacity hover:opacity-80"
            >
              {ui.cta}
              <ArrowRight className="size-6 shrink-0" aria-hidden />
            </Link>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:flex-wrap lg:gap-6">
            {blogHomePosts.map((post) => {
              const content = getBlogPostContent(post)
              const title = content.title
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
                      {content.excerpt}
                    </p>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-[5px] text-[#494f4a]">
                      <Clock className="size-5 shrink-0" aria-hidden />
                      <span className="whitespace-nowrap text-base font-medium leading-6">
                        {ui.readTime(post.readTimeMinutes)}
                      </span>
                    </div>
                    <div className="flex items-center gap-[5px] text-[#494f4a]">
                      <Calendar className="size-5 shrink-0" aria-hidden />
                      <span className="whitespace-nowrap text-base font-medium leading-6">
                        {formatBlogPostDate(post.dateISO, 'az')}
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
