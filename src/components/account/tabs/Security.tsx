'use client'

import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { type FormEvent, useState, useTransition } from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { changePasswordAction } from '@/services/auth/serveractions'

type SecurityProps = {
  /** POST /auth/change-password — GET /auth/profile-dan email */
  userEmail: string
}

/** Təhlükəsizlik — cari/yeni şifrə + təsdiq; POST /auth/change-password */
export default function Security({ userEmail }: SecurityProps) {
  const [isPending, startTransition] = useTransition()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const canSubmit =
    userEmail.trim().length > 0 &&
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit || isPending) return

    setFormError(null)
    startTransition(async () => {
      const result = await changePasswordAction({
        email: userEmail.trim(),
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      })

      if (result.ok) {
        toast.success(result.data.message)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        return
      }

      if (result.error === 'validation') {
        const msg = 'Məlumatları yoxlayın (şifrələr eyni olmalı, yeni caridən fərqli)'
        setFormError(msg)
        toast.error(msg)
        return
      }

      setFormError(result.error)
      toast.error(result.error)
    })
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate>


      {formError ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {formError}
        </p>
      ) : null}

      <div className="flex w-full max-w-full flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="px-1 text-sm leading-6 text-[#1d212a]">Cari şifrə</span>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              name="currentPassword"
              autoComplete="current-password"
              placeholder="Cari şifrənizi daxil edin"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={cn(
                'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 pr-11 text-sm text-[#1d212a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10',
                currentPassword ? 'font-medium' : 'font-normal'
              )}
            />
            <button
              type="button"
              aria-label={showCurrent ? 'Şifrəni gizlət' : 'Şifrəni göstər'}
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#6b6e71] transition-opacity hover:opacity-80"
            >
              {showCurrent ? (
                <EyeOff className="h-5 w-5" aria-hidden />
              ) : (
                <Eye className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="px-1 text-sm leading-6 text-[#1d212a]">Yeni şifrə</span>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              name="newPassword"
              autoComplete="new-password"
              placeholder="Yeni şifrənizi daxil edin"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={cn(
                'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 pr-11 text-sm text-[#1d212a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10',
                newPassword ? 'font-medium' : 'font-normal'
              )}
            />
            <button
              type="button"
              aria-label={showNew ? 'Şifrəni gizlət' : 'Şifrəni göstər'}
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#6b6e71] transition-opacity hover:opacity-80"
            >
              {showNew ? (
                <EyeOff className="h-5 w-5" aria-hidden />
              ) : (
                <Eye className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="px-1 text-sm leading-6 text-[#1d212a]">
            Yeni şifrənin təkrarı
          </span>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Şifrənizi təkrar daxil edin"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={cn(
                'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 pr-11 text-sm text-[#1d212a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10',
                confirmPassword ? 'font-medium' : 'font-normal'
              )}
            />
            <button
              type="button"
              aria-label={showConfirm ? 'Şifrəni gizlət' : 'Şifrəni göstər'}
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#6b6e71] transition-opacity hover:opacity-80"
            >
              {showConfirm ? (
                <EyeOff className="h-5 w-5" aria-hidden />
              ) : (
                <Eye className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!canSubmit || isPending}
          aria-disabled={!canSubmit || isPending}
          className={cn(
            'inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0f477d] px-6 text-base font-medium leading-6 text-white transition-opacity hover:opacity-95 disabled:opacity-50',
            isPending && 'cursor-wait'
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden />
              Gözləyin…
            </>
          ) : (
            <span>Şifrəni yenilə</span>
          )}
        </button>
      </div>
    </form>
  )
}
