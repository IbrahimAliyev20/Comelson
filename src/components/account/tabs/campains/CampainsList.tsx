'use client'

import { Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

import CreateCampain from './crud/createCampain'

/** Figma 456:7929 — boş şirkət siyahısı (ikon + mətn + əsas düymə) */
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
  view: 'list' | 'create'
  onViewChange: (view: 'list' | 'create') => void
}

export default function CampainsList({ view, onViewChange }: CampainsListProps) {
  if (view === 'create') {
    return <CreateCampain onBack={() => onViewChange('list')} />
  }

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

      <button
        type="button"
        onClick={() => onViewChange('create')}
        className="inline-flex h-12 shrink-0 items-center justify-center gap-4 rounded-2xl bg-[#0f477d] px-6 py-3 text-base font-medium leading-6 text-white transition-colors hover:bg-[#0c3a66] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d]"
      >
        <Plus className="size-6 shrink-0" aria-hidden />
        Şirkət əlavə et
      </button>
    </div>
  )
}
