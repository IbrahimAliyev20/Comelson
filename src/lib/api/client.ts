import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios'
import Cookies from 'js-cookie'
import { getAcceptLanguageHeader } from '@/lib/utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const TOKEN_COOKIE_NAME = 'access_token'
const COUNTRY_ID_COOKIE_NAME = 'country_id'
const COUNTRY_ID_HEADER = 'X-Country-Id'

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return Cookies.get(TOKEN_COOKIE_NAME) || null
}

const getAuthTokenServer = async (): Promise<string | null> => {
  try {
    const mod = await import('next/headers')
    const store = await mod.cookies()
    const token = store.get(TOKEN_COOKIE_NAME)?.value
    return token || null
  } catch {
    return null
  }
}

const resolveAuthToken = async (): Promise<string | null> => {
  if (typeof window !== 'undefined') return getAuthToken()
  return await getAuthTokenServer()
}

const getCountryId = (): string | null => {
  const raw = Cookies.get(COUNTRY_ID_COOKIE_NAME)
  if (!raw) return null
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return String(parsed)
}

const getCountryIdServer = async (): Promise<string | null> => {
  try {
    const mod = await import('next/headers')
    const store = await mod.cookies()
    const raw = store.get(COUNTRY_ID_COOKIE_NAME)?.value
    if (!raw) return null
    const parsed = Number(raw)
    if (!Number.isFinite(parsed) || parsed <= 0) return null
    return String(parsed)
  } catch {
    return null
  }
}

const resolveCountryId = async (): Promise<string | null> => {
  if (typeof window !== 'undefined') return getCountryId()
  return await getCountryIdServer()
}

function setRequestHeader(
  headers: InternalAxiosRequestConfig['headers'] | undefined,
  key: string,
  value: string
): InternalAxiosRequestConfig['headers'] {
  const resolved = headers ?? new AxiosHeaders()

  if (resolved instanceof AxiosHeaders) {
    if (!resolved.has(key)) resolved.set(key, value)
    return resolved
  }

  const record = resolved as unknown as Record<string, string | undefined>
  if (!record[key]) record[key] = value
  return resolved
}

const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return
  Cookies.remove(TOKEN_COOKIE_NAME)
}

const handleUnauthorized = (): void => {
  if (typeof window === 'undefined') return
  clearAuthToken()
}

const handleApiError = (error: AxiosError): void => {
  if (error.response?.status === 401) {
    handleUnauthorized()
  } else if (error.response?.status === 403) {
    console.error('Access forbidden')
  } else if (error.response && error.response.status >= 500) {
    console.error('Server error:', error.response.status)
  }
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
        config.headers = setRequestHeader(config.headers, 'Authorization', `Bearer ${token}`)
      }

      const countryId = await resolveCountryId()
      if (countryId) {
        config.headers = setRequestHeader(config.headers, COUNTRY_ID_HEADER, countryId)
      }

      
      if (config.headers) {
        const configLocale = config.params?.locale || config.headers['X-Locale']
        
        if (configLocale) {
          config.headers['Accept-Language'] = getAcceptLanguageHeader(configLocale)
        } else {
          const currentLocale = typeof window !== 'undefined' 
            ? window.location.pathname.split('/')[1] 
            : 'az'
          
          const validLocales = ['az', 'en', 'tr', 'ru']
          const locale = validLocales.includes(currentLocale) ? currentLocale : 'az'
          config.headers['Accept-Language'] = getAcceptLanguageHeader(locale)
        }
      }

      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      handleApiError(error)
      return Promise.reject(error)
    }
  )
}

setupInterceptors()

export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await client.get<T>(url, config)
  return response.data
}

export const post = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  const response = await client.post<T>(url, data, config)
  return response.data
}

/** Multipart — interceptor `Content-Type`-u silir ki, boundary avtomatik qoyulsun */
export const postForm = async <T>(
  url: string,
  data: FormData,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await client.post<T>(url, data, config)
  return response.data
}

export const put = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  const response = await client.put<T>(url, data, config)
  return response.data
}

export const patch = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  const response = await client.patch<T>(url, data, config)
  return response.data
}

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
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
