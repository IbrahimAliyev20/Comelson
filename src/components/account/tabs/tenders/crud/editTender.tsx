'use client'

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Code,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Table2,
  Underline,
} from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import { getCompanyCategoriesQuery } from '@/services/company-categories/queries'
import { getCompaniesQuery } from '@/services/companies/queries'
import { getCountriesQuery } from '@/services/members/queries'
import { getTenderQuery } from '@/services/tenders/queries'
import { cn } from '@/lib/utils'
import type {
  ApiResponse,
  CompanyCategoryResponse,
  CompanyResponse,
  CountryResponse,
  TenderResponse,
} from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import { useLocale } from 'next-intl'

import type { CreateTenderForm } from './createTender'

const inputClass =
  'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 text-sm text-[#1d212a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10'

const labelClass = 'pl-1 text-sm leading-6 text-[#1d212a]'

const DEFAULT_FORM: CreateTenderForm = {
  title: '',
  categoryId: '',
  countryId: '',
  startAt: '',
  endAt: '',
  company: '',
  about: '',
  requiredDocuments: '',
  fullName: '',
  position: '',
  email: '',
  phone: '',
  instagram: 'https://instagram.com/example',
  facebook: 'https://facebook.com/example',
  linkedin: 'https://linkedin.com/example',
  twitter: 'https://x.com/example',
}

function mergeForm(partial?: Partial<CreateTenderForm>): CreateTenderForm {
  return { ...DEFAULT_FORM, ...partial }
}

export type EditTenderProps = {
  tenderId: number
  initialValues?: Partial<CreateTenderForm>
  onBack?: () => void
  onCancel?: () => void
  onSubmit?: (data: CreateTenderForm) => void
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className={labelClass}>{children}</span>
}

const selectTriggerClass =
  'h-12 w-full rounded-[8px] border-[#ebeff4] bg-[#f4fafd] px-4 text-sm leading-5 text-[#32393f] focus:border-[#d7e6ef] focus:bg-[#f4fafd] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0'

function NativeSelect({
  className,
  children,
  ...rest
}: React.ComponentProps<'select'>) {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          selectTriggerClass,
          'cursor-pointer appearance-none pr-10',
          className
        )}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#1d212a]"
        aria-hidden
      />
    </div>
  )
}

function DateInput({
  value,
  onChange,
  placeholder,
  name,
}: {
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  placeholder: string
  name: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const openPicker = () => {
    const el = inputRef.current
    if (!el) return
    if (typeof el.showPicker === 'function') {
      try {
        el.showPicker()
      } catch {
        el.focus()
      }
    } else {
      el.focus()
    }
  }

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        name={name}
        type="datetime-local"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          inputClass,
          'pr-11 text-[#32393f] [color-scheme:light] sm:min-w-0'
        )}
      />
      <button
        type="button"
        onClick={openPicker}
        className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-[#1d212a] transition-colors hover:bg-[#eaf1fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d]/40"
        aria-label="Tarix və saat seçin"
      >
        <CalendarDays className="size-4" aria-hidden />
      </button>
    </div>
  )
}

function ToolbarIconButton({
  label,
  icon: Icon,
}: {
  label: string
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
}) {
  return (
    <button
      type="button"
      title={label}
      className="rounded-md p-1.5 text-[#1d212a] transition-colors hover:bg-[#eaf1fa]"
    >
      <Icon className="size-5" aria-hidden />
    </button>
  )
}

