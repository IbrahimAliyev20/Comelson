'use client'
import { CheckCircle2, ChevronRight, Clock4, MoreVertical, PencilIcon, Trash2, XCircle } from 'lucide-react'
import { useLocale } from 'next-intl'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { companyResponseToCard } from '@/services/companies/company-card-map'
import { deleteCompanyMutation } from '@/services/companies/mutations'
import { getCompaniesQuery } from '@/services/companies/queries'
import type { CompanyCard } from '@/types/types'

import CreateCampain from './crud/createCampain'
import CampainsDetail from './crud/CampainsDetail'
import EditCampain from './crud/editCampain'

export type { CompanyCard }

type CompanyStatusVariant = {
  label: string
  className: string
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
}

function getCompanyStatusVariant(status?: number): CompanyStatusVariant {
  // Assumption based on typical API conventions:
  // 0: pending, 1: approved/active, 2: rejected/blocked (fallback: pending).
  if (status === 1) {
    return {
      label: 'Təsdiqlənib',
      className: 'bg-[#eaf8ef] text-[#34c759]',
      Icon: CheckCircle2,
    }
  }

  if (status === 2) {
    return {
      label: 'İmtina',
      className: 'bg-[#ffebee] text-[#ff3b30]',
      Icon: XCircle,
    }
  }

  return {
    label: 'Gözləmədə',
    className: 'bg-[#fffae5] text-[#ff9500]',
    Icon: Clock4,
  }
}

function CompanyStatusPill({ status }: { status?: number }) {
  const v = getCompanyStatusVariant(status)
  return (
    <div
      className={cn(
        'inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 py-2 text-sm font-medium leading-5',
        v.className
      )}
    >
      <v.Icon className="size-5 shrink-0" aria-hidden />
      <span className="font-medium">{v.label}</span>
    </div>
  )
}

function EmptyCompanyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-9 px-6 py-7 sm:px-8">
      <div className="flex w-full max-w-[354px] flex-col items-center gap-8 text-center">
        <BuildingInBadge />
        <div className="flex flex-col gap-4">
          <p className="text-xl font-medium leading-7 text-[#14171a]">
            Hazırda əlavə edilmiş şirkət yoxdur
          </p>
          <p className="text-sm font-normal leading-5 text-[#6b6e71]">
            Şirkətinizi idarə etmək və yeni imkanlardan yararlanmaq üçün indi
            başlayın.
          </p>
        </div>
      </div>

      <AddCompanyButton onClick={onAdd} />
    </div>
  )
}

export function AddCompanyButton({
  onClick,
  children,
  className,
}: {
  onClick: () => void
  children?: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-12 shrink-0 items-center justify-center gap-4 rounded-2xl bg-[#e6eff6] px-6 py-3 text-base font-medium leading-6 text-[#0f477d] transition-colors hover:bg-[#d7e6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d]',
        className
      )}
    >
      {children ?? 'Şirkət əlavə et'}
    </button>
  )
}

