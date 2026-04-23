'use client'

import { ChevronLeft, PencilIcon } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import type { CompanyCard } from '@/types/types'

function FieldRow({
  label,
  value,
  href,
}: {
  label: string
  value?: string | null
  href?: string
}) {
  const v = value?.trim()
  if (!v) return null

  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-[#6b6e71]">{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-base font-medium text-[#0f477d] underline-offset-4 hover:underline"
        >
          {v}
        </a>
      ) : (
        <p className="text-base font-medium text-[#1d212a]">{v}</p>
      )}
    </div>
  )
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || '?'
}

export default function CampainsDetail({
  company,
  onBack,
  onEdit,
}: {
  company: CompanyCard
  onBack: () => void
  onEdit?: () => void
}) {
  const [logoOk, setLogoOk] = useState(true)

  return (
    <div className="flex w-full flex-col bg-white pb-12" data-name="company-detail">
      <div className="flex shrink-0 items-center gap-3 border-b border-[#eaf1fa] px-3 py-4 sm:px-8 sm:py-6">
        <button
          type="button"
          onClick={onBack}
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#1d212a] transition-colors hover:bg-[#f4fafd]"
          aria-label="Geri"
        >
          <ChevronLeft className="size-6" aria-hidden />
        </button>
        <h2 className="min-w-0 flex-1 truncate text-lg font-medium leading-7 text-[#1d212a] sm:text-2xl sm:leading-8">
          {company.name}
        </h2>
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-[#e6eff6] px-4 py-2.5 text-sm font-medium leading-5 text-[#0f477d] transition-colors hover:bg-[#d7e6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d] min-[400px]:px-6 min-[400px]:py-3 min-[400px]:text-base min-[400px]:leading-6"
          >
            <PencilIcon className="size-4 shrink-0 min-[400px]:size-5" aria-hidden />
            Redaktə et
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 px-3 pt-6 sm:gap-6 sm:px-12 sm:pt-8">
        <div className="rounded-xl border border-[#eaf1fa] bg-[#fafdff] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="relative size-[84px] shrink-0 overflow-hidden rounded-full border border-[#f1f2f6] bg-white">
              {company.logo?.trim() && logoOk ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={company.logo}
                  alt={company.name}
                  className="size-full object-cover"
                  onError={() => setLogoOk(false)}
                />
              ) : (
                <div
                  className="flex size-full items-center justify-center bg-[#e6eff6] text-base font-semibold text-[#0f477d]"
                  aria-hidden
                >
                  {initialsFromName(company.name)}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#6b6e71]">Kateqoriya</p>
              <p className="mt-1 text-xl font-medium leading-7 text-[#1d212a]">
                {company.category}
              </p>
              {company.voen ? (
                <p className="mt-1 text-sm leading-5 text-[#6b6e71]">
                  VÖEN: <span className="font-medium">{company.voen}</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#eaf1fa] bg-white p-5">
          <p className="text-sm font-medium text-[#6b6e71]">Şirkət haqqında</p>
          <div
            className={cn(
              'prose prose-sm mt-3 max-w-none text-[#1d212a]',
              'prose-p:leading-6'
            )}
            // create/edit-də CKEditor HTML saxlayırıq — demo üçün burada render edirik
            dangerouslySetInnerHTML={{
              __html: company.description || '<p>—</p>',
            }}
          />
        </div>

        <div className="rounded-xl border border-[#eaf1fa] bg-white p-5">
          <p className="text-sm font-medium text-[#6b6e71]">Əlaqə vasitələri</p>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-8">
            <FieldRow label="Telefon" value={company.phone} />
            <FieldRow
              label="Email"
              value={company.email}
              href={company.email ? `mailto:${company.email}` : undefined}
            />
            <FieldRow label="Ölkə" value={company.country} />
            <FieldRow label="Ünvan" value={company.address} />
          </div>
        </div>

        <div className="rounded-xl border border-[#eaf1fa] bg-white p-5">
          <p className="text-sm font-medium text-[#6b6e71]">
            Sosial media vasitələri
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-8">
            <FieldRow
              label="Website"
              value={company.website}
              href={company.website || undefined}
            />
            <FieldRow
              label="Instagram"
              value={company.instagram}
              href={company.instagram || undefined}
            />
            <FieldRow
              label="Facebook"
              value={company.facebook}
              href={company.facebook || undefined}
            />
            <FieldRow
              label="LinkedIn"
              value={company.linkedin}
              href={company.linkedin || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
