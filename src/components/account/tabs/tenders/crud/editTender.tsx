'use client'

import { CalendarDays, ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Controller, useForm } from 'react-hook-form'

import Editor from '@/components/Editor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

function setDateTimeField(
  data: CreateTenderForm,
  key: 'startAt' | 'endAt',
  nextValue: string
): CreateTenderForm {
  return { ...data, [key]: nextValue }
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
  'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 text-sm text-[#1d212a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10'

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
        className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-[#1d212a] transition-colors hover:bg-[#eaf1fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d]/40"
        aria-label="Tarix və saat seçin"
      >
        <CalendarDays className="size-4" aria-hidden />
      </button>
    </div>
  )
}

function EditorField({
  label,
  value,
  onChange,
}: {
  label: string
  placeholder?: string
  value: string
  onChange: (nextValue: string) => void
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className={cn(labelClass, 'text-[#32393f]')}>{label}</span>
      <div className="overflow-hidden rounded-xl border border-[#b5b8bb] bg-white">
        <Editor value={value ?? ''} onChange={onChange} />
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

  const { register, handleSubmit, control, reset, watch } =
    useForm<CreateTenderForm>({
      defaultValues: mergeForm(initialValues),
    })

  const categoryId = watch('categoryId')
  const countryId = watch('countryId')
  const companyId = watch('company')

  useEffect(() => {
    if (tenderDetail) {
      reset(mergeForm(tenderToInitialValues(tenderDetail)))
      return
    }
    reset(mergeForm(initialValues))
  }, [initialValues, reset, tenderDetail])

  const handleCancel = () => {
    onCancel?.()
    onBack?.()
  }

  const submit = (data: CreateTenderForm) => {
    onSubmit?.(data)
  }

  if (isLoadingTender) {
    return (
      <div className="flex w-full flex-col bg-white pb-12" data-name="edit-tender-loading">
        <div className="flex shrink-0 items-center gap-3 border-b border-[#eaf1fa] px-3 py-4 sm:px-8 sm:py-6">
          <button
            type="button"
            onClick={onBack}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#1d212a] transition-colors hover:bg-[#f4fafd]"
            aria-label="Geri"
          >
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <h2 className="text-lg font-medium leading-7 text-[#1d212a] sm:text-2xl sm:leading-8">
            Tenderi redaktə et
          </h2>
        </div>
        <div className="px-3 py-8 text-center text-sm text-[#6b6e71] sm:px-12 sm:py-10">
          Yüklənir…
        </div>
      </div>
    )
  }

  if (isTenderError) {
    return (
      <div className="flex w-full flex-col bg-white pb-12" data-name="edit-tender-error">
        <div className="flex shrink-0 items-center gap-3 border-b border-[#eaf1fa] px-3 py-4 sm:px-8 sm:py-6">
          <button
            type="button"
            onClick={onBack}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#1d212a] transition-colors hover:bg-[#f4fafd]"
            aria-label="Geri"
          >
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <h2 className="text-lg font-medium leading-7 text-[#1d212a] sm:text-2xl sm:leading-8">
            Tenderi redaktə et
          </h2>
        </div>
        <div className="flex flex-col items-center gap-4 px-3 py-8 text-center sm:px-12 sm:py-10">
          <p className="text-sm text-[#6b6e71]">Tender məlumatı yüklənmədi</p>
          <button
            type="button"
            onClick={() => void refetchTender()}
            className="cursor-pointer rounded-2xl bg-[#e6eff6] px-6 py-3 text-sm font-medium text-[#0f477d]"
          >
            Yenidən cəhd et
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col bg-white pb-12" data-name="edit-tender">
      <div className="flex shrink-0 items-center gap-3 border-b border-[#eaf1fa] px-3 py-4 sm:px-8 sm:py-6">
        <button
          type="button"
          onClick={onBack}
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#1d212a] transition-colors hover:bg-[#f4fafd]"
          aria-label="Geri"
        >
          <ChevronLeft className="size-6" aria-hidden />
        </button>
        <h2 className="text-lg font-medium leading-7 text-[#1d212a] sm:text-2xl sm:leading-8">
          Tenderi redaktə et
        </h2>
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-8 px-3 pt-6 sm:gap-12 sm:px-12 sm:pt-8"
      >
        <section className="flex flex-col gap-9">
          <h3 className="text-lg font-semibold leading-7 text-[#14171a] sm:text-2xl sm:leading-8">
            Tender məlumatları
          </h3>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-x-12">
            <label className="flex flex-col gap-2">
              <FieldLabel>Tender başlığı</FieldLabel>
              <input
                type="text"
                placeholder="Tender başlığı daxil edin"
                {...register('title')}
                className={inputClass}
              />
            </label>

            <div className="flex flex-col gap-2">
              <FieldLabel>Kateqoriya</FieldLabel>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    key={categoryId}
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Kateqoriyanı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.value &&
                      !(categories as CompanyCategoryResponse[]).some(
                        (c) => String(c.id) === field.value
                      ) ? (
                        <SelectItem value={field.value}>
                          {getLocalizedName(
                            tenderDetail?.category?.name,
                            locale,
                            `#${field.value}`
                          )}
                        </SelectItem>
                      ) : null}
                      {(categories as CompanyCategoryResponse[]).map((c) => (
                        <SelectItem key={String(c.id)} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>Başlama tarixi və saatı</FieldLabel>
              <DateInput
                name="startAt"
                value={watch('startAt')}
                onChange={(e) => {
                  const v = e.target.value
                  const current = watch()
                  reset(setDateTimeField(current, 'startAt', v))
                }}
                placeholder="YYYY-MM-DD --:--"
              />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>Bitmə tarixi və saatı</FieldLabel>
              <DateInput
                name="endAt"
                value={watch('endAt')}
                onChange={(e) => {
                  const v = e.target.value
                  const current = watch()
                  reset(setDateTimeField(current, 'endAt', v))
                }}
                placeholder="YYYY-MM-DD --:--"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>Ölkə</FieldLabel>
            <Controller
              name="countryId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  key={countryId}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Ölkə seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.value &&
                    !(countries as CountryResponse[]).some(
                      (c) => String(c.id) === field.value
                    ) ? (
                      <SelectItem value={field.value}>
                        {getLocalizedName(
                          tenderDetail?.country?.name,
                          locale,
                          `#${field.value}`
                        )}
                      </SelectItem>
                    ) : null}
                    {(countries as CountryResponse[]).map((c) => (
                      <SelectItem key={String(c.id)} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>Şirkət</FieldLabel>
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  key={companyId}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Şirkəti seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.value &&
                    !companies.some((c) => String(c.id) === field.value) ? (
                      <SelectItem value={field.value}>
                        {tenderDetail?.company?.name ?? `#${field.value}`}
                      </SelectItem>
                    ) : null}
                    {companies.map((c) => (
                      <SelectItem key={String(c.id)} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <EditorField
            label="Tender haqqında"
            value={watch('about')}
            onChange={(nextValue) => reset({ ...watch(), about: nextValue })}
            placeholder="Tender haqqında məlumat daxil edin"
          />

          <EditorField
            label="Tələb olunan sənədlər"
            value={watch('requiredDocuments')}
            onChange={(nextValue) =>
              reset({ ...watch(), requiredDocuments: nextValue })
            }
            placeholder="Tələb olunan sənədlər barədə məlumatları daxil edin"
          />
        </section>

        <section className="flex flex-col gap-9">
          <h3 className="text-lg font-semibold leading-7 text-[#14171a] sm:text-2xl sm:leading-8">
            Əlaqə məlumatları
          </h3>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-x-12">
            <label className="flex flex-col gap-2">
              <FieldLabel>Ad,soyad</FieldLabel>
              <input
                type="text"
                placeholder="Ad və soyadınızı daxil edin"
                {...register('fullName')}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>Vəzifə</FieldLabel>
              <input
                type="text"
                placeholder="Vəzifənizi daxil edin"
                {...register('position')}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>Email</FieldLabel>
              <input
                type="email"
                placeholder="Email adresinizi daxil edin"
                {...register('email')}
                className={inputClass}
              />
            </label>

            <div className="flex flex-col gap-2">
              <FieldLabel>Telefon nömrəsi</FieldLabel>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <>
                    <input type="hidden" name={field.name} value={field.value} />
                    <PhoneInput
                      country="az"
                      value={field.value}
                      onChange={(value) => field.onChange(String(value))}
                      placeholder="Nömrənizi daxil edin"
                      inputStyle={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '0 12px 12px 0',
                        border: '1px solid #ebeff4',
                        borderLeft: 'none',
                        backgroundColor: '#f4fafd',
                        fontSize: '16px',
                        paddingLeft: '48px',
                      }}
                      buttonStyle={{
                        border: '1px solid #ebeff4',
                        borderRadius: '12px 0 0 12px',
                        backgroundColor: '#f4fafd',
                      }}
                      containerStyle={{ width: '100%' }}
                    />
                  </>
                )}
              />
            </div>

            <label className="flex flex-col gap-2">
              <FieldLabel>Instagram</FieldLabel>
              <input
                type="url"
                {...register('instagram')}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>Facebook</FieldLabel>
              <input
                type="url"
                {...register('facebook')}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>LinkedIn</FieldLabel>
              <input
                type="url"
                {...register('linkedin')}
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>X/Twitter</FieldLabel>
              <input
                type="url"
                {...register('twitter')}
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
            className="inline-flex py-2 h-12 flex-1 cursor-pointer items-center justify-center rounded-lg md:rounded-2xl bg-[#e6eff6] px-6 text-base font-medium leading-6 text-[#0f477d] transition-colors hover:bg-[#d7e6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d]"
          >
            Ləğv et
          </button>
          <button
            type="submit"
            className="inline-flex py-2 h-12 flex-1 cursor-pointer items-center justify-center rounded-lg md:rounded-2xl bg-[#0f477d] px-6 text-base font-medium leading-6 text-white transition-colors hover:bg-[#0c3a66] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Dəyişiklikləri yadda saxla
          </button>
        </div>
      </form>
    </div>
  )
}
