import { getHomepageArticles, searchArticles, getCategories } from '@/lib/api'

// Mock the Supabase module
jest.mock('@/lib/supabase', () => ({
  supabase: {
    rpc: jest.fn(),
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
  },
}))

describe('API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getHomepageArticles', () => {
    it('returns articles from Supabase', async () => {
      const mockArticles = [
        {
          id: '1',
          title_en: 'Test Article',
          summary_en: 'Test summary',
          source_type: 'research',
          source_name: 'Test Source',
          category: 'research',
          published_at: new Date().toISOString(),
          arxiv_id: null,
          translation_status: 'completed',
          view_count: 10,
        },
      ]

      const { supabase } = require('@/lib/supabase')
      supabase.rpc.mockResolvedValue({ data: mockArticles, error: null })

      const articles = await getHomepageArticles()
      
      expect(supabase.rpc).toHaveBeenCalledWith('get_homepage_articles', {
        p_limit: 50,
        p_offset: 0,
      })
      expect(articles).toHaveLength(1)
      expect(articles[0].title).toBe('Test Article')
    })

    it('falls back to mock data on error', async () => {
      const { supabase } = require('@/lib/supabase')
      supabase.rpc.mockResolvedValue({ data: null, error: new Error('DB Error') })

      const articles = await getHomepageArticles()
      
      // Should return mock data
      expect(articles.length).toBeGreaterThan(0)
    })
  })

  describe('searchArticles', () => {
    it('searches articles by query', async () => {
      const mockSearchResults = [
        {
          id: '1',
          title_en: 'Search Result',
          summary_en: 'Search summary',
          source_type: 'news',
          source_name: 'News Source',
          category: 'industry',
          published_at: new Date().toISOString(),
          arxiv_id: null,
          translation_status: 'completed',
          view_count: 5,
        },
      ]

      const { supabase } = require('@/lib/supabase')
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockSearchResults, error: null }),
      })

      const results = await searchArticles('test query', 10)
      
      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('Search Result')
    })
  })

  describe('getCategories', () => {
    it('returns categories with article counts', async () => {
      const mockArticles = [
        { category: 'research' },
        { category: 'research' },
        { category: 'industry' },
        { category: null },
      ]

      const { supabase } = require('@/lib/supabase')
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        not: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: mockArticles, error: null }),
      })

      const categories = await getCategories()
      
      expect(categories).toHaveLength(2) // research and industry
      expect(categories.find((c: any) => c.slug === 'research').articleCount).toBe(2)
      expect(categories.find((c: any) => c.slug === 'industry').articleCount).toBe(1)
    })

    it('falls back to mock categories on error', async () => {
      const { supabase } = require('@/lib/supabase')
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        not: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: new Error('DB Error') }),
      })

      const categories = await getCategories()
      
      // Should return mock categories
      expect(categories.length).toBeGreaterThan(0)
    })
  })
})