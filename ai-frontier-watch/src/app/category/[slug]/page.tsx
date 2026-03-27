'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { ArticleCard, CategoryFilter, Pagination } from '@/components'
import type { Article, Category } from '@/types'

const PAGE_SIZE = 12

/**
 * Category Page
 * Filtered articles by category with pagination
 */
export default function CategoryPage() {
  const params = useParams()
  const slug = params?.slug as string | undefined
  const { t } = useTranslation('common')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  const [category, setCategory] = useState<Category | undefined>()
  const [categoryArticles, setCategoryArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const { getArticlesByCategory, getCategories } = await import('@/lib/api')
        
        const [articles, categoriesData] = await Promise.all([
          getArticlesByCategory(slug, 100),
          getCategories()
        ])
        
        // Find current category
        const currentCategory = categoriesData.find(c => c.slug === slug)
        setCategory(currentCategory)
        setCategories(categoriesData)
        
        // Sort articles
        const sortedArticles = sortBy === 'newest'
          ? articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          : articles.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
        
        setCategoryArticles(sortedArticles)
      } catch (error) {
        console.error('Failed to fetch category data:', error)
        // Fallback to mock data
        try {
          const { categories: mockCategories, getArticlesByCategory: mockGetArticles, getCategoryBySlug } = await import('@/lib/data')
          
          const currentCategory = getCategoryBySlug(slug)
          setCategory(currentCategory)
          setCategories(mockCategories)
          
          const articles = mockGetArticles(slug)
          const sortedArticles = sortBy === 'newest'
            ? articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
            : articles.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
          
          setCategoryArticles(sortedArticles)
        } catch (mockError) {
          console.error('Mock data fallback failed:', mockError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug, sortBy])

  const totalPages = Math.ceil(categoryArticles.length / PAGE_SIZE)
  const paginatedArticles = categoryArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const getCategoryName = (): string => {
    if (!category || !slug) return ''
    const isZh = typeof window !== 'undefined' && 
      (localStorage.getItem('language') === 'zh' || navigator.language.startsWith('zh'))
    return isZh && category.nameZh ? category.nameZh : category.name
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 dark:from-primary-900/20 dark:to-primary-800/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
                <div className="p-4 bg-light-card dark:bg-dark-card border border-t-0 border-light-border dark:border-dark-border rounded-b-xl">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-4">
          Category Not Found
        </h1>
        <p className="text-light-textMuted dark:text-dark-textMuted">
          The category &quot;{slug}&quot; does not exist.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 dark:from-primary-900/20 dark:to-primary-800/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">
              {slug === 'research' && '🔬'}
              {slug === 'industry' && '🏢'}
              {slug === 'startups' && '🚀'}
              {slug === 'products' && '🛠️'}
              {slug === 'ethics' && '⚖️'}
              {slug === 'policy' && '📋'}
              {slug === 'tutorials' && '📚'}
              {slug === 'opinion' && '💭'}
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">
                {getCategoryName()}
              </h1>
              <p className="text-light-textMuted dark:text-dark-textMuted mt-2">
                {category.description || category.descriptionZh || `${categoryArticles.length} articles`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-light-border dark:border-dark-border">
          <CategoryFilter
            categories={categories}
            selectedCategory={slug as string}
            onSelect={() => {}} // Disabled since we're on category page
          />
          
          <div className="flex items-center gap-4">
            <label className="text-sm text-light-textMuted dark:text-dark-textMuted">
              {t('category.sortBy')}:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="px-3 py-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">{t('category.newest')}</option>
              <option value="oldest">{t('category.oldest')}</option>
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        {paginatedArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedArticles.map((article) => (
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
            <p className="text-light-textMuted dark:text-dark-textMuted">
              {t('common.noResults')}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
