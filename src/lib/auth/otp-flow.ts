/** Query `flow` on `/otp` — keeps register vs forgot-password navigation separate. */
export const OTP_FLOW_REGISTER = 'register' as const
export const OTP_FLOW_FORGOT_PASSWORD = 'forgot-password' as const

export type OtpFlow = typeof OTP_FLOW_REGISTER | typeof OTP_FLOW_FORGOT_PASSWORD

export function buildOtpSearchParams(email: string, flow: OtpFlow): string {
  const q = new URLSearchParams()
  q.set('flow', flow)
  q.set('email', email.trim())
  return q.toString()
}
