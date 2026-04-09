import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import { notFound } from 'next/navigation'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { memberCompanies } from '@/utils/members-data'

export default async function MemberDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const company = memberCompanies.find((x) => x.slug === slug)
  if (!company) notFound()

  const about =
    company.about?.length
      ? company.about
      : [
          company.description,
          'Agentlik UI/UX dizayn, veb və mobil tətbiq inkişafı, brendinq və məhsul strategiyası sahələrində xidmət göstərir. Komanda istifadəçi təcrübəsini ön planda tutaraq funksional və estetik interfeyslər yaradır.',
          'Uzunmüddətli tərəfdaşlıqlara üstünlük verilir və layihədən sonra da dəstək xidmətləri təqdim edilir.'
        ]

  const others = memberCompanies.filter((x) => x.slug !== slug).slice(0, 2)

  return (
    <section className="bg-[#f8fafc] pb-16 pt-10 sm:pb-24 sm:pt-12">
      <Container >
        <div className="rounded-2xl bg-white p-6 sm:p-10 ">
          <div className="flex flex-col gap-8 sm:gap-10 max-w-[1150px] mx-auto">
            <nav className="flex items-center gap-1 text-xs leading-4">
              <Link href="/members" className="text-[#6b6e71] hover:underline">
                Üzvlər
              </Link>
              <span className="text-[#6b6e71]">/</span>
              <span className="line-clamp-1 font-medium text-[#32393f]">
                {company.name}
              </span>
            </nav>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-center gap-6">
                <div className="relative size-[96px] overflow-hidden rounded-full border border-[#f1f2f6] sm:size-[120px]">
                  <Image
                    src={company.logoSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 96px, 120px"
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-1">
                  <p className="truncate text-2xl font-semibold leading-8 text-[#1d212a] sm:text-[32px] sm:leading-[44px]">
                    {company.name}
                  </p>
                  <p className="text-base leading-6 text-[#6b6e71]">
                    {company.industry}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:pt-3">
                <p className="text-lg font-semibold leading-7 text-[#14171a]">
                  Əlaqə vasitələri
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
                Şikət haqqında
              </h2>

              <div className="flex flex-col gap-4 text-sm leading-6 text-[#6b6e71] sm:text-base">
                {about.map((p, idx) => (
                  <p key={idx} className={cn(idx === 0 ? 'text-[#64717c]' : '')}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 pt-2">
              <h3 className="text-2xl font-semibold leading-8 text-[#14171a] sm:text-[32px] sm:leading-[44px]">
                Digər Şirkətlər
              </h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {others.map((x) => (
                  <div
                    key={x.id}
                    className="flex w-full flex-col gap-4 rounded-xl border border-[#eaf1fa] bg-white px-5 py-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative size-20 overflow-hidden rounded-[56px] border border-[#f1f2f6]">
                        <Image
                          src={x.logoSrc}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <p className="truncate text-xl font-medium leading-7 text-[#1d212a]">
                          {x.name}
                        </p>
                        <p className="text-sm leading-5 text-[#6b6e71]">
                          {x.industry}
                        </p>
                      </div>
                    </div>

                    <p className="line-clamp-3 text-sm leading-5 text-[#64717c]">
                      {x.description}
                    </p>

                    <Link
                      href={`/members/${x.slug}`}
                      className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#e6eff6] px-6 text-base font-medium leading-6 text-[#0f477d] transition-opacity hover:opacity-90"
                    >
                      Profilə keçid edin
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
