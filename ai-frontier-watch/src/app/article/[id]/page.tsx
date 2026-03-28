'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { ArticleCard } from '@/components'
import { useState, useEffect } from 'react'
import type { Article } from '@/types'

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Article Detail Page
 * Full content view with related articles
 */
export default function ArticlePage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const { t } = useTranslation('common')
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Dynamic import to avoid SSR issues
        const { getArticleById, searchArticles } = await import('@/lib/api')
        
        const articleData = await getArticleById(id)
        
        if (articleData) {
          setArticle(articleData)
          // Fetch related articles (same category)
          const related = await searchArticles(articleData.category, 3)
          setRelatedArticles(related.filter(a => a.id !== id).slice(0, 3))
        } else {
          // Fallback to mock data
          const { getArticleById: mockGetArticleById, getRelatedArticles } = await import('@/lib/data')
          const mockArticle = mockGetArticleById(id)
          if (mockArticle) {
            setArticle(mockArticle)
            setRelatedArticles(getRelatedArticles(mockArticle))
          }
        }
      } catch (fetchError) {
        console.error('Failed to fetch article:', fetchError)
        // Fallback to mock data
        try {
          const { getArticleById: mockGetArticleById, getRelatedArticles } = await import('@/lib/data')
          const mockArticle = mockGetArticleById(id)
          if (mockArticle) {
            setArticle(mockArticle)
            setRelatedArticles(getRelatedArticles(mockArticle))
          }
        } catch (mockErr) {
          console.error('Mock data fallback failed:', mockErr)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-8"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-4">
          Article Not Found
        </h1>
        <p className="text-light-textMuted dark:text-dark-textMuted mb-8">
          The article you are looking for does not exist.
        </p>
        <Link href="/" className="btn-primary">
          {t('common.backToHome')}
        </Link>
      </div>
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert(t('common.copyLink'))
    }
  }

  return (
    <div className="min-h-screen">
      {/* Article Header */}
      <article>
        <header className="bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-bg dark:via-dark-card dark:to-primary-900/20 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm">
              <ol className="flex items-center space-x-2 text-light-textMuted dark:text-dark-textMuted">
                <li>
                  <Link href="/" className="hover:text-primary-500">
                    {t('header.home')}
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href={`/category/${article.category}`} className="hover:text-primary-500">
                    {t(`categories.${article.category}`)}
                  </Link>
                </li>
              </ol>
            </nav>

            {/* Category Tag */}
            <Link
              href={`/category/${article.category}`}
              className="inline-block px-3 py-1 text-sm font-semibold bg-primary-500 text-white rounded-full mb-4"
            >
              {t(`categories.${article.category}`)}
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-light-text dark:text-dark-text mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Summary */}
            <p className="text-xl text-light-textMuted dark:text-dark-textMuted mb-6">
              {article.summary}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-light-textMuted dark:text-dark-textMuted pb-6 border-b border-light-border dark:border-dark-border">
              {article.author && (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {article.author}
                </span>
              )}
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('article.publishedOn')} {formatDate(article.publishedAt)}
              </span>
              {article.readTime && (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {article.readTime} {t('article.readTime')}
                </span>
              )}
            </div>

            {/* Share Button */}
            <div className="pt-4">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 text-primary-500 hover:text-primary-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {t('article.shareArticle')}
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-light-text dark:text-dark-text leading-relaxed space-y-6">
              {/* Mock content - replace with actual article content */}
              <p className="text-xl leading-relaxed">
                {article.summary}
              </p>
              <p>
                The field of artificial intelligence continues to evolve at an unprecedented pace, 
                with breakthroughs occurring almost daily. This development represents a significant 
                milestone in the ongoing quest to create more capable and beneficial AI systems.
              </p>
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mt-8 mb-4">
                Key Developments
              </h2>
              <p>
                Researchers have been working on addressing some of the most challenging problems 
                in AI, from improving reasoning capabilities to enhancing multimodal understanding. 
                The implications of these advances extend far beyond academic research.
              </p>
              <p>
                Industry experts believe this could lead to transformative applications across 
                healthcare, education, scientific research, and many other sectors. The potential 
                for positive impact on society is substantial.
              </p>
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mt-8 mb-4">
                Looking Ahead
              </h2>
              <p>
                As we continue to push the boundaries of what AI can achieve, it remains crucial 
                to consider the ethical implications and ensure that these powerful technologies 
                are developed responsibly and benefit all of humanity.
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-light-border dark:border-dark-border">
            <h3 className="text-sm font-semibold text-light-text dark:text-dark-text uppercase tracking-wider mb-4">
              {t('article.tags')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 text-sm bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-full hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Source */}
          <div className="mt-8 p-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-light-textMuted dark:text-dark-textMuted">
                  {t('article.source')}
                </span>
                <p className="font-semibold text-light-text dark:text-dark-text mt-1">
                  {article.source}
                </p>
              </div>
              {article.sourceUrl && (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Visit Source
                </a>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-8">
              {t('article.relatedArticles')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.id} article={related} variant="default" />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
