'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Pencil } from 'lucide-react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'
import { toast } from 'sonner'

import { resolveAuthMediaUrl } from '@/lib/auth/resolve-media-url'
import { cn } from '@/lib/utils'
import { authKeys } from '@/services/auth/keys'
import type { AuthProfileUser } from '@/services/auth/types'
import { updateProfileAction } from '@/services/auth/serveractions'

type InfoAccountProps = {
  user: AuthProfileUser | null
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || '?'
}

/** Hesab məlumatları — GET /auth/profile; POST /auth/profile/update (multipart) */
export default function InfoAccount({
  user,
  isLoading,
  isError,
  onRetry,
}: InfoAccountProps) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [pendingImage, setPendingImage] = useState<File | null>(null)

  useEffect(() => {
    if (user) {
      setFullName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const serverAvatarUrl = useMemo(
    () => resolveAuthMediaUrl(user?.image ?? null),
    [user?.image]
  )

  const localPreviewUrl = useMemo(() => {
    if (!pendingImage) return null
    return URL.createObjectURL(pendingImage)
  }, [pendingImage])

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl)
    }
  }, [localPreviewUrl])

  const displayAvatarUrl = localPreviewUrl ?? serverAvatarUrl

  const canSave =
    fullName.trim().length >= 2 &&
    !isPending &&
    user != null &&
    (pendingImage != null ||
      fullName.trim() !== user.name.trim())

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="size-[120px] rounded-full bg-[#e6eff6]" />
        <div className="flex flex-col gap-4">
          <div className="h-12 rounded-lg bg-[#ebeff4]" />
          <div className="h-12 rounded-lg bg-[#ebeff4]" />
        </div>
        <div className="ml-auto h-12 w-48 rounded-2xl bg-[#e6eff6]" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-[#fde2e2] bg-[#fff5f5] px-4 py-3 text-sm text-[#9b2c2c]">
        <p>Profil məlumatları yüklənmədi. Yenidən cəhd edin.</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="self-start rounded-lg border border-current px-3 py-1.5 text-sm font-medium hover:opacity-90"
          >
            Yenidən yüklə
          </button>
        ) : null}
      </div>
    )
  }

  if (!user) {
    return null
  }

  function handleSave() {
    if (!canSave) return

    startTransition(async () => {
      const fd = new FormData()
      fd.append('name', fullName.trim())
      if (pendingImage) fd.append('image', pendingImage)

      const result = await updateProfileAction(fd)

      if (!result.ok) {
        if (result.error === 'validation') {
          toast.error('Ad ən azı 2 simvol olmalıdır.')
        } else {
          toast.error(result.error)
        }
        return
      }

      toast.success(result.data.message)
      setPendingImage(null)
      await queryClient.invalidateQueries({ queryKey: authKeys.profile() })
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) setPendingImage(f)
          e.target.value = ''
        }}
      />

      <div className="relative size-[120px] shrink-0">
        {displayAvatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayAvatarUrl}
            alt=""
            className="size-full rounded-full border border-[#eaf1fa] object-cover"
          />
        ) : (
          <div
            className="flex size-full items-center justify-center rounded-full border border-[#eaf1fa] bg-[#e6eff6] text-[32px] font-medium leading-10 text-[#6b6e71]"
            aria-hidden
          >
            {initialsFromName(fullName || user.name)}
          </div>
        )}
        <button
          type="button"
          aria-label="Profil şəklini dəyişdirin"
          onClick={() => fileInputRef.current?.click()}
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
            readOnly
            value={email}
            className={cn(
              'h-12 w-full cursor-not-allowed rounded-lg border border-[#ebeff4] bg-[#f0f3f6] px-4 text-sm text-[#565355] outline-none',
              email ? 'font-medium' : 'font-normal'
            )}
          />
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className="inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-2xl bg-[#0f477d] px-6 text-base font-medium leading-6 text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" aria-hidden />
          ) : null}
          <span>Dəyişiklikləri yadda saxla</span>
        </button>
      </div>
    </div>
  )
}
