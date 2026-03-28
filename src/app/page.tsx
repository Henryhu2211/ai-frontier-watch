'use client'

import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { ArticleCard } from '@/components'
import { useState, useEffect } from 'react'
import type { Article, Category } from '@/types'

/**
 * Homepage
 * Breaking news + category sections
 */
export default function HomePage() {
  const { t } = useTranslation('common')
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch articles and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Dynamic import to avoid SSR issues
        const { getHomepageArticles, getCategories } = await import('@/lib/api')
        
        const [articlesData, categoriesData] = await Promise.all([
          getHomepageArticles(20),
          getCategories()
        ])
        
        setArticles(articlesData)
        setCategories(categoriesData)
      } catch (fetchError) {
        console.error('Failed to fetch data:', fetchError)
        // Fallback to mock data
        const { articles: mockArticles, categories: mockCategories } = await import('@/lib/data')
        setArticles(mockArticles)
        setCategories(mockCategories)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const featuredArticle = articles.find(a => a.featured)
  const recentArticles = articles.filter(a => !a.featured).slice(0, 8)
  const trendingArticles = articles.slice(0, 5)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-bg dark:via-dark-card dark:to-primary-900/20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-light-text dark:text-dark-text mb-4">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-light-textMuted dark:text-dark-textMuted max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
          </div>
        </div>
        {/* Decorative background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900/20 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 dark:bg-primary-800/20 rounded-full blur-3xl opacity-30" />
        </div>
      </section>

      {/* Featured Article */}
      {loading ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="mb-8 animate-pulse">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </section>
      ) : featuredArticle ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="mb-8">
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded-full mb-4">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              {t('home.breakingNews.label')}
            </span>
            <ArticleCard article={featuredArticle} variant="featured" />
          </div>
        </section>
      ) : null}

      {/* Categories Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
            {t('home.categories.title')}
          </h2>
          <Link 
            href="/categories"
            className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 font-medium"
          >
            {t('home.categories.viewAll')}
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl animate-pulse">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300"
              >
                <div className="text-3xl mb-3">
                  {category.slug === 'research' && '🔬'}
                  {category.slug === 'industry' && '🏢'}
                  {category.slug === 'startups' && '🚀'}
                  {category.slug === 'products' && '🛠️'}
                  {category.slug === 'ethics' && '⚖️'}
                  {category.slug === 'policy' && '📋'}
                  {category.slug === 'tutorials' && '📚'}
                  {category.slug === 'opinion' && '💭'}
                </div>
                <h3 className="font-semibold text-light-text dark:text-dark-text group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                  {t(`categories.${category.slug}`)}
                </h3>
                <p className="text-sm text-light-textMuted dark:text-dark-textMuted mt-1">
                  {category.articleCount} articles
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
            {t('home.trending.title')}
          </h2>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl animate-pulse">
                  <div className="w-32 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {trendingArticles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article} variant="horizontal" showImage />
              ))}
            </div>
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                Top Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {['GPT-5', 'AI Safety', 'Open Source LLM', 'AI Regulation', 'Healthcare AI', 'Code Generation', 'Robotics', 'Autonomous Vehicles'].map((topic) => (
                  <Link
                    key={topic}
                    href={`/search?q=${encodeURIComponent(topic)}`}
                    className="px-3 py-1.5 text-sm bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-full hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                  >
                    #{topic}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Recent News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
            {t('home.recentNews.title')}
          </h2>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
                <div className="p-4 bg-light-card dark:bg-dark-card border border-t-0 border-light-border dark:border-dark-border rounded-b-xl">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="default" />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Stay Updated with AI Frontier Watch
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Get the latest AI news, research breakthroughs, and industry insights delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
