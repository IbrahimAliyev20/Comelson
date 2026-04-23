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
  ImagePlus,
  Link2,
  List,
  ListOrdered,
  Quote,
  Table2,
  Underline,
} from 'lucide-react'
import { useLocale } from 'next-intl'
import type { ComponentType, ReactNode } from 'react'
import { useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { getCompanyCategoriesQuery } from '@/services/company-categories/queries'
import { updateCompanyMutation } from '@/services/companies/mutations'
import { getCompanyQuery } from '@/services/companies/queries'
import { getCountriesQuery } from '@/services/members/queries'

const inputClass =
  'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 text-sm font-medium text-[#1d212a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10'

const labelClass = 'pl-1 text-sm leading-6 text-[#1d212a]'

export type EditableCompany = {
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

type EditCampainFormValues = {
  name: string
  voen: string
  categoryId: string
  countryId: string
  description: string
  phone: string
  email: string
  address: string
  website: string
  instagram: string
  facebook: string
  linkedin: string
  logo: File | null
}

function escapeHtmlPlain(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function normalizePhone(raw: string): string {
  const t = raw.trim()
  if (!t) return ''
  return t.startsWith('+') ? t : `+${t}`
}

export type EditCampainProps = {
  company: EditableCompany
  onCancel: () => void
  onSuccess?: () => void
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className={labelClass}>{children}</span>
}

export default function EditCampain({
  company,
  onCancel,
  onSuccess,
}: EditCampainProps) {
  const locale = useLocale()
  const companyId = Number(company.id)

  const { data: countries = [], isLoading: countriesLoading } = useQuery(
    getCountriesQuery(locale)
  )
  const { data: categories = [], isLoading: categoriesLoading } = useQuery(
    getCompanyCategoriesQuery(locale)
  )
  const { register, control, setValue, watch, reset, handleSubmit } =
    useForm<EditCampainFormValues>({
      defaultValues: {
        name: company.name,
        voen: company.voen ?? '12345678',
        categoryId: '',
        countryId: '',
        description: company.description,
        phone: company.phone ?? '',
        email: company.email ?? 'info@comelson.az',
        address: company.address ?? 'Bakı, Azərbaycan, Əhmədli',
        website: company.website ?? 'https://comelson.az',
        instagram: company.instagram ?? 'https://instagram.com/comelson',
        facebook: company.facebook ?? 'https://facebook.com/comelson',
        linkedin: company.linkedin ?? 'https://linkedin.com/comelson',
        logo: null,
      },
    })
  const logoFile = watch('logo')
  const logoPreviewUrl = logoFile ? URL.createObjectURL(logoFile) : ''
  const logoSrc = logoPreviewUrl || company.logo

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl)
    }
  }, [logoPreviewUrl])

  const updateMutation = useMutation({
    ...updateCompanyMutation(),
    onSuccess: (res) => {
      if (!res?.status) {
        toast.error(res?.message || 'Yadda saxlanılmadı')
        return
      }
      toast.success('Yadda saxlanıldı')
      onSuccess?.()
    },
    onError: () => {
      toast.error('Yadda saxlanılmadı')
    },
  })

  const { data: companyDetailResponse } = useQuery({
    ...getCompanyQuery({ locale, id: companyId }),
    enabled: Number.isFinite(companyId) && companyId > 0,
  })

  useEffect(() => {
    const d = companyDetailResponse?.data
    if (!d) return

    reset({
      name: d.name ?? company.name,
      voen: d.voen ?? company.voen ?? '12345678',
      categoryId: String(d.category?.id ?? ''),
      countryId: String(d.country?.id ?? ''),
      description: d.description ?? company.description,
      phone: d.phone ?? company.phone ?? '',
      email: d.email ?? company.email ?? 'info@comelson.az',
      address: d.address ?? company.address ?? 'Bakı, Azərbaycan, Əhmədli',
      website: d.website ?? company.website ?? 'https://comelson.az',
      instagram:
        d.instagram ?? company.instagram ?? 'https://instagram.com/comelson',
      facebook:
        d.facebook ?? company.facebook ?? 'https://facebook.com/comelson',
      linkedin:
        d.linkedin ?? company.linkedin ?? 'https://linkedin.com/comelson',
      logo: null,
    })
  }, [company, companyDetailResponse, reset])

  const submit = (data: EditCampainFormValues) => {
    if (Number.isNaN(companyId)) {
      toast.error('Şirkət ID düzgün deyil')
      return
    }
    if (!data.categoryId) {
      toast.error('Kateqoriya seçin')
      return
    }
    if (!data.countryId) {
      toast.error('Ölkə seçin')
      return
    }

    const description = `<p>${escapeHtmlPlain(data.description)}</p>`
    updateMutation.mutate({
      locale,
      id: companyId,
      body: {
        name: data.name,
        voen: data.voen,
        category_id: Number(data.categoryId),
        country_id: Number(data.countryId),
        description,
        phone: normalizePhone(data.phone),
        email: data.email,
        address: data.address,
        website: data.website,
        instagram: data.instagram,
        facebook: data.facebook,
        linkedin: data.linkedin,
        logo: data.logo ?? undefined,
      },
    })
  }

  return (
    <div className="flex w-full flex-col bg-white pb-12" data-name="edit-company">
      <div className="flex shrink-0 items-center gap-3 border-b border-[#eaf1fa] px-8 py-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#1d212a] transition-colors hover:bg-[#f4fafd]"
          aria-label="Geri"
        >
          <ChevronLeft className="size-6" aria-hidden />
        </button>
        <h2 className="text-2xl font-medium leading-8 text-[#1d212a]">
          Şirkəti redaktə et
        </h2>
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-12 px-6 pt-8 sm:px-12"
      >
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-5">
            <label className="relative flex size-[120px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[#e6eff6] bg-white p-2.5">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="sr-only"
                onChange={(ev) => setValue('logo', ev.target.files?.[0] ?? null)}
              />
              <img
                src={logoSrc}
                alt={watch('name')}
                className="size-full rounded-full object-cover"
              />
              <span
                className="pointer-events-none absolute right-0 top-0 z-10 flex size-9 items-center justify-center rounded-full border-2 border-white bg-[#e6eff6] text-[#0f477d] shadow-[0_2px_8px_rgba(15,71,125,0.25)] ring-1 ring-[#0f477d]/15"
                aria-hidden
              >
                <ImagePlus className="size-5 shrink-0 stroke-[2.25]" />
              </span>
              <span className="sr-only">Logo yüklə</span>
            </label>

            <div className="flex min-w-0 flex-col gap-2.5">
              <p className="text-sm font-medium leading-5 text-[#14171a]">
                Şirkətinizin rəsmi logosunu əlavə edin
              </p>
              <p className="text-xs leading-4 text-[#6b6e71]">
                JPG, JPEG və ya PNG formatı • Maksimum 5 MB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-8">
            <label className="flex flex-col gap-2">
              <FieldLabel>Şirkətin adı</FieldLabel>
              <input
                {...register('name')}
                type="text"
                autoComplete="organization"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>Şirkətin VÖEN-i</FieldLabel>
              <input
                {...register('voen')}
                type="text"
                inputMode="numeric"
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
                    disabled={categoriesLoading}
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <SelectTrigger className={cn(inputClass, 'justify-between')}>
                      <SelectValue
                        placeholder={
                          categoriesLoading ? 'Yüklənir...' : 'Kateqoriyanı seçin'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[#ebeff4] bg-white">
                      {categories.map((c) => (
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
              <FieldLabel>Ölkə</FieldLabel>
              <Controller
                name="countryId"
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={countriesLoading}
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <SelectTrigger className={cn(inputClass, 'justify-between')}>
                      <SelectValue
                        placeholder={countriesLoading ? 'Yüklənir...' : 'Ölkəni seçin'}
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[#ebeff4] bg-white">
                      {countries.map((c) => (
                        <SelectItem key={String(c.id)} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className={cn(labelClass, 'text-[#32393f]')}>
              Şirkət haqqında
            </span>
            <div className="overflow-hidden rounded-xl border border-[#b5b8bb] bg-[#f4fafd]">
              <div
                className="flex flex-wrap items-center gap-2 border-b border-[#b5b8bb] px-4 py-3 sm:gap-3"
                role="toolbar"
                aria-label="Mətn formatı"
              >
                <ToolbarIconButton label="Qalın" icon={Bold} />
                <ToolbarIconButton label="Altıxətli" icon={Underline} />
                <ToolbarIconButton label="Maili" icon={Italic} />
                <ToolbarIconButton label="Keçid" icon={Link2} />
                <ToolbarIconButton label="Kod" icon={Code} />
                <ToolbarIconButton label="Sitat" icon={Quote} />
                <span
                  className="size-6 shrink-0 rounded-full bg-[#1d212a]"
                  aria-hidden
                />
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
                {...register('description')}
                rows={8}
                className="min-h-[180px] w-full resize-y border-0 bg-transparent px-4 py-4 text-sm leading-5 text-[#14171a] outline-none"
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <h3 className="text-2xl font-medium leading-8 text-[#14171a]">
            Əlaqə vasitələri
          </h3>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-8">
            <div className="flex flex-col gap-2">
              <FieldLabel>Telefon nömrəsi</FieldLabel>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    country="az"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
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
                )}
              />
            </div>
            <label className="flex flex-col gap-2">
              <FieldLabel>Email</FieldLabel>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className={inputClass}
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <FieldLabel>Ünvan</FieldLabel>
            <input {...register('address')} type="text" className={inputClass} />
          </label>
        </section>

        <section className="flex flex-col gap-5">
          <h3 className="text-2xl font-medium leading-8 text-[#14171a]">
            Sosial media vasitələri
          </h3>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-8">
            <label className="flex flex-col gap-2">
              <FieldLabel>Website</FieldLabel>
              <input {...register('website')} type="url" className={inputClass} />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>Instagram</FieldLabel>
              <input
                {...register('instagram')}
                type="url"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>Facebook</FieldLabel>
              <input
                {...register('facebook')}
                type="url"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>LinkedIn</FieldLabel>
              <input
                {...register('linkedin')}
                type="url"
                className={inputClass}
              />
            </label>
          </div>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-2xl bg-[#e6eff6] px-6 text-base font-medium leading-6 text-[#0f477d] transition-colors hover:bg-[#d7e6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d]"
          >
            Ləğv et
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-2xl bg-[#0f477d] px-6 text-base font-medium leading-6 text-white transition-colors hover:bg-[#0c3a66] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
          >
            {updateMutation.isPending ? 'Saxlanılır...' : 'Yadda saxla'}
          </button>
        </div>
      </form>
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