function CompanyCardItem({
  company,
  onOpen,
  onEdit,
  onDelete,
}: {
  company: CompanyCard
  onOpen: (company: CompanyCard) => void
  onEdit: (company: CompanyCard) => void
  onDelete: (company: CompanyCard) => void
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

  const initials = useMemo(() => {
    const parts = company.name.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
    }
    return company.name.slice(0, 2).toUpperCase() || '?'
  }, [company.name])

  const [logoOk, setLogoOk] = useState(true)

  return (
    <article className="relative flex w-full flex-col gap-6 rounded-xl border border-[#eaf1fa] bg-[#fafdff] p-5">
      <div ref={menuRef} className="absolute right-4 top-4">
        <button
          type="button"
          aria-label="Menyu"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-lg bg-[#eaf1fa] text-[#6b6e71] transition-colors hover:bg-[#dfe9f7]"
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
                onEdit(company)
              }}
              className="flex w-full items-center px-4 py-3 gap-2 text-left text-sm text-[#14171a] transition-colors hover:bg-[#f4fafd] cursor-pointer rounded-lg"
            >
              <span>
                <PencilIcon className="size-4" aria-hidden />
              </span>
              Redaktə et
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false)
                onDelete(company)
              }}
              className="flex w-full items-center px-4 py-3 gap-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 cursor-pointer rounded-lg"
            >
              <span>
                <Trash2 className="size-4" aria-hidden />
              </span>
              Şirkəti sil
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-[56px] border border-[#f1f2f6] bg-white">
            {company.logo.trim().length > 0 && logoOk ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={company.logo}
                  alt={company.name}
                  className="size-full object-cover"
                  onError={() => setLogoOk(false)}
                />
              </>
            ) : (
              <div
                className="flex size-full items-center justify-center bg-[#e6eff6] text-sm font-semibold text-[#0f477d]"
                aria-hidden
              >
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xl font-medium leading-7 text-[#1d212a]">
              {company.name}
            </p>
            <p className="mt-1.5 text-sm leading-5 text-[#6b6e71]">
              {company.category}
            </p>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-5 text-[#64717c]">
          {company.description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="w-[249px] max-w-full">
          <CompanyStatusPill status={company.status} />
        </div>

        <button
          type="button"
          onClick={() => onOpen(company)}
          className="group inline-flex h-12 items-center justify-center gap-3 rounded-2xl px-2 text-base font-medium leading-6 text-[#0f477d] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d]"
        >
          Ətraflı bax
          <ChevronRight className="size-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </button>
      </div>
    </article>
  )
}

function BuildingInBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-lg bg-[#e6eff6] p-3',
        className
      )}
      aria-hidden
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={32}
        height={32}
        viewBox="0 0 28 28"
        fill="none"
        className="size-8 text-[#0f477d]"
      >
        <path
          d="M3.5 24.5H24.5M5.83333 24.5V8.16667L15.1667 3.5V24.5M22.1667 24.5V12.8333L15.1667 8.16667M10.5 10.5V10.5117M10.5 14V14.0117M10.5 17.5V17.5117M10.5 21V21.0117"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export type CampainsListProps = {
  view: 'list' | 'create' | 'edit' | 'detail'
  onViewChange: (view: 'list' | 'create' | 'edit' | 'detail') => void
}

export default function CampainsList({
  view,
  onViewChange,
}: CampainsListProps) {
  const locale = useLocale()
  const queryClient = useQueryClient()
  const { data, isLoading, isError, refetch } = useQuery(
    getCompaniesQuery({ locale })
  )

  const items = useMemo(
    () => data?.data?.map(companyResponseToCard) ?? [],
    [data]
  )

  const [selectedCompany, setSelectedCompany] = useState<CompanyCard | null>(
    null
  )

  useEffect(() => {
    if (selectedCompany) return
    setSelectedCompany(items[0] ?? null)
  }, [items, selectedCompany])

  const deleteMutation = useMutation({
    ...deleteCompanyMutation(),
    onSuccess: (res) => {
      if (!res?.status) {
        toast.error(res?.message || 'Xəta baş verdi')
        return
      }
      toast.success('Şirkət silindi')
      void queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
    onError: () => {
      toast.error('Şirkət silinmədi')
    },
  })

  const invalidateCompanies = () => {
    void queryClient.invalidateQueries({ queryKey: ['companies'] })
  }

  if (view === 'create') {
    return (
      <CreateCampain
        onBack={() => onViewChange('list')}
        onSuccess={() => {
          invalidateCompanies()
          onViewChange('list')
        }}
      />
    )
  }

  if (view === 'edit' && selectedCompany) {
    return (
      <EditCampain
        company={selectedCompany}
        onCancel={() => onViewChange('list')}
        onSuccess={() => {
          invalidateCompanies()
          onViewChange('list')
        }}
      />
    )
  }

  if (view === 'detail' && selectedCompany) {
    return <CampainsDetail company={selectedCompany} onBack={() => onViewChange('list')} />
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 px-6 py-12 sm:px-12">
        <p className="text-center text-sm text-[#6b6e71]">Yüklənir…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 px-6 py-12 sm:px-12">
        <p className="text-center text-sm text-[#6b6e71]">Yükləmə alınmadı</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-2xl bg-[#e6eff6] px-6 py-3 text-sm font-medium text-[#0f477d]"
        >
          Yenidən cəhd et
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-6 pt-8 sm:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eaf1fa] pb-6">
        <h2 className="text-2xl font-medium leading-8 text-[#1d212a]">
          Şirkətlərim
        </h2>
        {items.length > 0 ? (
          <AddCompanyButton onClick={() => onViewChange('create')} />
        ) : null}
      </div>
      {items.length === 0 ? (
        <EmptyCompanyState onAdd={() => onViewChange('create')} />
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {items.map((company) => (
            <CompanyCardItem
              key={company.id}
              company={company}
              onOpen={(item) => {
                setSelectedCompany(item)
                onViewChange('detail')
              }}
              onEdit={(item) => {
                setSelectedCompany(item)
                onViewChange('edit')
              }}
              onDelete={(item) => {
                const ok = window.confirm('Şirkəti silmək istəyirsiniz?')
                if (!ok) return
                const id = Number(item.id)
                if (Number.isNaN(id)) return
                deleteMutation.mutate({ locale, id })
                setSelectedCompany((prev) => (prev?.id === item.id ? null : prev))
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}