'use client'

import Image from 'next/image'
import { Search, X, ChevronDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'

import { Link } from '@/i18n/navigation'
import { getContactQuery, getSocialMediaQuery } from '@/services/contact/queries'
import { getCountriesQuery } from '@/services/members/queries'
import { getSettingsQuery } from '@/services/settings/queries'
import type { CountryResponse } from '@/types/types'
import { heroNavigationItems } from '@/utils/static'

import Container from '../shared/container'

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

export function Footer() {
  const locale = useLocale()
  const t = useTranslations('navigation')
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false)
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null)

  const { data: settingsResponse } = useQuery(getSettingsQuery(locale))
  const siteFooterLogoSrc = settingsResponse?.siteFooterLogo || '/images/Logo.svg'
  const { data: socialMediaResponse } = useQuery(getSocialMediaQuery(locale))
  const socialMedia = socialMediaResponse?.data ?? []
  const { data: contactResponse } = useQuery(getContactQuery(locale))
  const contact = contactResponse?.data
  const { data: countries = [] } = useQuery(getCountriesQuery(locale))

  useEffect(() => {
    if (selectedCountryId !== null) return
    const raw = Cookies.get(COUNTRY_ID_COOKIE)
    const parsed = raw ? Number(raw) : NaN
    if (!Number.isFinite(parsed) || parsed <= 0) return
    setSelectedCountryId(parsed)
  }, [selectedCountryId])

  useEffect(() => {
    if (!countries.length || selectedCountryId !== null) return
    const defaultCountry = countries.find(matchesAzerbaijan) ?? countries[0] ?? null
    setSelectedCountryId(defaultCountry?.id ?? null)
  }, [countries, selectedCountryId])

  const selectedCountry = useMemo(() => {
    return countries.find((item) => item.id === selectedCountryId) ?? null
  }, [countries, selectedCountryId])

  return (
    <>
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
                        className="transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
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
                <ul className="flex flex-col gap-2">
                  {FOOTER_NAV_ITEMS.map(({ href, labelKey }) => (
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
          onSelect={(country) => {
            setSelectedCountryId(country.id)
            Cookies.set(COUNTRY_ID_COOKIE, String(country.id), {
              expires: 365,
              sameSite: 'lax',
            })
            setIsCountryModalOpen(false)
          }}
        />
      ) : null}
    </>
  )
}
