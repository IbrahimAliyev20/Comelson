'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

/** Təhlükəsizlik — Figma 456:7836 (avatar + cari/yeni şifrə + təsdiq) */
export default function Security() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="flex flex-col gap-8">
      <div
        className="flex size-[120px] shrink-0 items-center justify-center rounded-full border border-[#eaf1fa] bg-[#e6eff6] text-[32px] font-medium leading-10 text-[#6b6e71]"
        aria-hidden
      >
        AF
      </div>

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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6e71] transition-opacity hover:opacity-80"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6e71] transition-opacity hover:opacity-80"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6e71] transition-opacity hover:opacity-80"
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
          type="button"
          className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-[#0f477d] px-6 text-base font-medium leading-6 text-white transition-opacity hover:opacity-95 sm:gap-4"
        >
          <span>Şifrəni yenilə</span>
        </button>
      </div>
    </div>
  )
}
