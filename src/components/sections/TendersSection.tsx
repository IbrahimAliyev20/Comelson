 'use client'

import Image from 'next/image'
import { ChevronRight, Search } from 'lucide-react'
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
import type { TenderRow } from '@/utils/tenders-data'
import { tendersHomeRows } from '@/utils/tenders-data'

type StatusFilter = 'active' | 'closed' | 'all'

function rowMatches(row: TenderRow, q: string) {
  if (!q) return true
  const v = q.toLowerCase()
  return (
    row.buyerName.toLowerCase().includes(v) ||
    row.subject.toLowerCase().includes(v) ||
    row.category.toLowerCase().includes(v)
  )
}

export default function TendersSection() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('active')
  const [category, setCategory] = useState<string | null>(null)

  const filterControlClass =
    '!h-12 rounded-xl border-[#dadee2] bg-white text-[#32393f] focus-visible:ring-0'

  const categories = useMemo(() => {
    const set = new Set(tendersHomeRows.map((x) => x.category))
    return Array.from(set)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim()
    return tendersHomeRows
      .filter((x) => (status === 'all' ? true : x.status === status))
      .filter((x) => (category ? x.category === category : true))
      .filter((x) => rowMatches(x, q))
  }, [category, query, status])

  return (
    <section className="bg-[#f8fafc] py-8 md:py-[70px]">
      <Container>
        <div className="flex flex-col gap-8 sm:gap-10">
          <h1 className="text-balance text-3xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
            Tender Elanları
          </h1>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[420px]">
              <Search
                className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#889097]"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Axtarın.."
                className={cn(
                  filterControlClass,
                  'pl-10 pr-3 text-sm placeholder:text-[#889097]'
                )}
              />
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as StatusFilter)}
              >
                <SelectTrigger
                  className={cn(
                    filterControlClass,
                    'w-full px-3.5 text-base leading-6 sm:w-[180px]'
                  )}
                >
                  <SelectValue placeholder="Aktiv elanlar" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem
                    value="active"
                    className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                  >
                    Aktiv elanlar
                  </SelectItem>
                  <SelectItem
                    value="closed"
                    className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                  >
                    Deaktiv elanlar
                  </SelectItem>
                  <SelectItem
                    value="all"
                    className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                  >
                    Hamısı
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={category ?? 'all'}
                onValueChange={(v) => setCategory(v === 'all' ? null : v)}
              >
                <SelectTrigger
                  className={cn(
                    filterControlClass,
                    'w-full px-3.5 text-base leading-6 sm:w-[180px]'
                  )}
                >
                  <SelectValue placeholder="Kateqoriya" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem
                    value="all"
                    className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                  >
                    Kateqoriya
                  </SelectItem>
                  {categories.map((x) => (
                    <SelectItem
                      key={x}
                      value={x}
                      className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                    >
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button
                type="button"
                className={cn(
                  filterControlClass,
                  'inline-flex w-full items-center justify-between px-3.5 text-base leading-6 sm:w-[180px]'
                )}
                aria-label="Tarix"
              >
                <span>Tarix</span>
                <Image src="/icons/calendar-event.svg" alt="" width={20} height={20} aria-hidden />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#eaf1fa] bg-white">
            <div className="w-full overflow-x-auto">
              <table className="min-w-[980px] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="border-b border-[#f2f9ff]">
                    <th className="px-6 py-5 text-left text-sm font-medium leading-5 text-[#64717c]">
                      №
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-medium leading-5 text-[#64717c]">
                      Tender başlığı
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-medium leading-5 text-[#64717c]">
                      Tenderin kateqoriyası
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-medium leading-5 text-[#64717c]">
                      Başlama tarixi
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-medium leading-5 text-[#64717c]">
                      Bitmə tarixi
                    </th>
                    <th className="px-6 py-5" />
                    <th className="px-6 py-5" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-t border-[#eaf1fa]">
                      <td className="px-6 py-6 align-middle text-sm leading-5 text-[#1d212a]">
                        {row.id}
                      </td>
                      <td className="px-6 py-6 align-middle text-sm leading-5 text-[#1d212a]">
                        <p className="max-w-[18rem]">{row.buyerName}</p>
                      </td>
                      <td className="px-6 py-6 align-middle text-sm leading-5 text-[#1d212a]">
                        <p className="max-w-[18rem]">{row.category}</p>
                      </td>
                      <td className="px-6 py-6 align-middle text-sm leading-5 text-[#1d212a] whitespace-pre">
                        {row.startAt}
                      </td>
                      <td className="px-6 py-6 align-middle text-sm leading-5 text-[#1d212a] whitespace-pre">
                        {row.endAt}
                      </td>
                      <td className="px-6 py-6 align-middle">
                        <Link
                          href={`/tenders/${row.slug}`}
                          className="inline-flex items-center gap-2 text-sm leading-5 text-[#0f477d] transition-opacity hover:opacity-80"
                        >
                          ətraflı bax
                          <ChevronRight className="size-5" aria-hidden />
                        </Link>
                      </td>
                      <td className="px-6 py-6 align-middle">
                        <div className="flex items-center justify-center">
                          <span
                            className={cn(
                              'inline-flex size-9 items-center justify-center rounded-full bg-[#e6eff6] text-[#0f477d]'
                            )}
                          >
                            <Image src="/icons/share.svg" alt="" width={20} height={20} aria-hidden />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
