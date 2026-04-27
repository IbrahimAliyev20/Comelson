'use client'

import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock4,
  FileText,
  MoreVertical,
  PencilIcon,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { useLocale } from 'next-intl'
import type { ComponentType } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'sonner'

import { TenderSharePopover } from '@/components/tenders/TenderSharePopover'
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog'
import { cn } from '@/lib/utils'
import { getCompaniesQuery } from '@/services/companies/queries'
import { deleteTenderMutation, postTenderMutation, updateTenderMutation } from '@/services/tenders/mutations'
import { getTendersQuery } from '@/services/tenders/queries'
import type { CompanyResponse, CreateTenderPayload, TenderResponse } from '@/types/types'

import CreateTender, { type CreateTenderForm } from './crud/createTender'
import EditTender from './crud/editTender'
import TenderDetail, { type TenderDetailProps } from './crud/TenderDetail'

type TenderListView = 'list' | 'create' | 'edit' | 'detail'
type TenderStatusFilter = 'all' | 'active'

type TenderListItem = {
  id: number
  slug: string
  title: string
  company: string
  companyLogo: string
  category: string
  /** API `is_active` */
  isActive: boolean
  status: 'active' | 'pending'
}

const COMPANY_LOGO =
  'https://www.figma.com/api/mcp/asset/c7c6ff5b-0d48-4e4a-b723-979979f11602'

function normalizePlainToHtml(value: string): string {
  const v = value.trim()
  if (!v) return '<p>—</p>'
  if (v.includes('<')) return v
  return `<p>${v}</p>`
}

function getCookieNumber(name: string): number | null {
  const raw = Cookies.get(name)
  if (!raw) return null
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

function toPositiveNumber(value: string): number | null {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return null
  return n
}

/** Form: `YYYY-MM-DDTHH:mm` (datetime-local) → API: `YYYY-MM-DD HH:mm` */
function inputValueToApiDateTime(value: string): string {
  if (!value.trim()) return ''
  return value.replace('T', ' ').slice(0, 16)
}

function normalizePhone(raw: string): string {
  const t = raw.trim()
  if (!t) return ''
  return t.startsWith('+') ? t : `+${t}`
}

const FIELD_LABELS: Record<string, string> = {
  title: 'Tender başlığı',
  category_id: 'Kateqoriya',
  country_id: 'Ölkə',
  company_id: 'Şirkət',
  start_date: 'Başlama tarixi',
  end_date: 'Bitmə tarixi',
  description: 'Tender haqqında',
  required_documents: 'Tələb olunan sənədlər',
  contact_name: 'Ad, soyad',
  contact_position: 'Vəzifə',
  contact_email: 'Email',
  contact_phone: 'Telefon',
}

const RULE_LABELS: Record<string, string> = {
  required: 'məcburidir',
  'validation after': 'başlama tarixindən sonra olmalıdır',
  'validation before': 'bitmə tarixindən əvvəl olmalıdır',
  email: 'düzgün email olmalıdır',
}

function humanizeFieldError(field: string, rule: string): string {
  const label = FIELD_LABELS[field] ?? field
  const text = RULE_LABELS[rule.toLowerCase()] ?? rule
  return `${label}: ${text}`
}

function extractTenderApiError(err: unknown, fallback: string): string {
  if (!axios.isAxiosError(err)) return fallback
  const data = err.response?.data as
    | { message?: string; params?: Record<string, string[] | string> }
    | undefined
  if (!data) return fallback

  const params = data.params
  if (params && typeof params === 'object') {
    const parts: string[] = []
    for (const [field, rules] of Object.entries(params)) {
      const list = Array.isArray(rules) ? rules : [String(rules)]
      for (const rule of list) {
        parts.push(humanizeFieldError(field, String(rule)))
      }
    }
    if (parts.length > 0) return parts.join('\n')
  }

  if (data.message && data.message.toLowerCase() !== 'bad request.') {
    return data.message
  }
  return fallback
}

function formToCreatePayload(form: CreateTenderForm): CreateTenderPayload {
  const categoryId = toPositiveNumber(form.categoryId) ?? 1
  const countryId =
    toPositiveNumber(form.countryId) ?? getCookieNumber('country_id') ?? 1
  const companyId = toPositiveNumber(form.company) ?? 1

  return {
    title: form.title,
    category_id: categoryId,
    country_id: countryId,
    start_date: inputValueToApiDateTime(form.startAt),
    end_date: inputValueToApiDateTime(form.endAt),
    company_id: companyId,
    description: normalizePlainToHtml(form.about),
    required_documents: normalizePlainToHtml(form.requiredDocuments),
    contact_name: form.fullName,
    contact_position: form.position,
    contact_email: form.email,
    contact_phone: normalizePhone(form.phone),
    contact_instagram: form.instagram,
    contact_facebook: form.facebook,
    contact_linkedin: form.linkedin,
    contact_twitter: form.twitter,
    notify_by_email: true,
  }
}

function getLocalizedLabel(
  value: Record<string, string> | string | null | undefined,
  locale: string
): string {
  if (!value) return '—'
  if (typeof value === 'string') return value.trim() || '—'
  return value[locale] ?? value.az ?? Object.values(value)[0] ?? '—'
}

function tenderResponseToListItem(t: TenderResponse, locale: string): TenderListItem {
  const companyName = t.company?.name?.trim() || '—'

  const companyLogoUrl = (() => {
    const company = t.company
    if (!company || typeof company !== 'object') return COMPANY_LOGO
    if ('logo_url' in company) {
      const raw = (company as { logo_url?: unknown }).logo_url
      return typeof raw === 'string' && raw.trim() ? raw : COMPANY_LOGO
    }
    const raw = (company as { logo?: unknown }).logo
    return typeof raw === 'string' && raw.trim() ? raw : COMPANY_LOGO
  })()

  // Backend sometimes returns `null` for `is_active` even though it's logically active.
  const isActive = t.is_active == null ? true : Boolean(t.is_active)

  return {
    id: t.id,
    slug: t.slug,
    title: t.title,
    company: companyName,
    companyLogo: companyLogoUrl,
    category: getLocalizedLabel(t.category?.name, locale),
    isActive,
    status: isActive ? 'active' : 'pending',
  }
}

function TenderStatusBadge({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <span className="inline-flex h-9 w-full max-w-[152px] items-center justify-center gap-2 rounded-2xl bg-[#eaf8ef] px-3 text-xs font-medium leading-5 text-[#34c759] sm:text-sm sm:leading-5">
        <CheckCircle2 className="size-4 shrink-0" aria-hidden />
        Aktiv
      </span>
    )
  }
  return (
    <span className="inline-flex h-9 w-full max-w-[152px] items-center justify-center gap-2 rounded-2xl bg-[#fffae5] px-3 text-xs font-medium leading-5 text-[#ff9500] sm:text-sm sm:leading-5">
      <Clock4 className="size-4 shrink-0" aria-hidden />
      Gözləmədə
    </span>
  )
}

