import type { Metadata } from 'next'
import { Geist_Mono, Inter } from 'next/font/google'
import '@/app/globals.css'
import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import { QueryProvider } from '@/providers/QueryProvider'
import { Toaster } from 'sonner'
import { RouteTransitionBoundary } from '@/components/navigation/RouteTransitionBoundary'
import ClientLayout from '@/components/navigation/clientLayout'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Comelson',
  description: 'Comelson',
}


export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const messages = (await getMessages()) as Record<string, string>
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <div className="min-h-screen">
              <RouteTransitionBoundary />
              <ClientLayout>{children}</ClientLayout>
            </div>
            <Toaster position="top-center" richColors />
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
