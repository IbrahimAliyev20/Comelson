'use client'

import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'

import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import { Link, useRouter } from '@/i18n/navigation'
import { OTP_FLOW_FORGOT_PASSWORD, buildOtpSearchParams } from '@/lib/auth/otp-flow'
import { cn } from '@/lib/utils'

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('')
  const canSubmit = email.trim().length > 0
  const router = useRouter()

  return (
    <AuthSplitLayout mainClassName="items-start justify-center py-6 sm:py-8">
      <div className="flex w-full max-w-[490px] flex-col justify-around h-full gap-8">
        <div>
          <Link
            href="/login"
            className="inline-flex w-fit items-center gap-3 rounded-xl px-1 py-2 text-base font-medium leading-6 text-[#64717c]"
          >
            <ChevronLeft className="h-6 w-6 shrink-0" aria-hidden />
            Geri
          </Link>
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-[40px] font-semibold leading-[56px] text-[#14171a]">
              Şifrəmi unutmuşam
            </h2>
            <p className="max-w-[461px] text-base leading-6 text-[#6b6e71]">
              Zəhmət olmasa qeydiyyatdan keçdiyiniz email adresini daxil edin, sizə
              təsdiq kodu göndəriləcək.
            </p>
          </div>

          <form
            className="flex w-full flex-col gap-12"
            onSubmit={(e) => {
              e.preventDefault()
              if (!canSubmit) return
              router.push(
                `/otp?${buildOtpSearchParams(email, OTP_FLOW_FORGOT_PASSWORD)}`
              )
            }}
          >
            <label className="flex flex-col gap-2">
              <span className="px-1 text-sm leading-6 text-[#1d212a]">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email adresinizi daxil edin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 text-sm text-[#1d212a] outline-none placeholder:text-[#6b7277] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10',
                  email ? 'font-medium' : 'font-normal'
                )}
              />
            </label>

            <button
              type="submit"
              disabled={!canSubmit}
              aria-disabled={!canSubmit}
              className={cn(
                'inline-flex h-12 w-full min-w-0 items-center justify-center gap-3 rounded-2xl px-4 text-base font-medium leading-6 transition-colors sm:gap-4 sm:px-6',
                canSubmit
                  ? 'bg-[#0f477d] text-white'
                  : 'bg-[#889097] text-[#dadee2]'
              )}
            >
              <span className="min-w-0 text-center">Davam et</span>
            </button>
          </form>
        </div>
      </div>
    </AuthSplitLayout>
  )
}
