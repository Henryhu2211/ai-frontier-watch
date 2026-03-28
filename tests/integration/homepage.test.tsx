import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import HomePage from '@/app/page'

// Mock the API functions
jest.mock('@/lib/api', () => ({
  getHomepageArticles: jest.fn(),
  getCategories: jest.fn(),
}))

// Mock the components
jest.mock('@/components', () => ({
  ArticleCard: ({ article }: { article: any }) => (
    <div data-testid={`article-card-${article.id}`}>
      <h3>{article.title}</h3>
      <p>{article.summary}</p>
    </div>
  ),
}))

describe('HomePage Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders homepage with loading state initially', () => {
    const { getHomepageArticles, getCategories } = require('@/lib/api')
    getHomepageArticles.mockImplementation(() => new Promise(() => {}))
    getCategories.mockImplementation(() => new Promise(() => {}))

    render(<HomePage />)
    
    // Should show loading skeleton
    expect(screen.getAllByRole('presentation')).toHaveLength(1)
  })

  it('renders homepage with articles after loading', async () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Featured Article',
        summary: 'Featured summary',
        category: 'research',
        publishedAt: new Date().toISOString(),
        source: 'Test Source',
        tags: ['test'],
        language: 'en',
        featured: true,
      },
      {
        id: '2',
        title: 'Regular Article',
        summary: 'Regular summary',
        category: 'industry',
        publishedAt: new Date().toISOString(),
        source: 'Test Source',
        tags: ['test'],
        language: 'en',
        featured: false,
      },
    ]

    const mockCategories = [
      {
        slug: 'research',
        name: 'Research',
        nameZh: '研究',
        articleCount: 1,
      },
      {
        slug: 'industry',
        name: 'Industry',
        nameZh: '行业',
        articleCount: 1,
      },
    ]

    const { getHomepageArticles, getCategories } = require('@/lib/api')
    getHomepageArticles.mockResolvedValue(mockArticles)
    getCategories.mockResolvedValue(mockCategories)

    render(<HomePage />)

    await waitFor(() => {
      expect(screen.getByText('Featured Article')).toBeInTheDocument()
      expect(screen.getByText('Regular Article')).toBeInTheDocument()
      expect(screen.getByText('Research')).toBeInTheDocument()
      expect(screen.getByText('Industry')).toBeInTheDocument()
    })
  })

  it('displays error message when API fails', async () => {
    const { getHomepageArticles, getCategories } = require('@/lib/api')
    getHomepageArticles.mockRejectedValue(new Error('API Error'))
    getCategories.mockRejectedValue(new Error('API Error'))

    render(<HomePage />)

    await waitFor(() => {
      // Should fallback to mock data, not show error
      expect(screen.getByText(/GPT-5/)).toBeInTheDocument()
    })
  })

  it('renders breaking news section', async () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Breaking News Article',
        summary: 'Breaking news summary',
        category: 'research',
        publishedAt: new Date().toISOString(),
        source: 'Test Source',
        tags: ['test'],
        language: 'en',
        featured: true,
      },
    ]

    const { getHomepageArticles, getCategories } = require('@/lib/api')
    getHomepageArticles.mockResolvedValue(mockArticles)
    getCategories.mockResolvedValue([])

    render(<HomePage />)

    await waitFor(() => {
      expect(screen.getByText(/breaking/i)).toBeInTheDocument()
      expect(screen.getByText('Breaking News Article')).toBeInTheDocument()
    })
  })

  it('renders categories section', async () => {
    const mockCategories = [
      {
        slug: 'research',
        name: 'Research',
        nameZh: '研究',
        articleCount: 5,
      },
      {
        slug: 'ethics',
        name: 'Ethics & Safety',
        nameZh: '伦理与安全',
        articleCount: 3,
      },
    ]

    const { getHomepageArticles, getCategories } = require('@/lib/api')
    getHomepageArticles.mockResolvedValue([])
    getCategories.mockResolvedValue(mockCategories)

    render(<HomePage />)

    await waitFor(() => {
      expect(screen.getByText('Research')).toBeInTheDocument()
      expect(screen.getByText('Ethics & Safety')).toBeInTheDocument()
      expect(screen.getByText('5 articles')).toBeInTheDocument()
      expect(screen.getByText('3 articles')).toBeInTheDocument()
    })
  })
})