import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { routing } from './i18n/routing'

/**
 * Next.js 16+: `proxy.ts` replaces `middleware.ts`.
 * Responsibilities:
 *  1. next-intl locale handling.
 *  2. Bounce authenticated users away from the auth-only pages.
 *  3. Bounce unauthenticated users away from protected pages.
 */
const intlMiddleware = createMiddleware({
  ...routing,
  alternateLinks: false,
  localeDetection: false,
})

const ACCESS_TOKEN_COOKIE = 'access_token'

/** Pages that MUST redirect authenticated users away. */
const AUTH_ONLY_PATHS = new Set([
  '/login',
  '/register',
  '/forgetpassword',
  '/otp',
  '/new-password',
])

/** Pages that require a valid session. Add more as needed. */
const PROTECTED_PATHS: ReadonlyArray<string> = ['/account']

function isProtected(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const { pathname } = request.nextUrl

  const localePrefix = routing.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  const normalizedPath = localePrefix
    ? pathname.slice(localePrefix.length + 1) || '/'
    : pathname

  const locale = localePrefix ?? routing.defaultLocale

  if (token && AUTH_ONLY_PATHS.has(normalizedPath)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/account`
    url.search = ''
    return NextResponse.redirect(url)
  }

  if (!token && isProtected(normalizedPath)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    url.searchParams.set('redirect', pathname)
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
