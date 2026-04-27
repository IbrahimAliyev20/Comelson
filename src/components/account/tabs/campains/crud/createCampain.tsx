'use client'

import {
  Camera,
  ChevronLeft,
} from 'lucide-react'
import { useLocale } from 'next-intl'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Editor from '@/components/Editor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { postCompanyMutation } from '@/services/companies/mutations'
import { getCompanyCategoriesQuery } from '@/services/company-categories/queries'
import { getCountriesQuery } from '@/services/members/queries'

const inputClass =
  'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 text-sm text-[#1d212a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10'

const labelClass = 'pl-1 text-sm leading-6 text-[#1d212a]'

type CreateCampainFormValues = {
  companyName: string
  voen: string
  categoryId: string
  countryId: string
  about: string
  phone: string
  email: string
  address: string
  website: string
  instagram: string
  facebook: string
  linkedin: string
  logo: File | null
  profil: File | null
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className={labelClass}>{children}</span>
}

function normalizePhone(raw: string): string {
  const t = raw.trim()
  if (!t) return ''
  return t.startsWith('+') ? t : `+${t}`
}

function phoneHasEnoughDigits(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10
}

export type CreateCampainProps = {
  onBack: () => void
  onCancel?: () => void
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
  const { register, control, setValue, watch, handleSubmit } =
    useForm<CreateCampainFormValues>({
      defaultValues: {
        companyName: '',
        voen: '',
        categoryId: '',
        countryId: '',
        about: '',
        phone: '',
        email: '',
        address: '',
        website: '',
        instagram: '',
        facebook: '',
        linkedin: '',
        logo: null,
        profil: null,
      },
    })

  const logoFile = watch('logo')
  const profilFile = watch('profil')
  const logoPreviewUrl = logoFile ? URL.createObjectURL(logoFile) : ''
  const profilPreviewUrl = profilFile ? URL.createObjectURL(profilFile) : ''

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl)
    }
  }, [logoPreviewUrl])

  useEffect(() => {
    return () => {
      if (profilPreviewUrl) URL.revokeObjectURL(profilPreviewUrl)
    }
  }, [profilPreviewUrl])

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

  const submit = (data: CreateCampainFormValues) => {
    if (!data.logo) return void toast.error('Logo yükləyin')
    if (!data.categoryId || !data.countryId) {
      return void toast.error('Kateqoriya və ölkə seçin')
    }
    if (!data.companyName.trim() || !data.voen.trim()) {
      return void toast.error('Şirkətin adı və VÖEN məcburidir')
    }
    if (!data.about.trim()) {
      return void toast.error('Şirkət haqqında məlumat daxil edin')
    }
    if (!phoneHasEnoughDigits(data.phone)) {
      return void toast.error('Telefon nömrəsini daxil edin')
    }
    if (!data.email.trim()) return void toast.error('Email ünvanını daxil edin')
    if (!data.address.trim()) return void toast.error('Ünvanı daxil edin')

    const description = data.about.trim()

    createMutation.mutate({
      locale,
      body: {
        name: data.companyName.trim(),
        voen: data.voen.trim(),
        category_id: Number(data.categoryId),
        country_id: Number(data.countryId),
        description,
        phone: normalizePhone(data.phone),
        email: data.email.trim(),
        address: data.address.trim(),
        website: data.website.trim(),
        instagram: data.instagram.trim(),
        facebook: data.facebook.trim(),
        linkedin: data.linkedin.trim(),
        logo: data.logo,
        profil: data.profil,
      },
    })
  }

  return (
    <div className="flex w-full flex-col bg-white pb-12" data-name="create-company">
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
          Şirkət əlavə et
        </h2>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(submit)}
        className="flex flex-col gap-8 px-3 pt-2 sm:gap-12 sm:px-12 sm:pt-0"
      >
        <section className="flex flex-col gap-8 py-5">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-5">
              <label className="relative flex size-[120px] shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border border-[#eaf1fa] bg-[#e6eff6] p-2.5">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className="sr-only"
                  aria-required="true"
                  onChange={(ev) => {
                    const file = ev.target.files?.[0] ?? null
                    setValue('logo', file)
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
                Şirkət səhifəsində görünəcək

                  <span className="text-[#ff3b30]" aria-hidden>
                    *
                  </span>
                </p>
                <p className="text-xs leading-4 text-[#6b6e71]">
                  JPG, JPEG və ya PNG formatı • Maksimum 5 MB
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-5">
              <label className="relative flex size-[120px] shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border border-[#eaf1fa] bg-[#e6eff6] p-2.5">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className="sr-only"
                  onChange={(ev) => {
                    const file = ev.target.files?.[0] ?? null
                    setValue('profil', file)
                  }}
                />
                {profilPreviewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profilPreviewUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <Camera className="size-9 text-[#6b6e71]" aria-hidden />
                )}
                <span className="sr-only">Profil şəkli yüklə</span>
              </label>
              <div className="flex min-w-0 flex-col gap-2.5">
                <p className="text-sm font-medium leading-5 text-[#14171a]">
                Üzvlük bölməsində böyük ölçüdə istifadə olunur
                <span className="text-[#ff3b30]" aria-hidden>
                  *
                </span>
                </p>
                <p className="text-xs leading-4 text-[#6b6e71]">
                  JPG, JPEG və ya PNG formatı • Maksimum 5 MB
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-x-8">
            <label className="flex flex-col gap-2">
              <FieldLabel>
                Şirkətin adı{' '}
                <span className="text-[#ff3b30]" aria-hidden>
                  *
                </span>
              </FieldLabel>
              <input
                {...register('companyName')}
                type="text"
                placeholder="Şirkət adını daxil edin"
                autoComplete="organization"
                aria-required="true"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>
                Şirkətin VÖEN-i{' '}
                <span className="text-[#ff3b30]" aria-hidden>
                  *
                </span>
              </FieldLabel>
              <input
                {...register('voen')}
                type="text"
                inputMode="numeric"
                placeholder="Şirkətin VÖEN-ni daxil edin"
                aria-required="true"
                className={inputClass}
              />
            </label>
            <div className="flex flex-col gap-2">
              <FieldLabel>
                Kateqoriya{' '}
                <span className="text-[#ff3b30]" aria-hidden>
                  *
                </span>
              </FieldLabel>
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
              <FieldLabel>
                Ölkə{' '}
                <span className="text-[#ff3b30]" aria-hidden>
                  *
                </span>
              </FieldLabel>
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
              Şirkət haqqında{' '}
              <span className="text-[#ff3b30]" aria-hidden>
                *
              </span>
            </span>
            <div className="overflow-hidden rounded-xl border border-[#b5b8bb] bg-white">
              <Controller
                name="about"
                control={control}
                render={({ field }) => (
                  <Editor value={field.value ?? ''} onChange={field.onChange} />
                )}
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
              <FieldLabel>
                Telefon nömrəsi{' '}
                <span className="text-[#ff3b30]" aria-hidden>
                  *
                </span>
              </FieldLabel>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    country="az"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    placeholder="Nömrənizi daxil edin"
                    inputProps={{ required: false, 'aria-required': true }}
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
              <FieldLabel>
                Email{' '}
                <span className="text-[#ff3b30]" aria-hidden>
                  *
                </span>
              </FieldLabel>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="Email adresini daxil edin"
                aria-required="true"
                className={inputClass}
              />
            </label>
          </div>
          <label className="flex flex-col gap-2">
            <FieldLabel>
              Ünvan{' '}
              <span className="text-[#ff3b30]" aria-hidden>
                *
              </span>
            </FieldLabel>
            <input
              {...register('address')}
              type="text"
              placeholder="Şirkətin ünvanını daxil edin"
              aria-required="true"
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
                {...register('website')}
                type="url"
                placeholder="https://example.com"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>Instagram</FieldLabel>
              <input
                {...register('instagram')}
                type="url"
                placeholder="https://instagram.com/example"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>Facebook</FieldLabel>
              <input
                {...register('facebook')}
                type="url"
                placeholder="https://facebook.com/example"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>LinkedIn</FieldLabel>
              <input
                {...register('linkedin')}
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
            className="inline-flex py-2 h-12 flex-1 cursor-pointer items-center justify-center rounded-lg md:rounded-2xl bg-[#e6eff6] px-6 text-base font-medium leading-6 text-[#0f477d] transition-colors hover:bg-[#d7e6f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f477d]"
          >
            Ləğv et
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="inline-flex py-2 h-12 flex-1 cursor-pointer items-center justify-center rounded-lg md:rounded-2xl bg-[#0f477d] px-6 text-base font-medium leading-6 text-white transition-colors hover:bg-[#0c3a66] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
          >
            {createMutation.isPending ? 'Göndərilir...' : 'Əlavə et'}
          </button>
        </div>
      </form>
    </div>
  )
}
