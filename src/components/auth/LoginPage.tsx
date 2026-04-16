'use client'

import { Check, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isRemember, setIsRemember] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const canSubmit = email.trim().length > 0 && password.trim().length > 0

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-[490px]">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <h2 className="text-[40px] font-semibold leading-[56px] text-[#14171a]">
                  Daxil olun
                </h2>
                <p className="text-base leading-6 text-[#6b6e71]">
                  Qeydiyyatdan keçmiş olduğunuz e-poçt ünvanı və şifrənizi daxil
                  edin.
                </p>
              </div>

              <form className="flex w-full flex-col gap-12">
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="px-1 text-sm leading-6 text-[#1d212a]">
                      Email
                    </span>
                    <input
                      type="email"
                      placeholder="Email adresinizi daxil edin"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(
                        'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 text-sm text-[#1d212a] outline-none placeholder:text-[#6b7277] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10',
                        email ? 'font-medium' : 'font-normal'
                      )}
                    />
                  </label>

                  <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-2">
                      <span className="px-1 text-sm leading-6 text-[#1d212a]">
                        Şifrə
                      </span>
                      <div className="relative">
                        <input
                          type={isPasswordVisible ? 'text' : 'password'}
                          placeholder="Şifrənizi daxil edin"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={cn(
                            'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 pr-11 text-sm text-[#1d212a] outline-none placeholder:text-[#6b6e71] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10',
                            password ? 'font-medium' : 'font-normal'
                          )}
                        />
                        <button
                          type="button"
                          aria-label={
                            isPasswordVisible
                              ? 'Hide password'
                              : 'Show password'
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

                    <div className="flex items-center justify-between px-2">
                      <label className="inline-flex cursor-pointer items-center gap-2">
                        <span
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-[4px] border',
                            isRemember
                              ? 'border-[#0f477d] bg-[#0f477d]'
                              : 'border-[#889097] bg-transparent'
                          )}
                          aria-hidden
                        >
                          {isRemember ? <Check className="h-4 w-4 text-white" /> : null}
                        </span>
                        <input
                          type="checkbox"
                          checked={isRemember}
                          onChange={(e) => setIsRemember(e.target.checked)}
                          className="sr-only"
                        />
                        <span className="text-xs leading-4 text-[#32393f]">
                          Yadda saxla
                        </span>
                      </label>

                      <Link
                        href="/forgetpassword"
                        className="text-xs leading-4 text-[#32393f] underline decoration-solid underline-offset-2"
                      >
                        Şifrəmi unutdum?
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-9">
                  <button
                    type="button"
                    disabled={!canSubmit}
                    aria-disabled={!canSubmit}
                    className={cn(
                      'inline-flex h-12 w-full items-center justify-center gap-4 rounded-2xl px-6 text-base font-medium leading-6 transition-colors',
                      canSubmit
                        ? 'bg-[#0f477d] text-white'
                        : 'bg-[#889097] text-[#dadee2]'
                    )}
                  >
                    Daxil ol
                  </button>

                  <div className="flex items-start gap-2 text-base leading-6">
                    <span className="text-[#64717c]">Hesabınız yoxdur?</span>
                    <Link
                      href="/register"
                      className="font-medium text-[#0f477d] underline underline-offset-2"
                    >
                      Qeydiyyatdan keçin
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
    </AuthSplitLayout>
  )
}
