"use client"

import { ArrowRight, ChevronDown, LogIn, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'

import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { getProfileQuery } from '@/services/auth/queries'
import { getSettingsQuery } from '@/services/settings/queries'
import { heroNavigationItems } from '@/utils/static'

import Container from '../shared/container'
import LanguageSelector from '../shared/language-selector'
import { HeaderUserMenu, UserMenuPanel } from './header-user-menu'

export function Header() {
  const t = useTranslations('navigation')
  const pathname = usePathname()
  const locale = useLocale()
  const isHero = pathname === '/'
  const headerRef = useRef<HTMLElement | null>(null)
  const aboutDropdownRef = useRef<HTMLDivElement | null>(null)
  const [heroScrolled, setHeroScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false)
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false)
  const [hasTopHero, setHasTopHero] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const aboutCloseTimeoutRef = useRef<number | null>(null)

  const isGlassMode = hasTopHero || isHero
  const showHeroGlass = isGlassMode && !heroScrolled
  const showSpacer = !isGlassMode

  const { data: settingsResponse } = useQuery(getSettingsQuery(locale))
  const siteLogoSrc = settingsResponse?.siteLogo || '/images/Logo.svg'

  const { data: profileResponse, isSuccess: profileOk } = useQuery({
    ...getProfileQuery(),
    retry: false,
  })
  const profileUser = profileResponse?.user
  const isAuthed = profileOk && Boolean(profileUser)

  const spacerStyle = useMemo(() => {
    if (!showSpacer) return undefined
    return { height: headerHeight }
  }, [headerHeight, showSpacer])

  useEffect(() => {
    function resolveHeroEl() {
      return (
        document.getElementById('home-hero') ??
        document.getElementById('page-hero')
      )
    }

    function updatePastHero() {
      const hero = resolveHeroEl()
      if (!hero) {
        setHasTopHero(false)
        setHeroScrolled(false)
        return
      }
      setHasTopHero(true)
      const { bottom } = hero.getBoundingClientRect()
      setHeroScrolled(bottom <= 0)
    }

    updatePastHero()
    window.addEventListener('scroll', updatePastHero, { passive: true })
    window.addEventListener('resize', updatePastHero, { passive: true })
    return () => {
      window.removeEventListener('scroll', updatePastHero)
      window.removeEventListener('resize', updatePastHero)
    }
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsMobileAboutOpen(false)
    setIsAboutDropdownOpen(false)
  }, [pathname, locale])

  useEffect(() => {
    if (!isAboutDropdownOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsAboutDropdownOpen(false)
    }

    function handlePointerDown(e: PointerEvent) {
      const el = aboutDropdownRef.current
      if (!el) return
      if (e.target instanceof Node && el.contains(e.target)) return
      setIsAboutDropdownOpen(false)
    }

    function handleScroll() {
      setIsAboutDropdownOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isAboutDropdownOpen])

  useEffect(() => {
    return () => {
      if (aboutCloseTimeoutRef.current) {
        window.clearTimeout(aboutCloseTimeoutRef.current)
      }
    }
  }, [])

  const aboutDropdownItems = useMemo(() => {
    return [
      { key: 'about', href: '/about' },
      { key: 'successStories', href: '/success-stories' },
      { key: 'partnership', href: '/partnership' }
    ] as const
  }, [])

  /** Figma 90:2830 — Secondary (#e6eff6) + Primary (#0f477d) */
  const secondaryCtaClass =
    'inline-flex h-12 items-center justify-center gap-4 rounded-2xl bg-[#e6eff6] px-6 text-base font-medium leading-6 text-[#0f477d] transition-opacity hover:opacity-90'
  const primaryCtaClass =
    'inline-flex h-12 items-center justify-center gap-4 rounded-2xl bg-[#0f477d] px-6 text-base font-medium leading-6 text-white transition-opacity hover:opacity-90'

  function openAboutDropdown() {
    if (aboutCloseTimeoutRef.current) {
      window.clearTimeout(aboutCloseTimeoutRef.current)
      aboutCloseTimeoutRef.current = null
    }
    setIsAboutDropdownOpen(true)
  }

  function closeAboutDropdownSoon() {
    if (aboutCloseTimeoutRef.current) {
      window.clearTimeout(aboutCloseTimeoutRef.current)
    }

    aboutCloseTimeoutRef.current = window.setTimeout(() => {
      setIsAboutDropdownOpen(false)
      aboutCloseTimeoutRef.current = null
    }, 120)
  }

  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    function update() {
      const current = headerRef.current
      if (!current) return
      setHeaderHeight(current.getBoundingClientRect().height)
    }

    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update, { passive: true })

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [showHeroGlass, isMobileMenuOpen, locale, pathname])

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 w-full transition-[background-color,backdrop-filter,border-color,box-shadow] duration-200',
          showHeroGlass
            ? 'border-b border-white/10 bg-white/[0.08] backdrop-blur-[24px]'
            : isGlassMode
              ? 'border-b border-[#F1F2F6] bg-white/95 shadow-sm backdrop-blur-md'
              : 'border-b border-[#F1F2F6] bg-white'
        )}
      >
        <Container>
          <div
            className={cn(
              'flex items-center justify-between',
              showHeroGlass ? 'py-4' : 'py-[16px]'
            )}
          >
            <div className="flex min-w-0 items-center gap-8 lg:gap-[90px]">
              <Link href="/" className="shrink-0">
                <Image
                  src={siteLogoSrc}
                  alt="Comelson"
                  width={158}
                  height={52}
                  priority
                  className="h-9 w-auto md:h-[35px]"
                />
              </Link>

              <nav className="hidden lg:flex items-center gap-5" aria-label="Primary">
                {heroNavigationItems.map((item) => {
                  if (item.key !== 'about' || !item.hasDropdown) {
                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-1 text-sm font-normal leading-5 transition-colors hover:opacity-80',
                          showHeroGlass ? 'text-white' : 'text-[#14171A] hover:text-[#14171A]'
                        )}
                      >
                        {t(`heroNav.${item.key}`)}
                      </Link>
                    )
                  }

                  return (
                    <div
                      key={item.key}
                      ref={aboutDropdownRef}
                      className="relative"
                      onMouseEnter={openAboutDropdown}
                      onMouseLeave={closeAboutDropdownSoon}
                    >
                      <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={isAboutDropdownOpen}
                        onClick={() => setIsAboutDropdownOpen((v) => !v)}
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-1 text-sm font-normal leading-5 transition-colors hover:opacity-80',
                          showHeroGlass ? 'text-white' : 'text-[#14171A] hover:text-[#14171A]'
                        )}
                      >
                        {t('heroNav.about')}
                        <ChevronDown
                          className={cn(
                            'size-4 transition-transform',
                            isAboutDropdownOpen ? 'rotate-180' : 'rotate-0',
                            showHeroGlass ? 'opacity-90' : 'opacity-80'
                          )}
                          aria-hidden
                        />
                      </button>

                      {isAboutDropdownOpen ? (
                        <>
                          <div
                            aria-hidden
                            className="absolute left-0 top-full z-40 h-4 w-[320px]"
                          />
                          <div
                            role="menu"
                            className={cn(
                              'absolute left-0 top-full z-50 w-[320px] pt-3',
                              'animate-in fade-in-0 slide-in-from-top-2 duration-200',
                            )}
                          >
                            <div
                              className={cn(
                                'rounded-2xl border p-3 shadow-xl',
                                showHeroGlass ? 'border-white/10 bg-[#0D2C4A]/95 backdrop-blur-xl' : 'border-[#EAF1FA] bg-white'
                              )}
                            >
                              {aboutDropdownItems.map((dd) => (
                                <Link
                                  key={dd.key}
                                  href={dd.href}
                                  role="menuitem"
                                  className={cn(
                                    'flex w-full cursor-pointer items-center rounded-xl px-4 py-3 text-sm transition-colors',
                                    showHeroGlass
                                      ? 'text-white/90 hover:bg-white/10'
                                      : 'text-[#14171A]/80 hover:bg-black/5 hover:text-[#14171A]'
                                  )}
                                  onClick={() => setIsAboutDropdownOpen(false)}
                                >
                                  {t(`aboutDropdown.${dd.key}`)}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  )
                })}
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-3 lg:gap-5">
              <div className="hidden lg:block">
                <LanguageSelector variant={showHeroGlass ? "onDark" : "default"} />
              </div>

              <div
                className={cn(
                  'hidden h-6 w-px lg:block',
                  showHeroGlass ? 'bg-[#6b6e71]' : 'bg-[#e5e6e5]'
                )}
                aria-hidden
              />
              <div className="hidden items-center gap-5 lg:flex">
                {!isAuthed ? (
                  <>
                    <Link href="/login" className={secondaryCtaClass}>
                      <LogIn className="size-6 shrink-0" aria-hidden />
                      {t('loginCta')}
                    </Link>
                    <Link href="/register" className={primaryCtaClass}>
                      <span>{t('headerCta')}</span>
                      <ArrowRight className="size-5 shrink-0" aria-hidden />
                    </Link>
                  </>
                ) : profileUser ? (
                  <Suspense
                    fallback={
                      <div
                        className="size-11 shrink-0 animate-pulse rounded-full bg-white/20"
                        aria-hidden
                      />
                    }
                  >
                    <HeaderUserMenu user={profileUser} />
                  </Suspense>
                ) : null}
              </div>

              <button
                type="button"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-header-menu"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:hidden",
                  showHeroGlass
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-[#E5E6E5] bg-white text-[#161E17]"
                )}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </Container>

        {isMobileMenuOpen ? (
          <div
            id="mobile-header-menu"
            className={cn(
              'absolute inset-x-0 top-full shadow-xl backdrop-blur-xl lg:hidden',
              showHeroGlass
                ? 'border-t border-white/10 bg-[#0D2C4A]/95'
                : 'border-t border-[#F1F2F6] bg-white/95'
            )}
          >
            <Container className="px-4 py-4">
              <div className="flex flex-col gap-6">
                <nav className="flex flex-col gap-2" aria-label="Mobile primary">
                  {heroNavigationItems.map((item) => {
                    const label = t(`heroNav.${item.key}`)
                    const isActive = item.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.href)

                    if (item.key === 'about' && item.hasDropdown) {
                      return (
                        <div key={item.key} className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => setIsMobileAboutOpen((v) => !v)}
                            className={cn(
                              'flex items-center justify-between rounded-2xl px-3 py-3 text-sm leading-5 transition-colors',
                              showHeroGlass
                                ? isActive
                                  ? 'bg-white/12 font-medium text-white'
                                  : 'text-white/90 hover:bg-white/8'
                                : isActive
                                  ? 'bg-black/5 font-medium text-[#14171A]'
                                  : 'text-[#14171A]/80 hover:bg-black/5 hover:text-[#14171A]'
                            )}
                          >
                            <span>{label}</span>
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 transition-transform',
                                isMobileAboutOpen ? 'rotate-180' : 'rotate-0',
                                showHeroGlass ? 'opacity-80' : 'opacity-70'
                              )}
                            />
                          </button>

                          {isMobileAboutOpen ? (
                            <div className="mt-2 flex flex-col gap-1 rounded-2xl p-2">
                              {aboutDropdownItems.map((dd) => (
                                <Link
                                  key={dd.key}
                                  href={dd.href}
                                  className={cn(
                                    'rounded-xl px-3 py-2 text-sm transition-colors',
                                    showHeroGlass
                                      ? 'text-white/90 hover:bg-white/10'
                                      : 'text-[#14171A]/80 hover:bg-black/5 hover:text-[#14171A]'
                                  )}
                                >
                                  {t(`aboutDropdown.${dd.key}`)}
                                </Link>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      )
                    }

                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        className={cn(
                          'flex items-center justify-between rounded-2xl px-3 py-3 text-sm leading-5 transition-colors',
                          showHeroGlass
                            ? isActive
                              ? 'bg-white/12 font-medium text-white'
                              : 'text-white/90 hover:bg-white/8'
                            : isActive
                              ? 'bg-black/5 font-medium text-[#14171A]'
                              : 'text-[#14171A]/80 hover:bg-black/5 hover:text-[#14171A]'
                        )}
                      >
                        <span>{label}</span>
                        {item.hasDropdown ? (
                          <ChevronDown className={cn('h-4 w-4', showHeroGlass ? 'opacity-80' : 'opacity-70')} />
                        ) : null}
                      </Link>
                    )
                  })}
                </nav>

                <div className={cn('h-px', showHeroGlass ? 'bg-white/10' : 'bg-black/10')} />

                <div className="flex flex-col gap-3">
                  <div
                    className={cn(
                      'grid grid-cols-2 gap-2 rounded-2xl p-1',
                      showHeroGlass ? 'border border-white/10 bg-white/5' : 'border border-black/10 bg-black/[0.02]'
                    )}
                  >
                    {routing.locales.map((code) => (
                      <Link
                        key={code}
                        href={pathname}
                        locale={code}
                        className={cn(
                          "rounded-xl px-3 py-2 text-center text-sm transition-colors",
                          code === locale
                            ? showHeroGlass
                              ? "bg-white text-[#0f477d] font-medium"
                              : "bg-[#0f477d] text-white font-medium"
                            : showHeroGlass
                              ? "text-white/90 hover:bg-white/10"
                              : "text-[#14171A]/80 hover:bg-black/5 hover:text-[#14171A]"
                        )}
                      >
                        {code.toUpperCase()}
                      </Link>
                    ))}
                  </div>

                  {isAuthed && profileUser ? (
                    <div className="flex flex-col gap-3">
                      <Suspense
                        fallback={
                          <div
                            className="h-40 animate-pulse rounded-2xl bg-white/10"
                            aria-hidden
                          />
                        }
                      >
                        <UserMenuPanel
                          user={profileUser}
                          lightOnDark={showHeroGlass}
                          onNavigate={() => setIsMobileMenuOpen(false)}
                        />
                      </Suspense>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/login"
                        className={cn(
                          secondaryCtaClass,
                          'w-full text-sm sm:text-base'
                        )}
                      >
                        <LogIn className="size-5 shrink-0 sm:size-6" aria-hidden />
                        <span className="truncate">{t('loginCta')}</span>
                      </Link>
                      <Link
                        href="/contact"
                        className={cn(
                          primaryCtaClass,
                          'w-full text-sm sm:text-base'
                        )}
                      >
                        <span className="truncate">{t('headerCta')}</span>
                        <ArrowRight className="size-5 shrink-0" aria-hidden />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </div>
        ) : null}
      </header>

      {showSpacer ? <div aria-hidden style={spacerStyle} /> : null}
    </>
  );
}
