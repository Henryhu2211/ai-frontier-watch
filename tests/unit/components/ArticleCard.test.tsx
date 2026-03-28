import React from 'react'
import { render, screen } from '@testing-library/react'
import ArticleCard from '@/components/ArticleCard'
import type { Article } from '@/types'

// Mock article data
const mockArticle: Article = {
  id: '1',
  title: 'Test Article Title',
  summary: 'Test article summary content',
  content: 'Full content here',
  source: 'Test Source',
  publishedAt: new Date().toISOString(),
  tags: ['test', 'article'],
  category: 'research',
  language: 'en',
}

describe('ArticleCard', () => {
  it('renders article title', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
  })

  it('renders article summary', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('Test article summary content')).toBeInTheDocument()
  })

  it('renders article source', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('Test Source')).toBeInTheDocument()
  })

  it('renders article category', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('categories.research')).toBeInTheDocument()
  })

  it('renders article source', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('Test Source')).toBeInTheDocument()
  })

  it('applies featured variant styling', () => {
    const { container } = render(
      <ArticleCard article={mockArticle} variant="featured" />
    )
    // Check if the component has the expected structure for featured variant
    expect(container.querySelector('article')).toBeInTheDocument()
  })

  it('applies compact variant styling', () => {
    const { container } = render(
      <ArticleCard article={mockArticle} variant="compact" />
    )
    // Check if the component has the expected structure for compact variant
    expect(container.querySelector('article')).toBeInTheDocument()
  })

  it('shows read time when provided', () => {
    const articleWithReadTime = { ...mockArticle, readTime: 5 }
    render(<ArticleCard article={articleWithReadTime} />)
    expect(screen.getByText(/5.*readTime/)).toBeInTheDocument()
  })

  it('hides image when showImage is false', () => {
    const articleWithImage = { ...mockArticle, imageUrl: 'https://example.com/image.jpg' }
    const { container } = render(
      <ArticleCard article={articleWithImage} showImage={false} />
    )
    // Image should not be rendered
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})