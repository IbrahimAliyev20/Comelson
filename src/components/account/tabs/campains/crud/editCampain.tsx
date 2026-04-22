'use client'

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
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
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { toast } from 'sonner'

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

function NativeSelect({
  className,
  children,
  ...rest
}: React.ComponentProps<'select'>) {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          inputClass,
          'cursor-pointer appearance-none pr-10 font-medium',
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
  const [categoryId, setCategoryId] = useState('')
  const [countryId, setCountryId] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>('')

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

  const [form, setForm] = useState<EditableCompany>({
    ...company,
    voen: company.voen ?? '12345678',
    country: company.country,
    phone: company.phone ?? '',
    email: company.email ?? 'info@comelson.az',
    address: company.address ?? 'Bakı, Azərbaycan, Əhmədli',
    website: company.website ?? 'https://comelson.az',
    instagram: company.instagram ?? 'https://instagram.com/comelson',
    facebook: company.facebook ?? 'https://facebook.com/comelson',
    linkedin: company.linkedin ?? 'https://linkedin.com/comelson',
  })

  const { data: companyDetailResponse } = useQuery({
    ...getCompanyQuery({ locale, id: companyId }),
    enabled: Number.isFinite(companyId) && companyId > 0,
  })

  useEffect(() => {
    const d = companyDetailResponse?.data
    if (!d) return

    setCategoryId(String(d.category?.id ?? ''))
    setCountryId(String(d.country?.id ?? ''))

    setForm((prev) => ({
      ...prev,
      name: d.name ?? prev.name,
      voen: d.voen ?? prev.voen,
      category: d.category?.name ?? prev.category,
      country: d.country?.name ?? prev.country,
      description: d.description ?? prev.description,
      logo: d.logo_url ?? prev.logo,
      phone: d.phone ?? prev.phone,
      email: d.email ?? prev.email,
      address: d.address ?? prev.address,
      website: d.website ?? prev.website,
      instagram: d.instagram ?? prev.instagram,
      facebook: d.facebook ?? prev.facebook,
      linkedin: d.linkedin ?? prev.linkedin,
    }))
  }, [companyDetailResponse])

  useEffect(() => {
    if (!logoFile) {
      setLogoPreviewUrl('')
      return
    }
    const url = URL.createObjectURL(logoFile)
    setLogoPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [logoFile])

  const handleChange =
    (field: keyof EditableCompany) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = companyId
    if (Number.isNaN(id)) {
      toast.error('Şirkət ID düzgün deyil')
      return
    }
    if (!categoryId) {
      toast.error('Kateqoriya seçin')
      return
    }
    if (!countryId) {
      toast.error('Ölkə seçin')
      return
    }
    const description = `<p>${escapeHtmlPlain(form.description)}</p>`
    updateMutation.mutate({
      locale,
      id,
      body: {
        name: form.name,
        voen: form.voen ?? '',
        category_id: Number(categoryId),
        country_id: Number(countryId),
        description,
        phone: normalizePhone(form.phone ?? ''),
        email: form.email ?? '',
        address: form.address ?? '',
        website: form.website ?? '',
        instagram: form.instagram ?? '',
        facebook: form.facebook ?? '',
        linkedin: form.linkedin ?? '',
        logo: logoFile ?? undefined,
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
        onSubmit={handleSubmit}
        className="flex flex-col gap-12 px-6 pt-8 sm:px-12"
      >
        <section className="flex flex-col gap-8">
         

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-5">
            <label className="relative flex size-[120px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[#e6eff6] bg-white p-2.5">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="sr-only"
                onChange={(ev) => {
                  const f = ev.target.files?.[0]
                  setLogoFile(f ?? null)
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoPreviewUrl || form.logo}
                alt={form.name}
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
                name="companyName"
                type="text"
                autoComplete="organization"
                value={form.name}
                onChange={handleChange('name')}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>Şirkətin VÖEN-i</FieldLabel>
              <input
                name="voen"
                type="text"
                inputMode="numeric"
                value={form.voen}
                onChange={handleChange('voen')}
                className={inputClass}
              />
            </label>
            <div className="flex flex-col gap-2">
              <FieldLabel>Kateqoriya</FieldLabel>
              <NativeSelect
                name="category"
                value={categoryId}
                onChange={(e) => {
                  const v = e.target.value
                  setCategoryId(v)
                  const cat = categories.find((c) => String(c.id) === v)
                  setForm((prev) => ({
                    ...prev,
                    category: cat?.name ?? prev.category,
                  }))
                }}
                disabled={categoriesLoading}
              >
                <option value="" disabled>
                  {categoriesLoading ? 'Yüklənir…' : 'Kateqoriyanı seçin'}
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel>Ölkə</FieldLabel>
              <NativeSelect
                name="country"
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                disabled={countriesLoading}
              >
                <option value="" disabled>
                  {countriesLoading ? 'Yüklənir…' : 'Ölkəni seçin'}
                </option>
                {countries.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className={cn(labelClass, 'text-[#32393f]')}>Şirkət haqqında</span>
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
                  x²
                </button>
                <button
                  type="button"
                  className="rounded-md px-1.5 py-1 text-sm font-medium text-[#1d212a] transition-colors hover:bg-[#eaf1fa]"
                >
                  x₂
                </button>
                <div className="mx-1 hidden h-6 w-px bg-[#aeaeb2]/40 sm:block" />
                <ToolbarIconButton label="Şəkil" icon={ImageIcon} />
                <ToolbarIconButton label="Cədvəl" icon={Table2} />
              </div>
              <textarea
                name="about"
                value={form.description}
                onChange={handleChange('description')}
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
              <PhoneInput
                country="az"
                value={form.phone || ''}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, phone: value }))
                }
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
            </div>
            <label className="flex flex-col gap-2">
              <FieldLabel>Email</FieldLabel>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange('email')}
                className={inputClass}
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <FieldLabel>Ünvan</FieldLabel>
            <input
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange('address')}
              className={inputClass}
            />
          </label>
        </section>

        <section className="flex flex-col gap-5">
          <h3 className="text-2xl font-medium leading-8 text-[#14171a]">
            Sosial media vasitələri
          </h3>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-8">
            <label className="flex flex-col gap-2">
              <FieldLabel>Website</FieldLabel>
              <input
                name="website"
                type="url"
                value={form.website}
                onChange={handleChange('website')}
                className={inputClass}
              />
            </label>
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
            {updateMutation.isPending ? 'Saxlanılır…' : 'Yadda saxla'}
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
