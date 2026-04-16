'use server'

import axios from 'axios'
import { cookies } from 'next/headers'

import {
  postForgotPassword,
  postLogin,
  postRegister,
  postResendOtp,
  postResetPassword,
  postVerifyOtp,
} from './api'
import {
  type ChangePasswordResponse,
  type UpdateProfileResponse,
  changePasswordRequestSchema,
  forgotPasswordRequestSchema,
  loginRequestSchema,
  registerRequestSchema,
  resendOtpRequestSchema,
  resetPasswordRequestSchema,
  updateProfileRequestSchema,
  verifyOtpRequestSchema,
} from './types'

const ACCESS_COOKIE = 'access_token'

const COOKIE_MAX_AGE_SESSION = 60 * 60 * 24
const COOKIE_MAX_AGE_REMEMBER = 60 * 60 * 24 * 30
/** OTP sonrası qeydiyyat — uzun sessiya */
const COOKIE_MAX_AGE_AFTER_VERIFY = COOKIE_MAX_AGE_REMEMBER

type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; details?: unknown }

function toActionError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as { message?: string } | undefined
    if (data?.message && typeof data.message === 'string') {
      return data.message
    }
  }
  return e instanceof Error ? e.message : 'request_failed'
}

async function setAccessTokenCookie(token: string, maxAge: number) {
  const jar = await cookies()
  jar.set(ACCESS_COOKIE, token, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
    maxAge,
  })
}

/** POST /auth/login */
export async function loginAction(
  input: unknown
): Promise<ActionResult<Awaited<ReturnType<typeof postLogin>>>> {
  const parsed = loginRequestSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'validation', details: parsed.error.flatten() }
  }

  try {
    const res = await postLogin(parsed.data)
    const token = res.token

    if (token) {
      const maxAge = parsed.data.remember_me
        ? COOKIE_MAX_AGE_REMEMBER
        : COOKIE_MAX_AGE_SESSION
      await setAccessTokenCookie(token, maxAge)
    }

    return { ok: true, data: res }
  } catch (e) {
    return { ok: false, error: toActionError(e), details: undefined }
  }
}

/** POST /auth/register — cookie qoyulmur; OTP gözlənilir */
export async function registerAction(
  input: unknown
): Promise<ActionResult<Awaited<ReturnType<typeof postRegister>>>> {
  const parsed = registerRequestSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'validation', details: parsed.error.flatten() }
  }

  try {
    const res = await postRegister(parsed.data)
    return { ok: true, data: res }
  } catch (e) {
    return { ok: false, error: toActionError(e), details: undefined }
  }
}

/** POST /auth/verify-otp — token cookie-yə yazılır */
export async function verifyOtpAction(
  input: unknown
): Promise<ActionResult<Awaited<ReturnType<typeof postVerifyOtp>>>> {
  const parsed = verifyOtpRequestSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'validation', details: parsed.error.flatten() }
  }

  try {
    const res = await postVerifyOtp(parsed.data)
    const token = res.token

    if (parsed.data.type === 'register' && token) {
      await setAccessTokenCookie(token, COOKIE_MAX_AGE_AFTER_VERIFY)
    }

    return { ok: true, data: res }
  } catch (e) {
    return { ok: false, error: toActionError(e), details: undefined }
  }
}

/** POST /auth/forgot-password */
export async function forgotPasswordAction(
  input: unknown
): Promise<ActionResult<Awaited<ReturnType<typeof postForgotPassword>>>> {
  const parsed = forgotPasswordRequestSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'validation', details: parsed.error.flatten() }
  }

  try {
    const res = await postForgotPassword(parsed.data)
    return { ok: true, data: res }
  } catch (e) {
    return { ok: false, error: toActionError(e), details: undefined }
  }
}

/**
 * POST /auth/change-password — serverdə `cookies()` ilə Bearer token göndərilir
 * (`@/lib/api` client tərəfdə işləyir; server action-da ayrıca fetch).
 */
