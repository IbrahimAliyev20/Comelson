'use client'

import Image from 'next/image'

import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useLocale } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { getSettingsQuery } from '@/services/settings/queries'

export const AUTH_HERO_IMAGE_SRC = '/images/herobg.jpg'
export const AUTH_LOGO_SRC = '/images/Logo.svg'

export const AUTH_HERO_TITLE = 'Biznesinizi Doğru İnsanlarla Birləşdirin'
export const AUTH_HERO_DESCRIPTION =
  'Comelson şirkətləri bir araya gətirərək əməkdaşlıq, tərəfdaşlıq və yeni imkanlar üçün güclü bir biznes şəbəkəsi yaradır.'

export interface AuthSplitLayoutProps {
  children: React.ReactNode
  mainClassName?: string
}

export function AuthSplitLayout({ children, mainClassName }: AuthSplitLayoutProps) {
  const locale = useLocale()
  const { data: settingsResponse } = useQuery(getSettingsQuery(locale))
  const mobileLogoSrc = settingsResponse?.siteLogo ?? AUTH_LOGO_SRC

  return (
    <section className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen w-full grid-cols-1 xl:grid-cols-[minmax(0,720px)_minmax(0,1fr)]">
        <aside className="relative hidden min-h-screen overflow-hidden xl:block">
          <Image
            src={AUTH_HERO_IMAGE_SRC}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="720px"
          />
          <div className="absolute inset-0 bg-[rgba(6,28,52,0.48)]" aria-hidden />

          <Link href="/" className="absolute left-[65px] top-[67px]">
            <Image
              src={AUTH_LOGO_SRC}
              alt="Comelson"
              width={200}
              height={56}
              priority
              className="h-14 w-auto"
            />
          </Link>

          <div className="absolute left-[65px] top-1/2 w-[592px] -translate-y-1/2">
            <div className="flex flex-col gap-7">
              <h1 className="text-balance text-[48px] font-semibold leading-[64px] text-white">
                {AUTH_HERO_TITLE}
              </h1>
              <p className="w-[520px] text-base leading-6 text-[#eaf1fa]">{AUTH_HERO_DESCRIPTION}</p>
            </div>
          </div>
        </aside>

        <main
          className={cn(
            'flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 md:px-10 lg:px-12',
            mainClassName
          )}
        >
          <div className="flex w-full max-w-[498px] flex-col">
            <div className="mb-6 flex items-center justify-center xl:hidden">
              <Link href="/" aria-label="Ana səhifə">
                <Image
                  src={mobileLogoSrc}
                  alt="Comelson"
                  width={160}
                  height={44}
                  priority
                  className="h-11 w-auto"
                />
              </Link>
            </div>

            {children}
          </div>
        </main>
      </div>
    </section>
  )
}
