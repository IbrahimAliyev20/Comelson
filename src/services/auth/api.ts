import { del, get, post, postForm } from '@/lib/api'

import type {
  ApiAuthResponse,
  AuthProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdateProfileResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from './types'


export function getAuthApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!base || typeof base !== 'string') {
    throw new Error('NEXT_PUBLIC_API_BASE_URL təyin edilməyib')
  }
  return base.replace(/\/$/, '')
}

export const AUTH_API_PREFIX = '/auth'

const path = (segment: string) => `${AUTH_API_PREFIX}${segment}`

export async function postLogin(body: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>(path('/login'), body)
}

export async function postRegister(
  body: RegisterRequest
): Promise<RegisterResponse> {
  return post<RegisterResponse>(path('/register'), body)
}

export async function postVerifyOtp(
  body: VerifyOtpRequest
): Promise<VerifyOtpResponse> {
  return post<VerifyOtpResponse>(path('/verify-otp'), body)
}

export async function postResendOtp(
  body: ResendOtpRequest
): Promise<ResendOtpResponse> {
  return post<ResendOtpResponse>(path('/resend-otp'), body)
}

export async function postForgotPassword(
  body: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  return post<ForgotPasswordResponse>(path('/forgot-password'), body)
}

export async function postResetPassword(
  body: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  return post<ResetPasswordResponse>(path('/reset-password'), body)
}

export async function postChangePassword(
  body: ChangePasswordRequest
): Promise<ChangePasswordResponse> {
  return post<ChangePasswordResponse>(path('/change-password'), body)
}

export async function postLogout(): Promise<ApiAuthResponse<null>> {
  return post<ApiAuthResponse<null>>(path('/logout'), {})
}

export async function getProfile(): Promise<AuthProfileResponse> {
  return get<AuthProfileResponse>(path('/profile'))
}

export async function postUpdateProfile(
  body: FormData
): Promise<UpdateProfileResponse> {
  return postForm<UpdateProfileResponse>(path('/profile/update'), body)
}

export async function deleteSession(): Promise<ApiAuthResponse<null>> {
  return del<ApiAuthResponse<null>>(path('/session'))
}
