'use client'

import { ChevronLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import { Link, useRouter } from '@/i18n/navigation'
import {
  OTP_FLOW_FORGOT_PASSWORD,
  OTP_FLOW_REGISTER,
  buildOtpSearchParams,
  type OtpFlow,
} from '@/lib/auth/otp-flow'
import { cn } from '@/lib/utils'

export default function OtpPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const flow = searchParams.get('flow')
  const isForgotPassword = flow === OTP_FLOW_FORGOT_PASSWORD
  const backHref = isForgotPassword ? '/forgetpassword' : '/register'
  const emailFromQuery = searchParams.get('email')?.trim() ?? ''
  const otpFlow: OtpFlow = isForgotPassword
    ? OTP_FLOW_FORGOT_PASSWORD
    : OTP_FLOW_REGISTER
  const otpLength = 6
  const [otp, setOtp] = useState<string[]>(Array.from({ length: otpLength }, () => ''))
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const [secondsLeft, setSecondsLeft] = useState(119)

  const canSubmit = useMemo(() => otp.every((x) => x.trim().length === 1), [otp])
  const displayTime = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
    const s = secondsLeft % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }, [secondsLeft])

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((v) => (v > 0 ? v - 1 : 0))
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  function focusIndex(nextIdx: number) {
    const el = inputsRef.current[nextIdx]
    el?.focus()
    el?.select?.()
  }

  function setAt(idx: number, value: string) {
    setOtp((prev) => {
      const next = [...prev]
      next[idx] = value
      return next
    })
  }

  function handleChange(idx: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    setAt(idx, digit)

    if (digit && idx < otpLength - 1) focusIndex(idx + 1)
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (otp[idx]) {
        setAt(idx, '')
        return
      }
      if (idx > 0) {
        focusIndex(idx - 1)
        setAt(idx - 1, '')
      }
    }

    if (e.key === 'ArrowLeft' && idx > 0) focusIndex(idx - 1)
    if (e.key === 'ArrowRight' && idx < otpLength - 1) focusIndex(idx + 1)
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text')
    const digits = text.replace(/\D/g, '').slice(0, otpLength).split('')
    if (!digits.length) return

    e.preventDefault()
    setOtp((prev) => {
      const next = [...prev]
      digits.forEach((d, i) => {
        next[i] = d
      })
      return next
    })

    focusIndex(Math.min(digits.length, otpLength - 1))
  }

  function handleResend() {
    setSecondsLeft(119)
  }

  function handleOtpConfirm() {
    if (!canSubmit) return
    router.push(`/new-password?${buildOtpSearchParams(emailFromQuery, otpFlow)}`)
  }

  return (
    <AuthSplitLayout mainClassName="items-start justify-center py-6 sm:py-8">
      <div className="w-full h-full  max-w-[498px] shrink-0">
        <div className=" h-full flex flex-col gap-8 justify-around">
          <Link
            href={backHref}
            className="inline-flex w-fit items-center gap-3 rounded-xl px-1 py-2 text-base font-medium leading-6 text-[#64717c]"
          >
            <ChevronLeft className="h-6 w-6 shrink-0" aria-hidden />
            Geri
          </Link>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-[40px] font-semibold leading-[56px] text-[#14171a]">
                OTP təsdiq
              </h2>
              <p className="max-w-[461px] text-base leading-6 text-[#6b6e71]">
                Zəhmət olmasa,{' '}
                <span className="font-medium text-[#14171a]">
                  {emailFromQuery || '—'}
                </span>{' '}
                email adresinə göndərilən OTP kodunu daxil edin.
              </p>
            </div>

            <div className="flex flex-col gap-12">
              <div className="flex flex-col items-center gap-9">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {otp.map((val, idx) => {
                    const isActive =
                      otp[idx] === '' && (idx === 0 || otp[idx - 1] !== '')

                    return (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputsRef.current[idx] = el
                        }}
                        inputMode="numeric"
                        autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                        aria-label={`OTP digit ${idx + 1}`}
                        value={val}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        onPaste={idx === 0 ? handlePaste : undefined}
                        className={cn(
                          'h-[60px] w-[64px] shrink-0 rounded-lg border bg-[#f4fafd] text-center text-[20px] font-medium leading-7 text-[#1d212a] outline-none',
                          isActive ? 'border-[#0f477d]' : 'border-[#ebeff4]'
                        )}
                        maxLength={1}
                      />
                    )
                  })}
                </div>

                <p className="text-sm font-medium leading-5 text-[#1d212a]">
                  {displayTime}
                </p>

                <div className="flex flex-wrap items-start justify-center gap-2 text-base leading-6">
                  <span className="text-[#64717c]">Kodu əldə etmədiniz?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    className="font-medium text-[#0f477d] underline underline-offset-2 disabled:opacity-50"
                    disabled={secondsLeft > 0}
                  >
                    Yenidən göndər
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled={!canSubmit}
                aria-disabled={!canSubmit}
                onClick={handleOtpConfirm}
                className={cn(
                  'inline-flex h-12 w-full min-w-0 items-center justify-center gap-3 rounded-2xl px-4 text-base font-medium leading-6 transition-colors sm:gap-4 sm:px-6',
                  canSubmit ? 'bg-[#0f477d] text-white' : 'bg-[#889097] text-[#dadee2]'
                )}
              >
                <span className="min-w-0 text-center">Təsdiq et</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthSplitLayout>
  )
}
