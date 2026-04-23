import Cookies from 'js-cookie'

/**
 * Shared cookie constants used by the auth / API layers.
 * Keep these in sync with `src/proxy.ts` and `src/lib/api/client.ts`.
 */
export const ACCESS_TOKEN_COOKIE = 'access_token'
export const COUNTRY_ID_COOKIE = 'country_id'
export const COUNTRY_ID_HEADER = 'X-Country-Id'

/** Standard cookie options — kept identical on client and server. */
export const COOKIE_MAX_AGE_SESSION = 60 * 60 * 24 // 1 day
export const COOKIE_MAX_AGE_REMEMBER = 60 * 60 * 24 * 30 // 30 days

export type AccessCookieAttrs = {
  maxAge?: number
  expiresAt?: string
}

/** Shared attributes so client-set and server-set cookies never diverge. */
export function buildClientAccessCookieOptions(
  attrs: AccessCookieAttrs = {}
): Cookies.CookieAttributes {
  const opts: Cookies.CookieAttributes = {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }

  if (attrs.expiresAt) {
    const date = new Date(attrs.expiresAt)
    if (!Number.isNaN(date.getTime())) opts.expires = date
  } else if (typeof attrs.maxAge === 'number') {
    opts.expires = attrs.maxAge / (60 * 60 * 24)
  }

  return opts
}

/** Browser: write/clear the access_token cookie. No-op on server. */
export function setAccessTokenCookieClient(
  token: string,
  attrs: AccessCookieAttrs = {}
): void {
  if (typeof window === 'undefined') return
  Cookies.set(ACCESS_TOKEN_COOKIE, token, buildClientAccessCookieOptions(attrs))
}

export function clearAccessTokenCookieClient(): void {
  if (typeof window === 'undefined') return
  Cookies.remove(ACCESS_TOKEN_COOKIE, { path: '/' })
}

/**
 * Server: write the access_token cookie through `next/headers`.
 * Only works inside Server Actions or Route Handlers (RSC is read-only).
 * Swallows the RSC "cookies().set" error silently.
 */
export async function setAccessTokenCookieServer(
  token: string,
  attrs: AccessCookieAttrs = {}
): Promise<void> {
  try {
    const { cookies } = await import('next/headers')
    const jar = await cookies()
    jar.set({
      name: ACCESS_TOKEN_COOKIE,
      value: token,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
      maxAge: attrs.maxAge,
      expires: attrs.expiresAt ? new Date(attrs.expiresAt) : undefined,
    })
  } catch {
    /* RSC read-only cookie store — caller must rely on in-memory token. */
  }
}

export async function clearAccessTokenCookieServer(): Promise<void> {
  try {
    const { cookies } = await import('next/headers')
    const jar = await cookies()
    jar.delete(ACCESS_TOKEN_COOKIE)
  } catch {
    /* ignore */
  }
}
