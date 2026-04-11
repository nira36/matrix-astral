import type { Metadata } from 'next'
import './globals.css'
import InAppBrowserWarning from '@/components/InAppBrowserWarning'

export const metadata: Metadata = {
  title: 'Cosmic Love Matrix',
  description: 'Discover your cosmic blueprint — calculate your core numerology numbers and life phases.',
  keywords: ['numerology', 'life path', 'birth chart', 'astrology', 'spiritual'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen bg-bg-primary text-white antialiased">
        <InAppBrowserWarning />
        {children}
      </body>
    </html>
  )
}
