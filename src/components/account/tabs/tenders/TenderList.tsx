'use client'

import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  FileText,
  MoreVertical,
  PencilIcon,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import { tendersHomeRows } from '@/utils/tenders-data'

import CreateTender, { type CreateTenderForm } from './crud/createTender'
import Link from 'next/link'

type TenderListView = 'list' | 'create'
type TenderStatusFilter = 'all' | 'active'

type TenderListItem = {
  id: number
  title: string
  company: string
  companyLogo: string
  category: string
  startDate: string
  endDate: string
  status: 'active' | 'closed'
}

const COMPANY_LOGO =
  'https://www.figma.com/api/mcp/asset/c7c6ff5b-0d48-4e4a-b723-979979f11602'

const MOCK_TENDERS: TenderListItem[] = tendersHomeRows.map((item) => ({
  id: item.id,
  title: item.buyerName,
  company: 'Comelson MMC',
  companyLogo: COMPANY_LOGO,
  category: item.category,
  startDate: item.startAt.split(/\s+/)[0] ?? item.startAt,
  endDate: item.endAt.split(/\s+/)[0] ?? item.endAt,
  status: item.status,
}))

function AddTenderButton({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-12 items-center justify-center gap-4 rounded-2xl bg-[#0f477d] px-6 text-base font-medium leading-6 text-white transition-colors hover:bg-[#0c3a66] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d]',
        className
      )}
    >
      <Plus className="size-6 shrink-0" aria-hidden />
      Tender əlavə et
    </button>
  )
}

function EmptyTenderState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-8">
      <div className="flex w-full max-w-[402px] flex-col items-center gap-9 rounded-xl bg-white px-6 py-7 text-center">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center rounded-lg bg-[#e6eff6] p-3" aria-hidden>
            <FileText className="size-8 text-[#0f477d]" strokeWidth={1.8} />
          </div>

          <div className="flex w-full max-w-[354px] flex-col gap-4">
            <p className="text-[20px] font-medium leading-7 text-[#14171a]">
              Hazırda əlavə edilmiş tender yoxdur
            </p>
            <p className="text-sm leading-5 text-[#6b6e71]">
              İlk tenderinizi yaradın, təkliflər toplayın və doğru tərəfdaşları
              tapın
            </p>
          </div>
        </div>

        <AddTenderButton onClick={onAdd} />
      </div>
    </div>
  )
}

function FilterButton({
  label,
  icon,
}: {
  label: string
  icon?: 'chevron' | 'calendar'
}) {
  return (
    <button
      type="button"
      className="inline-flex h-12 items-center justify-between rounded-xl border border-[#dadee2] bg-white px-3.5 text-base leading-6 text-[#32393f]"
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
        className="inline-flex size-10 items-center justify-center rounded-full bg-[#e6eff6] text-[#0f477d] transition-colors hover:bg-[#d7e6f2]"
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
            className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-sm text-[#14171a] transition-colors hover:bg-[#f4fafd]"
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
            className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="size-4" aria-hidden />
            Sil
          </button>
        </div>
      ) : null}
    </div>
  )
}

