// Article Types
export interface Article {
  id: string
  title: string
  summary: string
  content: string
  source: string
  sourceUrl?: string
  author?: string
  publishedAt: string
  updatedAt?: string
  imageUrl?: string
  tags: string[]
  category: string
  language: 'en' | 'zh'
  readTime?: number
  featured?: boolean
}

// Category Types
export interface Category {
  slug: string
  name: string
  nameZh: string
  description?: string
  descriptionZh?: string
  articleCount?: number
}

// Pagination Types
export interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  pagination?: PaginationInfo
}

// Search Types
export interface SearchParams {
  query: string
  category?: string
  language?: 'en' | 'zh'
  page?: number
  pageSize?: number
  sortBy?: 'relevance' | 'date'
}

// User Preferences
export interface UserPreferences {
  language: 'en' | 'zh'
  darkMode: boolean
  theme: 'light' | 'dark' | 'system'
}

// Component Props Types
export interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'featured' | 'compact' | 'horizontal'
  showImage?: boolean
}

export interface CategoryFilterProps {
  categories: Category[]
  selectedCategory?: string
  onSelect: (slug: string | null) => void
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisible?: number
}

export interface HeaderProps {
  onSearch?: (query: string) => void
  onLanguageChange?: (lang: 'en' | 'zh') => void
  onThemeToggle?: () => void
  currentLanguage?: 'en' | 'zh'
  isDarkMode?: boolean
}
