'use client'

import { useTranslation } from 'next-i18next'
import { useTheme } from '@/context/ThemeContext'

/**
 * DarkModeToggle Component
 * Toggle between light and dark mode
 */
export default function DarkModeToggle() {
  const { t } = useTranslation('common')
  const { resolvedTheme, toggleTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-light-border dark:bg-dark-border hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
      aria-label={isDark ? t('header.lightMode') : t('header.darkMode')}
      title={isDark ? t('header.lightMode') : t('header.darkMode')}
    >
      {isDark ? (
        // Sun icon for light mode
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  )
}
