'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

type EventShareLinksProps = {
  locale: string
  slug: string
  title: string
}

import { IconFacebook } from '@/../public/iconssvg/İconFacebook'
import { IconTelegram } from '@/../public/iconssvg/IconTelegram'
import { IconWhatsapp } from '@/../public/iconssvg/IconWhatsapp'
import { IconX } from '@/../public/iconssvg/IconX'

export default function EventShareLinks({
  locale,
  slug,
  title,
}: EventShareLinksProps) {
  const t = useTranslations('common')
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
      <span className="text-sm leading-5">{t('actions.shareWithLabel')}</span>
      <div className="flex items-center gap-1.5">
        <a
          className="hover:opacity-70"
          href={shareUrls.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('share.whatsappLabel')}
        >
          <IconWhatsapp width={16} height={16} aria-hidden />
        </a>
        <a
          className="hover:opacity-70"
          href={shareUrls.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('share.telegramLabel')}
        >
          <IconTelegram width={16} height={16} aria-hidden  />
        </a>
        <a
          className="hover:opacity-70"
          href={shareUrls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('share.facebookLabel')}
        >
          <IconFacebook width={16} height={16} aria-hidden />
        </a>
        <a
          className="hover:opacity-70"
          href={shareUrls.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('share.xLabel')}
        >
          <IconX width={16} height={16} aria-hidden />
        </a>
      </div>
    </div>
  )
}
