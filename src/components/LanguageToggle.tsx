'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from 'next-i18next'

/**
 * LanguageToggle Component
 * Toggle between English and Chinese languages
 */
export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()

  const currentLang = i18n.language?.startsWith('zh') ? 'zh' : 'en'

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'zh' : 'en'
    
    // Persist the language preference
    localStorage.setItem('i18nextLng', newLang)
    
    // Update URL with new language
    if (!pathname) return
    
    const segments = pathname.split('/')
    if (segments[1] === 'en' || segments[1] === 'zh') {
      segments[1] = newLang
    } else {
      segments.splice(1, 0, newLang)
    }
    
    router.push(segments.join('/') || '/')
    router.refresh()
  }

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-light-border dark:bg-dark-border hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
      aria-label="Toggle language"
    >
      <span className={currentLang === 'en' ? 'text-primary-600 dark:text-primary-400' : 'text-light-textMuted dark:text-dark-textMuted'}>
        EN
      </span>
      <span className="mx-1 text-light-textMuted dark:text-dark-textMuted">/</span>
      <span className={currentLang === 'zh' ? 'text-primary-600 dark:text-primary-400' : 'text-light-textMuted dark:text-dark-textMuted'}>
        中文
      </span>
    </button>
  )
}
