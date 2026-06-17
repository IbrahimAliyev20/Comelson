'use client'

import { ChevronLeft, PencilIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { toRenderableHtml } from '@/lib/html'
import { cn } from '@/lib/utils'
import { getTenderQuery } from '@/services/tenders/queries'
import type { ApiResponse, TenderResponse } from '@/types/types'

export type TenderDetailProps = {
  tenderId: number
  locale: string
  onBack: () => void
  onEdit?: () => void
}

function DetailHeader({
  title,
  onBack,
  onEdit,
}: {
  title: string
  onBack: () => void
  onEdit?: () => void
}) {
  return (
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
        {title}
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
  )
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
  const v = toRenderableHtml(html).trim()
  if (!v) return '<p>—</p>'
  return v
}

export default function TenderDetail({
  tenderId,
  locale,
  onBack,
  onEdit,
}: TenderDetailProps) {
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
        <DetailHeader title="Tender" onBack={onBack} onEdit={onEdit} />
        <div className="px-3 py-8 text-center text-sm text-[#6b6e71] sm:px-12 sm:py-10">
          Yüklənir…
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex w-full flex-col bg-white pb-12" data-name="tender-detail-error">
        <DetailHeader title="Tender" onBack={onBack} onEdit={onEdit} />
        <div className="flex flex-col items-center gap-4 px-3 py-8 text-center sm:px-12 sm:py-10">
          <p className="text-sm text-[#6b6e71]">Yükləmə alınmadı</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="cursor-pointer rounded-2xl bg-[#e6eff6] px-6 py-3 text-sm font-medium text-[#0f477d]"
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
        <DetailHeader title="Tender" onBack={onBack} onEdit={onEdit} />
        <div className="px-3 py-8 text-center text-sm text-[#6b6e71] sm:px-12 sm:py-10">
          Məlumat tapılmadı
        </div>
      </div>
    )
  }

  const category =
    tender.category?.name?.[locale] ?? tender.category?.name?.az ?? '—'

  return (
    <div className="flex w-full flex-col bg-white pb-12" data-name="tender-detail">
      <DetailHeader title={tender.title} onBack={onBack} onEdit={onEdit} />

      <div className="flex flex-col gap-4 px-3 pt-6 sm:gap-6 sm:px-12 sm:pt-8">
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
