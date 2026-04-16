import {
  OTP_FLOW_FORGOT_PASSWORD,
  OTP_FLOW_REGISTER,
  type OtpFlow,
} from './otp-flow'

/**
 * Backend `POST /auth/resend-otp` gözləyir:
 * - qeydiyyat: `register`
 * - şifrə unutma: `forgot-password`
 */
export function getResendOtpApiType(
  flow: OtpFlow
): 'register' | 'forgot-password' {
  return flow === OTP_FLOW_REGISTER ? 'register' : 'forgot-password'
}

/**
 * Backend `POST /auth/verify-otp` gözləyir:
 * - qeydiyyat: `register` (token + user)
 * - şifrə bərpası: `reset` (yalnız mesaj)
 */
export function getVerifyOtpApiType(flow: OtpFlow): 'register' | 'reset' {
  return flow === OTP_FLOW_REGISTER ? 'register' : 'reset'
}
