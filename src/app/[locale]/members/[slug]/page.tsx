import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { stripHtmlToText, toRenderableHtml } from '@/lib/html'
import { getMemberLogoSrc } from '@/lib/media'
import { cn } from '@/lib/utils'
import { getServerQueryClient } from '@/providers/server'
import { getMemberQuery, getMembersQuery } from '@/services/members/queries'

function getMemberName(member: { name?: string | null; company?: string | null }) {
  return member.name || member.company || '—'
}

export default async function MemberDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const t = await getTranslations('membersPage.detail')
  const tMembers = await getTranslations('membersPage')
  const queryClient = getServerQueryClient()

  const membersResponse = await queryClient.fetchQuery(getMembersQuery(locale))
  const members = membersResponse?.data ?? []

  let company = members.find((item) => item.slug === slug) ?? null

  try {
    const singleResponse = await queryClient.fetchQuery(getMemberQuery(locale, slug))
    company = singleResponse?.data ?? company
  } catch {
    // fall back to list response
  }

  if (!company) notFound()

  const aboutHtml = toRenderableHtml(company.description)
  const others = members.filter((item) => item.slug !== slug).slice(0, 2)
  const companyName = getMemberName(company)

  return (
    <section className="bg-[#f8fafc] py-8 md:py-[70px]">
      <Container>
        <div className="rounded-2xl bg-white p-6 sm:p-10">
          <div className="mx-auto flex max-w-[1150px] flex-col gap-8 sm:gap-10">
            <nav className="flex items-center gap-1 text-xs leading-4">
              <Link href="/members" className="text-[#6b6e71] hover:underline">
                {t('breadcrumb')}
              </Link>
              <span className="text-[#6b6e71]">/</span>
              <span className="line-clamp-1 font-medium text-[#32393f]">
                {companyName}
              </span>
            </nav>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-center gap-6">
                <div className="relative aspect-square size-[96px] shrink-0 overflow-hidden rounded-full border border-[#f1f2f6] sm:size-[120px]">
                  <Image
                    src={getMemberLogoSrc(company)}
                    alt={companyName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 120px"
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-1">
                  <p className="break-words text-2xl font-semibold leading-8 text-[#1d212a] sm:text-[32px] sm:leading-[44px]">
                    {companyName}
                  </p>
                  <p className="text-base leading-6 text-[#6b6e71]">
                    {company.activity?.name ?? ''}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:pt-3">
                <p className="text-lg font-semibold leading-7 text-[#14171a]">
                  {t('contactInfo')}
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
                {t('about')}
              </h2>

              <div
                className={cn(
                  'flex flex-col gap-4 text-sm leading-6 text-[#64717c] sm:text-base',
                  '[&_a]:text-[#0f477d] [&_a]:underline [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_li]:list-disc [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5'
                )}
                dangerouslySetInnerHTML={{ __html: aboutHtml }}
              />
            </div>

            {others.length > 0 ? (
              <div className="flex flex-col gap-6">
                <h3 className="text-2xl font-semibold leading-8 text-[#1d212a] sm:text-[32px] sm:leading-10">
                  {t('otherCompanies')}
                </h3>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {others.map((item) => (
                    <div
                      key={item.slug}
                      className="flex w-full flex-col gap-6 justify-between rounded-xl border border-[#eaf1fa] bg-[#fafdff] px-5 py-6"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <div className="relative size-20 shrink-0 overflow-hidden rounded-[56px] border border-[#f1f2f6]">
                            <Image
                              src={getMemberLogoSrc(item)}
                              alt={getMemberName(item)}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col ">
                            <p className="truncate text-xl font-medium leading-7 text-[#1d212a]">
                              {getMemberName(item)}
                            </p>
                            <p className="text-sm leading-5 text-[#6b6e71]">
                              {item.activity?.name ?? ''}
                            </p>
                            <p className="text-sm leading-5 text-[#6b6e71]">
                              {item.category?.name ?? ''}
                            </p>
                          </div>
                        </div>

                        <p className="line-clamp-3 text-sm leading-5 text-[#64717c]">
                          {stripHtmlToText(item.description)}
                        </p>
                      </div>

                      <Link
                        href={`/members/${item.slug}`}
                        className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#e6eff6] px-6 text-base font-medium leading-6 text-[#0f477d] transition-colors hover:bg-[#dce9f3]"
                      >
                        {tMembers('viewProfile')}
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
