'use client'

import { usePathname } from '@/i18n/navigation'

import { Footer } from './footer'
import { Header } from './header'

const AUTH_PATHS = new Set([
  '/login',
  '/register',
  '/forgetpassword',
  '/otp',
  '/new-password',
])

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname().replace(/\/$/, '') || '/'
  const isAuthRoute = AUTH_PATHS.has(pathname)
  const showChrome = !isAuthRoute

  return (
    <>
      {showChrome ? <Header /> : null}
      <main>{children}</main>
      {showChrome ? <Footer /> : null}
    </>
  )
}
