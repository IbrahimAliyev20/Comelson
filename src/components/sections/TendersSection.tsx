'use client'

import Image from 'next/image'
import { ChevronRight, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'

import Container from '@/components/shared/container'
import { TenderSharePopover } from '@/components/tenders/TenderSharePopover'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { getAllTendersQuery } from '@/services/tenders/queries'
import type { PublicTenderResponse } from '@/types/types'

type StatusFilter = 'active' | 'closed' | 'all'

function formatApiDateTime(value: string): string {
  const m = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}:\d{2})/)
  if (!m) return value
  const [, yyyy, mm, dd, hhmm] = m
  return `${dd}.${mm}.${yyyy}   ${hhmm}`
}

function getLocalizedLabel(
  value: Record<string, string> | string | null | undefined,
  locale: string
): string {
  if (!value) return '—'
  if (typeof value === 'string') return value.trim() || '—'
  return value[locale] ?? value.az ?? Object.values(value)[0] ?? '—'
}

type CategoryOption = { id: number; label: string }

function getPaginationWindow(
  current: number,
  total: number,
  siblingCount: number
): Array<number | 'ellipsis'> {
  if (total <= 1) return [1]

  const safeCurrent = Math.min(Math.max(current, 1), total)
  const left = Math.max(safeCurrent - siblingCount, 1)
  const right = Math.min(safeCurrent + siblingCount, total)

  const pages: Array<number | 'ellipsis'> = []
  pages.push(1)

  if (left > 2) pages.push('ellipsis')
  for (let p = Math.max(left, 2); p <= Math.min(right, total - 1); p += 1) {
    pages.push(p)
  }
  if (right < total - 1) pages.push('ellipsis')

  if (total > 1) pages.push(total)
  return pages
}

