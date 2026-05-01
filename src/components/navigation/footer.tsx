'use client'

import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { Link } from '@/i18n/navigation'
import { getContactQuery, getSocialMediaQuery } from '@/services/contact/queries'
import { getSettingsQuery } from '@/services/settings/queries'
import { heroNavigationItems } from '@/utils/static'

import Container from '../shared/container'

type FooterNavItem = { href: string; labelKey: string }

function getFooterNavItems(): FooterNavItem[] {
  const items: FooterNavItem[] = []

  for (const item of heroNavigationItems) {
    if (item.key === 'about' && item.hasDropdown) {
      items.push(
        { href: '/about', labelKey: 'aboutDropdown.about' },
        { href: '/success-stories', labelKey: 'aboutDropdown.successStories' },
        { href: '/partnership', labelKey: 'aboutDropdown.partnership' }
      )
      continue
    }

    items.push({ href: item.href, labelKey: `heroNav.${item.key}` })
  }

  return items
}

const FOOTER_NAV_ITEMS = getFooterNavItems()

export function Footer() {
  const locale = useLocale()
  const tNav = useTranslations('navigation')
  const tFooter = useTranslations('footer')

  const { data: settingsResponse } = useQuery(getSettingsQuery(locale))
  const siteFooterLogoSrc = settingsResponse?.siteFooterLogo || '/images/Logo.svg'
  const { data: socialMediaResponse } = useQuery(getSocialMediaQuery(locale))
  const socialMedia = socialMediaResponse?.data ?? []
  const { data: contactResponse } = useQuery(getContactQuery(locale))
  const contact = contactResponse?.data

  const footerNavSplitIndex = Math.ceil(FOOTER_NAV_ITEMS.length / 2)
  const footerNavColumns = useMemo(() => {
    return {
      left: FOOTER_NAV_ITEMS.slice(0, footerNavSplitIndex),
      right: FOOTER_NAV_ITEMS.slice(footerNavSplitIndex),
    }
  }, [footerNavSplitIndex])

  return (
    <footer className="bg-white pt-8 sm:pt-10">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-8">
            <Link href="/" className="inline-flex items-center">
              <Image
                src={siteFooterLogoSrc}
                alt={tFooter('logoAlt')}
                width={170}
                height={56}
                priority
              />
            </Link>

            <div className="flex flex-col gap-4">
              <p className="text-[14px] leading-5 text-[#8E8E93]">{tFooter('followUs')}</p>
              <div className="flex items-center gap-2 sm:gap-4">
                {socialMedia.map((item, index) => (
                  <Link
                    key={`${item.link}-${index}`}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.link}
                    className="group inline-flex rounded-full p-2 text-black transition-all hover:bg-[#e6eff6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f477d]/40 focus-visible:ring-offset-2"
                  >
                    <Image
                      src={item.image}
                      alt=""
                      width={24}
                      height={24}
                      className="transition-[filter,transform] duration-200 group-hover:scale-110 group-active:scale-95 group-hover:[filter:brightness(0)_saturate(100%)_invert(19%)_sepia(78%)_saturate(1738%)_hue-rotate(182deg)_brightness(93%)_contrast(93%)]"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10 md:flex-row md:gap-28">
            <div className="flex flex-col gap-6">
              <h3 className="px-2 text-[16px] font-medium leading-6 text-black">{tFooter('links')}</h3>
              <div className="grid grid-cols-2 gap-x-8">
                <ul className="flex flex-col gap-2">
                  {footerNavColumns.left.map(({ href, labelKey }) => (
                    <li key={`${href}-${labelKey}`} className="px-2">
                      <Link
                        href={href}
                        className="text-[14px] font-medium leading-5 text-[#8E8E93] transition-colors hover:text-[#0f477d]"
                      >
                        {tNav(labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-col gap-2">
                  {footerNavColumns.right.map(({ href, labelKey }) => (
                    <li key={`${href}-${labelKey}`} className="px-2">
                      <Link
                        href={href}
                        className="text-[14px] font-medium leading-5 text-[#8E8E93] transition-colors hover:text-[#0f477d]"
                      >
                        {tNav(labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="px-2 text-[16px] font-medium leading-6 text-black">{tFooter('contact')}</h3>
              <div className="flex flex-col gap-2">
                {contact?.address ? (
                  <p className="px-2 text-[14px] font-medium leading-5 text-[#8E8E93]">{contact.address}</p>
                ) : null}
                {contact?.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="px-2 text-[14px] font-medium leading-5 text-[#8E8E93] transition-colors hover:text-black"
                  >
                    {contact.email}
                  </a>
                ) : null}
                {contact?.phone ? (
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                    className="px-2 text-[14px] font-medium leading-5 text-[#8E8E93] transition-colors hover:text-black"
                  >
                    {contact.phone}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="mt-10 h-px w-full bg-[#F3F2F8]" />

      <Container>
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-black">
            <span className="flex size-6 items-center justify-center rounded-full border border-black text-[12px] leading-none">
              &copy;
            </span>
            <p className="text-center text-[14px] leading-5">{tFooter('copyright')}</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
