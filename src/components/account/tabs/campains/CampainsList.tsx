'use client'
import { MoreVertical, PencilIcon, Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import CreateCampain from './crud/createCampain'
import CampainsDetail from './crud/CampainsDetail'
import EditCampain from './crud/editCampain'

export type CompanyCard = {
  id: string
  name: string
  category: string
  description: string
  logo: string
  voen?: string
  country?: string
  phone?: string
  email?: string
  address?: string
  website?: string
  instagram?: string
  facebook?: string
  linkedin?: string
}

const DEMO_COMPANIES: CompanyCard[] = [
  {
    id: 'comelson-mmc',
    name: 'Comelson MMC',
    category: 'Networking',
    description:
      'Şirkətə özəl veb sayt hazırlanması, SEO və SMM xidmətləri həyata keçiririk. Bizimlə əlaqə saxlayın və onlayn mövcudluğunuzu birlikdə artıraq!',
    logo: 'https://www.figma.com/api/mcp/asset/39672e3b-85b5-4299-8f4c-bd93347a99c3',
    voen: '12345678',
    country: 'Azərbaycan',
    phone: '70 777 77 77',
    email: 'info@comelson.az',
    address: 'Bakı, Azərbaycan, Əhmədli',
    website: 'https://comelson.az',
    instagram: 'https://instagram.com/comelson',
    facebook: 'https://facebook.com/comelson',
    linkedin: 'https://linkedin.com/company/comelson',
  },
  {
    id: 'markup-agency',
    name: 'Markup Agency',
    category: 'IT&Marketing',
    description:
      'Şirkətə özəl veb sayt hazırlanması, SEO və SMM xidmətləri həyata keçiririk. Bizimlə əlaqə saxlayın və onlayn mövcudluğunuzu birlikdə artıraq!',
    logo: 'https://www.figma.com/api/mcp/asset/6d560330-2bc7-4857-b190-270be5a06e12',
    voen: '87654321',
    country: 'Azərbaycan',
    phone: '55 444 22 11',
    email: 'hello@markup.agency',
    address: 'Bakı, Azərbaycan, Nərimanov',
    website: 'https://markup.agency',
    instagram: 'https://instagram.com/markup.agency',
    facebook: 'https://facebook.com/markup.agency',
    linkedin: 'https://linkedin.com/company/markup-agency',
  },
]

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
      <Plus className="size-6 shrink-0" aria-hidden />
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
    <article className="relative flex w-full flex-col gap-6 rounded-xl border border-[#eaf1fa] bg-[#fafdff] px-5 py-6">
      <div ref={menuRef} className="absolute right-4 top-4">
        <button
          type="button"
          aria-label="Menyu"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex size-9 items-center justify-center rounded-lg border border-[#eaf1fa] bg-white text-[#6b6e71] transition-colors hover:bg-[#f4fafd]"
        >
          <MoreVertical className="size-5" aria-hidden />
        </button>

        {menuOpen ? (
          <div
            role="menu"
            className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-[#eaf1fa] bg-white shadow-xl p-3  "
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

      <button
        type="button"
        onClick={() => onOpen(company)}
        className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#e6eff6] px-6 text-base font-medium leading-6 text-[#0f477d] transition-colors hover:bg-[#d7e6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d]"
      >
        Ətraflı bax
      </button>
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
  companies?: CompanyCard[]
}

export default function CampainsList({
  view,
  onViewChange,
  companies = DEMO_COMPANIES,
}: CampainsListProps) {
  const [items, setItems] = useState<CompanyCard[]>(companies)
  const [selectedCompany, setSelectedCompany] = useState<CompanyCard | null>(
    items[0] ?? null
  )

  useEffect(() => {
    setItems(companies)
  }, [companies])

  useEffect(() => {
    if (selectedCompany) return
    setSelectedCompany(items[0] ?? null)
  }, [items, selectedCompany])

  if (view === 'create') {
    return <CreateCampain onBack={() => onViewChange('list')} />
  }

  if (view === 'edit' && selectedCompany) {
    return (
      <EditCampain
        company={selectedCompany}
        onCancel={() => onViewChange('list')}
        onSubmit={(company) => {
          setSelectedCompany(company)
          setItems((prev) =>
            prev.map((x) => (x.id === company.id ? { ...x, ...company } : x))
          )
          onViewChange('list')
        }}
      />
    )
  }

  if (view === 'detail' && selectedCompany) {
    return <CampainsDetail company={selectedCompany} onBack={() => onViewChange('list')} />
  }

  if (items.length === 0) {
    return <EmptyCompanyState onAdd={() => onViewChange('create')} />
  }

  return (
    <div className="flex flex-col gap-6 px-6 pt-8 sm:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eaf1fa] pb-6">
        <h2 className="text-2xl font-medium leading-8 text-[#1d212a]">
          Şirkətlərim
        </h2>
        <AddCompanyButton onClick={() => onViewChange('create')} />
      </div>
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
              setItems((prev) => prev.filter((x) => x.id !== item.id))
              setSelectedCompany((prev) => (prev?.id === item.id ? null : prev))
            }}
          />
        ))}
      </div>
    </div>
  )
}