export default function TendersSection() {
  const locale = useLocale()
  const t = useTranslations('common')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('active')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  const perPage = 6

  const filterControlClass =
    '!h-12 rounded-xl border-[#dadee2] bg-white text-[#32393f] focus-visible:ring-0'

  const { data, isLoading, isError } = useQuery(
    getAllTendersQuery({
      locale,
      page,
      per_page: perPage,
      ...(query.trim() ? { search: query.trim() } : {}),
      ...(typeof categoryId === 'number' ? { category_id: categoryId } : {}),
      /**
       * Backend often returns `is_active: null` for active tenders.
       * Passing `is_active: 1` would exclude them, so we only send `0` when user
       * explicitly asks for closed.
       */
      ...(status === 'closed' ? { is_active: 0 } : {}),
    })
  )

  const rows = useMemo<PublicTenderResponse[]>(() => data?.data ?? [], [data])

  const categories = useMemo<CategoryOption[]>(() => {
    const map = new Map<number, string>()
    for (const row of rows) {
      const id = row.category?.id
      if (typeof id !== 'number') continue
      if (map.has(id)) continue
      map.set(id, getLocalizedLabel(row.category?.name, locale))
    }
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }))
  }, [locale, rows])

  useEffect(() => {
    setPage(1)
  }, [categoryId, query, status])

  const currentPage = data?.meta?.current_page ?? page
  const lastPage = data?.meta?.last_page ?? 1
  const canPrev = currentPage > 1
  const canNext = currentPage < lastPage

  const paginationItems = useMemo(() => {
    return getPaginationWindow(currentPage, lastPage, 1)
  }, [currentPage, lastPage])

  const rowNumberOffset = (currentPage - 1) * perPage

  return (
    <section className="bg-[#f8fafc] py-8 md:py-[70px]">
      <Container>
        <div className="flex flex-col gap-8 sm:gap-10">
          <h1 className="text-balance text-3xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
            Tender Elanları
          </h1>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between lg:items-center">
            <div className="relative w-full md:max-w-[320px] lg:max-w-[420px]">
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

            <div className="grid w-full grid-cols-2 gap-3  md:w-auto md:max-w-[560px] lg:w-auto">
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
                value={categoryId == null ? 'all' : String(categoryId)}
                onValueChange={(v) => setCategoryId(v === 'all' ? null : Number(v))}
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
                      key={x.id}
                      value={String(x.id)}
                      className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                    >
                      {x.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#f2f9ff] bg-white px-6 py-8">
            {isLoading ? (
              <div className="py-10 text-center text-sm text-[#6b6e71]">
                Yüklənir…
              </div>
            ) : isError ? (
              <div className="py-10 text-center text-sm text-[#6b6e71]">
                Yükləmə alınmadı
              </div>
            ) : null}
            <div className="w-full overflow-x-auto">
              <table className="min-w-[1100px] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="border-b border-[#eaf1fa]">
                    <th className="w-16 px-6 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      №
                    </th>
                    <th className="min-w-[236px] px-6 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      Tender başlığı
                    </th>
                    <th className="min-w-[212px] px-6 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      Şirkət
                    </th>
                    <th className="min-w-[208px] px-6 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      Tenderin kateqoriyası
                    </th>
                    <th className="min-w-[178px] px-6 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      Başlama tarixi
                    </th>
                    <th className="min-w-[178px] px-6 py-4 text-left text-sm font-medium leading-5 text-[#64717c]">
                      Bitmə tarixi
                    </th>
                    <th className="min-w-[120px] px-6 py-4" />
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id}>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle text-center text-sm font-normal leading-5 text-[#1d212a]">
                        {rowNumberOffset + index + 1}
                      </td>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle text-sm font-normal leading-5 text-[#1d212a]">
                        <p className="max-w-[18rem]">{row.title}</p>
                      </td>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle">
                        <div className="flex items-center justify-center gap-3">
                          <span className="relative inline-flex size-10 shrink-0 overflow-hidden rounded-full border border-[rgba(69,136,183,0.12)] bg-white">
                            <Image
                              src={row.company?.logo_url || '/images/Logo.svg'}
                              alt=""
                              width={40}
                              height={40}
                              className="object-cover"
                              aria-hidden
                            />
                          </span>
                          <span className="text-sm font-medium leading-5 text-[#1d212a]">
                            {row.company?.name || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle text-sm font-normal leading-5 text-[#1d212a]">
                        <p className="max-w-[18rem]">
                          {getLocalizedLabel(row.category?.name, locale)}
                        </p>
                      </td>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle text-sm font-normal leading-5 whitespace-pre text-[#1d212a]">
                        {formatApiDateTime(row.start_date)}
                      </td>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle text-sm font-normal leading-5 whitespace-pre text-[#1d212a]">
                        {formatApiDateTime(row.end_date)}
                      </td>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle">
                        <Link
                          href={`/tenders/${row.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-normal leading-5 text-[#0f477d] transition-opacity hover:opacity-80"
                        >
                          Ətraflı
                          <ChevronRight className="size-6 shrink-0" aria-hidden />
                        </Link>
                      </td>
                      <td className="h-[82px] border-b border-[#eaf1fa] px-6 align-middle">
                        <div className="flex items-center justify-center gap-3">
                          <TenderSharePopover
                            slug={row.slug}
                            tenderTitle={row.title}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!isLoading && !isError && rows.length === 0 ? (
              <div className="border-t border-[#f2f9ff] px-4 py-6 text-center text-sm text-[#64717c]">
                Axtarışınıza uyğun nəticə tapılmadı
              </div>
            ) : null}
          </div>

          {lastPage > 1 ? (
            <Pagination className="pt-4">
              <PaginationContent className="gap-0.5">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (!canPrev) return
                      setPage((p) => Math.max(1, p - 1))
                    }}
                    aria-disabled={!canPrev}
                    className={cn(
                      'px-2 text-sm',
                      !canPrev && 'pointer-events-none opacity-50'
                    )}
                  >
                    {t('pagination.previous')}
                  </PaginationPrevious>
                </PaginationItem>

                {paginationItems.map((item, idx) => {
                  if (item === 'ellipsis') {
                    return (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  return (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        isActive={item === currentPage}
                        className="h-9 w-9 text-sm"
                        onClick={(e) => {
                          e.preventDefault()
                          setPage(item)
                        }}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (!canNext) return
                      setPage((p) => Math.min(lastPage, p + 1))
                    }}
                    aria-disabled={!canNext}
                    className={cn(
                      'px-2 text-sm',
                      !canNext && 'pointer-events-none opacity-50'
                    )}
                  >
                    {t('pagination.next')}
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
