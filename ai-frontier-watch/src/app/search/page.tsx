'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { ArticleCard, CategoryFilter, Pagination } from '@/components'
import type { Article, Category } from '@/types'

const PAGE_SIZE = 12

/**
 * Search Page
 * Search results with filters
 */
export default function SearchPage() {
  const searchParams = useSearchParams()
  const { t } = useTranslation('common')
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchParams) {
      const q = searchParams.get('q')
      if (q) {
        setQuery(q)
      }
    }
  }, [searchParams])

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { getCategories } = await import('@/lib/api')
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Fallback to mock data
        const { categories: mockCategories } = await import('@/lib/data')
        setCategories(mockCategories)
      }
    }
    fetchCategories()
  }, [])

  // Search when query or category changes
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setSearchResults([])
        return
      }

      setLoading(true)
      try {
        const { searchArticles } = await import('@/lib/api')
        const results = await searchArticles(query, PAGE_SIZE * 3) // Fetch more for pagination
        let filteredResults = results
        
        if (selectedCategory) {
          filteredResults = results.filter(a => a.category === selectedCategory)
        }
        
        setSearchResults(filteredResults)
      } catch (error) {
        console.error('Search failed:', error)
        // Fallback to mock search
        try {
          const { searchArticles: mockSearchArticles } = await import('@/lib/data')
          let results = mockSearchArticles(query)
          if (selectedCategory) {
            results = results.filter(a => a.category === selectedCategory)
          }
          setSearchResults(results)
        } catch (mockError) {
          console.error('Mock search failed:', mockError)
        }
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(performSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [query, selectedCategory])

  const totalPages = Math.ceil(searchResults.length / PAGE_SIZE)
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [query, selectedCategory])

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-bg dark:via-dark-card dark:to-primary-900/20 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-6">
            {t('search.title')}
          </h1>
          
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('common.searchPlaceholder')}
              className="w-full px-6 py-4 pl-14 text-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-light-textMuted dark:text-dark-textMuted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 pb-6 border-b border-light-border dark:border-dark-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory || undefined}
              onSelect={(slug) => setSelectedCategory(slug)}
            />
            
            {searchResults.length > 0 && !loading && (
              <span className="text-sm text-light-textMuted dark:text-dark-textMuted whitespace-nowrap">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
              </span>
            )}
            
            {loading && (
              <span className="text-sm text-light-textMuted dark:text-dark-textMuted whitespace-nowrap">
                Searching...
              </span>
            )}
          </div>
        </div>

        {/* Results */}
        {query.trim() ? (
          loading ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6 animate-pulse">🔍</div>
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
                Searching...
              </h2>
              <p className="text-light-textMuted dark:text-dark-textMuted max-w-md mx-auto">
                Finding articles matching &quot;{query}&quot;
              </p>
            </div>
          ) : paginatedResults.length > 0 ? (
            <>
              {/* Query info */}
              <div className="mb-6">
                <p className="text-light-textMuted dark:text-dark-textMuted">
                  {t('search.resultsFor')} <span className="font-semibold text-light-text dark:text-dark-text">&quot;{query}&quot;</span>
                </p>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedResults.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="default" />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center py-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
                {t('search.noResults')}
              </h2>
              <p className="text-light-textMuted dark:text-dark-textMuted max-w-md mx-auto">
                {t('search.tryDifferent')}
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🤖</div>
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
              What are you looking for?
            </h2>
            <p className="text-light-textMuted dark:text-dark-textMuted max-w-md mx-auto">
              Search for AI news, research papers, products, or any topic related to artificial intelligence.
            </p>

            {/* Popular searches */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-light-text dark:text-dark-text uppercase tracking-wider mb-4">
                Popular Searches
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {['GPT-5', 'AI Safety', 'Open Source LLM', 'Machine Learning', 'Neural Networks', 'AI Ethics'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 text-sm bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-full hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
