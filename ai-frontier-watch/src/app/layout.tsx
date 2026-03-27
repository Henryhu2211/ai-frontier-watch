import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import { I18nProvider } from '@/context/I18nProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'AI Frontier Watch - Stay Ahead of the AI Revolution',
    template: '%s | AI Frontier Watch',
  },
  description: 'Your trusted source for AI news, research, and insights. Stay updated on the latest artificial intelligence developments, breakthroughs, and industry trends.',
  keywords: ['AI', 'artificial intelligence', 'machine learning', 'deep learning', 'LLM', 'ChatGPT', 'AI news', 'AI research'],
  authors: [{ name: 'AI Frontier Watch' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'AI Frontier Watch',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300">
        <ThemeProvider>
          <I18nProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
