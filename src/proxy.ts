import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'

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

export function proxy(request: NextRequest) {
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
