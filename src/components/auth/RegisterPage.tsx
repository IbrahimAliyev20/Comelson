'use client'

import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  authFormFlexGrow,
  authMainMobileStickyFooter,
  authMobileCtaCluster,
  authPageColumn,
  authUpperBlockGrow,
} from '@/components/auth/auth-layout-classes'
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import { Link, useRouter } from '@/i18n/navigation'
import { OTP_FLOW_REGISTER, buildOtpSearchParams } from '@/lib/auth/otp-flow'
import { cn } from '@/lib/utils'
import { registerAction } from '@/services/auth/serveractions'

type RegisterFormValues = {
  fullName: string
  email: string
  password: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const { register, watch, handleSubmit } = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  })

  const fullName = watch('fullName')
  const email = watch('email')
  const password = watch('password')
  const canSubmit =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length >= 8

  function submit(values: RegisterFormValues) {
    if (!canSubmit || isPending) return

    setFormError(null)
    startTransition(async () => {
      const result = await registerAction({
        name: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      })

      if (result.ok) {
        toast.success(result.data.message)
        router.push(
          `/otp?${buildOtpSearchParams(result.data.email, OTP_FLOW_REGISTER)}`
        )
        return
      }

      if (result.error === 'validation') {
        const msg = 'Məlumatları düzgün daxil edin (şifrə ən azı 8 simvol)'
        setFormError(msg)
        toast.error(msg)
        return
      }

      setFormError(result.error)
      toast.error(result.error)
    })
  }

  return (
    <AuthSplitLayout mainClassName={authMainMobileStickyFooter}>
      <div className={authPageColumn}>
        <div className="flex min-h-0 flex-1 flex-col gap-6 sm:gap-8 md:gap-10 md:flex-none">
          <div className="flex flex-col gap-3 sm:gap-4">
            <h2 className="text-2xl font-semibold leading-8 text-[#14171a] sm:text-[28px] sm:leading-9 md:text-[40px] md:leading-[56px]">
              Qeydiyyatdan keçin
            </h2>
            <p className="max-w-[461px] text-base leading-6 text-[#6b6e71]">
              Aşağıdakı məlumatları daxil edin, email adresinizə təsdiq kodu
              göndəriləcək.
            </p>
          </div>

          <form
            className={cn(authFormFlexGrow, 'gap-8 sm:gap-10 md:gap-12')}
            onSubmit={handleSubmit(submit)}
            noValidate
          >
            <div className={cn(authUpperBlockGrow, 'gap-4')}>
              {formError ? (
                <p
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                  role="alert"
                >
                  {formError}
                </p>
              ) : null}

              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-2">
                  <span className="px-1 text-sm leading-6 text-[#1d212a]">
                    Ad, soyad
                  </span>
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Ad və soyadınızı daxil edin"
                    {...register('fullName')}
                    className="h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 text-sm text-[#1d212a] outline-none placeholder:text-[#6b7277] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="px-1 text-sm leading-6 text-[#1d212a]">
                    Email
                  </span>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="Email adresinizi daxil edin"
                    {...register('email')}
                    className="h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 text-sm text-[#1d212a] outline-none placeholder:text-[#6b7277] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="px-1 text-sm leading-6 text-[#1d212a]">
                    Şifrə
                  </span>
                  <div className="relative">
                    <input
                      type={isPasswordVisible ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Şifrənizi daxil edin"
                      {...register('password')}
                      className="h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 pr-11 text-sm text-[#1d212a] outline-none placeholder:text-[#6b6e71] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10"
                    />
                    <button
                      type="button"
                      aria-label={
                        isPasswordVisible ? 'Hide password' : 'Show password'
                      }
                      onClick={() => setIsPasswordVisible((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6e71] transition-opacity hover:opacity-80"
                    >
                      {isPasswordVisible ? (
                        <EyeOff className="h-5 w-5" aria-hidden />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden />
                      )}
                    </button>
                  </div>
                </label>
              </div>
            </div>

            <div className={authMobileCtaCluster}>
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
                    <Loader2
                      className="size-5 shrink-0 animate-spin"
                      aria-hidden
                    />
                    <span>Gözləyin...</span>
                  </>
                ) : (
                  <span className="min-w-0 text-center">
                    Qeydiyyatdan keçin
                  </span>
                )}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-2 text-center text-base leading-6">
                <span className="text-[#64717c]">Hesabınız var?</span>
                <Link
                  href="/login"
                  className="font-medium text-[#0f477d] underline underline-offset-2"
                >
                  Daxil olun
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthSplitLayout>
  )
}
