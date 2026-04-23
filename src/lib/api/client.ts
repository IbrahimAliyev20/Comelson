import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios'
import Cookies from 'js-cookie'

import {
  ACCESS_TOKEN_COOKIE,
  COUNTRY_ID_COOKIE,
  COUNTRY_ID_HEADER,
  clearAccessTokenCookieClient,
  clearAccessTokenCookieServer,
  setAccessTokenCookieClient,
  setAccessTokenCookieServer,
} from '@/lib/auth/cookies'
import { getAcceptLanguageHeader, getServerLocale } from '@/lib/utils'

/**
 * Validate env BEFORE creating the axios instance so we fail loudly in dev
 * rather than throwing `ERR_INVALID_URL` at the first request.
 */
function resolveBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!raw || typeof raw !== 'string') {
    throw new Error(
      'NEXT_PUBLIC_API_BASE_URL is not defined. Set it in your `.env` file.'
    )
  }
  return raw.replace(/\/$/, '')
}

const API_BASE_URL = resolveBaseUrl()
const REFRESH_PATH = '/auth/refresh'

/** Endpoints that must never trigger the refresh-retry loop. */
const AUTH_SKIP_REFRESH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-otp',
  '/auth/resend-otp',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/refresh',
  '/auth/logout',
]

export type RetryableAxiosConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  _skipAuthRefresh?: boolean
}

type RefreshResponse = {
  message: string
  token: string
  token_type: string
  expires_at?: string
}

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

const isBrowser = (): boolean => typeof window !== 'undefined'

const getAuthTokenClient = (): string | null => {
  if (!isBrowser()) return null
  return Cookies.get(ACCESS_TOKEN_COOKIE) || null
}

const getAuthTokenServer = async (): Promise<string | null> => {
  try {
    const { cookies } = await import('next/headers')
    const jar = await cookies()
    return jar.get(ACCESS_TOKEN_COOKIE)?.value ?? null
  } catch {
    return null
  }
}

const resolveAuthToken = async (): Promise<string | null> =>
  isBrowser() ? getAuthTokenClient() : await getAuthTokenServer()

const getCountryIdClient = (): string | null => {
  if (!isBrowser()) return null
  const raw = Cookies.get(COUNTRY_ID_COOKIE)
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : null
}

const getCountryIdServer = async (): Promise<string | null> => {
  try {
    const { cookies } = await import('next/headers')
    const jar = await cookies()
    const raw = jar.get(COUNTRY_ID_COOKIE)?.value
    if (!raw) return null
    const parsed = Number(raw)
    return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : null
  } catch {
    return null
  }
}

const resolveCountryId = async (): Promise<string | null> =>
  isBrowser() ? getCountryIdClient() : await getCountryIdServer()

const resolveAcceptLanguage = async (override?: string): Promise<string> => {
  if (override) return getAcceptLanguageHeader(override)
  if (isBrowser()) return getAcceptLanguageHeader()
  const locale = await getServerLocale()
  return getAcceptLanguageHeader(locale)
}

function setRequestHeader(
  headers: InternalAxiosRequestConfig['headers'] | undefined,
  key: string,
  value: string
): InternalAxiosRequestConfig['headers'] {
  const resolved = headers ?? new AxiosHeaders()
  if (resolved instanceof AxiosHeaders) {
    resolved.set(key, value, true)
    return resolved
  }
  ;(resolved as Record<string, string>)[key] = value
  return resolved
}

function shouldSkipRefresh(url: string | undefined): boolean {
  if (!url) return false
  return AUTH_SKIP_REFRESH_PATHS.some((path) => url.includes(path))
}

/**
 * Fully log out on terminal auth failure:
 * - clear token cookie on both client & server
 * - on client: push to `/<locale>/login`
 */
async function forceLogout(): Promise<void> {
  if (isBrowser()) {
    clearAccessTokenCookieClient()
    const locale = window.location.pathname.split('/')[1] || 'az'
    const target = `/${locale}/login`
    if (window.location.pathname !== target) {
      window.location.assign(target)
    }
    return
  }
  await clearAccessTokenCookieServer()
}

let refreshPromise: Promise<string> | null = null

