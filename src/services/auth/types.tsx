import { z } from 'zod'

import type { ApiResponse } from '@/types/types'

/** POST /auth/login — cavab */
export type LoginResponse = {
  message: string
  token: string
  user: AuthUser
}

export type AuthUser = {
  id: number
  name: string
  country_id: number
  email: string
  image?: string | null
}

/** GET /auth/profile — cavab */
export type AuthProfileUser = {
  id: number
  name: string
  email: string
  image: string | null
  country_id: number
}

export type AuthProfileResponse = {
  user: AuthProfileUser
}

/** POST /auth/profile/update — cavabda `user` həmişə olmaya bilər; uğurdan sonra profil refetch */
export type UpdateProfileResponse = {
  message: string
  user?: AuthProfileUser
}

/** POST /auth/login — sorğu */
export type LoginRequest = {
  email: string
  password: string
  remember_me: boolean
}

/** POST /auth/register — sorğu (Postman: name, email, password) */
export type RegisterRequest = {
  name: string
  email: string
  password: string
  country_id: number
}

/** POST /auth/register — cavab 201 */
export type RegisterResponse = {
  message: string
  email: string
}

/** Qeydiyyat OTP — verify + resend üçün API `type` */
export type OtpApiTypeRegister = 'register'

/** Şifrə bərpası — yalnız `POST /auth/verify-otp` üçün API `type` */
export type OtpApiTypeVerifyReset = 'reset'

/** Şifrə bərpası — yalnız `POST /auth/resend-otp` üçün API `type` */
export type OtpApiTypeResendForgot = 'forgot-password'

/** POST /auth/verify-otp — sorğu */
export type VerifyOtpRequest = {
  email: string
  otp: string
  type: OtpApiTypeRegister | OtpApiTypeVerifyReset
}

/**
 * POST /auth/verify-otp — cavab
 * - `type: register` → token + user
 * - `type: reset` → yalnız mesaj
 */
export type VerifyOtpResponse = {
  message: string
  token?: string
  user?: AuthUser
}

/** POST /auth/resend-otp — sorğu */
export type ResendOtpRequest = {
  email: string
  type: OtpApiTypeRegister | OtpApiTypeResendForgot
}

/** POST /auth/resend-otp — cavab (ümumi olaraq mesaj) */
export type ResendOtpResponse = {
  message: string
}

/** POST /auth/forgot-password — sorğu */
export type ForgotPasswordRequest = {
  email: string
}

/** POST /auth/forgot-password — cavab 200 */
export type ForgotPasswordResponse = {
  message: string
  email: string
}

/** POST /auth/reset-password — sorğu (OTP `reset` təsdiqindən sonra) */
export type ResetPasswordRequest = {
  email: string
  new_password: string
  new_password_confirmation: string
}

/** POST /auth/reset-password — cavab 200 */
export type ResetPasswordResponse = {
  message: string
}

/** POST /auth/change-password — daxil olunmuş istifadəçi (Bearer token) */
export type ChangePasswordRequest = {
  email: string
  current_password: string
  new_password: string
  new_password_confirmation: string
}

/** POST /auth/change-password — cavab 200 */
export type ChangePasswordResponse = {
  message: string
}

export type ApiAuthResponse<T> = ApiResponse<T>

const emailSchema = z.string().trim().email()

/**
 * Shared "strong" password rules used by register + reset-password flows.
 * Must match the UI rules in `NewPasswordPage` and backend expectations.
 */
export const strongPasswordSchema = z
  .string()
  .min(8, 'Şifrə ən azı 8 simvol olmalıdır')
  .max(12, 'Şifrə ən çox 12 simvol ola bilər')
  .regex(/[A-Z]/, 'Ən azı bir böyük hərf olmalıdır')
  .regex(/[a-z]/, 'Ən azı bir kiçik hərf olmalıdır')
  .regex(/\d/, 'Ən azı bir rəqəm olmalıdır')
  .regex(/[^A-Za-z0-9]/, 'Ən azı bir xüsusi simvol olmalıdır')

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
  remember_me: z.boolean(),
})

export const registerRequestSchema = z.object({
  name: z.string().trim().min(2),
  email: emailSchema,
  password: strongPasswordSchema,
  country_id: z.number().int().positive(),
})

export const verifyOtpRequestSchema = z.object({
  email: emailSchema,
  otp: z.string().regex(/^\d{6}$/),
  type: z.union([z.literal('register'), z.literal('reset')]),
})

export const resendOtpRequestSchema = z.object({
  email: emailSchema,
  type: z.union([z.literal('register'), z.literal('forgot-password')]),
})

export const forgotPasswordRequestSchema = z.object({
  email: emailSchema,
})

export const resetPasswordRequestSchema = z
  .object({
    email: emailSchema,
    new_password: strongPasswordSchema,
    new_password_confirmation: z.string().min(1),
  })
  .refine((d) => d.new_password === d.new_password_confirmation, {
    message: 'Şifrələr üst-üstə düşmür',
    path: ['new_password_confirmation'],
  })

export const updateProfileRequestSchema = z.object({
  name: z.string().trim().min(2),
})

export const changePasswordRequestSchema = z
  .object({
    email: emailSchema,
    current_password: z.string().min(1),
    new_password: strongPasswordSchema,
    new_password_confirmation: z.string().min(1),
  })
  .refine((d) => d.new_password === d.new_password_confirmation, {
    message: 'Yeni şifrələr üst-üstə düşmür',
    path: ['new_password_confirmation'],
  })
  .refine((d) => d.current_password !== d.new_password, {
    message: 'Yeni şifrə cari şifrədən fərqli olmalıdır',
    path: ['new_password'],
  })