function EditorField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
  placeholder: string
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className={cn(labelClass, 'text-[#32393f]')}>{label}</span>
      <div className="overflow-hidden rounded-xl border border-[#b5b8bb] bg-[#f4fafd]">
        <div
          className="flex flex-wrap items-center gap-2 border-b border-[#b5b8bb] px-4 py-3 sm:gap-3"
          role="toolbar"
          aria-label={`${label} formatı`}
        >
          <ToolbarIconButton label="Qalın" icon={Bold} />
          <ToolbarIconButton label="Altıxətli" icon={Underline} />
          <ToolbarIconButton label="Maili" icon={Italic} />
          <ToolbarIconButton label="Keçid" icon={Link2} />
          <ToolbarIconButton label="Kod" icon={Code} />
          <ToolbarIconButton label="Sitat" icon={Quote} />
          <span className="size-6 shrink-0 rounded-full bg-[#1d212a]" aria-hidden />
          <div className="mx-1 hidden h-6 w-px bg-[#aeaeb2]/40 sm:block" />
          <ToolbarIconButton label="Sola" icon={AlignLeft} />
          <ToolbarIconButton label="Mərkəz" icon={AlignCenter} />
          <ToolbarIconButton label="Sağa" icon={AlignRight} />
          <div className="mx-1 hidden h-6 w-px bg-[#aeaeb2]/40 sm:block" />
          <ToolbarIconButton label="Siyahı" icon={List} />
          <ToolbarIconButton label="Nömrəli siyahı" icon={ListOrdered} />
          <div className="mx-1 hidden h-6 w-px bg-[#aeaeb2]/40 sm:block" />
          <button
            type="button"
            className="rounded-md px-1.5 py-1 text-sm font-medium text-[#1d212a] transition-colors hover:bg-[#eaf1fa]"
          >
            x2
          </button>
          <button
            type="button"
            className="rounded-md px-1.5 py-1 text-sm font-medium text-[#1d212a] transition-colors hover:bg-[#eaf1fa]"
          >
            x2
          </button>
          <div className="mx-1 hidden h-6 w-px bg-[#aeaeb2]/40 sm:block" />
          <ToolbarIconButton label="Şəkil" icon={ImageIcon} />
          <ToolbarIconButton label="Cədvəl" icon={Table2} />
        </div>
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          className="min-h-[120px] w-full resize-y border-0 bg-transparent px-4 py-4 text-sm leading-5 text-[#1d212a] outline-none placeholder:text-[#889097]"
        />
      </div>
    </div>
  )
}

type TenderDetailLike = TenderResponse & {
  category_id?: number | string | null
  country_id?: number | string | null
  company_id?: number | string | null
  category?: {
    id?: number | string | null
    name?: Record<string, string> | string | null
  } | null
  company?: { id?: number | string | null; name?: string | null } | null
  country?: {
    id?: number | string | null
    name?: Record<string, string> | string | null
  } | null
}

function getEntityId(
  ...values: Array<number | string | null | undefined>
): string {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      return String(value)
    }

    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed) return trimmed
    }
  }

  return ''
}

function apiDateTimeToInputValue(api: string): string {
  const v = api.trim()
  if (!v) return ''
  const m = v.match(/^(\d{4}-\d{2}-\d{2})[\sT](\d{2}:\d{2})/)
  if (m) return `${m[1]}T${m[2]}`
  return v.replace(' ', 'T').slice(0, 16)
}

function getLocalizedName(
  value: Record<string, string> | string | null | undefined,
  locale: string,
  fallback: string
): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    return value[locale] ?? value.az ?? Object.values(value)[0] ?? fallback
  }
  return fallback
}

function tenderToInitialValues(t: TenderDetailLike): Partial<CreateTenderForm> {
  return {
    title: t.title ?? '',
    categoryId: getEntityId(t.category?.id, t.category_id),
    countryId: getEntityId(t.country?.id, t.country_id),
    startAt: apiDateTimeToInputValue(t.start_date ?? ''),
    endAt: apiDateTimeToInputValue(t.end_date ?? ''),
    company: getEntityId(t.company?.id, t.company_id),
    about: t.description ?? '',
    requiredDocuments: t.required_documents ?? '',
    fullName: t.contact_name ?? '',
    position: t.contact_position ?? '',
    email: t.contact_email ?? '',
    phone: (t.contact_phone ?? '').replace(/\D/g, ''),
    instagram: t.contact_instagram ?? '',
    facebook: t.contact_facebook ?? '',
    linkedin: t.contact_linkedin ?? '',
    twitter: t.contact_twitter ?? '',
  }
}

