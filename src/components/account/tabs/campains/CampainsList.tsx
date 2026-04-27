'use client'
import { CheckCircle2, ChevronRight, Clock4, MoreVertical, PencilIcon, Plus, Trash2, XCircle } from 'lucide-react'
import { useLocale } from 'next-intl'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog'
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
  tooltip: string
  className: string
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
}

function getCompanyStatusVariant(status?: number): CompanyStatusVariant {
  // Assumption based on typical API conventions:
  // 0: pending, 1: approved/active, 2: rejected/blocked (fallback: pending).
  if (status === 1) {
    return {
      label: 'Təsdiqləndi',
      tooltip: 'Şirkətiniz təsdiqləndi və platformada aktivdir.',
      className: 'bg-[#eaf8ef] text-[#34c759]',
      Icon: CheckCircle2,
    }
  }

  if (status === 2) {
    return {
      label: 'İmtina',
      tooltip:
        'Şirkət müraciətiniz rədd edildi. Məlumatları yeniləyib yenidən göndərə bilərsiniz.',
      className: 'bg-[#ffebee] text-[#ff3b30]',
      Icon: XCircle,
    }
  }

  return {
    label: 'Gözləmədə',
    tooltip:
      'Şirkətiniz hal-hazırda yoxlanış mərhələsindədir. Təsdiqdən sonra aktiv olacaq.',
    className: 'bg-[#fffae5] text-[#ff9500]',
    Icon: Clock4,
  }
}

function CompanyStatusPill({ status }: { status?: number }) {
  const v = getCompanyStatusVariant(status)
  return (
    <div className="group relative inline-flex w-full">
      <div
        tabIndex={0}
        aria-label={v.tooltip}
        className={cn(
          'inline-flex h-9 w-full cursor-help items-center justify-center gap-2 rounded-2xl px-3 py-1.5 text-xs font-medium leading-4 outline-none sm:h-12 sm:px-6 sm:py-2 sm:text-sm sm:leading-5',
          v.className
        )}
      >
        <v.Icon className="size-4 shrink-0 sm:size-5" aria-hidden />
        <span className="font-medium">{v.label}</span>
      </div>
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[240px] -translate-x-1/2 rounded-lg bg-[#0c3a66] px-3 py-2 text-center text-xs font-normal leading-4 text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {v.tooltip}
        <span
          aria-hidden
          className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#0c3a66]"
        />
      </div>
    </div>
  )
}

function EmptyCompanyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-7 px-3 py-6 sm:gap-9 sm:px-8 sm:py-7">
      <div className="flex w-full max-w-[354px] flex-col items-center gap-8 text-center">
        <BuildingInBadge />
        <div className="flex flex-col gap-4">
          <p className="text-lg font-medium leading-7 text-[#14171a] sm:text-xl">
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
        'inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-4 rounded-2xl bg-[#e6eff6] px-6 py-3 text-base font-medium leading-6 text-[#0f477d] transition-colors hover:bg-[#d7e6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d]',
        className
      )}
    >
            <Plus className="size-6 shrink-0" aria-hidden />

      {children ?? ' Şirkət əlavə et'}
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
          className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg bg-[#eaf1fa] text-[#6b6e71] transition-colors hover:bg-[#dfe9f7]"
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
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-[#f1f2f6] bg-white sm:size-16 sm:rounded-[56px]">
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

          <div className="min-w-0 flex-1 pr-10 sm:pr-0">
            <p className="truncate text-base font-medium leading-6 text-[#1d212a] sm:text-xl sm:leading-7">
              {company.name}
            </p>
            <p className="mt-1 text-xs leading-4 text-[#6b6e71] sm:mt-1.5 sm:text-sm sm:leading-5">
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
          className="group inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl px-2 text-sm font-medium leading-5 text-[#0f477d] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d] sm:h-12 sm:gap-3 sm:text-base sm:leading-6"
        >
          Ətraflı bax
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5 sm:size-5" aria-hidden />
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

  const hasActiveCompany = useMemo(
    () => items.some((c) => c.status === 1),
    [items]
  )

  const [selectedCompany, setSelectedCompany] = useState<CompanyCard | null>(
    null
  )
  const [deleteTarget, setDeleteTarget] = useState<CompanyCard | null>(null)

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
      setDeleteTarget(null)
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
    return (
      <CampainsDetail
        company={selectedCompany}
        onBack={() => onViewChange('list')}
        onEdit={() => onViewChange('edit')}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 px-3 py-8 sm:px-12 sm:py-12">
        <p className="text-center text-sm text-[#6b6e71]">Yüklənir…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 px-3 py-8 sm:px-12 sm:py-12">
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
    <>
    <div className="flex flex-col gap-4 px-3 pb-8 pt-6 sm:gap-6 sm:px-12 sm:pb-12 sm:pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eaf1fa] pb-6">
        <h2 className="text-lg font-medium leading-7 text-[#1d212a] sm:text-2xl sm:leading-8">
          Şirkətlərim
        </h2>
        {items.length > 0 ? (
          <AddCompanyButton
            onClick={() => onViewChange('create')}
            className="w-full sm:w-auto"
          />
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
              onDelete={(item) => setDeleteTarget(item)}
            />
          ))}
        </div>
      )}
    </div>
    <DeleteConfirmDialog
      open={deleteTarget !== null}
      onOpenChange={(next) => {
        if (!next) setDeleteTarget(null)
      }}
      title="Şirkəti silmək istədiyinizə əminsiniz?"
      confirmPending={deleteMutation.isPending}
      onConfirm={() => {
        if (!deleteTarget) return
        const id = Number(deleteTarget.id)
        if (Number.isNaN(id)) return
        setSelectedCompany((prev) =>
          prev?.id === deleteTarget.id ? null : prev
        )
        deleteMutation.mutate({ locale, id })
      }}
    />
    </>
  )
}