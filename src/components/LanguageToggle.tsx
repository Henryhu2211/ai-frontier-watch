'use client'

import { useTranslation } from 'next-i18next'

/**
 * LanguageToggle Component
 * Toggle between English and Chinese languages
 * Uses client-side only language switching (no URL changes)
 */
export default function LanguageToggle() {
  const { i18n } = useTranslation()

  const currentLang = i18n.language?.startsWith('zh') ? 'zh' : 'en'

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'zh' : 'en'
    
    // Persist the language preference
    localStorage.setItem('i18nextLng', newLang)
    document.cookie = `i18next=${newLang}; path=/; max-age=31535400`
    
    // Change language without URL change
    i18n.changeLanguage(newLang)
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
