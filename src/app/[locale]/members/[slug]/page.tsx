import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import { notFound } from 'next/navigation'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { getServerQueryClient } from '@/providers/server'
import { getMemberQuery, getMembersQuery } from '@/services/members/queries'

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default async function MemberDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const queryClient = getServerQueryClient()

  const membersResponse = await queryClient.fetchQuery(getMembersQuery(locale))
  const members = membersResponse?.data ?? []

  let company = null

  try {
    const singleResponse = await queryClient.fetchQuery(getMemberQuery(locale, slug))
    company = singleResponse?.data ?? singleResponse ?? null
  } catch {
    company = members.find((item) => item.slug === slug) ?? null
  }

  if (!company) {
    company = members.find((item) => item.slug === slug) ?? null
  }

  if (!company) notFound()

  const about = stripHtml(company.description)
  const others = members.filter((item) => item.slug !== slug).slice(0, 2)

  return (
    <section className="bg-[#f8fafc] py-8 md:py-[70px]">
      <Container>
        <div className="rounded-2xl bg-white p-6 sm:p-10">
          <div className="mx-auto flex max-w-[1150px] flex-col gap-8 sm:gap-10">
            <nav className="flex items-center gap-1 text-xs leading-4">
              <Link href="/members" className="text-[#6b6e71] hover:underline">
                {'\u00DCzvl\u0259r'}
              </Link>
              <span className="text-[#6b6e71]">/</span>
              <span className="line-clamp-1 font-medium text-[#32393f]">
                {company.company}
              </span>
            </nav>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-center gap-6">
                <div className="relative aspect-square size-[96px] shrink-0 overflow-hidden rounded-full border border-[#f1f2f6] sm:size-[120px]">
                  <Image
                    src={company.image}
                    alt={company.company}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 120px"
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-1">
                  <p className="break-words text-2xl font-semibold leading-8 text-[#1d212a] sm:text-[32px] sm:leading-[44px]">
                    {company.company}
                  </p>
                  <p className="text-base leading-6 text-[#6b6e71]">
                    {company.activity?.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:pt-3">
                <p className="text-lg font-semibold leading-7 text-[#14171a]">
                  {'\u018Flaq\u0259 vasit\u0259l\u0259ri'}
                </p>
                <div className="flex flex-col gap-3 text-sm leading-5 text-[#32393f]">
                  {company.phone ? (
                    <a
                      href={`tel:${company.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-3 hover:opacity-80"
                    >
                      <Phone className="size-5 text-[#0f477d]" aria-hidden />
                      <span>{company.phone}</span>
                    </a>
                  ) : null}
                  {company.email ? (
                    <a
                      href={`mailto:${company.email}`}
                      className="inline-flex items-center gap-3 hover:opacity-80"
                    >
                      <Mail className="size-5 text-[#0f477d]" aria-hidden />
                      <span>{company.email}</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-[#eef2f6]" />

            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold leading-8 text-[#14171a] sm:text-[32px] sm:leading-[44px]">
                {'\u015Eirk\u0259t haqq\u0131nda'}
              </h2>

              <div className="flex flex-col gap-4 text-sm leading-6 text-[#6b6e71] sm:text-base">
                <p className={cn('text-[#64717c]')}>{about}</p>
              </div>
            </div>

            {others.length > 0 ? (
              <div className="flex flex-col gap-6">
                <h3 className="text-2xl font-semibold leading-8 text-[#1d212a] sm:text-[32px] sm:leading-10">
                  {'Dig\u0259r \u015Eirk\u0259tl\u0259r'}
                </h3>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {others.map((item) => (
                    <div
                      key={item.slug}
                      className="flex w-full flex-col gap-6 rounded-xl border border-[#eaf1fa] bg-[#fafdff] px-5 py-6"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <div className="relative size-20 shrink-0 overflow-hidden rounded-[56px] border border-[#f1f2f6]">
                            <Image
                              src={item.image}
                              alt={item.company}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <p className="truncate text-xl font-medium leading-7 text-[#1d212a]">
                              {item.company}
                            </p>
                            <p className="text-sm leading-5 text-[#6b6e71]">
                              {item.activity?.name}
                            </p>
                          </div>
                        </div>

                        <p className="line-clamp-3 text-sm leading-5 text-[#64717c]">
                          {stripHtml(item.description)}
                        </p>
                      </div>

                      <Link
                        href={`/members/${item.slug}`}
                        className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#e6eff6] px-6 text-base font-medium leading-6 text-[#0f477d] transition-colors hover:bg-[#dce9f3]"
                      >
                        {'Profil\u0259 ke\u00E7id edin'}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}
