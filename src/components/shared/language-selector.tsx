"use client"

import React from 'react'
import { ChevronDown } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'

import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'

interface LanguageSelectorProps {
  variant?: 'default' | 'onDark'
}

function LanguageSelector({ variant = 'default' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const activeLocale = useLocale()
  const searchParams = useSearchParams()
  const dropdownRef = React.useRef<HTMLDivElement | null>(null)

  function handleSelect(nextLocale: string) {
    setIsOpen(false)
    const query = Object.fromEntries(searchParams.entries())
    router.replace({ pathname, query }, { locale: nextLocale })
  }

  React.useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    function handlePointerDown(event: PointerEvent) {
      const el = dropdownRef.current
      if (!el) return
      if (event.target instanceof Node && el.contains(event.target)) return
      setIsOpen(false)
    }

    function handleScroll() {
      setIsOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 text-sm font-normal leading-5 transition-colors hover:opacity-80',
          variant === 'onDark' ? 'text-white' : 'text-[#14171A] hover:text-[#14171A]'
        )}
      >
        {activeLocale.toUpperCase()}
        <ChevronDown
          className={cn(
            'size-4 transition-transform',
            isOpen ? 'rotate-180' : 'rotate-0',
            variant === 'onDark' ? 'opacity-90' : 'opacity-80'
          )}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className={cn(
            'absolute right-0 top-full z-50 w-[96px] pt-3',
            'animate-in fade-in-0 slide-in-from-top-2 duration-200'
          )}
        >
          <div
            className={cn(
              'rounded-2xl border p-3 shadow-xl',
              variant === 'onDark'
                ? 'border-white/10 bg-[#0D2C4A]/95 backdrop-blur-xl'
                : 'border-[#EAF1FA] bg-white'
            )}
          >
            <div className="flex flex-col gap-1">
              {routing.locales.map((locale) => {
                const isActive = activeLocale === locale

                return (
                  <button
                    key={locale}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelect(locale)}
                    className={cn(
                      'flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm transition-colors',
                      variant === 'onDark'
                        ? isActive
                          ? 'bg-white/12 font-medium text-white'
                          : 'text-white/90 hover:bg-white/10'
                        : isActive
                          ? 'bg-black/5 font-medium text-[#14171A]'
                          : 'text-[#14171A]/80 hover:bg-black/5 hover:text-[#14171A]'
                    )}
                  >
                    {locale.toUpperCase()}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default LanguageSelector
