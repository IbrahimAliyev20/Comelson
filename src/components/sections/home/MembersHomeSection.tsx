import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { getServerLocale } from '@/lib/utils'
import { MemberResponse } from '@/types/types'

export default async function MembersHomeSection( { members }: { members: MemberResponse[] | undefined } ) {
  const t = await getTranslations('home')
  const locale = await getServerLocale()

  const list = (members ?? []).slice(0, 8)
  if (list.length === 0) return null

  return (
    <section className="bg-[#F8FAFC] py-16 md:py-[100px]">
      <Container>
        <div className="flex flex-col gap-12">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-balance text-3xl font-semibold leading-tight text-black md:text-[40px] md:leading-[56px]">
              <span>{t('membersTitleMain')} </span>
              <span className="text-[#6b6e71]">{t('membersTitleAccent')}</span>
            </h2>

            <Link
              href={`/${locale}/members`}
              className="inline-flex items-center gap-3 text-sm font-medium leading-5 text-black transition-opacity hover:opacity-80"
            >
              {t('membersCta')}
              <ArrowRight className="size-5" aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((member) => (
              <Link
                key={member.slug}
                href={`/${locale}/members/${member.slug}`}
                className="group flex h-[188px] items-center justify-center overflow-hidden rounded-[10px] border border-[#e8eaed] bg-white p-6 transition-shadow hover:shadow-[0_14px_40px_rgba(15,71,125,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f477d]/40"
              >
                <Image
                  src={member.image}
                  alt={member.company}
                  width={360}
                  height={240}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 360px"
                />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
