'use client'

import Link from 'next/link'
import { useTranslation } from 'next-i18next'

/**
 * Footer Component
 * Site footer with navigation and copyright
 */
export default function Footer() {
  const { t } = useTranslation('common')

  const categories = [
    { slug: 'research', href: '/category/research' },
    { slug: 'industry', href: '/category/industry' },
    { slug: 'startups', href: '/category/startups' },
    { slug: 'products', href: '/category/products' },
    { slug: 'ethics', href: '/category/ethics' },
    { slug: 'policy', href: '/category/policy' },
  ]

  return (
    <footer className="bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🤖</span>
              <span className="text-xl font-bold text-light-text dark:text-dark-text">
                AI Frontier Watch
              </span>
            </Link>
            <p className="text-light-textMuted dark:text-dark-textMuted max-w-md">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-light-text dark:text-dark-text uppercase tracking-wider mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-light-textMuted dark:text-dark-textMuted hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  {t('header.home')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/search" 
                  className="text-light-textMuted dark:text-dark-textMuted hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  {t('header.search')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-light-textMuted dark:text-dark-textMuted hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  {t('footer.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-light-text dark:text-dark-text uppercase tracking-wider mb-4">
              {t('header.categories')}
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link 
                    href={cat.href}
                    className="text-light-textMuted dark:text-dark-textMuted hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    {t(`categories.${cat.slug}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-light-border dark:border-dark-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-light-textMuted dark:text-dark-textMuted">
              {t('footer.copyright')}
            </p>
            <div className="flex gap-6">
              <Link 
                href="/privacy" 
                className="text-sm text-light-textMuted dark:text-dark-textMuted hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                {t('footer.privacy')}
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-light-textMuted dark:text-dark-textMuted hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
