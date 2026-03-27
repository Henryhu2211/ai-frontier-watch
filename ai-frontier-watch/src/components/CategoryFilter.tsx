'use client'

import { useTranslation } from 'next-i18next'
import type { Category, CategoryFilterProps } from '@/types'

/**
 * CategoryFilter Component
 * Horizontal scrollable category filter with selection state
 */
export default function CategoryFilter({ 
  categories, 
  selectedCategory,
  onSelect 
}: CategoryFilterProps) {
  const { t, i18n } = useTranslation('common')

  const getCategoryName = (category: Category): string => {
    const isZh = i18n?.language?.startsWith('zh')
    if (category.nameZh && isZh) {
      return category.nameZh
    }
    return t(`categories.${category.slug}`, category.name)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* All Categories Button */}
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
          selectedCategory === null || selectedCategory === undefined
            ? 'bg-primary-500 text-white shadow-md'
            : 'bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text border border-light-border dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-600'
        }`}
      >
        {t('category.allArticles')}
      </button>

      {/* Category Buttons */}
      {categories.map((category) => {
        const isSelected = selectedCategory === category.slug
        const categoryName = getCategoryName(category)

        return (
          <button
            key={category.slug}
            onClick={() => onSelect(category.slug)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
              isSelected
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text border border-light-border dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-600'
            }`}
          >
            {categoryName}
          </button>
        )
      })}
    </div>
  )
}
