import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { getServerLocale } from '@/lib/utils'
import { MemberResponse } from '@/types/types'
import MembersCarousel from './MembersCarousel'

function getMemberLogoUrl(member: MemberResponse): string {
  const logo = member.profil?.trim()
  if (logo) return logo
  const img = member.image?.trim()
  if (img) return img
  return '/images/Logo.svg'
}

function getMemberName(member: MemberResponse): string {
  return member.name?.trim() || member.company?.trim() || 'Company'
}

export default async function MembersHomeSection({
  members,
}: {
  members: MemberResponse[] | undefined
}) {
  const t = await getTranslations('home')
  const locale = await getServerLocale()

  const list = (members ?? []).slice(0, 8)
  if (list.length === 0) return null

  return (
    <section className="bg-[#F8FAFC] py-8 md:py-[60px]">
      <Container>
        <div className="flex flex-col gap-2 md:gap-8">
          <div className="flex flex-col items-start justify-between gap-2 md:gap-6 sm:flex-row sm:items-end">
            <h2 className="text-balance text-2xl font-semibold leading-tight text-black min-[360px]:text-3xl md:text-[40px] md:leading-[56px]">
              <span>{t('membersTitleMain')} </span>
              <span className="text-[#6b6e71]">{t('membersTitleAccent')}</span>
            </h2>

            <Link
              href={`/${locale}/members`}
              className="hidden h-11 w-full shrink-0 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium leading-5 text-[#0f477d] transition-opacity hover:opacity-80 min-[400px]:h-12 min-[400px]:w-auto min-[400px]:gap-3 min-[400px]:px-6 min-[400px]:py-3 min-[400px]:text-base min-[400px]:leading-6 lg:inline-flex"
            >
              {t('membersCta')}
              <ChevronRight className="size-5 shrink-0 min-[400px]:size-6" aria-hidden />
            </Link>
          </div>

          {/* Mobile/tablet */}
          <div className="md:hidden">
            {list.length === 1 ? (
              <Link
                href={`/${locale}/members/${list[0]!.slug}`}
                className="group flex w-full items-center justify-center overflow-hidden rounded-[10px] border border-[#e8eaed] bg-white p-6 transition-shadow hover:shadow-[0_14px_40px_rgba(15,71,125,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f477d]/40"
              >
                <div className="flex h-[188px] w-full items-center justify-center overflow-hidden rounded-[10px] bg-white">
                  <Image
                    src={getMemberLogoUrl(list[0]!)}
                    alt={getMemberName(list[0]!)}
                    width={720}
                    height={480}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="100vw"
                  />
                </div>
              </Link>
            ) : (
              <MembersCarousel members={list} locale={locale} />
            )}
          </div>

          {/* Desktop: keep grid */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-5 xl:grid-cols-5">
            {list.map((member, idx) => (
              <Link
                key={`${member.slug || member.company}-${member.country?.id ?? 'na'}-${idx}`}
                href={`/${locale}/members/${member.slug}`}
                className="group flex h-[160px] items-center justify-center overflow-hidden rounded-[10px] border border-[#e8eaed] bg-white p-2 transition-shadow hover:shadow-[0_14px_40px_rgba(15,71,125,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f477d]/40 md:h-[180px] lg:h-[160px]"
              >
                <Image
                  src={getMemberLogoUrl(member)}
                  alt={getMemberName(member)}
                  width={360}
                  height={240}
                  className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 360px"
                />
              </Link>
            ))}
          </div>

          <div className="flex justify-center lg:hidden">
            <Link
              href={`/${locale}/members`}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium leading-5 text-[#0f477d] transition-opacity hover:opacity-80 min-[400px]:h-12 min-[400px]:w-auto min-[400px]:gap-3 min-[400px]:px-6 min-[400px]:py-3 min-[400px]:text-base min-[400px]:leading-6"
            >
              {t('membersCta')}
              <ChevronRight className="size-5 shrink-0 min-[400px]:size-6" aria-hidden />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
