'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

type EventShareLinksProps = {
  locale: string
  slug: string
  title: string
}

export default function EventShareLinks({
  locale,
  slug,
  title,
}: EventShareLinksProps) {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    setShareUrl(`${window.location.origin}/${locale}/events/${slug}`)
  }, [locale, slug])

  const shareUrls = useMemo(() => {
    if (!shareUrl) {
      return {
        whatsapp: '#',
        telegram: '#',
        facebook: '#',
        x: '#',
      }
    }

    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(title)

    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    }
  }, [shareUrl, title])

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-white px-2.5 py-2 text-sm leading-5 text-[#1d212a]">
      <span className="text-sm leading-5">PaylaÅŸ:</span>
      <div className="flex items-center gap-1.5">
        <a className="hover:opacity-70" href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <Image src="/icons/brand-whatsapp.svg" alt="WhatsApp" width={16} height={16} />
        </a>
        <a className="hover:opacity-70" href={shareUrls.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
          <Image src="/icons/brand-telegram.svg" alt="Telegram" width={16} height={16} />
        </a>
        <a className="hover:opacity-70" href={shareUrls.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <Image src="/icons/brand-facebook.svg" alt="Facebook" width={16} height={16} />
        </a>
        <a className="hover:opacity-70" href={shareUrls.x} target="_blank" rel="noopener noreferrer" aria-label="X">
          <Image src="/icons/brand-x.svg" alt="X" width={16} height={16} />
        </a>
      </div>
    </div>
  )
}
