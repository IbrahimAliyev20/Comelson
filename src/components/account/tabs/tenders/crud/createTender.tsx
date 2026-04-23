'use client'

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
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
import { useRef } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Controller, useForm } from 'react-hook-form'

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
import { cn } from '@/lib/utils'
import type {
  CompanyCategoryResponse,
  CompanyResponse,
  CountryResponse,
} from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import { useLocale } from 'next-intl'
import { toast } from 'sonner'

const inputClass =
  'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 text-sm text-[#1d212a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10'

const labelClass = 'pl-1 text-sm leading-6 text-[#1d212a]'

export type CreateTenderForm = {
  title: string
  categoryId: string
  countryId: string
  startAt: string
  endAt: string
  company: string
  about: string
  requiredDocuments: string
  fullName: string
  position: string
  email: string
  phone: string
  instagram: string
  facebook: string
  linkedin: string
  twitter: string
}

export type CreateTenderProps = {
  onBack?: () => void
  onCancel?: () => void
  onSubmit?: (data: CreateTenderForm) => void
}

const DEFAULT_FORM_VALUES: CreateTenderForm = {
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
  instagram: '',
  facebook: '',
  linkedin: '',
  twitter: '',
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className={labelClass}>{children}</span>
}

const selectTriggerClass =
  'h-12 w-full rounded-[8px] border-[#ebeff4] bg-[#f4fafd] px-4 text-sm leading-5 text-[#32393f] focus:border-[#d7e6ef] focus:bg-[#f4fafd] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0'

const selectItemCheckedClass =
  'data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]'

function phoneHasEnoughDigits(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10
}

function RequiredMark() {
  return (
    <span className="text-[#ff3b30]" aria-hidden>
      *
    </span>
  )
}

