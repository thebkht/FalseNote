import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import TopLoader from '@/components/providers/top-loader'
import Navbar from '@/components/navbar/navbar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Analytics } from '@vercel/analytics/react';
import AuthProvider from '@/components/providers/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FalseNotes',
  description: '🚀 FalseNotes is a developer-focused blogging platform where individual developers can ignite discussions, share expertise, and craft their coding journeys.',
}

export default async function Rootayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
          <TopLoader />
          {children}
          <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
