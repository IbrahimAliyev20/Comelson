'use client'

import { Check, ChevronLeft, Eye, EyeOff, Loader2, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  authFormFlexGrow,
  authMainMobileStickyFooter,
  authMobileStickySubmit,
  authPageColumn,
  authUpperBlockGrow,
} from '@/components/auth/auth-layout-classes'
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import { Link, useRouter } from '@/i18n/navigation'
import {
  OTP_FLOW_FORGOT_PASSWORD,
  OTP_FLOW_REGISTER,
  buildOtpSearchParams,
  type OtpFlow,
} from '@/lib/auth/otp-flow'
import { cn } from '@/lib/utils'
import { resetPasswordAction } from '@/services/auth/serveractions'

function resolveFlow(flowParam: string | null): OtpFlow {
  return flowParam === OTP_FLOW_FORGOT_PASSWORD
    ? OTP_FLOW_FORGOT_PASSWORD
    : OTP_FLOW_REGISTER
}

function meetsPasswordRules(value: string): boolean {
  if (value.length === 0) return false
  return getPasswordFeedbackMessages(value).length === 0
}

function getPasswordFeedbackMessages(value: string): string[] {
  if (value.length === 0) return []

  const messages: string[] = []

  if (value.length < 8 || value.length > 12) {
    messages.push(
      `Şifrə 8-12 simvol arasında olmalıdır (indiki: ${value.length} simvol).`
    )
  }

  if (!/[A-Z]/.test(value)) {
    messages.push('Ən azı bir böyük hərf (A-Z) daxil edin.')
  }

  if (!/[a-z]/.test(value)) {
    messages.push('Ən azı bir kiçik hərf (a-z) daxil edin.')
  }

  if (!/\d/.test(value)) {
    messages.push('Ən azı bir rəqəm daxil edin.')
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    messages.push('Ən azı bir xüsusi simvol (!, @, #, * və s.) daxil edin.')
  }

  return messages
}

type NewPasswordFormValues = {
  password: string
  confirmPassword: string
}

