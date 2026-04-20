'use client'

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Camera,
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
import { useLocale } from 'next-intl'
import type { ComponentType, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { postCompanyMutation } from '@/services/companies/mutations'
import { getCompanyCategoriesQuery } from '@/services/company-categories/queries'
import { getCountriesQuery } from '@/services/members/queries'

const inputClass =
  'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 text-sm text-[#1d212a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10'

const labelClass = 'pl-1 text-sm leading-6 text-[#1d212a]'

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
          'cursor-pointer appearance-none pr-10',
          className
        )}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#6b6e71]"
        aria-hidden
      />
    </div>
  )
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

/** Figma 459:6806 — Şirkət əlavə et */
export type CreateCampainProps = {
  onBack: () => void
  onCancel?: () => void
  /** API uğuru — siyahını yeniləmək üçün */
  onSuccess?: () => void
}

export default function CreateCampain({
  onBack,
  onCancel,
  onSuccess,
}: CreateCampainProps) {
  const locale = useLocale()
  const { data: countries = [], isLoading: countriesLoading } = useQuery(
    getCountriesQuery(locale)
  )
  const { data: categories = [], isLoading: categoriesLoading } = useQuery(
    getCompanyCategoriesQuery(locale)
  )
  const [about, setAbout] = useState('')
  const [phone, setPhone] = useState<string>('')
  const [categoryId, setCategoryId] = useState('')
  const [countryId, setCountryId] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>('')

  useEffect(() => {
    if (!logoFile) {
      setLogoPreviewUrl('')
      return
    }

    const url = URL.createObjectURL(logoFile)
    setLogoPreviewUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [logoFile])

  const createMutation = useMutation({
    ...postCompanyMutation(),
    onSuccess: (res) => {
      if (!res?.status) {
        toast.error(res?.message || 'Əlavə edilmədi')
        return
      }
      toast.success('Şirkət əlavə olundu')
      onSuccess?.()
    },
    onError: () => {
      toast.error('Şirkət əlavə edilmədi')
    },
  })

  const handleCancel = () => {
    onCancel?.()
    onBack()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = String(
      (form.elements.namedItem('companyName') as HTMLInputElement)?.value ?? ''
    ).trim()
    const voen = String(
      (form.elements.namedItem('voen') as HTMLInputElement)?.value ?? ''
    ).trim()
    const email = String(
      (form.elements.namedItem('email') as HTMLInputElement)?.value ?? ''
    ).trim()
    const address = String(
      (form.elements.namedItem('address') as HTMLInputElement)?.value ?? ''
    ).trim()
    const website = String(
      (form.elements.namedItem('website') as HTMLInputElement)?.value ?? ''
    ).trim()
    const instagram = String(
      (form.elements.namedItem('instagram') as HTMLInputElement)?.value ?? ''
    ).trim()
    const facebook = String(
      (form.elements.namedItem('facebook') as HTMLInputElement)?.value ?? ''
    ).trim()
    const linkedin = String(
      (form.elements.namedItem('linkedin') as HTMLInputElement)?.value ?? ''
    ).trim()

    if (!categoryId || !countryId) {
      toast.error('Kateqoriya və ölkə seçin')
      return
    }
    if (!name || !voen || !email) {
      toast.error('Məcburi sahələri doldurun')
      return
    }

    const description =
      about.trim().length > 0
        ? `<p>${escapeHtmlPlain(about)}</p>`
        : '<p></p>'

    createMutation.mutate({
      locale,
      body: {
        name,
        voen,
        category_id: Number(categoryId),
        country_id: Number(countryId),
        description,
        phone: normalizePhone(phone),
        email,
        address,
        website,
        instagram,
        facebook,
        linkedin,
        logo: logoFile ?? undefined,
      },
    })
  }

  return (
    <div className="flex w-full flex-col bg-white pb-12" data-name="create-company">
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
          Şirkət əlavə et
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-12 px-6 sm:px-12"
      >
        {/* Şirkət detalları */}
        <section className="flex flex-col gap-8 py-5">
      

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-5">
            <label className="relative flex size-[120px] shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border border-[#eaf1fa] bg-[#e6eff6] p-2.5">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="sr-only"
                onChange={(ev) => {
                  const f = ev.target.files?.[0]
                  setLogoFile(f ?? null)
                }}
              />
              {logoPreviewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoPreviewUrl}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <Camera className="size-9 text-[#6b6e71]" aria-hidden />
              )}
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
                placeholder="Şirkət adını daxil edin"
                autoComplete="organization"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>Şirkətin VÖEN-i</FieldLabel>
              <input
                name="voen"
                type="text"
                inputMode="numeric"
                placeholder="Şirkətin VÖEN-ni daxil edin"
                className={inputClass}
              />
            </label>
            <div className="flex flex-col gap-2">
              <FieldLabel>Kateqoriya</FieldLabel>
              <NativeSelect
                name="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
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
                required
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
                <ToolbarIconButton label="Şəkil" icon={ImageIcon} />
                <ToolbarIconButton label="Cədvəl" icon={Table2} />
              </div>
              <textarea
                name="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Şirkət haqqında məlumat daxil edin"
                rows={6}
                className="min-h-[140px] w-full resize-y border-0 bg-transparent px-4 py-4 text-sm leading-5 text-[#1d212a] outline-none placeholder:text-[#889097]"
              />
            </div>
          </div>
        </section>

        {/* Əlaqə vasitələri */}
        <section className="flex flex-col gap-5">
          <h3 className="text-2xl font-medium leading-8 text-[#14171a]">
            Əlaqə vasitələri
          </h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-8">
            <div className="flex flex-col gap-2">
              <FieldLabel>Telefon nömrəsi</FieldLabel>
              <input type="hidden" name="phone" value={phone} />
              <PhoneInput
                country="az"
                value={phone}
                onChange={(value) => setPhone(value)}
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
              <FieldLabel>Email</FieldLabel>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email adresini daxil edin"
                className={inputClass}
              />
            </label>
          </div>
          <label className="flex flex-col gap-2">
            <FieldLabel>Ünvan</FieldLabel>
            <input
              name="address"
              type="text"
              placeholder="Şirkətin ünvanını daxil edin"
              className={inputClass}
            />
          </label>
        </section>

        {/* Sosial media */}
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
                placeholder="https://example.com"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>Instagram</FieldLabel>
              <input
                name="instagram"
                type="url"
                placeholder="https://instagram.com/example"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>Facebook</FieldLabel>
              <input
                name="facebook"
                type="url"
                placeholder="https://facebook.com/example"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>LinkedIn</FieldLabel>
              <input
                name="linkedin"
                type="url"
                placeholder="https://linkedin.com/example"
                className={inputClass}
              />
            </label>
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
            disabled={createMutation.isPending}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#0f477d] px-6 text-base font-medium leading-6 text-white transition-colors hover:bg-[#0c3a66] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
          >
            {createMutation.isPending ? 'Göndərilir…' : 'Əlavə et'}
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
      className="rounded-md p-1.5 text-[#1d212a] transition-colors hover:bg-[#eaf1fa]"
    >
      <Icon className="size-6" aria-hidden />
    </button>
  )
}
