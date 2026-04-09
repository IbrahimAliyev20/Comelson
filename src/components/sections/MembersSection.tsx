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
import { memberCompanies } from '@/utils/members-data'

export default function MembersSection() {
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState<string | null>(null)
  const [industry, setIndustry] = useState<string | null>(null)
  const [visible, setVisible] = useState(9)

  const countries = useMemo(() => {
    const set = new Set(memberCompanies.map((x) => x.country))
    return Array.from(set)
  }, [])

  const industries = useMemo(() => {
    const set = new Set(memberCompanies.map((x) => x.industry))
    return Array.from(set)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return memberCompanies
      .filter((x) => (country ? x.country === country : true))
      .filter((x) => (industry ? x.industry === industry : true))
      .filter((x) => {
        if (!q) return true
        return (
          x.name.toLowerCase().includes(q) ||
          x.industry.toLowerCase().includes(q) ||
          x.description.toLowerCase().includes(q)
        )
      })
  }, [country, industry, query])

  const shown = filtered.slice(0, visible)
  const canLoadMore = visible < filtered.length

  return (
    <section className="bg-[#f8fafc] pb-24 pt-12">
      <Container>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[380px]">
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
                className="h-12 rounded-xl border-[#dadee2] bg-white pl-10 pr-3 text-sm text-[#32393f] placeholder:text-[#889097] focus-visible:ring-0"
              />
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-2 lg:gap-4">
              <Select
                value={country ?? 'all'}
                onValueChange={(v) => {
                  setCountry(v === 'all' ? null : v)
                  setVisible(9)
                }}
              >
                <SelectTrigger className="h-12 w-full rounded-xl border-[#dadee2] bg-white px-3.5 text-base leading-6 text-[#32393f] sm:w-[180px]">
                  <SelectValue placeholder="Ölkələr" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Ölkələr</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
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
                <SelectTrigger className="h-12 w-full rounded-xl border-[#dadee2] bg-white px-3.5 text-base leading-6 text-[#32393f] sm:w-[180px]">
                  <SelectValue placeholder="Fəaliyyət sahəsi" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Fəaliyyət sahəsi</SelectItem>
                  {industries.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col items-center gap-10">
            <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((company) => (
                <div
                  key={company.id}
                  className="flex w-full flex-col items-center gap-6 overflow-hidden rounded-xl border border-[#eaf1fa] bg-white px-5 py-6"
                >
                  <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full items-center gap-4">
                      <div className="relative size-20 overflow-hidden rounded-[56px] border border-[#f1f2f6]">
                        <Image
                          src={company.logoSrc}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <p className="truncate text-xl font-medium leading-7 text-[#1d212a]">
                          {company.name}
                        </p>
                        <p className="text-sm leading-5 text-[#6b6e71]">
                          {company.industry}
                        </p>
                      </div>
                    </div>

                    <p className="line-clamp-3 text-sm leading-5 text-[#64717c]">
                      {company.description}
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
