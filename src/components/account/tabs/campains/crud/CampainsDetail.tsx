import { ChevronLeft } from 'lucide-react'

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
}: {
  company: CompanyCard
  onBack: () => void
}) {
  return (
    <div className="flex w-full flex-col bg-white pb-12" data-name="company-detail">
      <div className="flex shrink-0 items-center gap-3 border-b border-[#eaf1fa] px-8 py-6">
        <button
          type="button"
          onClick={onBack}
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-[#1d212a] transition-colors hover:bg-[#f4fafd]"
          aria-label="Geri"
        >
          <ChevronLeft className="size-6" aria-hidden />
        </button>
        <h2 className="text-2xl font-medium leading-8 text-[#1d212a]">
          {company.name}
        </h2>
      </div>

      <div className="flex flex-col gap-6 px-6 pt-8 sm:px-12">
        <div className="rounded-xl border border-[#eaf1fa] bg-[#fafdff] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="relative size-[84px] shrink-0 overflow-hidden rounded-full border border-[#f1f2f6] bg-white">
              {company.logo?.trim() ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={company.logo}
                  alt={company.name}
                  className="size-full object-cover"
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
