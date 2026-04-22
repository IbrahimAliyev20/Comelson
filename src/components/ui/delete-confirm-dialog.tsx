'use client'

import { Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

export type DeleteConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  cancelLabel?: string
  confirmLabel?: string
  confirmPending?: boolean
  onConfirm: () => void
}

/** Figma 747:38014 — silmə təsdiqi modalı */
export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  cancelLabel = 'Ləğv et',
  confirmLabel = 'Sil',
  confirmPending = false,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !confirmPending) onOpenChange(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, confirmPending, onOpenChange])

  if (!mounted || !open) return null

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Bağla"
        disabled={confirmPending}
        className="absolute inset-0 bg-black/40 disabled:pointer-events-none"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
        className="relative w-full max-w-[400px] overflow-hidden rounded-xl border border-[#ebf0f7] bg-white shadow-[0px_16px_32px_0px_rgba(0,0,0,0.12)]"
      >
        <div className="flex w-full flex-col shadow-[1px_1px_4px_0px_rgba(0,0,0,0.06)]">
          <div className="flex justify-end pr-5 pt-5">
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-full border border-[#ebf0f7] bg-[#fafdff] text-[#1d212a] transition-opacity hover:opacity-80 disabled:pointer-events-none disabled:opacity-50"
              aria-label="Bağla"
              disabled={confirmPending}
              onClick={() => onOpenChange(false)}
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="flex flex-col items-center gap-8 px-5 pb-5">
            <div className="flex w-full flex-col items-center gap-6">
              <div className="flex items-center justify-center rounded-[40px] bg-[#fff6f6] p-5">
                <Trash2 className="size-8 text-[#ff3b30]" strokeWidth={1.5} aria-hidden />
              </div>
              <p
                id="delete-confirm-title"
                className="max-w-[342px] text-center text-xl font-medium leading-7 text-[#1d212a]"
              >
                {title}
              </p>
            </div>

            <div className="flex w-full gap-8">
              <button
                type="button"
                disabled={confirmPending}
                className={cn(
                  'inline-flex h-12 min-h-12 flex-1 cursor-pointer items-center justify-center rounded-2xl bg-[#eaf1fa] px-6 text-base font-medium leading-6 text-[#32393f] transition-colors hover:bg-[#dfe9f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f477d]/25 disabled:pointer-events-none disabled:opacity-60'
                )}
                onClick={() => onOpenChange(false)}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                disabled={confirmPending}
                className="inline-flex h-12 min-h-12 flex-1 cursor-pointer items-center justify-center rounded-xl bg-[#ff3b30] px-6 text-base font-medium leading-6 text-white transition-colors hover:bg-[#e6352b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b30]/40 disabled:opacity-60"
                onClick={() => onConfirm()}
              >
                {confirmPending ? 'Silinir…' : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
