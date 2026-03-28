'use client'

import Link from 'next/link'
import { useState, useCallback } from 'react'
import { useTranslation } from 'next-i18next'
import DarkModeToggle from './DarkModeToggle'
import LanguageToggle from './LanguageToggle'
import SearchBar from './SearchBar'

/**
 * Header Component
 * Main navigation header with logo, search, language toggle, and dark mode
 */
export default function Header() {
  const { t } = useTranslation('common')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`
    }
  }, [])

  const categories = [
    { slug: 'research', href: '/category/research' },
    { slug: 'industry', href: '/category/industry' },
    { slug: 'forum', href: '/category/forum' },
    { slug: 'claw', href: '/category/claw' },
    { slug: 'startups', href: '/category/startups' },
    { slug: 'products', href: '/category/products' },
    { slug: 'ethics', href: '/category/ethics' },
    { slug: 'policy', href: '/category/policy' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-light-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🤖</span>
            <span className="text-xl font-bold text-light-text dark:text-dark-text hidden sm:block">
              AI Frontier Watch
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-light-text dark:text-dark-text hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              {t('header.home')}
            </Link>
            <div className="relative group">
              <button className="text-light-text dark:text-dark-text hover:text-primary-500 dark:hover:text-primary-400 transition-colors flex items-center">
                {t('header.categories')}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={cat.href}
                      className="block px-4 py-2 text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border transition-colors"
                    >
                      {t(`categories.${cat.slug}`)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-light-text dark:text-dark-text hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              aria-label={t('header.search')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-light-text dark:text-dark-text"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4 border-t border-light-border dark:border-dark-border">
            <SearchBar onSearch={handleSearch} autoFocus />
          </div>
        )}

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-light-border dark:border-dark-border">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="px-4 py-2 text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('header.home')}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.href}
                  className="px-4 py-2 text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(`categories.${cat.slug}`)}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