function AddTenderButton({
  onClick,
  className,
  disabled = false,
}: {
  onClick: () => void
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-12 items-center justify-center gap-4 rounded-2xl bg-[#e6eff6] px-8 text-base font-medium leading-6 text-[#0f477d] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d]',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer hover:bg-[#d7e6f2]',
        className
      )}
    >
      <Plus className="size-6 shrink-0" aria-hidden />
      Tender əlavə et
    </button>
  )
}

function EmptyTenderState({
  onAdd,
  addDisabled = false,
  helperText,
}: {
  onAdd: () => void
  addDisabled?: boolean
  helperText?: string
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-3 py-8 sm:px-8 sm:py-10">
      <div className="flex w-full max-w-[402px] flex-col items-center gap-7 rounded-xl bg-white px-3 py-6 text-center sm:gap-9 sm:px-6 sm:py-7">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center rounded-lg bg-[#e6eff6] p-3" aria-hidden>
            <FileText className="size-8 text-[#0f477d]" strokeWidth={1.8} />
          </div>

          <div className="flex w-full max-w-[354px] flex-col gap-4">
            <p className="text-lg font-medium leading-7 text-[#14171a] sm:text-[20px]">
              Hazırda əlavə edilmiş tender yoxdur
            </p>
            <p className="text-sm leading-5 text-[#6b6e71]">
              İlk tenderinizi yaradın, təkliflər toplayın və doğru tərəfdaşları
              tapın
            </p>
            {helperText ? (
              <p className="text-sm leading-5 text-[#ff3b30]">{helperText}</p>
            ) : null}
          </div>
        </div>

        <AddTenderButton onClick={onAdd} disabled={addDisabled} />
      </div>
    </div>
  )
}

function FilterButton({
  label,
  icon,
  className,
}: {
  label: string
  icon?: 'chevron' | 'calendar'
  className?: string
}) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-12 cursor-pointer items-center justify-between rounded-xl border border-[#dadee2] bg-white px-3.5 text-base leading-6 text-[#32393f]',
        className
      )}
    >
      <span>{label}</span>
      {icon === 'calendar' ? (
        <CalendarDays className="size-5 text-[#6b6e71]" aria-hidden />
      ) : (
        <ChevronDown className="size-5 text-[#6b6e71]" aria-hidden />
      )}
    </button>
  )
}