function ShareButton() {
  return (
    <button
      type="button"
      className="inline-flex size-10 items-center justify-center rounded-full bg-[#e6eff6] text-[#0f477d] transition-colors hover:bg-[#d7e6f2]"
      aria-label="Tenderi paylaş"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="size-5"
        aria-hidden
      >
        <path
          d="M10.8335 3.33301V6.66634C5.35432 7.52301 3.31682 12.323 2.50016 16.6663C2.46932 16.838 6.98682 11.698 10.8335 11.6663V14.9997L17.5002 9.16634L10.8335 3.33301Z"
          stroke="#0F477D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function TenderTable({
  tenders,
  onEdit,
  onDelete,
}: {
  tenders: TenderListItem[]
  onEdit: (tender: TenderListItem) => void
  onDelete: (tender: TenderListItem) => void
}) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TenderStatusFilter>('active')
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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:w-auto">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as TenderStatusFilter)
              }
              className="h-12 w-full appearance-none rounded-xl border border-[#dadee2] bg-white px-3.5 pr-10 text-base leading-6 text-[#32393f] outline-none"
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
              className="h-12 w-full appearance-none rounded-xl border border-[#dadee2] bg-white px-3.5 pr-10 text-base leading-6 text-[#32393f] outline-none"
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

          <FilterButton label="Tarix" icon="calendar" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#f2f9ff] bg-white ">
        <div className="hidden grid-cols-[56px_minmax(220px,1.7fr)_minmax(180px,1.1fr)_128px_128px_48px_116px] items-center gap-3 border-b border-[#eaf1fa] px-6 pb-7 text-sm font-medium leading-5 text-[#64717c] lg:grid">
          <span className="text-center">№</span>
          <span className="text-left">Tender başlığı</span>
          <span className="text-center">Şirkət</span>
          <span className="text-center">Başlama tarixi</span>
          <span className="text-center">Bitmə tarixi</span>
          <span className="sr-only">Ətraflı</span>
          <span className="sr-only">Əməliyyatlar</span>
        </div>

        <div className="flex flex-col">
          {filteredTenders.map((tender, index) => (
            <div
              key={tender.id}
              className="border-b border-[#eaf1fa] px-0 py-4 last:border-b-0 lg:px-6"
            >
              <div className="hidden grid-cols-[56px_minmax(220px,1.7fr)_minmax(180px,1.1fr)_128px_128px_48px_116px] items-center gap-3 lg:grid">
                <span className="text-center text-sm leading-5 text-[#1d212a]">
                  {index + 1}
                </span>

                <p className="max-w-[252px] text-left text-sm leading-7 text-[#1d212a]">
                  {tender.title}
                </p>

                <div className="flex items-center justify-center gap-3">
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

                <span className="text-center text-sm leading-5 text-[#1d212a]">
                  {tender.startDate}
                </span>
                <span className="text-center text-sm leading-5 text-[#1d212a]">
                  {tender.endDate}
                </span>

                <div className="flex justify-center">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center text-[#0f477d] transition-opacity hover:opacity-80"
                    aria-label="Tenderə bax"
                  >
                    <Link href={`/tenders/${tender.id}`}>
                      <ChevronRight className="size-6" aria-hidden />
                    </Link>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <ShareButton />
                  <RowActionMenu
                    tender={tender}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium leading-4 text-[#64717c]">
                      #{index + 1}
                    </p>
                    <p className="mt-2 text-base leading-6 text-[#1d212a]">
                      {tender.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center text-[#0f477d]"
                    aria-label="Tenderə bax"
                  >
                    <ChevronRight className="size-6" aria-hidden />
                  </button>
                </div>

                <div className="flex items-center gap-3">
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

                <div className="grid grid-cols-2 gap-3 text-sm leading-5 text-[#1d212a]">
                  <div>
                    <p className="text-xs text-[#64717c]">Başlama tarixi</p>
                    <p className="mt-1">{tender.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64717c]">Bitmə tarixi</p>
                    <p className="mt-1">{tender.endDate}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <ShareButton />
                  <RowActionMenu
                    tender={tender}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
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
  const [view, setView] = useState<TenderListView>('list')
  /** Demo + istifadəçi əlavələri — ilkin olaraq statik MOCK_TENDERS görünür */
  const [items, setItems] = useState<TenderListItem[]>(() => [...MOCK_TENDERS])

  if (view === 'create') {
    return (
      <CreateTender
        onBack={() => setView('list')}
        onCancel={() => setView('list')}
        onSubmit={(data: CreateTenderForm) => {
          const nextTender: TenderListItem = {
            id: Date.now(),
            title: data.title || 'Yeni tender',
            company: data.company || 'Comelson MMC',
            companyLogo: COMPANY_LOGO,
            category: data.category || 'Digər',
            startDate: data.startAt || '01.10.2026',
            endDate: data.endAt || '01.11.2026',
            status: 'active',
          }

          setItems((prev) => [nextTender, ...prev])
          setView('list')
        }}
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-xl border border-[#eaf1fa] bg-white">
      <div className="border-b border-[#eaf1fa] px-8 py-6">
        <h2 className="text-2xl font-medium leading-8 text-[#1d212a]">
          Tenderlərim
        </h2>
      </div>

      <div className="flex-1 px-0 py-8 sm:px-8">
        {items.length === 0 ? (
          <EmptyTenderState onAdd={() => setView('create')} />
        ) : (
          <TenderTable
            tenders={items}
            onEdit={(tender) => {
              console.log('Edit tender', tender)
            }}
            onDelete={(tender) => {
              const ok = window.confirm('Tenderi silmək istəyirsiniz?')
              if (!ok) return
              setItems((prev) => prev.filter((x) => x.id !== tender.id))
            }}
          />
        )}
      </div>
    </div>
  )
}
