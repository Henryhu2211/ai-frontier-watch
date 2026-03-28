'use client'

import { useTranslation } from 'next-i18next'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisible?: number
}

/**
 * Pagination Component
 * Renders numbered pagination with previous/next buttons
 */
export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxVisible = 7 
}: PaginationProps) {
  const { t } = useTranslation('common')

  if (totalPages <= 1) return null

  // Generate page numbers to display
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = []
    const halfVisible = Math.floor(maxVisible / 2)
    
    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, currentPage + halfVisible)
    
    // Adjust range if at edges
    if (currentPage <= halfVisible) {
      end = Math.min(totalPages, maxVisible)
    }
    if (currentPage + halfVisible >= totalPages) {
      start = Math.max(1, totalPages - maxVisible + 1)
    }
    
    // Add first page
    if (start > 1) {
      pages.push(1)
      if (start > 2) {
        pages.push('ellipsis')
      }
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Add last page
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('ellipsis')
      }
      pages.push(totalPages)
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav 
      className="flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-light-text dark:text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light-border dark:hover:bg-dark-border transition-colors"
        aria-label="Previous page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span 
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-light-textMuted dark:text-dark-textMuted"
            >
              ...
            </span>
          )
        }

        const isActive = page === currentPage
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        )
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-light-text dark:text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light-border dark:hover:bg-dark-border transition-colors"
        aria-label="Next page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Page Info */}
      <span className="ml-4 text-sm text-light-textMuted dark:text-dark-textMuted hidden sm:block">
        {t('common.page')} {currentPage} {t('common.of')} {totalPages}
      </span>
    </nav>
  )
}