function RowActionMenu({
  tender,
  onEdit,
  onDelete,
}: {
  tender: TenderListItem
  onEdit: (tender: TenderListItem) => void
  onDelete: (tender: TenderListItem) => void
}) {
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    function onPointerDown(e: PointerEvent) {
      const el = menuRef.current
      if (!el) return
      if (e.target instanceof Node && el.contains(e.target)) return
      setMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="Menyu"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#e6eff6] text-[#0f477d] transition-colors hover:bg-[#d7e6f2]"
      >
        <MoreVertical className="size-5" aria-hidden />
      </button>

      {menuOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-[#eaf1fa] bg-white p-3 shadow-xl"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false)
              onEdit(tender)
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-left text-sm text-[#14171a] transition-colors hover:bg-[#f4fafd]"
          >
            <PencilIcon className="size-4" aria-hidden />
            Redaktə et
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false)
              onDelete(tender)
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="size-4" aria-hidden />
            Sil
          </button>
        </div>
      ) : null}
    </div>
  )
}

function TenderTable({
  tenders,
  onOpen,
  onEdit,
  onDelete,
}: {
  tenders: TenderListItem[]
  onOpen: (tender: TenderListItem) => void
  onEdit: (tender: TenderListItem) => void
  onDelete: (tender: TenderListItem) => void
}) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TenderStatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const categories = useMemo(
    () => Array.from(new Set(tenders.map((item) => item.category))),
    [tenders]
  )

  const filteredTenders = useMemo(() => {
    const q = query.trim().toLowerCase()

    return tenders.filter((item) => {
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q)

      const matchesStatus =
        statusFilter === 'all' ? true : item.status === statusFilter

      const matchesCategory =
        categoryFilter === 'all' ? true : item.category === categoryFilter

      return matchesQuery && matchesStatus && matchesCategory
    })
  }, [categoryFilter, query, statusFilter, tenders])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1 xl:max-w-[420px]">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#889097]"
            aria-hidden
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Axtarın.."
            className="h-12 w-full rounded-xl border border-[#dadee2] bg-white pl-10 pr-4 text-sm text-[#32393f] outline-none placeholder:text-[#889097] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex xl:flex-1 xl:items-center">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as TenderStatusFilter)
              }
              className="h-12 w-full appearance-none rounded-xl border border-[#dadee2] bg-white px-3.5 pr-10 text-sm leading-6 text-[#32393f] outline-none sm:text-base xl:w-[180px]"
            >
              <option value="active">Aktiv elanlar</option>
              <option value="all">Bütün elanlar</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#6b6e71]"
              aria-hidden
            />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-12 w-full appearance-none rounded-xl border border-[#dadee2] bg-white px-3.5 pr-10 text-sm leading-6 text-[#32393f] outline-none sm:text-base xl:w-[180px]"
            >
              <option value="all">Kateqoriya</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#6b6e71]"
              aria-hidden
            />
          </div>

          <FilterButton
            label="Tarix"
            icon="calendar"
            className="sm:col-span-2 xl:w-[180px]"
          />
        </div>
      </div>

      {/* NOTE: keep overflow visible so row menus can pop out */}
      <div className="rounded-lg border border-[#f2f9ff] bg-white">
        <div className="hidden grid-cols-[56px_minmax(200px,1.6fr)_minmax(160px,1.1fr)_minmax(120px,0.85fr)_44px_108px] items-center gap-2 border-b border-[#eaf1fa] px-4 py-4 text-sm font-medium leading-5 text-[#64717c] lg:grid xl:grid-cols-[56px_minmax(220px,1.8fr)_minmax(180px,1.2fr)_minmax(132px,0.95fr)_48px_116px] xl:gap-3 xl:px-6">
          <span className="flex items-center justify-center self-center text-center">
            №
          </span>
          <span className="flex items-center self-center text-left">
            Tender başlığı
          </span>
          <span className="flex items-center justify-center self-center text-center">
            Şirkət
          </span>
          <span className="flex items-center justify-center self-center text-center">
            Status
          </span>
          <span className="sr-only">Ətraflı</span>
          <span className="sr-only">Əməliyyatlar</span>
        </div>

        <div className="flex flex-col">
          {filteredTenders.map((tender, index) => (
            <div
              key={tender.id}
              className="border-b border-[#eaf1fa] px-0 py-4 last:border-b-0 lg:px-6"
            >
              <div className="hidden grid-cols-[56px_minmax(200px,1.6fr)_minmax(160px,1.1fr)_minmax(120px,0.85fr)_44px_108px] items-center gap-2 lg:grid xl:grid-cols-[56px_minmax(220px,1.8fr)_minmax(180px,1.2fr)_minmax(132px,0.95fr)_48px_116px] xl:gap-3">
                <span className="flex items-center justify-center self-center text-center text-sm leading-5 text-[#1d212a]">
                  {index + 1}
                </span>

                <p className="flex max-w-[252px] items-center self-center text-left text-sm leading-6 text-[#1d212a]">
                  {tender.title}
                </p>

                <div className="flex items-center justify-center gap-3 self-center">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-[rgba(69,136,183,0.12)] bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tender.companyLogo}
                      alt={tender.company}
                      className="size-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium leading-5 text-[#1d212a]">
                    {tender.company}
                  </span>
                </div>

                <div className="flex justify-center self-center px-0.5">
                  <TenderStatusBadge isActive={tender.isActive} />
                </div>

                <div className="flex justify-center self-center">
                  <button
                    type="button"
                    onClick={() => onOpen(tender)}
                    className="inline-flex items-center justify-center text-[#0f477d] transition-opacity hover:opacity-80"
                    aria-label="Tenderə bax"
                  >
                    <ChevronRight className="size-6" aria-hidden />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 self-center">
                  <TenderSharePopover
                    slug={tender.slug}
                    tenderTitle={tender.title}
                  />
                  <RowActionMenu
                    tender={tender}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-[#eaf1fa] bg-[#fbfdff] p-4 shadow-[0_1px_2px_rgba(15,71,125,0.04)] lg:hidden">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium leading-4 text-[#64717c]">
                      Tender #{index + 1}
                    </p>
                    <p className="mt-2 break-words text-base font-medium leading-6 text-[#1d212a]">
                      {tender.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#6b6e71]">
                      {tender.category}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpen(tender)}
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6eff6] text-[#0f477d]"
                    aria-label="Tenderə bax"
                  >
                    <ChevronRight className="size-5" aria-hidden />
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-[rgba(69,136,183,0.12)] bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tender.companyLogo}
                      alt={tender.company}
                      className="size-full object-cover"
                    />
                  </div>
                  <span className="min-w-0 truncate text-sm font-medium leading-5 text-[#1d212a]">
                    {tender.company}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <TenderStatusBadge isActive={tender.isActive} />
                  <span className="text-xs font-medium uppercase tracking-[0.04em] text-[#64717c]">
                    {tender.isActive ? 'Aktiv tender' : 'Gözləmədə'}
                  </span>
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                  <button
                    type="button"
                    onClick={() => onOpen(tender)}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#0f477d] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0c3a66]"
                  >
                    Ətraflı bax
                  </button>
                  <div className="flex items-center justify-end gap-3 rounded-xl bg-white px-3 py-1.5">
                    <TenderSharePopover
                      slug={tender.slug}
                      tenderTitle={tender.title}
                    />
                    <RowActionMenu
                      tender={tender}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TenderList() {
  const locale = useLocale()
  const queryClient = useQueryClient()

  const [view, setView] = useState<TenderListView>('list')
  const [selectedTenderId, setSelectedTenderId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TenderListItem | null>(null)

  const { data, isLoading, isError, refetch } = useQuery(
    getTendersQuery({ locale })
  )

  const { data: companiesResponse } = useQuery(
    getCompaniesQuery({ locale, per_page: 100 })
  )
  const companies = useMemo(
    () => (companiesResponse?.data ?? []) as CompanyResponse[],
    [companiesResponse?.data]
  )
  const hasActiveCompany = useMemo(() => companies.some((c) => c.status === 1), [companies])

  const onTryCreateTender = () => {
    if (!hasActiveCompany) {
      toast.error(
        'Tender yaratmaq üçün aktiv şirkətiniz olmalıdır. Zəhmət olmasa şirkətinizi təsdiqlədin.'
      )
      return
    }
    setView('create')
  }

  const tenders = useMemo(() => data?.data ?? [], [data])

  const items = useMemo(() => {
    return tenders.map((t) => tenderResponseToListItem(t, locale))
  }, [locale, tenders])

  const createTender = useMutation({
    ...postTenderMutation(),
    onSuccess: (res) => {
      if (!res?.status) {
        toast.error(res?.message || 'Xəta baş verdi')
        return
      }
      toast.success('Tender yaradıldı')
      void queryClient.invalidateQueries({ queryKey: ['tenders'] })
      setView('list')
    },
    onError: (err) =>
      toast.error(extractTenderApiError(err, 'Tender yaradılmadı')),
  })

  const updateTender = useMutation({
    ...updateTenderMutation(),
    onSuccess: (res) => {
      if (!res?.status) {
        toast.error(res?.message || 'Xəta baş verdi')
        return
      }
      toast.success('Tender yeniləndi')
      void queryClient.invalidateQueries({ queryKey: ['tenders'] })
      setView('list')
      setSelectedTenderId(null)
    },
    onError: (err) =>
      toast.error(extractTenderApiError(err, 'Tender yenilənmədi')),
  })

  const deleteTender = useMutation({
    ...deleteTenderMutation(),
    onSuccess: (res) => {
      if (!res?.status) {
        toast.error(res?.message || 'Xəta baş verdi')
        return
      }
      toast.success('Tender silindi')
      void queryClient.invalidateQueries({ queryKey: ['tenders'] })
      setDeleteTarget(null)
    },
    onError: (err) =>
      toast.error(extractTenderApiError(err, 'Tender silinmədi')),
  })

  useEffect(() => {
    if (view !== 'create') return
    if (hasActiveCompany) return
    setView('list')
    toast.error(
      'Tender yaratmaq üçün aktiv şirkətiniz olmalıdır. Zəhmət olmasa şirkətinizi təsdiqlədin.'
    )
  }, [hasActiveCompany, view])

  if (view === 'create') {
    return (
      <CreateTender
        onBack={() => setView('list')}
        onCancel={() => setView('list')}
        onSubmit={(form: CreateTenderForm) => {
          createTender.mutate({ locale, body: formToCreatePayload(form) })
        }}
      />
    )
  }

  if (view === 'edit' && selectedTenderId != null) {
    return (
      <EditTender
        tenderId={selectedTenderId}
        onBack={() => {
          setSelectedTenderId(null)
          setView('list')
        }}
        onCancel={() => {
          setSelectedTenderId(null)
          setView('list')
        }}
        onSubmit={(form: CreateTenderForm) => {
          updateTender.mutate({
            locale,
            id: selectedTenderId,
            body: formToCreatePayload(form),
          })
        }}
      />
    )
  }

  if (view === 'detail' && selectedTenderId != null) {
    const TenderDetailView = TenderDetail as unknown as ComponentType<TenderDetailProps>
    return (
      <TenderDetailView
        tenderId={selectedTenderId}
        locale={locale}
        onBack={() => {
          setSelectedTenderId(null)
          setView('list')
        }}
        onEdit={() => setView('edit')}
      />
    )
  }

  return (
    <>
    <div className="flex h-full min-h-0 w-full flex-col rounded-xl border border-[#eaf1fa] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eaf1fa] px-3 py-4 sm:px-8 sm:py-6">
        <h2 className="text-lg font-medium leading-7 text-[#1d212a] sm:text-2xl sm:leading-8">
          Tenderlərim
        </h2>
        {items.length > 0 ? (
          <AddTenderButton
            onClick={onTryCreateTender}
            disabled={!hasActiveCompany}
            className="w-full sm:w-auto"
          />
        ) : null}
      </div>

      <div className="flex-1 px-3 py-5 sm:px-8 sm:py-8">
        {isLoading ? (
          <div className="px-3 py-8 text-center text-sm text-[#6b6e71] sm:px-6 sm:py-10">
            Yüklənir…
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 px-3 py-8 text-center sm:px-6 sm:py-10">
            <p className="text-sm text-[#6b6e71]">Yükləmə alınmadı</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded-2xl bg-[#e6eff6] px-6 py-3 text-sm font-medium text-[#0f477d]"
            >
              Yenidən cəhd et
            </button>
          </div>
        ) : items.length === 0 ? (
          <EmptyTenderState
            onAdd={onTryCreateTender}
            addDisabled={!hasActiveCompany}
            helperText={
              hasActiveCompany
                ? undefined
                : 'Tender yaratmaq üçün aktiv şirkətiniz olmalıdır.'
            }
          />
        ) : (
          <TenderTable
            tenders={items}
            onOpen={(tender) => {
              setSelectedTenderId(tender.id)
              setView('detail')
            }}
            onEdit={(tender) => {
              setSelectedTenderId(tender.id)
              setView('edit')
            }}
            onDelete={(tender) => setDeleteTarget(tender)}
          />
        )}
      </div>
    </div>
    <DeleteConfirmDialog
      open={deleteTarget !== null}
      onOpenChange={(next) => {
        if (!next) setDeleteTarget(null)
      }}
      title="Tenderi silmək istədiyinizə əminsiniz?"
      confirmPending={deleteTender.isPending}
      onConfirm={() => {
        if (!deleteTarget) return
        deleteTender.mutate({ locale, id: deleteTarget.id })
      }}
    />
    </>
  )
}

