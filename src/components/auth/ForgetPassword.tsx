'use client'

import { ChevronLeft, Loader2 } from 'lucide-react'
import { type FormEvent, useState, useTransition } from 'react'
import { toast } from 'sonner'

import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import { Link, useRouter } from '@/i18n/navigation'
import { OTP_FLOW_FORGOT_PASSWORD, buildOtpSearchParams } from '@/lib/auth/otp-flow'
import { cn } from '@/lib/utils'
import { forgotPasswordAction } from '@/services/auth/serveractions'

export default function ForgetPasswordPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const canSubmit = email.trim().length > 0

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit || isPending) return

    setFormError(null)
    startTransition(async () => {
      const result = await forgotPasswordAction({ email: email.trim() })

      if (result.ok) {
        toast.success(result.data.message)
        router.push(
          `/otp?${buildOtpSearchParams(result.data.email, OTP_FLOW_FORGOT_PASSWORD)}`
        )
        return
      }

      if (result.error === 'validation') {
        const msg = 'Düzgün email daxil edin'
        setFormError(msg)
        toast.error(msg)
        return
      }

      setFormError(result.error)
      toast.error(result.error)
    })
  }

  return (
    <AuthSplitLayout mainClassName="items-start justify-center py-6 sm:py-8">
      <div className="flex h-full w-full max-w-[490px] flex-col justify-around pb-0 md:pb-25 gap-8">
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
            onSubmit={handleSubmit}
            noValidate
          >
            {formError ? (
              <p
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                role="alert"
              >
                {formError}
              </p>
            ) : null}

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
              disabled={!canSubmit || isPending}
              aria-disabled={!canSubmit || isPending}
              className={cn(
                'inline-flex h-12 w-full min-w-0 items-center justify-center gap-2 rounded-2xl px-4 text-base font-medium leading-6 transition-colors sm:gap-4 sm:px-6',
                canSubmit && !isPending
                  ? 'bg-[#0f477d] text-white hover:bg-[#0c3a66]'
                  : 'bg-[#889097] text-[#dadee2]',
                isPending && 'cursor-wait'
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden />
                  Gözləyin…
                </>
              ) : (
                <span className="min-w-0 text-center">Davam et</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </AuthSplitLayout>
  )
}
