'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import type { ArticleCardProps } from '@/types'

/**
 * Format relative time
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  const diffWeeks = Math.floor(diffDays / 7)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return `${diffWeeks}w ago`
}

/**
 * ArticleCard Component
 * Displays article preview with title, summary, source, date, and tags
 */
export default function ArticleCard({ 
  article, 
  variant = 'default',
  showImage = true 
}: ArticleCardProps) {
  const { t } = useTranslation('common')

  const categoryName = t(`categories.${article.category}`, article.category)

  // Featured variant - large card with image
  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300">
        <Link href={`/article/${article.id}`} className="block">
          {showImage && article.imageUrl && (
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-500 text-white rounded-full mb-3">
                  {t('home.breakingNews.label')}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors">
                  {article.title}
                </h2>
                <p className="text-white/80 line-clamp-2 mb-3">
                  {article.summary}
                </p>
                <div className="flex items-center text-white/60 text-sm space-x-4">
                  <span>{article.source}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(article.publishedAt)}</span>
                  {article.readTime && (
                    <>
                      <span>•</span>
                      <span>{article.readTime} {t('article.readTime')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </Link>
      </article>
    )
  }

  // Horizontal variant - side by side layout
  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-4 p-4 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300">
        {showImage && article.imageUrl && (
          <Link href={`/article/${article.id}`} className="flex-shrink-0">
            <div className="relative w-32 h-24 md:w-48 md:h-32 overflow-hidden rounded-lg">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="128px"
              />
            </div>
          </Link>
        )}
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href={`/category/${article.category}`}
              className="text-xs font-semibold text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300"
            >
              {categoryName}
            </Link>
            <span className="text-light-textMuted dark:text-dark-textMuted">•</span>
            <span className="text-xs text-light-textMuted dark:text-dark-textMuted">
              {formatRelativeTime(article.publishedAt)}
            </span>
          </div>
          <Link href={`/article/${article.id}`}>
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text line-clamp-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors mb-1">
              {article.title}
            </h3>
          </Link>
          <p className="text-sm text-light-textMuted dark:text-dark-textMuted line-clamp-2">
            {article.summary}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-light-textMuted dark:text-dark-textMuted">
            <span>{article.source}</span>
            {article.readTime && (
              <>
                <span>•</span>
                <span>{article.readTime} {t('article.readTime')}</span>
              </>
            )}
          </div>
        </div>
      </article>
    )
  }

  // Compact variant - minimal information
  if (variant === 'compact') {
    return (
      <article className="group py-4 border-b border-light-border dark:border-dark-border last:border-b-0">
        <div className="flex items-center gap-2 mb-1">
          <Link 
            href={`/category/${article.category}`}
            className="text-xs font-semibold text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300"
          >
            {categoryName}
          </Link>
          <span className="text-light-textMuted dark:text-dark-textMuted">•</span>
          <span className="text-xs text-light-textMuted dark:text-dark-textMuted">
            {formatRelativeTime(article.publishedAt)}
          </span>
        </div>
        <Link href={`/article/${article.id}`}>
          <h3 className="text-base font-medium text-light-text dark:text-dark-text line-clamp-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
            {article.title}
          </h3>
        </Link>
      </article>
    )
  }

  // Default variant - standard card
  return (
    <article className="group flex flex-col h-full overflow-hidden rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300">
      {showImage && article.imageUrl && (
        <Link href={`/article/${article.id}`} className="block">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      )}
      <div className="flex flex-col flex-grow p-4">
        <div className="flex items-center gap-2 mb-3">
          <Link 
            href={`/category/${article.category}`}
            className="text-xs font-semibold text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 px-2 py-1 bg-primary-50 dark:bg-primary-900/30 rounded-md transition-colors"
          >
            {categoryName}
          </Link>
          <span className="text-xs text-light-textMuted dark:text-dark-textMuted">
            {formatRelativeTime(article.publishedAt)}
          </span>
        </div>
        <Link href={`/article/${article.id}`} className="flex-grow">
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text line-clamp-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors mb-2">
            {article.title}
          </h3>
          <p className="text-sm text-light-textMuted dark:text-dark-textMuted line-clamp-3">
            {article.summary}
          </p>
        </Link>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-light-border dark:border-dark-border">
          <span className="text-xs text-light-textMuted dark:text-dark-textMuted">
            {article.source}
          </span>
          {article.readTime && (
            <span className="text-xs text-light-textMuted dark:text-dark-textMuted">
              {article.readTime} {t('article.readTime')}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
