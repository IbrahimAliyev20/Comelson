'use client'

import { ChevronLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { cn } from '@/lib/utils'
import { getTenderQuery } from '@/services/tenders/queries'
import type { ApiResponse, TenderResponse } from '@/types/types'

export type TenderDetailProps = {
  tenderId: number
  locale: string
  onBack: () => void
}

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

function htmlOrFallback(html?: string | null): string {
  const v = html?.trim()
  if (!v) return '<p>—</p>'
  return v
}

export default function TenderDetail({ tenderId, locale, onBack }: TenderDetailProps) {
  const {
    data: tenderResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    ...getTenderQuery({ locale, id: tenderId }),
    enabled: Number.isFinite(tenderId) && tenderId > 0,
  })

  if (isLoading) {
    return (
      <div className="flex w-full flex-col bg-white pb-12" data-name="tender-detail-loading">
        <div className="flex shrink-0 items-center gap-3 border-b border-[#eaf1fa] px-8 py-6">
          <button
            type="button"
            onClick={onBack}
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-[#1d212a] transition-colors hover:bg-[#f4fafd]"
            aria-label="Geri"
          >
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <h2 className="text-2xl font-medium leading-8 text-[#1d212a]">Tender</h2>
        </div>
        <div className="px-6 py-10 text-center text-sm text-[#6b6e71] sm:px-12">
          Yüklənir…
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex w-full flex-col bg-white pb-12" data-name="tender-detail-error">
        <div className="flex shrink-0 items-center gap-3 border-b border-[#eaf1fa] px-8 py-6">
          <button
            type="button"
            onClick={onBack}
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-[#1d212a] transition-colors hover:bg-[#f4fafd]"
            aria-label="Geri"
          >
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <h2 className="text-2xl font-medium leading-8 text-[#1d212a]">Tender</h2>
        </div>
        <div className="flex flex-col items-center gap-4 px-6 py-10 text-center sm:px-12">
          <p className="text-sm text-[#6b6e71]">Yükləmə alınmadı</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-2xl bg-[#e6eff6] px-6 py-3 text-sm font-medium text-[#0f477d]"
          >
            Yenidən cəhd et
          </button>
        </div>
      </div>
    )
  }

  const res = tenderResponse as ApiResponse<TenderResponse> | undefined
  const tender = res?.status ? res.data : undefined

  if (!tender) {
    return (
      <div className="flex w-full flex-col bg-white pb-12" data-name="tender-detail-empty">
        <div className="flex shrink-0 items-center gap-3 border-b border-[#eaf1fa] px-8 py-6">
          <button
            type="button"
            onClick={onBack}
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-[#1d212a] transition-colors hover:bg-[#f4fafd]"
            aria-label="Geri"
          >
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <h2 className="text-2xl font-medium leading-8 text-[#1d212a]">Tender</h2>
        </div>
        <div className="px-6 py-10 text-center text-sm text-[#6b6e71] sm:px-12">
          Məlumat tapılmadı
        </div>
      </div>
    )
  }

  const category =
    tender.category?.name?.[locale] ?? tender.category?.name?.az ?? '—'

  return (
    <div className="flex w-full flex-col bg-white pb-12" data-name="tender-detail">
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
          {tender.title}
        </h2>
      </div>

      <div className="flex flex-col gap-6 px-6 pt-8 sm:px-12">
        <div className="rounded-xl border border-[#eaf1fa] bg-white p-5">
          <p className="text-sm font-medium text-[#6b6e71]">Tender məlumatları</p>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-8">
            <FieldRow label="Kateqoriya" value={category} />
            <FieldRow label="Başlama tarixi və saatı" value={tender.start_date} />
            <FieldRow label="Bitmə tarixi və saatı" value={tender.end_date} />
            <FieldRow
              label="Şirkət ID"
              value={tender.company_id ? String(tender.company_id) : '—'}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#eaf1fa] bg-white p-5">
          <p className="text-sm font-medium text-[#6b6e71]">Tender haqqında</p>
          <div
            className={cn(
              'prose prose-sm mt-3 max-w-none text-[#1d212a]',
              'prose-p:leading-6'
            )}
            dangerouslySetInnerHTML={{ __html: htmlOrFallback(tender.description) }}
          />
        </div>

        <div className="rounded-xl border border-[#eaf1fa] bg-white p-5">
          <p className="text-sm font-medium text-[#6b6e71]">Tələb olunan sənədlər</p>
          <div
            className={cn(
              'prose prose-sm mt-3 max-w-none text-[#1d212a]',
              'prose-p:leading-6'
            )}
            dangerouslySetInnerHTML={{
              __html: htmlOrFallback(tender.required_documents),
            }}
          />
        </div>

        <div className="rounded-xl border border-[#eaf1fa] bg-white p-5">
          <p className="text-sm font-medium text-[#6b6e71]">Əlaqə vasitələri</p>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-8">
            <FieldRow label="Əlaqə adı" value={tender.contact_name} />
            <FieldRow label="Vəzifə" value={tender.contact_position} />
            <FieldRow
              label="Telefon"
              value={tender.contact_phone}
              href={tender.contact_phone ? `tel:${tender.contact_phone}` : undefined}
            />
            <FieldRow
              label="Email"
              value={tender.contact_email}
              href={tender.contact_email ? `mailto:${tender.contact_email}` : undefined}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#eaf1fa] bg-white p-5">
          <p className="text-sm font-medium text-[#6b6e71]">
            Sosial media vasitələri
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-8">
            <FieldRow
              label="Instagram"
              value={tender.contact_instagram}
              href={tender.contact_instagram || undefined}
            />
            <FieldRow
              label="Facebook"
              value={tender.contact_facebook}
              href={tender.contact_facebook || undefined}
            />
            <FieldRow
              label="LinkedIn"
              value={tender.contact_linkedin}
              href={tender.contact_linkedin || undefined}
            />
            <FieldRow
              label="X/Twitter"
              value={tender.contact_twitter}
              href={tender.contact_twitter || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
