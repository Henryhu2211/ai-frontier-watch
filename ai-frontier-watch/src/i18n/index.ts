'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

export async function initI18n(): Promise<typeof i18n> {
  await i18n
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

  return i18n
}

export default i18n
