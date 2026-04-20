'use client'

import Image from 'next/image'
import { ChevronDown, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import Container from '@/components/shared/container'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { ActivityResponse, CountryResponse, MemberResponse } from '@/types/types'

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default function MembersSection({
  members,
  activities,
  countries
}: {
  members: MemberResponse[] | undefined
  activities: ActivityResponse[] | undefined
  countries: CountryResponse[] | undefined
}) {
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState<string | null>(null)
  const [industry, setIndustry] = useState<string | null>(null)
  const [visible, setVisible] = useState(9)

  const membersList = useMemo(() => members ?? [], [members])
  const countryOptions = useMemo(() => countries ?? [], [countries])
  const industryOptions = useMemo(() => activities ?? [], [activities])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return membersList
      .filter((x) => (country ? x.country?.name === country : true))
      .filter((x) => (industry ? x.activity?.name === industry : true))
      .filter((x) => {
        if (!q) return true
        return (
          x.company.toLowerCase().includes(q) ||
          x.activity?.name.toLowerCase().includes(q) ||
          stripHtml(x.description).toLowerCase().includes(q)
        )
      })
  }, [country, industry, membersList, query])

  const shown = filtered.slice(0, visible)
  const canLoadMore = visible < filtered.length
  const filterControlClass =
    '!h-12 rounded-xl border-[#dadee2] bg-white text-[#32393f] focus-visible:ring-0'

  return (
    <section className="bg-[#f8fafc] py-8 md:py-[70px]">
      <Container>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between lg:items-center">
            <div className="relative w-full md:max-w-[320px] lg:max-w-[380px]">
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
                placeholder="Axtarın.."
                className={cn(
                  filterControlClass,
                  'pl-10 pr-3 text-sm placeholder:text-[#889097]'
                )}
              />
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:w-auto md:min-w-[380px] lg:grid-cols-2 lg:gap-4">
              <Select
                value={country ?? 'all'}
                onValueChange={(v) => {
                  setCountry(v === 'all' ? null : v)
                  setVisible(9)
                }}
              >
                <SelectTrigger
                  className={cn(
                    filterControlClass,
                    'w-full px-3.5 text-base leading-6 sm:w-[180px]'
                  )}
                >
                  <SelectValue placeholder="Ölkələr" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem
                    value="all"
                    className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                  >
                    Ölkələr
                  </SelectItem>
                  {countryOptions.map((item) => (
                    <SelectItem
                      key={item.name}
                      value={item.name}
                      className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={industry ?? 'all'}
                onValueChange={(v) => {
                  setIndustry(v === 'all' ? null : v)
                  setVisible(9)
                }}
              >
                <SelectTrigger
                  className={cn(
                    filterControlClass,
                    'w-full px-3.5 text-base leading-6 sm:w-[180px]'
                  )}
                >
                  <SelectValue placeholder="Fəaliyyət sahəsi" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem
                    value="all"
                    className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                  >
                    Fəaliyyət sahəsi
                  </SelectItem>
                  {industryOptions.map((item) => (
                    <SelectItem
                      key={item.name}
                      value={item.name}
                      className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col items-center gap-10">
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-6">
              {shown.map((company) => (
                <div
                  key={company.slug}
                  className="flex w-full flex-col items-center gap-6 overflow-hidden rounded-xl border border-[#eaf1fa] bg-white px-5 py-6"
                >
                  <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full items-center gap-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-[56px] border border-[#f1f2f6]">
                        <Image
                          src={company.image}
                          alt={company.company}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <p className="truncate text-xl font-medium leading-7 text-[#1d212a]">
                          {company.company}
                        </p>
                        <p className="text-sm leading-5 text-[#6b6e71]">
                          {company.activity?.name}
                        </p>
                      </div>
                    </div>

                    <p className="line-clamp-3 text-sm leading-5 text-[#64717c]">
                      {stripHtml(company.description)}
                    </p>
                  </div>

                  <Link
                    href={`/members/${company.slug}`}
                    className="inline-flex h-12 w-full items-center justify-center gap-4 rounded-2xl bg-[#e6eff6] px-6 py-3 text-base font-medium leading-6 text-[#0f477d] transition-opacity hover:opacity-90"
                  >
                    <span className={cn('inline-flex items-center gap-2')}>
                      Profilə keçid edin
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            {canLoadMore ? (
              <button
                type="button"
                onClick={() => setVisible((v) => v + 9)}
                className="inline-flex items-center justify-center gap-1 text-base font-medium leading-6 text-[#64717c] transition-opacity hover:opacity-80"
              >
                Daha çox
                <ChevronDown className="size-6" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}
