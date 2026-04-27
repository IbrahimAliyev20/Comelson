'use client'

import Image from 'next/image'
import { Copy, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { IconFacebook } from '@/../public/iconssvg/İconFacebook'
import { IconInstagram } from '@/../public/iconssvg/İconİnstagram'
import { IconTiktok } from '@/../public/iconssvg/IconTiktok'
import { IconWhatsapp } from '@/../public/iconssvg/IconWhatsapp'
import { IconX } from '@/../public/iconssvg/IconX'

function tenderShareUrlFromEnv(slug: string): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  return env ? `${env}/tenders/${slug}` : ''
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
                  <IconFacebook width={20} height={20} aria-hidden />
                </a>
                <button
                  type="button"
                  className={socialBtnClass}
                  aria-label="Instagram / sistem paylaşımı"
                  onClick={() => void shareWithSystemShare()}
                >
                  <IconInstagram width={20} height={20} aria-hidden />
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
                  <IconX width={20} height={20} aria-hidden />
                </a>
                <button
                  type="button"
                  className={socialBtnClass}
                  aria-label="TikTok / sistem paylaşımı"
                  onClick={() => void shareWithSystemShare()}
                >
                  <IconTiktok width={20} height={20} aria-hidden />
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
                  <IconWhatsapp width={20} height={20} aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
