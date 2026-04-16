'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import { Link, useRouter } from '@/i18n/navigation'
import { OTP_FLOW_REGISTER, buildOtpSearchParams } from '@/lib/auth/otp-flow'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const canSubmit =
    fullName.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0
  const router = useRouter()

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-[490px]">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <h2 className="text-[40px] font-semibold leading-[56px] text-[#14171a]">
                  Qeydiyyatdan keçin
                </h2>
                <p className="max-w-[461px] text-base leading-6 text-[#6b6e71]">
                  Aşağıdakı məlumatları daxil edin, email adresinizə təsdiq kodu
                  göndəriləcək.
                </p>
              </div>

              <form
                className="flex w-full flex-col gap-12"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!canSubmit) return
                  router.push(`/otp?${buildOtpSearchParams(email, OTP_FLOW_REGISTER)}`)
                }}
              >
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="px-1 text-sm leading-6 text-[#1d212a]">
                      Ad,soyad
                    </span>
                    <input
                      type="text"
                      name="fullName"
                      autoComplete="name"
                      placeholder="Ad və soyadınızı daxil edin"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 text-sm text-[#1d212a] outline-none placeholder:text-[#6b7277] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="px-1 text-sm leading-6 text-[#1d212a]">
                      Email
                    </span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="Email adresinizi daxil edin"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                        name="password"
                        autoComplete="new-password"
                        placeholder="Şifrənizi daxil edin"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                <div className="flex flex-col items-center gap-9">
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
                    <span className="min-w-0 text-center">Qeydiyyatdan keçin</span>
                  </button>

                  <div className="flex flex-wrap items-start gap-2 text-base leading-6">
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
