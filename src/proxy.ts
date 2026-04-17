import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { routing } from './i18n/routing'

/**
 * Next.js 16+: `middleware.ts` əvəzinə `proxy.ts` — eyni məqsəd (request tamamlanmazdan əvvəl).
 * next-intl burada qoşulur.
 *
 * Auth üçün qeyd:
 * - Protected route redirect / token yoxlaması sonradan əlavə oluna bilər.
 * - `access_token` cookie — `@/lib/api/client.ts` ilə uyğunlaşdırın.
 */
const intlMiddleware = createMiddleware({
  ...routing,
  alternateLinks: false,
  localeDetection: false,
})

const AUTH_PATHS = new Set([
  '/login',
  '/register',
  '/forgetpassword',
  '/otp',
  '/new-password',
])

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  const localePrefix = routing.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  const normalizedPath = localePrefix
    ? pathname.slice(localePrefix.length + 1) || '/'
    : pathname

  if (token && AUTH_PATHS.has(normalizedPath)) {
    const locale = localePrefix ?? routing.defaultLocale
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/account`
    url.search = ''
    return NextResponse.redirect(url)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/',
    '/en/:path*',
    '/tr/:path*',
    '/ru/:path*',
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
}
