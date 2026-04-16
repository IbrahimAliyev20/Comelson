'use client'

import { ArrowLeft, ArrowRight, Pencil } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

/** Hesab məlumatları — Figma (Info bloku: avatar, ad, email, yadda saxla) */
export default function İnfoAccount() {
  const [fullName, setFullName] = useState('Aysun Feyzullayeva')
  const [email, setEmail] = useState('aysunfeyzullayevauix@gmail.com')

  return (
    <div className="flex flex-col gap-8">
      <div className="relative size-[120px] shrink-0">
        <div
          className="flex size-full items-center justify-center rounded-full border border-[#eaf1fa] bg-[#e6eff6] text-[32px] font-medium leading-10 text-[#6b6e71]"
          aria-hidden
        >
          AF
        </div>
        <button
          type="button"
          aria-label="Profil şəklini dəyişdirin"
          className="absolute -right-0.5 -top-1 flex size-8 items-center justify-center rounded-full border border-[#e6eff6] bg-white p-1.5 text-[#6b6e71] shadow-sm transition-opacity hover:opacity-90"
        >
          <Pencil className="size-5" aria-hidden />
        </button>
      </div>

      <div className="flex w-full max-w-full flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="px-1 text-sm leading-6 text-[#1d212a]">Ad, soyad</span>
          <input
            type="text"
            name="fullName"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={cn(
              'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 text-sm text-[#1d212a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10',
              fullName ? 'font-medium' : 'font-normal'
            )}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="px-1 text-sm leading-6 text-[#1d212a]">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              'h-12 w-full rounded-lg border border-[#ebeff4] bg-[#f4fafd] px-4 text-sm text-[#1d212a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]/40 focus:ring-4 focus:ring-[#0f477d]/10',
              email ? 'font-medium' : 'font-normal'
            )}
          />
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-[#0f477d] px-6 text-base font-medium leading-6 text-white transition-opacity hover:opacity-95 sm:gap-4"
        >
          <span>Dəyişiklikləri yadda saxla</span>
        </button>
      </div>
    </div>
  )
}
