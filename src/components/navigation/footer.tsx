'use client'

import Image from 'next/image'
import { Search, X, ChevronDown } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'
import { startTransition, useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { useSearchParams } from 'next/navigation'

import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { getLocaleForCountry } from '@/lib/utils'
import { getContactQuery, getSocialMediaQuery } from '@/services/contact/queries'
import { getCountriesQuery } from '@/services/members/queries'
import { getSettingsQuery } from '@/services/settings/queries'
import type { CountryResponse } from '@/types/types'
import { heroNavigationItems } from '@/utils/static'

import Container from '../shared/container'
import { Squonk, SquonkContent } from '../ui/squonk'

type FooterNavItem = { href: string; labelKey: string }

function getFooterNavItems(): FooterNavItem[] {
  const items: FooterNavItem[] = []

  for (const item of heroNavigationItems) {
    if (item.key === 'about' && item.hasDropdown) {
      items.push(
        { href: '/about', labelKey: 'aboutDropdown.about' },
        { href: '/success-stories', labelKey: 'aboutDropdown.successStories' },
        { href: '/partnership', labelKey: 'aboutDropdown.partnership' }
      )
      continue
    }

    items.push({ href: item.href, labelKey: `heroNav.${item.key}` })
  }

  return items
}

const FOOTER_NAV_ITEMS = getFooterNavItems()

const COUNTRY_ID_COOKIE = 'country_id'

function matchesAzerbaijan(country: CountryResponse) {
  const value = country.name.trim().toLowerCase()
  return value.includes('azərbaycan') || value.includes('azerbaijan')
}

function matchesTurkey(country: CountryResponse) {
  const value = country.name.trim().toLowerCase()
  return (
    value.includes('türkiyə') ||
    value.includes('turkiye') ||
    value.includes('türkiye') ||
    value.includes('turkey')
  )
}

function matchesRussia(country: CountryResponse) {
  const value = country.name.trim().toLowerCase()
  return value.includes('rusiya') || value.includes('russia') || value.includes('россия')
}

function pickDefaultCountry(
  countries: CountryResponse[],
  locale: string
): CountryResponse | null {
  if (!countries.length) return null

  if (locale === 'az') return countries.find(matchesAzerbaijan) ?? countries[0] ?? null
  if (locale === 'tr') return countries.find(matchesTurkey) ?? countries[0] ?? null
  if (locale === 'ru') return countries.find(matchesRussia) ?? countries[0] ?? null

  return countries[0] ?? null
}

function CountryModal({
  countries,
  activeCountry,
  onClose,
  onSelect,
}: {
  countries: CountryResponse[]
  activeCountry: CountryResponse | null
  onClose: () => void
  onSelect: (country: CountryResponse) => void
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
        aria-label="Bağla"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 flex w-full max-w-[804px] flex-col rounded-2xl bg-white px-4 py-5 shadow-[0_24px_80px_rgba(20,23,26,0.18)] sm:px-6 sm:py-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h3 className="text-[20px] font-medium leading-7 text-[#1d212a] sm:text-[24px] sm:leading-8">
            Ölkə seçiminizi edin
          </h3>

          <button
            type="button"
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
            placeholder="Axtarın.."
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
                  className={`flex min-h-[48px] items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? 'border-[#5a94d0] bg-[#f8fbff]'
                      : 'border-transparent bg-white hover:bg-[#f8fbff]'
                  }`}
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
}: {
  currentCountry: CountryResponse
  nextCountry: CountryResponse
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

        <p className="text-[20px] font-medium leading-7 text-[#1d212a]">Ölkə dəyişdirilir...</p>
        <p className="mt-2 text-sm leading-6 text-[#6b7280]">
          {currentCountry.name} ölkəsindən {nextCountry.name} ölkəsinə keçid hazırlanır.
        </p>

        <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-[#e8eef5]">
          <div className="h-full w-full animate-[country-loading_1.2s_ease-in-out_infinite] rounded-full bg-[linear-gradient(90deg,#0f477d_0%,#3e8ff5_100%)]" />
        </div>
      </div>
    </div>
  )
}

export function Footer() {
  const locale = useLocale()
  const t = useTranslations('navigation')
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false)
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null)
  const [currentSwitchCountry, setCurrentSwitchCountry] = useState<CountryResponse | null>(null)
  const [switchingCountry, setSwitchingCountry] = useState<CountryResponse | null>(null)

  const { data: settingsResponse } = useQuery(getSettingsQuery(locale))
  const siteFooterLogoSrc = settingsResponse?.siteFooterLogo || '/images/Logo.svg'
  const { data: socialMediaResponse } = useQuery(getSocialMediaQuery(locale))
  const socialMedia = socialMediaResponse?.data ?? []
  const { data: contactResponse } = useQuery(getContactQuery(locale))
  const contact = contactResponse?.data
  const { data: countries = [] } = useQuery(getCountriesQuery(locale))

  const footerNavSplitIndex = Math.ceil(FOOTER_NAV_ITEMS.length / 2)
  const footerNavColumns = useMemo(() => {
    return {
      left: FOOTER_NAV_ITEMS.slice(0, footerNavSplitIndex),
      right: FOOTER_NAV_ITEMS.slice(footerNavSplitIndex),
    }
  }, [footerNavSplitIndex])

  useEffect(() => {
    if (selectedCountryId !== null) return
    const raw = Cookies.get(COUNTRY_ID_COOKIE)
    const parsed = raw ? Number(raw) : NaN
    if (!Number.isFinite(parsed) || parsed <= 0) return
    setSelectedCountryId(parsed)
  }, [selectedCountryId])

  useEffect(() => {
    if (!countries.length || selectedCountryId !== null) return
    const defaultCountry = pickDefaultCountry(countries, locale)
    if (!defaultCountry) return
    setSelectedCountryId(defaultCountry.id)

    if (!Cookies.get(COUNTRY_ID_COOKIE)) {
      Cookies.set(COUNTRY_ID_COOKIE, String(defaultCountry.id), {
        path: '/',
        expires: 365,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
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

      <footer className="bg-white pt-8 sm:pt-10">
        <Container>
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-8">
              <Link href="/" className="inline-flex items-center">
                <Image src={siteFooterLogoSrc} alt="Comelson" width={170} height={56} priority />
              </Link>

              <div className="flex flex-col gap-4">
                <p className="text-[14px] leading-5 text-[#8E8E93]">Bizi izləyin</p>
                <div className="flex items-center gap-2 sm:gap-4">
                  {socialMedia.map((item, index) => (
                    <Link
                      key={`${item.link}-${index}`}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.link}
                      className="group inline-flex rounded-full p-2 text-black transition-all hover:bg-[#e6eff6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f477d]/40 focus-visible:ring-offset-2"
                    >
                      <Image
                        src={item.image}
                        alt=""
                        width={24}
                        height={24}
                        className="transition-[filter,transform] duration-200 group-hover:scale-110 group-active:scale-95 group-hover:[filter:brightness(0)_saturate(100%)_invert(19%)_sepia(78%)_saturate(1738%)_hue-rotate(182deg)_brightness(93%)_contrast(93%)]"
                      />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-[14px] leading-5 text-[#8E8E93]">Ölkə seçimi</p>
                <button
                  type="button"
                  onClick={() => setIsCountryModalOpen(true)}
                  className="inline-flex w-fit items-center gap-3 rounded-xl text-left transition-opacity hover:opacity-80"
                >
                  {selectedCountry ? (
                    <>
                      <Image
                        src={selectedCountry.flag}
                        alt=""
                        width={24}
                        height={16}
                        className="h-4 w-6 rounded-[2px] object-cover"
                      />
                      <span className="text-[18px] font-medium leading-7 text-[#1d212a] sm:text-[20px]">
                        {selectedCountry.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-[18px] font-medium leading-7 text-[#1d212a] sm:text-[20px]">
                      Ölkə seçin
                    </span>
                  )}
                  <ChevronDown className="size-5 text-[#1d212a]" aria-hidden />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-10 md:flex-row md:gap-28">
              <div className="flex flex-col gap-6">
                <h3 className="px-2 text-[16px] font-medium leading-6 text-black">Keçidlər</h3>
                <div className="grid grid-cols-2 gap-x-8">
                  <ul className="flex flex-col gap-2">
                    {footerNavColumns.left.map(({ href, labelKey }) => (
                      <li key={`${href}-${labelKey}`} className="px-2">
                        <Link
                          href={href}
                          className="text-[14px] font-medium leading-5 text-[#8E8E93] transition-colors hover:text-[#0f477d]"
                        >
                          {t(labelKey)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <ul className="flex flex-col gap-2">
                    {footerNavColumns.right.map(({ href, labelKey }) => (
                      <li key={`${href}-${labelKey}`} className="px-2">
                        <Link
                          href={href}
                          className="text-[14px] font-medium leading-5 text-[#8E8E93] transition-colors hover:text-[#0f477d]"
                        >
                          {t(labelKey)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <h3 className="px-2 text-[16px] font-medium leading-6 text-black">Əlaqə</h3>
                <div className="flex flex-col gap-2">
                  {contact?.address ? (
                    <p className="px-2 text-[14px] font-medium leading-5 text-[#8E8E93]">{contact.address}</p>
                  ) : null}
                  {contact?.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="px-2 text-[14px] font-medium leading-5 text-[#8E8E93] transition-colors hover:text-black"
                    >
                      {contact.email}
                    </a>
                  ) : null}
                  {contact?.phone ? (
                    <a
                      href={`tel:${contact.phone.replace(/\\s+/g, '')}`}
                      className="px-2 text-[14px] font-medium leading-5 text-[#8E8E93] transition-colors hover:text-black"
                    >
                      {contact.phone}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </Container>

        <div className="mt-10 h-px w-full bg-[#F3F2F8]" />

        <Container>
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-2 text-black">
              <span className="flex size-6 items-center justify-center rounded-full border border-black text-[12px] leading-none">
                ©
              </span>
              <p className="text-center text-[14px] leading-5">Copyright | All Rights Reserved</p>
            </div>
          </div>
        </Container>
      </footer>

      {isCountryModalOpen ? (
        <CountryModal
          countries={countries}
          activeCountry={selectedCountry}
          onClose={() => setIsCountryModalOpen(false)}
          onSelect={handleCountrySelect}
        />
      ) : null}

      {switchingCountry && currentSwitchCountry ? (
        <CountrySwitchLoadingModal
          currentCountry={currentSwitchCountry}
          nextCountry={switchingCountry}
        />
      ) : null}
    </>
  )
}
