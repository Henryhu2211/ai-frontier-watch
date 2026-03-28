'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useTranslation } from 'next-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import 'i18next'

// Initialize i18n
if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      debug: process.env.NODE_ENV === 'development',
      fallbackLng: 'en',
      supportedLngs: ['en', 'zh'],
      defaultNS: 'common',
      ns: ['common'],
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: true,
      },
    })
}

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsReady(true)
    } else {
      const handleInit = () => setIsReady(true)
      i18n.on('initialized', handleInit)
      return () => {
        i18n.off('initialized', handleInit)
      }
    }
  }, [])

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
        <div className="animate-pulse text-light-textMuted dark:text-dark-textMuted">
          Loading...
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export { useTranslation }
