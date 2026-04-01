import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Linkedin, Send, X } from 'lucide-react'

import Container from '../shared/container'

const NAV_LINKS = [
  'Haqqımızda',
  'Xidmətlər',
  'Üzvlər',
  'Xəbərlər',
  'Reklam və Medya',
  'Tərəfdaşlıq',
  'Uğur hekayələri',
  'Tender',
] as const

export function Footer() {
  return (
    <footer className="bg-white pt-14">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-8">
            <Link href="/" className="inline-flex items-center">
              <Image src="/images/Logo.svg" alt="Comelson" width={158} height={52} priority />
            </Link>

            <div className="flex flex-col gap-4">
              <p className="text-[14px] leading-5 text-[#8E8E93]">Bizi izləyin</p>
              <div className="flex items-center gap-6 text-black">
                <Link href="#" aria-label="Instagram" className="transition-opacity hover:opacity-70">
                  <Instagram className="h-6 w-6" />
                </Link>
                <Link href="#" aria-label="LinkedIn" className="transition-opacity hover:opacity-70">
                  <Linkedin className="h-6 w-6" />
                </Link>
                <Link href="#" aria-label="X" className="transition-opacity hover:opacity-70">
                  <X className="h-6 w-6" />
                </Link>
                <Link href="#" aria-label="Telegram" className="transition-opacity hover:opacity-70">
                  <Send className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10 md:flex-row md:gap-28">
            <div className="flex flex-col gap-6">
              <h3 className="px-2 text-[16px] font-medium leading-6 text-black">Keçidlər</h3>
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((label) => (
                  <li key={label} className="px-2">
                    <Link
                      href="#"
                      className="text-[14px] font-medium leading-5 text-[#8E8E93] transition-colors hover:text-black"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="px-2 text-[16px] font-medium leading-6 text-black">Əlaqə</h3>
              <div className="flex flex-col gap-2">
                <p className="px-2 text-[14px] font-medium leading-5 text-[#8E8E93]">Bakı, Azərabycan, Əhmədli</p>
                <Link
                  href="mailto:info@comelson.az"
                  className="px-2 text-[14px] font-medium leading-5 text-[#8E8E93] transition-colors hover:text-black"
                >
                  info@comelson.az
                </Link>
                <Link
                  href="tel:+994707777777"
                  className="px-2 text-[14px] font-medium leading-5 text-[#8E8E93] transition-colors hover:text-black"
                >
                  +994 70 777 77 77
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="mt-10 h-px w-full bg-[#F3F2F8]" />

      <Container>
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-black">
            <span className="flex size-6 items-center justify-center rounded-full border border-black text-[12px] leading-none">
              ©
            </span>
            <p className="text-[14px] leading-5">Copyright | All Rights Reserved</p>
          </div>

          <p className="text-[14px] leading-5 text-black md:text-right">
            <Link href="#" className="underline underline-offset-2">
              Markup Agency
            </Link>{' '}
            tərəfindən hazırlanmışdır.
          </p>
        </div>
      </Container>
    </footer>
  )
}
