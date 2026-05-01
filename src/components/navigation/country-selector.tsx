'use client'

import Image from 'next/image'
import Cookies from 'js-cookie'
import { Search, X } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'
import { startTransition, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createPortal } from 'react-dom'

import { usePathname, useRouter } from '@/i18n/navigation'
import { COUNTRY_ID_COOKIE } from '@/lib/auth/cookies'
import { cn, getLocaleForCountry } from '@/lib/utils'
import { getCountriesQuery } from '@/services/members/queries'
import type { CountryResponse } from '@/types/types'

import { Squonk, SquonkContent } from '../ui/squonk'

type CountrySelectorProps = {
  variant?: 'default' | 'onDark'
}

function CountryModal({
  countries,
  activeCountry,
  onClose,
  onSelect,
  title,
  searchPlaceholder,
  closeLabel,
}: {
  countries: CountryResponse[]
  activeCountry: CountryResponse | null
  onClose: () => void
  onSelect: (country: CountryResponse) => void
  title: string
  searchPlaceholder: string
  closeLabel: string
}) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return countries
    return countries.filter((item) => item.name.toLowerCase().includes(q))
  }, [countries, query])

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#14171a]/35 px-4 py-8">
      <button
        type="button"
        aria-label={closeLabel}
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 flex w-full max-w-[804px] flex-col rounded-2xl bg-white px-4 py-5 shadow-[0_24px_80px_rgba(20,23,26,0.18)] sm:px-6 sm:py-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h3 className="text-[20px] font-medium leading-7 text-[#1d212a] sm:text-[24px] sm:leading-8">
            {title}
          </h3>

          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-full border border-[#d9e3eb] text-[#6b6e71] transition-colors hover:bg-[#f4fafd]"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="relative mb-5">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#889097]"
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-xl border border-[#dce6ef] bg-white pl-11 pr-4 text-sm text-[#1d212a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]/30"
          />
        </div>

        <div className="max-h-[340px] overflow-y-auto pr-1 sm:max-h-[360px]">
          <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 lg:grid-cols-5">
            {filtered.map((country) => {
              const isActive = activeCountry?.id === country.id
              return (
                <button
                  key={country.id}
                  type="button"
                  onClick={() => onSelect(country)}
                  className={cn(
                    'flex min-h-[48px] items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
                    isActive
                      ? 'border-[#5a94d0] bg-[#f8fbff]'
                      : 'border-transparent bg-white hover:bg-[#f8fbff]'
                  )}
                >
                  <Image
                    src={country.flag}
                    alt=""
                    width={20}
                    height={14}
                    className="h-[14px] w-5 rounded-[2px] object-cover"
                  />
                  <span className="truncate text-sm leading-5 text-[#32393f]">
                    {country.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function CountryFlagCard({
  country,
  className = '',
}: {
  country: CountryResponse
  className?: string
}) {
  return (
    <div
      className={`flex size-full items-center justify-center rounded-[26px] bg-white shadow-[0_14px_34px_rgba(20,23,26,0.14)] ${className}`}
    >
      <div className="flex h-full w-full items-center justify-center rounded-[26px] bg-[linear-gradient(180deg,#f9fbfd_0%,#eef4f8_100%)] p-3">
        <Image
          src={country.flag}
          alt={country.name}
          width={80}
          height={56}
          className="h-auto w-full rounded-[18px] object-cover"
        />
      </div>
    </div>
  )
}

function CountrySwitchLoadingModal({
  currentCountry,
  nextCountry,
  title,
}: {
  currentCountry: CountryResponse
  nextCountry: CountryResponse
  title: string
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#14171a]/35 px-4 py-8 backdrop-blur-[6px]">
      <div className="flex w-full max-w-[320px] flex-col items-center rounded-[28px] bg-white px-6 py-7 text-center shadow-[0_24px_80px_rgba(20,23,26,0.22)]">
        <Squonk
          size={92}
          radius={28}
          cycleDuration={1800}
          easing="smooth"
          className="mb-4 h-[180px] w-full"
        >
          <SquonkContent index={0}>
            <CountryFlagCard country={currentCountry} />
          </SquonkContent>
          <SquonkContent index={1}>
            <CountryFlagCard country={nextCountry} className="ring-1 ring-[#dce6ef]" />
          </SquonkContent>
        </Squonk>

        <p className="text-[20px] font-medium leading-7 text-[#1d212a]">{title}</p>
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          {currentCountry.name} {'>'} {nextCountry.name}
        </p>

        <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-[#e8eef5]">
          <div className="h-full w-full animate-[country-loading_1.2s_ease-in-out_infinite] rounded-full bg-[linear-gradient(90deg,#0f477d_0%,#3e8ff5_100%)]" />
        </div>
      </div>
    </div>
  )
}

export default function CountrySelector({ variant = 'default' }: CountrySelectorProps) {
  const locale = useLocale()
  const tFooter = useTranslations('footer')
  const tCommon = useTranslations('common')
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false)
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null)
  const [currentSwitchCountry, setCurrentSwitchCountry] = useState<CountryResponse | null>(null)
  const [switchingCountry, setSwitchingCountry] = useState<CountryResponse | null>(null)
  const [hasMounted, setHasMounted] = useState(false)

  const { data: countries = [] } = useQuery(getCountriesQuery(locale))

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (selectedCountryId !== null) return
    const raw = Cookies.get(COUNTRY_ID_COOKIE)
    const parsed = raw ? Number(raw) : Number.NaN
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setIsCountryModalOpen(true)
      return
    }
    setSelectedCountryId(parsed)
  }, [selectedCountryId])

  useEffect(() => {
    if (!countries.length) return
    const raw = Cookies.get(COUNTRY_ID_COOKIE)
    const parsed = raw ? Number(raw) : Number.NaN
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setIsCountryModalOpen(true)
    }
  }, [countries, selectedCountryId, locale])

  const selectedCountry = useMemo(() => {
    return countries.find((item) => item.id === selectedCountryId) ?? null
  }, [countries, selectedCountryId])

  async function handleCountrySelect(country: CountryResponse) {
    if (switchingCountry) return

    if (selectedCountry?.id === country.id) {
      setIsCountryModalOpen(false)
      return
    }

    const currentCountry = selectedCountry ?? country

    setIsCountryModalOpen(false)
    setCurrentSwitchCountry(currentCountry)
    setSwitchingCountry(country)

    await new Promise((resolve) => window.setTimeout(resolve, 1250))

    Cookies.set(COUNTRY_ID_COOKIE, String(country.id), {
      path: '/',
      expires: 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    try {
      const nextLocale = getLocaleForCountry(country.name, country.flag)
      const query = Object.fromEntries(searchParams.entries())

      if (nextLocale !== locale) {
        startTransition(() => {
          router.replace({ pathname, query }, { locale: nextLocale })
        })
        return
      }

      await queryClient.invalidateQueries()
      setSelectedCountryId(country.id)
    } finally {
      setCurrentSwitchCountry(null)
      setSwitchingCountry(null)
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes country-loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>

      <button
        type="button"
        aria-label={tFooter('countrySelection')}
        onClick={() => setIsCountryModalOpen(true)}
        className={cn(
          'inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          variant === 'onDark'
            ? 'border-white/20 bg-white/10 hover:bg-white/15'
            : 'border-[#E5E6E5] bg-white hover:bg-black/5'
        )}
      >
        <span className="relative inline-block size-7 overflow-hidden rounded-full">
          {selectedCountry ? (
            <Image
              src={selectedCountry.flag}
              alt={selectedCountry.name}
              fill
              sizes="28px"
              className="object-cover"
            />
          ) : (
            <span
              className={cn(
                'absolute inset-0 rounded-full',
                variant === 'onDark' ? 'bg-white/20' : 'bg-[#dce6ef]'
              )}
              aria-hidden
            />
          )}
        </span>
      </button>

      {hasMounted && isCountryModalOpen
        ? createPortal(
            <CountryModal
              countries={countries}
              activeCountry={selectedCountry}
              onClose={() => setIsCountryModalOpen(false)}
              onSelect={handleCountrySelect}
              title={tFooter('countrySelection')}
              searchPlaceholder={tCommon('actions.search')}
              closeLabel={tCommon('actions.close')}
            />,
            document.body
          )
        : null}

      {hasMounted && switchingCountry && currentSwitchCountry
        ? createPortal(
            <CountrySwitchLoadingModal
              currentCountry={currentSwitchCountry}
              nextCountry={switchingCountry}
              title={tCommon('status.changingCountry')}
            />,
            document.body
          )
        : null}
    </>
  )
}
