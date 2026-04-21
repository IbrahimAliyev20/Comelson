import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SUPPORTED_LOCALES = ['az', 'en', 'tr', 'ru'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export function getLocaleForCountry(countryName?: string, flagUrl?: string): SupportedLocale {
  const normalizedName = countryName?.trim().toLowerCase() ?? ''
  const normalizedFlag = flagUrl?.trim().toLowerCase() ?? ''
  const flagCodeMatch = normalizedFlag.match(/\/([a-z]{2})\.(svg|png|jpe?g|webp)(?:\?|#|$)/i)
  const flagCode = flagCodeMatch?.[1]?.toLowerCase() ?? ''

  if (
    flagCode === 'az' ||
    normalizedName.includes('azərbaycan') ||
    normalizedName.includes('azerbaijan')
  ) {
    return 'az'
  }

  if (
    flagCode === 'tr' ||
    normalizedName.includes('türkiyə') ||
    normalizedName.includes('turkiye') ||
    normalizedName.includes('türkiye') ||
    normalizedName.includes('turkey')
  ) {
    return 'tr'
  }

  if (
    flagCode === 'ru' ||
    normalizedName.includes('rusiya') ||
    normalizedName.includes('russia') ||
    normalizedName.includes('россия')
  ) {
    return 'ru'
  }

  if (
    flagCode === 'gb' ||
    flagCode === 'us' ||
    normalizedName.includes('birləşmiş krallıq') ||
    normalizedName.includes('united kingdom') ||
    normalizedName.includes('great britain') ||
    normalizedName.includes('england') ||
    normalizedName.includes('amerika') ||
    normalizedName.includes('united states')
  ) {
    return 'en'
  }

  return 'en'
}

export function getCurrentLocale(): SupportedLocale {
  if (typeof window === 'undefined') return 'az'

  const pathname = window.location.pathname
  const match = pathname.match(/^\/([a-z]{2})(\/|$)/)
  const candidate = match?.[1]
  if (!candidate) return 'az'
  if (!isSupportedLocale(candidate)) return 'az'
  return candidate
}

export function getAcceptLanguageHeader(locale?: string): string {
  const currentLocale = locale && isSupportedLocale(locale) ? locale : getCurrentLocale()

  const localeMap: Record<SupportedLocale, string> = {
    az: 'az-AZ,az;q=0.9,en;q=0.8',
    en: 'en-US,en;q=0.9,az;q=0.8',
    tr: 'tr-TR,tr;q=0.9,en;q=0.8',
    ru: 'ru-RU,ru;q=0.9,en;q=0.8',
  }

  return localeMap[currentLocale]
}

export async function getServerLocale(): Promise<SupportedLocale> {
  try {
    const { getLocale } = await import('next-intl/server')
    const locale = await getLocale()
    if (isSupportedLocale(locale)) return locale
    return 'az'
  } catch {
    return 'az'
  }
}
