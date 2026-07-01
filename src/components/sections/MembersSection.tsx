'use client'

import Image from 'next/image'
import { ChevronDown, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import Container from '@/components/shared/container'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { stripHtmlToText } from '@/lib/html'
import { getMemberLogoSrc } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { GetMembersParams } from '@/services/members/api'
import { getMembersQuery } from '@/services/members/queries'
import { CompanyCategoryResponse, CountryResponse, MemberResponse } from '@/types/types'

const SEARCH_DEBOUNCE_MS = 400

export default function MembersSection({
  members,
  categories,
  countries,
  initialFilters
}: {
  members: MemberResponse[] | undefined
  categories: CompanyCategoryResponse[] | undefined
  countries: CountryResponse[] | undefined
  initialFilters?: GetMembersParams
}) {
  const locale = useLocale()
  const t = useTranslations('membersPage')
  const tc = useTranslations('common')
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialCountryId = initialFilters?.country_id ?? null
  const initialCategoryId = initialFilters?.category_id ?? null
  const initialSearch = initialFilters?.search ?? ''

  const [countryId, setCountryId] = useState<number | null>(initialCountryId)
  const [categoryId, setCategoryId] = useState<number | null>(initialCategoryId)
  const [searchInput, setSearchInput] = useState(initialSearch)
  const [search, setSearch] = useState(initialSearch)
  const [visible, setVisible] = useState(9)

  const countryOptions = useMemo(() => countries ?? [], [countries])
  const categoryOptions = useMemo(() => categories ?? [], [categories])
  const initialMembers = useMemo(() => members ?? [], [members])

  // Axtarış mətnini debounce edirik ki, hər hərfdə API çağırışı olmasın.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setVisible(9)
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(id)
  }, [searchInput])

  const queryParams: GetMembersParams = useMemo(
    () => ({
      ...(countryId ? { country_id: countryId } : {}),
      ...(categoryId ? { category_id: categoryId } : {}),
      ...(search ? { search } : {}),
    }),
    [countryId, categoryId, search]
  )

  const isInitial =
    countryId === initialCountryId &&
    categoryId === initialCategoryId &&
    search === initialSearch

  // Filtrləri URL-ə yazırıq (paylaşıla bilən: /members?category_id=3&country_id=1&search=markup)
  useEffect(() => {
    const sameUrl =
      (searchParams.get('country_id') ?? '') === (countryId ? String(countryId) : '') &&
      (searchParams.get('category_id') ?? '') === (categoryId ? String(categoryId) : '') &&
      (searchParams.get('search') ?? '') === search
    if (sameUrl) return

    const query: Record<string, string> = {}
    if (countryId) query.country_id = String(countryId)
    if (categoryId) query.category_id = String(categoryId)
    if (search) query.search = search

    router.replace({ pathname, query }, { scroll: false })
  }, [countryId, categoryId, search, pathname, router, searchParams])

  const membersQuery = useQuery({
    ...getMembersQuery(locale, queryParams),
    initialData: isInitial
      ? { status: true, message: '', data: initialMembers }
      : undefined,
  })

  const list = membersQuery.data?.data ?? []
  const shown = list.slice(0, visible)
  const canLoadMore = visible < list.length
  const isLoading = membersQuery.isLoading
  const isError = membersQuery.isError
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={tc('actions.search')}
                className={cn(
                  filterControlClass,
                  'pl-10 pr-3 text-sm placeholder:text-[#889097]'
                )}
              />
            </div>

            <div className="grid w-full grid-cols-2 gap-3 md:w-auto md:min-w-[380px] lg:gap-4">
              <Select
                value={countryId == null ? 'all' : String(countryId)}
                onValueChange={(v) => {
                  setCountryId(v === 'all' ? null : Number(v))
                  setVisible(9)
                }}
              >
                <SelectTrigger
                  className={cn(
                    filterControlClass,
                    'w-full px-3.5 text-base leading-6'
                  )}
                >
                  <SelectValue placeholder={t('countriesFilter')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem
                    value="all"
                    className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                  >
                    {t('countriesFilter')}
                  </SelectItem>
                  {countryOptions.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={String(item.id)}
                      className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={categoryId == null ? 'all' : String(categoryId)}
                onValueChange={(v) => {
                  setCategoryId(v === 'all' ? null : Number(v))
                  setVisible(9)
                }}
              >
                <SelectTrigger
                  className={cn(
                    filterControlClass,
                    'w-full px-3.5 text-base leading-6'
                  )}
                >
                  <SelectValue placeholder={t('categoryFilter')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem
                    value="all"
                    className="data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]"
                  >
                    {t('categoryFilter')}
                  </SelectItem>
                  {categoryOptions.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={String(item.id)}
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
              {shown.map((company, idx) => (
                <div
                  key={company.id ?? company.slug ?? idx}
                  className="flex w-full flex-col items-center gap-6 overflow-hidden rounded-xl justify-between border border-[#eaf1fa] bg-white px-5 py-6"
                >
                  <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full items-center gap-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-[56px] border border-[#f1f2f6]">
                        <Image
                          src={getMemberLogoSrc(company)}
                          alt={company.name ?? company.company ?? 'Company'}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col ">
                        <p className="truncate text-xl font-medium leading-7 text-[#1d212a]">
                          {company.name ?? company.company}
                        </p>
                        <p className="text-sm leading-5 text-[#6b6e71]">
                          {company.activity?.name}
                        </p>
                        <p className="text-sm leading-5 text-[#6b6e71]">
                          {company.category?.name}
                        </p>
                      </div>
                    </div>

                    <p className="line-clamp-3 text-sm leading-5 text-[#64717c]">
                      {stripHtmlToText(company.description)}
                    </p>
                  </div>

                  <Link
                    href={`/members/${company.slug}`}
                    className="inline-flex h-12 w-full items-center justify-center gap-4 rounded-2xl bg-[#e6eff6] px-6 py-3 text-base font-medium leading-6 text-[#0f477d] transition-opacity hover:opacity-90"
                  >
                    <span className={cn('inline-flex items-center gap-2')}>
                      {t('viewProfile')}
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            {isLoading ? (
              <div className="w-full rounded-xl border border-[#eaf1fa] bg-white px-6 py-10 text-center text-sm text-[#64717c]">
                {tc('loading')}
              </div>
            ) : isError ? (
              <div className="w-full rounded-xl border border-[#eaf1fa] bg-white px-6 py-10 text-center text-sm text-red-600">
                {tc('status.loadFailed')}
              </div>
            ) : list.length === 0 ? (
              <div className="w-full rounded-xl border border-[#eaf1fa] bg-white px-6 py-10 text-center text-sm text-[#64717c]">
                {t('empty')}
              </div>
            ) : canLoadMore ? (
              <button
                type="button"
                onClick={() => setVisible((v) => v + 9)}
                className="inline-flex items-center justify-center gap-1 text-base font-medium leading-6 text-[#64717c] transition-opacity hover:opacity-80"
              >
                {tc('actions.loadMore')}
                <ChevronDown className="size-6" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}