function DateInput({
  value,
  onChange,
  placeholder,
  name,
  ariaRequired,
}: {
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  placeholder: string
  name: string
  ariaRequired?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative w-full">
      {!value ? (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#889097] sm:hidden">
          {placeholder}
        </span>
      ) : null}
      <input
        ref={inputRef}
        name={name}
        type="datetime-local"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-required={ariaRequired}
        className={cn(
          inputClass,
          'pr-3 text-[#32393f] [color-scheme:light] sm:min-w-0'
        )}
      />
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
      className="cursor-pointer rounded-md p-1.5 text-[#1d212a] transition-colors hover:bg-[#eaf1fa]"
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
  required = false,
}: {
  label: string
  value: string
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
  placeholder: string
  required?: boolean
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className={cn(labelClass, 'text-[#32393f]')}>
        {label}
        {required ? (
          <>
            {' '}
            <RequiredMark />
          </>
        ) : null}
      </span>
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
            className="cursor-pointer rounded-md px-1.5 py-1 text-sm font-medium text-[#1d212a] transition-colors hover:bg-[#eaf1fa]"
          >
            x2
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-md px-1.5 py-1 text-sm font-medium text-[#1d212a] transition-colors hover:bg-[#eaf1fa]"
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
          aria-required={required}
          className="min-h-[120px] w-full resize-y border-0 bg-transparent px-4 py-4 text-sm leading-5 text-[#1d212a] outline-none placeholder:text-[#889097]"
        />
      </div>
    </div>
  )
}

export default function CreateTender({
  onBack,
  onCancel,
  onSubmit,
}: CreateTenderProps) {
  const locale = useLocale()
  const { data: categories = [] } = useQuery(getCompanyCategoriesQuery(locale))
  const { data: countries = [] } = useQuery(getCountriesQuery(locale))
  const { data: companiesResponse } = useQuery(
    getCompaniesQuery({ locale, per_page: 100 })
  )
  const companies = (companiesResponse?.data ?? []) as CompanyResponse[]
  const { register, control, handleSubmit } = useForm<CreateTenderForm>({
    defaultValues: DEFAULT_FORM_VALUES,
  })

  const handleCancel = () => {
    onCancel?.()
    onBack?.()
  }

  const submit = (data: CreateTenderForm) => {
    if (!data.title.trim()) return void toast.error('Tender başlığını daxil edin')
    if (!data.categoryId) return void toast.error('Kateqoriya seçin')
    if (!data.startAt.trim()) {
      return void toast.error('Başlama tarixini və saatı seçin')
    }
    if (!data.endAt.trim()) {
      return void toast.error('Bitmə tarixini və saatı seçin')
    }
    if (!data.countryId) return void toast.error('Ölkə seçin')
    if (!data.company) return void toast.error('Şirkət seçin')
    if (!data.about.trim()) {
      return void toast.error('Tender haqqında məlumat daxil edin')
    }
    if (!data.requiredDocuments.trim()) {
      return void toast.error('Tələb olunan sənədlər barədə məlumat daxil edin')
    }
    if (!data.fullName.trim()) {
      return void toast.error('Ad və soyadı daxil edin')
    }
    if (!data.position.trim()) {
      return void toast.error('Vəzifəni daxil edin')
    }
    if (!data.email.trim()) {
      return void toast.error('Email ünvanını daxil edin')
    }
    if (!phoneHasEnoughDigits(data.phone)) {
      return void toast.error('Telefon nömrəsini daxil edin')
    }

    onSubmit?.(data)
  }

  return (
    <div className="flex w-full flex-col bg-white pb-12" data-name="create-tender">
      <div className="flex shrink-0 items-center gap-3 border-b border-[#eaf1fa] px-8 py-6">
        <button
          type="button"
          onClick={onBack}
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#1d212a] transition-colors hover:bg-[#f4fafd]"
          aria-label="Geri"
        >
          <ChevronLeft className="size-6" aria-hidden />
        </button>
        <h2 className="text-2xl font-medium leading-8 text-[#1d212a]">
          Tender əlavə et
        </h2>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-12 px-6 pt-8 sm:px-12"
      >
        <section className="flex flex-col gap-9">
          <h3 className="text-2xl font-semibold leading-8 text-[#14171a]">
            Tender məlumatları
          </h3>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-12">
            <label className="flex flex-col gap-2">
              <FieldLabel>
                Tender başlığı <RequiredMark />
              </FieldLabel>
              <input
                type="text"
                placeholder="Tender başlığını daxil edin"
                {...register('title')}
                aria-required="true"
                className={inputClass}
              />
            </label>

            <div className="flex flex-col gap-2">
              <FieldLabel>
                Kateqoriya <RequiredMark />
              </FieldLabel>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Kateqoriyanı seçin" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl  border-[#ebeff4] bg-white">
                      {(categories as CompanyCategoryResponse[]).map((c) => (
                        <SelectItem
                          key={c.id}
                          value={String(c.id)}
                          className={selectItemCheckedClass}
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>
                Başlama tarixi və saatı <RequiredMark />
              </FieldLabel>
              <Controller
                name="startAt"
                control={control}
                render={({ field }) => (
                  <DateInput
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="YYYY-MM-DD --:--"
                    ariaRequired
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>
                Bitmə tarixi və saatı <RequiredMark />
              </FieldLabel>
              <Controller
                name="endAt"
                control={control}
                render={({ field }) => (
                  <DateInput
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="YYYY-MM-DD --:--"
                    ariaRequired
                  />
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>
              Ölkə <RequiredMark />
            </FieldLabel>
            <Controller
              name="countryId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Ölkə seçin" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#ebeff4] bg-white">
                    {(countries as CountryResponse[]).map((c) => (
                      <SelectItem
                        key={c.id}
                        value={String(c.id)}
                        className={selectItemCheckedClass}
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>
              Şirkət <RequiredMark />
            </FieldLabel>
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Şirkəti seçin" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[#ebeff4] bg-white">
                    {companies.map((c) => (
                      <SelectItem
                        key={c.id}
                        value={String(c.id)}
                        className={selectItemCheckedClass}
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Controller
            name="about"
            control={control}
            render={({ field }) => (
              <EditorField
                label="Tender haqqında"
                value={field.value}
                onChange={field.onChange}
                placeholder="Tender haqqında məlumat daxil edin"
                required
              />
            )}
          />

          <Controller
            name="requiredDocuments"
            control={control}
            render={({ field }) => (
              <EditorField
                label="Tələb olunan sənədlər"
                value={field.value}
                onChange={field.onChange}
                placeholder="Tələb olunan sənədlər barədə məlumatları daxil edin"
                required
              />
            )}
          />
        </section>

        <section className="flex flex-col gap-9">
          <h3 className="text-2xl font-semibold leading-8 text-[#14171a]">
            Əlaqə məlumatları
          </h3>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-12">
            <label className="flex flex-col gap-2">
              <FieldLabel>
                Ad, soyad <RequiredMark />
              </FieldLabel>
              <input
                type="text"
                placeholder="Ad və soyadınızı daxil edin"
                {...register('fullName')}
                aria-required="true"
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>
                Vəzifə <RequiredMark />
              </FieldLabel>
              <input
                type="text"
                placeholder="Vəzifənizi daxil edin"
                {...register('position')}
                aria-required="true"
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>
                Email <RequiredMark />
              </FieldLabel>
              <input
                type="email"
                placeholder="Email adresinizi daxil edin"
                {...register('email')}
                aria-required="true"
                className={inputClass}
              />
            </label>

            <div className="flex flex-col gap-2">
              <FieldLabel>
                Telefon nömrəsi <RequiredMark />
              </FieldLabel>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <>
                    <input type="hidden" name={field.name} value={field.value} />
                    <PhoneInput
                      country="az"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      placeholder="Nömrənizi daxil edin"
                      inputProps={{
                        required: false,
                        'aria-required': true,
                      }}
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
                placeholder="https://instagram.com/nümunə"
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>Facebook</FieldLabel>
              <input
                type="url"
                {...register('facebook')}
                placeholder="https://facebook.com/nümunə"
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>LinkedIn</FieldLabel>
              <input
                type="url"
                {...register('linkedin')}
                placeholder="https://linkedin.com/nümunə"
                className={inputClass}
              />
            </label>

            <label className="flex flex-col gap-2">
              <FieldLabel>X/Twitter</FieldLabel>
              <input
                type="url"
                {...register('twitter')}
                placeholder="https://x.com/nümunə"
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
            className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-2xl bg-[#e6eff6] px-6 text-base font-medium leading-6 text-[#0f477d] transition-colors hover:bg-[#d7e6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d]"
          >
            Ləğv et
          </button>
          <button
            type="submit"
            className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-2xl bg-[#0f477d] px-6 text-base font-medium leading-6 text-white transition-colors hover:bg-[#0c3a66] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Tender sorğusunu əlavə et
          </button>
        </div>
      </form>
    </div>
  )
}