export default function EditTender({
  tenderId,
  initialValues,
  onBack,
  onCancel,
  onSubmit,
}: EditTenderProps) {
  const locale = useLocale()
  const { data: categories = [] } = useQuery(getCompanyCategoriesQuery(locale))
  const { data: countries = [] } = useQuery(getCountriesQuery(locale))
  const { data: companiesResponse } = useQuery(
    getCompaniesQuery({ locale, per_page: 100 })
  )
  const companies = (companiesResponse?.data ?? []) as CompanyResponse[]

  const {
    data: tenderDetailResponse,
    isLoading: isLoadingTender,
    isError: isTenderError,
    refetch: refetchTender,
  } = useQuery({
    ...getTenderQuery({ locale, id: tenderId }),
    enabled: Number.isFinite(tenderId) && tenderId > 0,
  })

  const tenderDetail = (() => {
    const res = tenderDetailResponse as ApiResponse<TenderResponse> | undefined
    if (!res?.status) return null
    return res.data as TenderDetailLike
  })()

  const [form, setForm] = useState<CreateTenderForm>(() =>
    mergeForm(initialValues)
  )

  useEffect(() => {
    if (tenderDetail) {
      setForm(mergeForm(tenderToInitialValues(tenderDetail)))
      return
    }
    setForm(mergeForm(initialValues))
  }, [initialValues, tenderDetail])

  const handleChange =
    (field: keyof CreateTenderForm) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleCancel = () => {
    onCancel?.()
    onBack?.()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(form)
  }

  if (isLoadingTender) {
    return (
      <div className="flex w-full flex-col bg-white pb-12" data-name="edit-tender-loading">
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
            Tenderi redaktə et
          </h2>
        </div>
        <div className="px-6 py-10 text-center text-sm text-[#6b6e71] sm:px-12">
          Yüklənir…
        </div>
      </div>
    )
  }

  if (isTenderError) {
    return (
      <div className="flex w-full flex-col bg-white pb-12" data-name="edit-tender-error">
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
            Tenderi redaktə et
          </h2>
        </div>
        <div className="flex flex-col items-center gap-4 px-6 py-10 text-center sm:px-12">
          <p className="text-sm text-[#6b6e71]">Tender məlumatı yüklənmədi</p>
          <button
            type="button"
            onClick={() => void refetchTender()}
            className="rounded-2xl bg-[#e6eff6] px-6 py-3 text-sm font-medium text-[#0f477d]"
          >
            Yenidən cəhd et
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col bg-white pb-12" data-name="edit-tender">
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
          Tenderi redaktə et
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-12 px-6 pt-8 sm:px-12"
      >
        <section className="flex flex-col gap-9">
          <h3 className="text-2xl font-semibold leading-8 text-[#14171a]">
            Tender məlumatları
          </h3>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-12">
            <label className="flex flex-col gap-2">
              <FieldLabel>Tender başlığı</FieldLabel>
              <input
                name="title"
                type="text"
                placeholder="Tender başlığı daxil edin"
                value={form.title}
                onChange={handleChange('title')}
                className={inputClass}
              />
            </label>

            <div className="flex flex-col gap-2">
              <FieldLabel>Kateqoriya</FieldLabel>
              <NativeSelect
                name="categoryId"
                value={form.categoryId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, categoryId: e.target.value }))
                }
              >
                <option value="" disabled>
                  Kateqoriyanı seçin
                </option>
                  {form.categoryId &&
                  !(categories as CompanyCategoryResponse[]).some(
                    (c) => String(c.id) === form.categoryId
                  ) ? (
                    <option value={form.categoryId}>
                      {getLocalizedName(
                        tenderDetail?.category?.name,
                        locale,
                        `#${form.categoryId}`
                      )}
                    </option>
                  ) : null}
                  {(categories as CompanyCategoryResponse[]).map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
              </NativeSelect>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>Başlama tarixi və saatı</FieldLabel>
              <DateInput
                name="startAt"
                value={form.startAt}
                onChange={handleChange('startAt')}
                placeholder="YYYY-MM-DD --:--"
              />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>Bitmə tarixi və saatı</FieldLabel>
              <DateInput
                name="endAt"
                value={form.endAt}
                onChange={handleChange('endAt')}
                placeholder="YYYY-MM-DD --:--"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>Ölkə</FieldLabel>
            <NativeSelect
              name="countryId"
              value={form.countryId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, countryId: e.target.value }))
              }
            >
              <option value="" disabled>
                Ölkə seçin
              </option>
                {form.countryId &&
                !(countries as CountryResponse[]).some(
                  (c) => String(c.id) === form.countryId
                ) ? (
                  <option value={form.countryId}>
                    {getLocalizedName(
                      tenderDetail?.country?.name,
                      locale,
                      `#${form.countryId}`
                    )}
                  </option>
                ) : null}
                {(countries as CountryResponse[]).map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
            </NativeSelect>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>Şirkət</FieldLabel>
            <NativeSelect
              name="company"
              value={form.company}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, company: e.target.value }))
              }
            >
              <option value="" disabled>
                Şirkəti seçin
              </option>
                {form.company &&
                !companies.some((c) => String(c.id) === form.company) ? (
                  <option value={form.company}>
                    {tenderDetail?.company?.name ?? `#${form.company}`}
                  </option>
                ) : null}
                {companies.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
            </NativeSelect>
          </div>

          <EditorField
            label="Tender haqqında"
            value={form.about}
            onChange={handleChange('about')}
            placeholder="Tender haqqında məlumat daxil edin"
          />

          <EditorField
            label="Tələb olunan sənədlər"
            value={form.requiredDocuments}
            onChange={handleChange('requiredDocuments')}
            placeholder="Tələb olunan sənədlər barədə məlumatları daxil edin"
          />
        </section>

        <section className="flex flex-col gap-9">
          <h3 className="text-2xl font-semibold leading-8 text-[#14171a]">
            Əlaqə məlumatları
          </h3>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-12">
            <label className="flex flex-col gap-2">
              <FieldLabel>Ad,soyad</FieldLabel>
              <input
                name="fullName"
                type="text"
                placeholder="Ad və soyadınızı daxil edin"
                value={form.fullName}
                onChange={handleChange('fullName')}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>Vəzifə</FieldLabel>
              <input
                name="position"
                type="text"
                placeholder="Vəzifənizi daxil edin"
                value={form.position}
                onChange={handleChange('position')}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>Email</FieldLabel>
              <input
                name="email"
                type="email"
                placeholder="Email adresinizi daxil edin"
                value={form.email}
                onChange={handleChange('email')}
                className={inputClass}
              />
            </label>

            <div className="flex flex-col gap-2">
              <FieldLabel>Telefon nömrəsi</FieldLabel>
              <input type="hidden" name="phone" value={form.phone} />
              <PhoneInput
                country="az"
                value={form.phone}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, phone: value }))
                }
                placeholder="Nömrənizi daxil edin"
                inputStyle={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '12px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  paddingLeft: '48px',
                }}
                buttonStyle={{
                  border: '1px solid #d1d5db',
                  borderRadius: '12px 0 0 12px',
                  backgroundColor: 'transparent',
                }}
                containerStyle={{ width: '100%' }}
              />
            </div>

            <label className="flex flex-col gap-2">
              <FieldLabel>Instagram</FieldLabel>
              <input
                name="instagram"
                type="url"
                value={form.instagram}
                onChange={handleChange('instagram')}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>Facebook</FieldLabel>
              <input
                name="facebook"
                type="url"
                value={form.facebook}
                onChange={handleChange('facebook')}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>LinkedIn</FieldLabel>
              <input
                name="linkedin"
                type="url"
                value={form.linkedin}
                onChange={handleChange('linkedin')}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>X/Twitter</FieldLabel>
              <input
                name="twitter"
                type="url"
                value={form.twitter}
                onChange={handleChange('twitter')}
                className={inputClass}
              />
            </label>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0f477d] text-white"
              aria-hidden
            >
              i
            </div>
            <p className="text-base leading-6 text-[#32393f]">
              Tender sorğunuz paylaşılmazdan əvvəl administrator tərəfindən
              yoxlanılacaq və təsdiqləndikdən sonra platformada yayımlanacaq.
            </p>
          </div>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#e6eff6] px-6 text-base font-medium leading-6 text-[#0f477d] transition-colors hover:bg-[#d7e6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d]"
          >
            Ləğv et
          </button>
          <button
            type="submit"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#0f477d] px-6 text-base font-medium leading-6 text-white transition-colors hover:bg-[#0c3a66] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Dəyişiklikləri yadda saxla
          </button>
        </div>
      </form>
    </div>
  )
}