async function persistRefreshedToken(
  token: string,
  expiresAt?: string
): Promise<void> {
  if (isBrowser()) {
    setAccessTokenCookieClient(token, { expiresAt })
    return
  }
  await setAccessTokenCookieServer(token, { expiresAt })
}

async function refreshAuthToken(): Promise<string> {
  const token = await resolveAuthToken()
  if (!token) throw new Error('No access token to refresh')

  const acceptLanguage = await resolveAcceptLanguage()
  const countryId = await resolveCountryId()

  // Bare axios (no interceptors) to avoid recursion; send `{}` per backend requirement.
  const res = await axios.post<RefreshResponse>(
    `${API_BASE_URL}${REFRESH_PATH}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': acceptLanguage,
        ...(countryId ? { [COUNTRY_ID_HEADER]: countryId } : {}),
      },
      timeout: 10000,
    }
  )

  const next = res.data?.token
  if (!next) throw new Error('Refresh response missing token')

  await persistRefreshedToken(next, res.data?.expires_at)
  return next
}

function getRefreshedToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshAuthToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

const setupInterceptors = (): void => {
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (config.data instanceof FormData && config.headers) {
        if (typeof config.headers.delete === 'function') {
          config.headers.delete('Content-Type')
        } else {
          delete (config.headers as Record<string, unknown>)['Content-Type']
        }
      }

      const token = await resolveAuthToken()
      if (token) {
        config.headers = setRequestHeader(
          config.headers,
          'Authorization',
          `Bearer ${token}`
        )
      }

      const countryId = await resolveCountryId()
      if (countryId) {
        config.headers = setRequestHeader(
          config.headers,
          COUNTRY_ID_HEADER,
          countryId
        )
      }

      const localeOverride =
        (config.params && typeof config.params === 'object'
          ? (config.params as Record<string, unknown>).locale
          : undefined) ??
        (config.headers && typeof config.headers === 'object'
          ? (config.headers as Record<string, unknown>)['X-Locale']
          : undefined)

      const accept = await resolveAcceptLanguage(
        typeof localeOverride === 'string' ? localeOverride : undefined
      )
      config.headers = setRequestHeader(config.headers, 'Accept-Language', accept)

      return config
    },
    (error: AxiosError) => Promise.reject(error)
  )

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const status = error.response?.status
      const original = error.config as RetryableAxiosConfig | undefined
      const url = String(original?.url ?? '')

      /**
       * Only attempt refresh when:
       *  - response is 401
       *  - caller didn't opt-out
       *  - the URL is NOT an auth endpoint (login/register/etc.)
       *  - a token actually existed on this request (otherwise 401 just means
       *    "endpoint requires auth" and we should NOT blow away the session)
       */
      const hadToken = !!(await resolveAuthToken())
      const canAttemptRefresh =
        status === 401 &&
        !!original &&
        !original._retry &&
        !original._skipAuthRefresh &&
        !shouldSkipRefresh(url) &&
        hadToken

      if (canAttemptRefresh && original) {
        try {
          original._retry = true
          const nextToken = await getRefreshedToken()
          original.headers = setRequestHeader(
            original.headers,
            'Authorization',
            `Bearer ${nextToken}`
          )
          return await client.request(original)
        } catch {
          await forceLogout()
          return Promise.reject(error)
        }
      }

      return Promise.reject(error)
    }
  )
}

setupInterceptors()

/** Call from server actions to immediately invalidate local session. */
export async function clearClientSession(): Promise<void> {
  await forceLogout()
}

export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await client.get<T>(url, config)
  return response.data
}

export const post = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await client.post<T>(url, data, config)
  return response.data
}

/** Multipart — interceptor strips Content-Type so axios sets the boundary. */
export const postForm = async <T>(
  url: string,
  data: FormData,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await client.post<T>(url, data, config)
  return response.data
}

export const put = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await client.put<T>(url, data, config)
  return response.data
}

export const patch = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await client.patch<T>(url, data, config)
  return response.data
}

export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await client.delete<T>(url, config)
  return response.data
}

export const apiClient = {
  get,
  post,
  put,
  patch,
  delete: del,
}

export default apiClient
