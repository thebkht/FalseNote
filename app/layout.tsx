import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import TopLoader from '@/components/providers/top-loader'
import AuthProvider from '@/components/providers/auth-provider'
import { TailwindIndicator } from '@/components/indicator'
import { Toaster } from '@/components/ui/toaster'
import { getSessionUser } from '@/components/get-session-user'
import { getSettings } from '@/lib/prisma/session'
import { GeistSans } from "geist/font";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.DOMAIN!),
  title: '🚀 FalseNotes - Start Your Journey',
  description: '🚀 FalseNotes is a developer-focused blogging platform where individual developers can ignite discussions, share expertise, and craft their coding journeys.',
  keywords: ['FalseNotes', 'False Notes', 'FalseNotes Blog', 'FalseNotes Blogging', 'FalseNotes Blogging Platform', 'FalseNotes Platform', 'FalseNotes Blogging Platform', 'FalseNotes Blogging Platform'],
  robots: 'follow, index',
  openGraph: {
    title: 'FalseNotes',
    description: '🚀 FalseNotes is a developer-focused blogging platform where individual developers can ignite discussions, share expertise, and craft their coding journeys.',
    url: process.env.DOMAIN!,
    images: [
      {
        url: 'https://falsenotescontent.s3.ap-northeast-2.amazonaws.com/og.png',
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
        url: 'https://falsenotescontent.s3.ap-northeast-2.amazonaws.com/og.png',
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
  return (
    <html lang={settings?.language || 'en'}>
      <head>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${GeistSans.className}`}>
        <ThemeProvider attribute="class" defaultTheme={settings?.appearance || 'system'} enableSystem>
          <AuthProvider>
          {children}
          <Toaster />
          <TailwindIndicator />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