export async function changePasswordAction(
  input: unknown
): Promise<ActionResult<ChangePasswordResponse>> {
  const parsed = changePasswordRequestSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'validation', details: parsed.error.flatten() }
  }

  const jar = await cookies()
  const token = jar.get(ACCESS_COOKIE)?.value
  if (!token) {
    return { ok: false, error: 'Sessiya tapılmadı. Yenidən daxil olun.' }
  }

  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '')
  if (!base) {
    return { ok: false, error: 'NEXT_PUBLIC_API_BASE_URL təyin edilməyib' }
  }

  try {
    const res = await fetch(`${base}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(parsed.data),
    })

    const data = (await res.json().catch(() => ({}))) as {
      message?: string
    }

    if (!res.ok) {
      const msg =
        typeof data?.message === 'string' ? data.message : `Xəta ${res.status}`
      return { ok: false, error: msg, details: undefined }
    }

    return {
      ok: true,
      data: {
        message:
          typeof data?.message === 'string'
            ? data.message
            : 'Şifrə yeniləndi.',
      },
    }
  } catch (e) {
    return { ok: false, error: toActionError(e), details: undefined }
  }
}

/** POST /auth/reset-password — şifrə bərpası axını (OTP reset təsdiqindən sonra) */
export async function resetPasswordAction(
  input: unknown
): Promise<ActionResult<Awaited<ReturnType<typeof postResetPassword>>>> {
  const parsed = resetPasswordRequestSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'validation', details: parsed.error.flatten() }
  }

  try {
    const res = await postResetPassword(parsed.data)
    return { ok: true, data: res }
  } catch (e) {
    return { ok: false, error: toActionError(e), details: undefined }
  }
}

/** POST /auth/resend-otp — yeni OTP emailə göndərilir */
export async function resendOtpAction(
  input: unknown
): Promise<ActionResult<Awaited<ReturnType<typeof postResendOtp>>>> {
  const parsed = resendOtpRequestSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'validation', details: parsed.error.flatten() }
  }

  try {
    const res = await postResendOtp(parsed.data)
    return { ok: true, data: res }
  } catch (e) {
    return { ok: false, error: toActionError(e), details: undefined }
  }
}

/**
 * POST /auth/logout — serverdə `cookies()` ilə Bearer token (Postman ilə eyni).
 * Axios client tərəfdə cookie oxuyur; server action-da `fetch`.
 */
export async function logoutAction(): Promise<ActionResult<null>> {
  const jar = await cookies()
  const token = jar.get(ACCESS_COOKIE)?.value
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '')

  if (token && base) {
    try {
      await fetch(`${base}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      })
    } catch {
      /* şəbəkə / API xətası — cookie yenə də silinir */
    }
  }

  jar.delete(ACCESS_COOKIE)

  return { ok: true, data: null }
}

/**
 * POST /auth/profile/update — multipart (name, image?), serverdə Bearer token ilə `fetch`.
 */
export async function updateProfileAction(
  formData: FormData
): Promise<ActionResult<UpdateProfileResponse>> {
  const nameRaw = formData.get('name')
  const image = formData.get('image')

  const parsed = updateProfileRequestSchema.safeParse({
    name: typeof nameRaw === 'string' ? nameRaw : '',
  })
  if (!parsed.success) {
    return { ok: false, error: 'validation', details: parsed.error.flatten() }
  }

  const jar = await cookies()
  const token = jar.get(ACCESS_COOKIE)?.value
  if (!token) {
    return { ok: false, error: 'Sessiya tapılmadı. Yenidən daxil olun.' }
  }

  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '')
  if (!base) {
    return { ok: false, error: 'NEXT_PUBLIC_API_BASE_URL təyin edilməyib' }
  }

  const fd = new FormData()
  fd.append('name', parsed.data.name)
  if (image instanceof File && image.size > 0) {
    fd.append('image', image)
  }

  try {
    const res = await fetch(`${base}/auth/profile/update`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    })

    const raw = (await res.json().catch(() => ({}))) as {
      message?: string
      user?: {
        id?: number
        name?: string
        email?: string
        image?: string | null
      }
    }

    if (!res.ok) {
      const msg =
        typeof raw?.message === 'string' ? raw.message : `Xəta ${res.status}`
      return { ok: false, error: msg, details: undefined }
    }

    const u = raw.user
    const idNum =
      u && (typeof u.id === 'number' || typeof u.id === 'string')
        ? Number(u.id)
        : NaN
    const user =
      u &&
      Number.isFinite(idNum) &&
      typeof u.name === 'string' &&
      typeof u.email === 'string'
        ? {
            id: idNum,
            name: u.name,
            email: u.email,
            image:
              u.image === undefined || u.image === null ? null : String(u.image),
          }
        : undefined

    return {
      ok: true,
      data: {
        message:
          typeof raw?.message === 'string' ? raw.message : 'Profil yeniləndi.',
        user,
      },
    }
  } catch (e) {
    return { ok: false, error: toActionError(e), details: undefined }
  }
}
