'use client'

import { usePathname } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

const MIN_SPINNER_MS = 550

function isModifiedEvent(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

function isInternalNavigation(anchor: HTMLAnchorElement) {
  if (!anchor.href) return false
  if (anchor.target && anchor.target !== '_self') return false
  if (anchor.hasAttribute('download')) return false

  const url = new URL(anchor.href, window.location.href)
  if (url.origin !== window.location.origin) return false

  const current = new URL(window.location.href)
  if (
    url.pathname === current.pathname &&
    url.search === current.search &&
    url.hash === current.hash
  ) {
    return false
  }

  return true
}

export default function RouteTransition() {
  const t = useTranslations('common')
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, setIsPending] = useState(false)
  const startedAtRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const search = searchParams.toString()

  useEffect(() => {
    function clearPending() {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      const startedAt = startedAtRef.current
      if (!startedAt) {
        setIsPending(false)
        return
      }

      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, MIN_SPINNER_MS - elapsed)

      timeoutRef.current = window.setTimeout(() => {
        setIsPending(false)
        startedAtRef.current = null
        timeoutRef.current = null
      }, remaining)
    }

    clearPending()

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [pathname, search])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || isModifiedEvent(event)) {
        return
      }

      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (!isInternalNavigation(anchor)) return

      startedAtRef.current = Date.now()
      setIsPending(true)
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  return (
    <div
      aria-hidden={!isPending}
      className={[
        'pointer-events-none fixed inset-0 z-[100] transition-all duration-300',
        isPending ? 'opacity-100 visible' : 'invisible opacity-0'
      ].join(' ')}
    >
      <div className="absolute inset-0 bg-[rgba(248,250,252,0.58)] backdrop-blur-[8px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,71,125,0.10),transparent_42%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative overflow-hidden rounded-[26px] border border-white/80 bg-white/72 px-6 py-5 shadow-[0_20px_70px_rgba(15,71,125,0.16)] backdrop-blur-xl">
          <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <div className="absolute h-12 w-12 rounded-full border border-[#c9dbeb]" />
              <div className="absolute h-12 w-12 rounded-full border-[3px] border-[#dce8f3]" />
              <div className="route-spinner absolute h-12 w-12 rounded-full border-[3px] border-transparent border-t-[#0f477d] border-r-[#5b87b1]" />
              <div className="route-spinner-soft absolute h-7 w-7 rounded-full border-2 border-transparent border-b-[#8cb2d3] border-l-[#8cb2d3]" />
              <div className="h-2 w-2 rounded-full bg-[#0f477d] shadow-[0_0_18px_rgba(15,71,125,0.32)]" />
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-[10px] font-semibold tracking-[0.28em] text-[#0f477d] uppercase">
                {t('loading')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
