'use server'

import axios from 'axios'

import { post, postForm } from '@/lib/api'
import {
  COOKIE_MAX_AGE_REMEMBER,
  COOKIE_MAX_AGE_SESSION,
  clearAccessTokenCookieServer,
  setAccessTokenCookieServer,
} from '@/lib/auth/cookies'

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

/** OTP success → long session. */
const COOKIE_MAX_AGE_AFTER_VERIFY = COOKIE_MAX_AGE_REMEMBER

type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; details?: unknown }

function toActionError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const data = e.response?.data as { message?: string } | undefined
    if (data?.message && typeof data.message === 'string') return data.message
  }
  return e instanceof Error ? e.message : 'request_failed'
}

// ─── /auth/login ────────────────────────────────────────────────────────────
export async function loginAction(
  input: unknown
): Promise<ActionResult<Awaited<ReturnType<typeof postLogin>>>> {
  const parsed = loginRequestSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'validation', details: parsed.error.flatten() }
  }

  try {
    const res = await postLogin(parsed.data)

    if (!res?.token) {
      return {
        ok: false,
        error: res?.message || 'Login uğursuz oldu. Yenidən cəhd edin.',
      }
    }

    const maxAge = parsed.data.remember_me
      ? COOKIE_MAX_AGE_REMEMBER
      : COOKIE_MAX_AGE_SESSION
    await setAccessTokenCookieServer(res.token, { maxAge })

    return { ok: true, data: res }
  } catch (e) {
    return { ok: false, error: toActionError(e) }
  }
}

// ─── /auth/register ─────────────────────────────────────────────────────────
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
    return { ok: false, error: toActionError(e) }
  }
}

// ─── /auth/verify-otp ───────────────────────────────────────────────────────
export async function verifyOtpAction(
  input: unknown
): Promise<ActionResult<Awaited<ReturnType<typeof postVerifyOtp>>>> {
  const parsed = verifyOtpRequestSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'validation', details: parsed.error.flatten() }
  }

  try {
    const res = await postVerifyOtp(parsed.data)

    if (parsed.data.type === 'register') {
      if (!res?.token) {
        return {
          ok: false,
          error: res?.message || 'OTP təsdiqi uğursuz oldu.',
        }
      }
      await setAccessTokenCookieServer(res.token, {
        maxAge: COOKIE_MAX_AGE_AFTER_VERIFY,
      })
    }

    return { ok: true, data: res }
  } catch (e) {
    return { ok: false, error: toActionError(e) }
  }
}

// ─── /auth/forgot-password ──────────────────────────────────────────────────
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
    return { ok: false, error: toActionError(e) }
  }
}

// ─── /auth/reset-password ───────────────────────────────────────────────────
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
    return { ok: false, error: toActionError(e) }
  }
}

// ─── /auth/resend-otp ───────────────────────────────────────────────────────
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
    return { ok: false, error: toActionError(e) }
  }
}

// ─── /auth/change-password (uses shared axios client) ───────────────────────
export async function changePasswordAction(
  input: unknown
): Promise<ActionResult<ChangePasswordResponse>> {
  const parsed = changePasswordRequestSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'validation', details: parsed.error.flatten() }
  }

  try {
    const res = await post<ChangePasswordResponse>(
      '/auth/change-password',
      parsed.data
    )
    return {
      ok: true,
      data: {
        message:
          typeof res?.message === 'string' ? res.message : 'Şifrə yeniləndi.',
      },
    }
  } catch (e) {
    return { ok: false, error: toActionError(e) }
  }
}

// ─── /auth/logout (uses shared axios client) ────────────────────────────────
export async function logoutAction(): Promise<ActionResult<null>> {
  try {
    await post<unknown>('/auth/logout', {})
  } catch {
    /* network / API errors are non-fatal — local cookie is still cleared */
  }
  await clearAccessTokenCookieServer()
  return { ok: true, data: null }
}

// ─── /auth/profile/update (multipart, shared axios client) ──────────────────
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

  const fd = new FormData()
  fd.append('name', parsed.data.name)
  if (image instanceof File && image.size > 0) {
    fd.append('image', image)
  }

  try {
    const raw = await postForm<{
      message?: string
      user?: {
        id?: number | string
        name?: string
        email?: string
        image?: string | null
      }
    }>('/auth/profile/update', fd)

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
              u.image === undefined || u.image === null
                ? null
                : String(u.image),
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
    return { ok: false, error: toActionError(e) }
  }
}
