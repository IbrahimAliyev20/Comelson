'use client'

import { useQueryClient } from '@tanstack/react-query'
import {
  Building2,
  CircleUser,
  FileText,
  LogOut,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'
import { useTranslations } from 'next-intl'

import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { resolveAuthMediaUrl } from '@/lib/auth/resolve-media-url'
import { cn } from '@/lib/utils'
import { authKeys } from '@/services/auth/keys'
import type { AuthProfileUser } from '@/services/auth/types'
import { logoutAction } from '@/services/auth/serveractions'

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || '?'
}

function useAccountTabActive() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  return useMemo(() => {
    const tab = searchParams.get('tab')
    return {
      account:
        pathname === '/account' && (!tab || tab === 'account'),
      companies: pathname === '/account' && tab === 'companies',
      tenders: pathname === '/account' && tab === 'tenders',
    }
  }, [pathname, searchParams])
}

const itemBase =
  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-normal leading-5 transition-colors'
const itemInactive = 'text-[#14171a] hover:bg-[#e6eff6]'
const itemActive = 'bg-[#e6eff6] font-medium text-[#0f477d]'

type UserMenuPanelProps = {
  user: AuthProfileUser
  onNavigate?: () => void
  /** Mobil menyuda daha açıq fon */
  lightOnDark?: boolean
}

