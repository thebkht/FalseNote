import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import TopLoader from '@/components/providers/top-loader'
import AuthProvider from '@/components/providers/auth-provider'
import { Analytics } from '@vercel/analytics/react';
import { TailwindIndicator } from '@/components/indicator'
import { Toaster } from '@/components/ui/toaster'
import { getSessionUser } from '@/components/get-session-user'
import { getSettings } from '@/lib/prisma/session'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.DOMAIN!),
  title: 'FalseNotes',
  description: '🚀 FalseNotes is a developer-focused blogging platform where individual developers can ignite discussions, share expertise, and craft their coding journeys.',
  openGraph: {
    title: 'FalseNotes',
    description: '🚀 FalseNotes is a developer-focused blogging platform where individual developers can ignite discussions, share expertise, and craft their coding journeys.',
    url: process.env.DOMAIN!,
    images: [
      {
        url: 'https://s3.ap-northeast-2.amazonaws.com/falsenotes.app/assets/media/og.png',
        width: 1200,
        height: 630,
        alt: 'FalseNotes',
      },
    ],
    creators: ['@bkhtdev'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FalseNotes',
    description: '🚀 FalseNotes is a developer-focused blogging platform where individual developers can ignite discussions, share expertise, and craft their coding journeys.',
    images: [
      {
        url: 'https://s3.ap-northeast-2.amazonaws.com/falsenotes.app/assets/media/og.png',
        width: 1200,
        height: 630,
        alt: 'FalseNotes',
      },
    ],
    creator: '@bkhtdev',
  },
}

export default async function Rootayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getSessionUser()
  const { settings } = await getSettings({ id: session?.id})
  console.log(settings)
  return (
    <html lang={settings?.language || 'en'}>
      <body className={`${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme={settings?.appearance || 'system'} enableSystem>
          <AuthProvider>
          <TopLoader />
          {children}
          <Toaster />
          <TailwindIndicator />
          <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
