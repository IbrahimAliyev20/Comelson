'use client'

import Image from 'next/image'
import { Copy, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

function tenderShareUrlFromEnv(slug: string): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  return env ? `${env}/tenders/${slug}` : ''
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

export type TenderSharePopoverProps = {
  slug: string
  tenderTitle: string
}

export function TenderSharePopover({ slug, tenderTitle }: TenderSharePopoverProps) {
  const [open, setOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState(() => tenderShareUrlFromEnv(slug))

  useEffect(() => {
    const fromEnv = tenderShareUrlFromEnv(slug)
    if (fromEnv) {
      setShareUrl(fromEnv)
      return
    }
    setShareUrl(`${window.location.origin}/tenders/${slug}`)
  }, [slug])

  const encodedShareUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(tenderTitle)

  const socialLinks = useMemo(
    () => ({
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedTitle}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${tenderTitle} ${shareUrl}`)}`,
    }),
    [encodedShareUrl, encodedTitle, shareUrl, tenderTitle]
  )

  async function copyLink() {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link kopyalandı')
    } catch {
      toast.error('Kopyalama alınmadı')
    }
  }

  async function shareWithSystemShare() {
    if (!shareUrl) return
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: tenderTitle, url: shareUrl })
        return
      } catch {
        /* dismissed or failed */
      }
    }
    await copyLink()
  }

  const socialBtnClass =
    'cursor-pointer inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e6eff6] text-[#0f477d] transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f477d]/25'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[26px] bg-[#e6eff6] p-1.5 text-[#0f477d] transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f477d]/25"
          aria-label="Paylaş"
        >
          <Image src="/icons/share.svg" alt="" width={20} height={20} aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-[min(calc(100vw-2rem),398px)] rounded-lg border border-[#eaf1fa] bg-white p-0 shadow-[0px_2px_4px_0px_#efefef]"
      >
        <div className="flex w-full flex-col border border-[#f3f2f8] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between border-b border-[#f3f2f8] px-6 py-4">
            <p className="text-xl font-medium leading-7 text-[#1d212a]">Paylaşın</p>
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-full border border-[#ebf0f7] bg-[#fafdff] text-[#1d212a] transition-opacity hover:opacity-80"
              aria-label="Bağla"
              onClick={() => setOpen(false)}
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="flex flex-col gap-6 px-6 py-5">
            <div className="flex flex-col gap-3">
              <p className="pl-1 text-sm font-medium leading-5 text-[#1d212a]">
                Linki paylaşın
              </p>
              <div className="flex items-center gap-[8px] rounded-lg border border-[#b5b8bb] px-[16px] py-[14px]">
                <p className="min-w-0 flex-1 truncate text-sm font-normal leading-5 text-[#1d212a]">
                  {shareUrl || '…'}
                </p>
                <button
                  type="button"
                  className="shrink-0 text-[#0f477d] transition-opacity hover:opacity-80"
                  aria-label="Linki kopyala"
                  onClick={() => void copyLink()}
                >
                  <Copy className="size-5" aria-hidden />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium leading-5 text-[#1d212a]">
                Sosial media linkləri
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={shareUrl ? socialLinks.facebook : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialBtnClass}
                  aria-label="Facebook-da paylaş"
                  onClick={(e) => {
                    if (!shareUrl) e.preventDefault()
                  }}
                >
                  <Image
                    src="/icons/brand-facebook.svg"
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden
                  />
                </a>
                <button
                  type="button"
                  className={socialBtnClass}
                  aria-label="Instagram / sistem paylaşımı"
                  onClick={() => void shareWithSystemShare()}
                >
                  <InstagramGlyph className="size-5" />
                </button>
                <a
                  href={shareUrl ? socialLinks.x : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialBtnClass}
                  aria-label="X-də paylaş"
                  onClick={(e) => {
                    if (!shareUrl) e.preventDefault()
                  }}
                >
                  <Image
                    src="/icons/brand-x.svg"
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden
                  />
                </a>
                <button
                  type="button"
                  className={socialBtnClass}
                  aria-label="TikTok / sistem paylaşımı"
                  onClick={() => void shareWithSystemShare()}
                >
                  <TikTokGlyph className="size-5" />
                </button>
                <a
                  href={shareUrl ? socialLinks.whatsapp : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialBtnClass}
                  aria-label="WhatsApp-da paylaş"
                  onClick={(e) => {
                    if (!shareUrl) e.preventDefault()
                  }}
                >
                  <Image
                    src="/icons/brand-whatsapp.svg"
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