export function UserMenuPanel({
  user,
  onNavigate,
  lightOnDark = false,
}: UserMenuPanelProps) {
  const t = useTranslations('navigation.userMenu')
  const router = useRouter()
  const queryClient = useQueryClient()
  const tabActive = useAccountTabActive()
  const [logoutPending, startLogout] = useTransition()

  const avatarUrl = useMemo(
    () => resolveAuthMediaUrl(user.image),
    [user.image]
  )

  function handleLogout() {
    startLogout(async () => {
      onNavigate?.()
      await logoutAction()
      await queryClient.invalidateQueries({ queryKey: authKeys.profile() })
      router.push('/login')
    })
  }

  const borderSection = lightOnDark ? 'border-white/10' : 'border-[#eaf1fa]'
  const textMuted = lightOnDark ? 'text-white/70' : 'text-[#6b6e71]'
  const textName = lightOnDark ? 'text-white' : 'text-[#14171a]'
  const cardBg = lightOnDark ? 'border-white/10 bg-white/5' : 'border-[#eaf1fa] bg-white'

  return (
    <div
      className={cn(
        'rounded-2xl border py-3 shadow-xl',
        cardBg,
        lightOnDark && 'shadow-none'
      )}
    >
      <div className={cn('flex gap-3 border-b px-4 pb-4', borderSection)}>
        <div
          className={cn(
            'relative size-10 shrink-0 overflow-hidden rounded-full border bg-[#f4fafd]',
            lightOnDark ? 'border-white/20' : 'border-[#eaf1fa]'
          )}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-xs font-semibold text-[#0f477d]">
              {initialsFromName(user.name)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn('truncate text-base font-semibold leading-6', textName)}>
            {user.name}
          </p>
          <p className={cn('mt-0.5 truncate text-sm leading-5', textMuted)}>
            {user.email}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 px-2 pt-3">
        <Link
          href="/account?tab=account"
          role="menuitem"
          className={cn(
            itemBase,
            tabActive.account ? itemActive : itemInactive,
            lightOnDark &&
              !tabActive.account &&
              'text-white/90 hover:bg-white/10'
          )}
          onClick={onNavigate}
        >
          <CircleUser
            className={cn(
              'size-5 shrink-0',
              tabActive.account
                ? 'text-[#0f477d]'
                : lightOnDark
                  ? 'text-white/80'
                  : 'text-[#6b6e71]'
            )}
            aria-hidden
          />
          {t('account')}
        </Link>
        <Link
          href="/account?tab=companies"
          role="menuitem"
          className={cn(
            itemBase,
            tabActive.companies ? itemActive : itemInactive,
            lightOnDark &&
              !tabActive.companies &&
              'text-white/90 hover:bg-white/10'
          )}
          onClick={onNavigate}
        >
          <Building2
            className={cn(
              'size-5 shrink-0',
              tabActive.companies
                ? 'text-[#0f477d]'
                : lightOnDark
                  ? 'text-white/80'
                  : 'text-[#6b6e71]'
            )}
            aria-hidden
          />
          {t('company')}
        </Link>
        <Link
          href="/account?tab=tenders"
          role="menuitem"
          className={cn(
            itemBase,
            tabActive.tenders ? itemActive : itemInactive,
            lightOnDark &&
              !tabActive.tenders &&
              'text-white/90 hover:bg-white/10'
          )}
          onClick={onNavigate}
        >
          <FileText
            className={cn(
              'size-5 shrink-0',
              tabActive.tenders
                ? 'text-[#0f477d]'
                : lightOnDark
                  ? 'text-white/80'
                  : 'text-[#6b6e71]'
            )}
            aria-hidden
          />
          {t('tenders')}
        </Link>
      </div>

      <div className={cn('mx-2 my-2 h-px', borderSection)} />

      <div className="px-2 pb-1">
        <button
          type="button"
          role="menuitem"
          disabled={logoutPending}
          onClick={handleLogout}
          className={cn(
            itemBase,
            'w-full disabled:opacity-60 cursor-pointer',
            lightOnDark
              ? 'text-white/90 hover:bg-white/10'
              : 'text-[#14171a] hover:bg-[#fde8e8]'
          )}
        >
          <LogOut
            className={cn(
              'size-5 shrink-0',
              lightOnDark ? 'text-white/70' : 'text-[#6b6e71]'
            )}
            aria-hidden
          />
          {t('logout')}
        </button>
      </div>
    </div>
  )
}

type HeaderUserMenuProps = {
  user: AuthProfileUser
  variant?: 'default' | 'onDark'
}

export function HeaderUserMenu({
  user,
  variant = 'default',
}: HeaderUserMenuProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)
  const [popoverTop, setPopoverTop] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const avatarUrl = useMemo(
    () => resolveAuthMediaUrl(user.image),
    [user.image]
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setIsNarrow(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useLayoutEffect(() => {
    if (!open || !isNarrow || !containerRef.current) return

    function updateTop() {
      const el = containerRef.current
      if (!el) return
      setPopoverTop(el.getBoundingClientRect().bottom + 8)
    }

    updateTop()
    window.addEventListener('resize', updateTop)
    return () => window.removeEventListener('resize', updateTop)
  }, [open, isNarrow])

  useEffect(() => {
    setOpen(false)
  }, [pathname, searchParams])

  useEffect(() => {
    if (!open) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    function onPointerDown(e: PointerEvent) {
      const el = containerRef.current
      if (!el) return
      if (e.target instanceof Node && el.contains(e.target)) return
      setOpen(false)
    }

    function onScroll() {
      setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('scroll', onScroll)
    }
  }, [open])

  const isOnDark = variant === 'onDark'

  return (
    <div ref={containerRef} className="relative shrink-0 ">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative flex size-11 shrink-0 items-center justify-center rounded-full border-2 outline-none ring-offset-2 transition-opacity hover:opacity-95 focus-visible:ring-2 cursor-pointer',
          isOnDark
            ? 'border-white/90 focus-visible:ring-white/60'
            : 'border-[#e6eff6] focus-visible:ring-[#e6eff6]'
        )}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="size-full rounded-full object-cover"
          />
        ) : (
          <span
            className="flex size-full items-center justify-center rounded-full bg-[#e6eff6] text-sm font-semibold text-[#0f477d]"
            aria-hidden
          >
            {initialsFromName(user.name)}
          </span>
        )}
      </button>

      {open ? (
        <div
          role="menu"
          className={cn(
            'z-[60] animate-in fade-in-0 slide-in-from-top-1 duration-200',
            isNarrow
              ? 'fixed left-4 right-4 max-h-[min(70vh,calc(100dvh-96px))] overflow-y-auto'
              : 'absolute right-0 top-full pt-2'
          )}
          style={isNarrow ? { top: popoverTop } : undefined}
        >
          <div
            className={cn(
              !isNarrow && 'w-[min(calc(100vw-32px),320px)]'
            )}
          >
            <UserMenuPanel user={user} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
