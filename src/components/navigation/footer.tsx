'use client'

import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { getContactQuery, getSocialMediaQuery } from '@/services/contact/queries'
import { getSettingsQuery } from '@/services/settings/queries'

import Container from '../shared/container'

type FooterNavItem = { href: string; labelKey: string }

const FOOTER_NAV_COLUMNS: FooterNavItem[][] = [
  [
    { href: '/about', labelKey: 'aboutDropdown.about' },
    { href: '/partnership', labelKey: 'aboutDropdown.partnership' },
    { href: '/success-stories', labelKey: 'aboutDropdown.successStories' },
  ],
  [
    { href: '/tenders', labelKey: 'heroNav.tenders' },
    { href: '/events', labelKey: 'heroNav.events' },
    { href: '/news', labelKey: 'heroNav.news' },
  ],
  [
    { href: '/members', labelKey: 'heroNav.members' },
    { href: '/contact', labelKey: 'heroNav.contact' },
  ],
]

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

  return (
    <footer className="border-t border-[#F3F2F8] bg-white pt-12 sm:pt-16">
      <Container>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* Brand */}
          <div className="flex max-w-sm flex-col gap-6">
            <Link href="/" className="inline-flex items-center">
              <Image
                src={siteFooterLogoSrc}
                alt={tFooter('logoAlt')}
                width={170}
                height={56}
                priority
              />
            </Link>

            <p className="text-[14px] leading-6 text-[#8E8E93]">{tFooter('description')}</p>

            <div className="mt-2 flex flex-col gap-4">
              <p className="text-[14px] leading-5 text-[#8E8E93]">{tFooter('followUs')}</p>
              <div className="flex items-center gap-3">
                {socialMedia.map((item, index) => (
                  <Link
                    key={`${item.link}-${index}`}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.link}
                    className="group inline-flex size-10 items-center justify-center rounded-[10px]  text-[#0f477d] transition-all hover:border-[#0f477d]/40 hover:bg-[#e6eff6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f477d]/40 focus-visible:ring-offset-2"
                  >
                    <Image
                      src={item.image}
                      alt=""
                      width={20}
                      height={20}
                      className="transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Links + Contact */}
          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16 lg:gap-24">
            <div className="flex flex-col gap-7">
              <h3 className="text-[16px] font-medium leading-6 text-black">{tFooter('links')}</h3>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4 sm:grid-cols-3">
                {FOOTER_NAV_COLUMNS.map((column, columnIndex) => (
                  <ul key={columnIndex} className="flex flex-col gap-4">
                    {column.map(({ href, labelKey }) => (
                      <li key={`${href}-${labelKey}`}>
                        <Link
                          href={href}
                          className="text-[14px] leading-5 text-[#8E8E93] transition-colors hover:text-[#0f477d]"
                        >
                          {tNav(labelKey)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-7">
              <h3 className="text-[16px] font-medium leading-6 text-black">{tFooter('contact')}</h3>
              <div className="flex flex-col gap-4">
                {contact?.address ? (
                  <p className="text-[14px] leading-5 text-[#8E8E93]">{contact.address}</p>
                ) : null}
                {contact?.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[14px] leading-5 text-[#8E8E93] transition-colors hover:text-[#0f477d]"
                  >
                    {contact.email}
                  </a>
                ) : null}
                {contact?.phone ? (
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                    className="text-[14px] leading-5 text-[#8E8E93] transition-colors hover:text-[#0f477d]"
                  >
                    {contact.phone}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="mt-12 h-px w-full bg-[#F3F2F8]" />

      <Container>
        <div className="flex justify-center py-5">
          <div className="flex items-center gap-2 text-[#1c1c1e]">
            <span className="flex size-5 items-center justify-center rounded-full border border-[#1c1c1e] text-[11px] leading-none">
              &copy;
            </span>
            <p className="text-center text-[14px] leading-5">{tFooter('copyright')}</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