export default function NewPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const flow = resolveFlow(searchParams.get('flow'))
  const email = searchParams.get('email')?.trim() ?? ''
  const backToOtpHref = `/otp?${buildOtpSearchParams(email, flow)}`
  const isForgotPasswordFlow = flow === OTP_FLOW_FORGOT_PASSWORD

  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const { register, watch, handleSubmit } = useForm<NewPasswordFormValues>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  useEffect(() => {
    if (!showSuccess) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [showSuccess])

  useEffect(() => {
    if (!showSuccess) return
    const id = window.setTimeout(() => {
      closeSuccessAndGoToLogin()
    }, 4500)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess])

  function closeSuccessAndGoToLogin() {
    setShowSuccess(false)
    router.push('/login')
  }

  const passwordFeedback = useMemo(
    () => getPasswordFeedbackMessages(password),
    [password]
  )

  const canSubmit = useMemo(() => {
    if (password !== confirmPassword) return false
    return meetsPasswordRules(password)
  }, [password, confirmPassword])

  function submit(values: NewPasswordFormValues) {
    if (!canSubmit || isPending) return

    if (!isForgotPasswordFlow) {
      toast.error('Bu səhifə yalnız şifrə bərpası axını üçündür.')
      return
    }

    if (!email) {
      toast.error('Email tapılmadı. OTP addımına qayıdın.')
      return
    }

    setFormError(null)
    startTransition(async () => {
      const result = await resetPasswordAction({
        email,
        new_password: values.password,
        new_password_confirmation: values.confirmPassword,
      })

      if (result.ok) {
        setSuccessMessage(result.data.message)
        setShowSuccess(true)
        return
      }

      if (result.error === 'validation') {
        const msg = 'Məlumatları yoxlayın (şifrələr eyni olmalıdır)'
        setFormError(msg)
        toast.error(msg)
        return
      }

      setFormError(result.error)
      toast.error(result.error)
    })
  }

  const confirmMismatch =
    confirmPassword.length > 0 && password !== confirmPassword

  return (
    <>
      <AuthSplitLayout mainClassName={authMainMobileStickyFooter}>
        <div className={cn(authPageColumn, 'gap-4 sm:gap-6 md:pb-25')}>
          <Link
            href={backToOtpHref}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl px-1 py-1 text-base font-medium leading-6 text-[#64717c] sm:gap-3 sm:py-2"
          >
            <ChevronLeft className="h-6 w-6 shrink-0" aria-hidden />
            Geri
          </Link>

          <form
            className={cn(authFormFlexGrow, 'gap-6 sm:gap-8')}
            onSubmit={handleSubmit(submit)}
            noValidate
          >
            <div className={cn(authUpperBlockGrow, 'gap-6 sm:gap-8')}>
              {formError ? (
                <p
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                  role="alert"
                >
                  {formError}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 sm:gap-4">
                <h2 className="text-2xl font-semibold leading-8 text-[#14171a] sm:text-[28px] sm:leading-9">
                  Yeni şifrə
                </h2>
                <ul className="list-disc space-y-1.5 pl-6 text-base leading-6 text-[#64717c]">
                  <li>Şifrəniz 8-12 simvoldan ibarət olmalıdır.</li>
                  <li>
                    Böyük və kiçik hərflər, rəqəmlər və xüsusi simvollardan
                    istifadə edin.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-2">
                  <span className="px-1 text-sm leading-6 text-[#1d212a]">
                    Yeni şifrə
                  </span>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNew ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Yeni şifrənizi daxil edin"
                      {...register('password')}
                      aria-invalid={passwordFeedback.length > 0}
                      aria-describedby={
                        passwordFeedback.length > 0
                          ? 'new-password-feedback'
                          : undefined
                      }
                      className={cn(
                        'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 pr-11 text-sm text-[#1d212a] outline-none placeholder:text-[#6b6e71] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10',
                        password ? 'font-medium' : 'font-normal',
                        passwordFeedback.length > 0 &&
                          'border-red-300 focus:border-red-400 focus:ring-red-200'
                      )}
                    />
                    <button
                      type="button"
                      aria-label={
                        showNew ? 'Hide password' : 'Show password'
                      }
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6e71] transition-opacity hover:opacity-80"
                    >
                      {showNew ? (
                        <EyeOff className="h-5 w-5" aria-hidden />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden />
                      )}
                    </button>
                  </div>
                  {passwordFeedback.length > 0 ? (
                    <ul
                      id="new-password-feedback"
                      className="mt-2 list-none space-y-1.5 px-1 text-sm leading-5 text-red-600"
                      role="status"
                      aria-live="polite"
                    >
                      {passwordFeedback.map((msg) => (
                        <li key={msg}>{msg}</li>
                      ))}
                    </ul>
                  ) : null}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="px-1 text-sm leading-6 text-[#1d212a]">
                    Şifrənin təkrarı
                  </span>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Şifrənizi təkrar daxil edin"
                      {...register('confirmPassword')}
                      aria-invalid={confirmMismatch}
                      aria-describedby={
                        confirmMismatch
                          ? 'confirm-password-feedback'
                          : undefined
                      }
                      className={cn(
                        'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 pr-11 text-sm text-[#1d212a] outline-none placeholder:text-[#6b6e71] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10',
                        confirmPassword ? 'font-medium' : 'font-normal',
                        confirmMismatch &&
                          'border-red-300 focus:border-red-400 focus:ring-red-200'
                      )}
                    />
                    <button
                      type="button"
                      aria-label={
                        showConfirm ? 'Hide password' : 'Show password'
                      }
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6e71] transition-opacity hover:opacity-80"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-5 w-5" aria-hidden />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden />
                      )}
                    </button>
                  </div>
                  {confirmMismatch ? (
                    <p
                      id="confirm-password-feedback"
                      className="mt-2 px-1 text-sm leading-5 text-red-600"
                      role="status"
                      aria-live="polite"
                    >
                      Daxil etdiyiniz şifrələr üst-üstə düşmür.
                    </p>
                  ) : null}
                </label>
              </div>
            </div>

            <div className={authMobileStickySubmit}>
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
                    Gözləyin...
                  </>
                ) : (
                  <span className="min-w-0 text-center">Şifrəni yenilə</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </AuthSplitLayout>

      {showSuccess ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Bağla"
            className="absolute inset-0 bg-black/40"
            onClick={closeSuccessAndGoToLogin}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-success-title"
            className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-xl border border-[#ebf0f7] bg-white shadow-[0px_16px_32px_0px_rgba(0,0,0,0.12)]"
          >
            <div className="flex flex-col items-end shadow-[1px_1px_4px_0px_rgba(0,0,0,0.06)]">
              <div className="flex w-full justify-end pr-5 pt-5">
                <button
                  type="button"
                  onClick={closeSuccessAndGoToLogin}
                  className="flex size-8 shrink-0 items-center justify-center rounded-[24px] border border-[#ebf0f7] bg-[#fafdff] text-[#32393f] transition-opacity hover:opacity-80"
                  aria-label="Bağla"
                >
                  <X className="size-5" strokeWidth={2} aria-hidden />
                </button>
              </div>
              <div className="flex w-full flex-col items-center gap-8 px-5 pb-12 pt-0">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex size-[72px] items-center justify-center rounded-full bg-[#e6eff6] p-2">
                    <div className="flex size-12 items-center justify-center rounded-full bg-[#0f477d]">
                      <Check
                        className="size-9 shrink-0 text-white"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                    </div>
                  </div>
                  <p
                    id="password-success-title"
                    className="text-center text-[18px] font-medium leading-6 text-[#1d212a]"
                  >
                    {successMessage || 'Şifrəniz uğurla yeniləndi.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
