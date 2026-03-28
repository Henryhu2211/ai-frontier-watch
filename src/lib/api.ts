import { supabase } from './supabase'
import type { HomepageArticle } from '@/types/supabase'
import type { Article as FrontendArticle, Category } from '@/types'

// Transform Supabase article to frontend Article type
export function transformArticle(article: HomepageArticle): FrontendArticle {
  // Use Chinese title if available and user preference is Chinese
  const isZh = typeof window !== 'undefined' && 
    (localStorage.getItem('language') === 'zh' || navigator.language.startsWith('zh'))
  
  return {
    id: article.id,
    title: isZh && article.title_zh ? article.title_zh : article.title_en,
    summary: isZh && article.summary_zh ? article.summary_zh : (article.summary_en || ''),
    content: '', // Full content would be fetched separately
    source: article.source_name || 'Unknown',
    sourceUrl: undefined,
    author: undefined,
    publishedAt: article.published_at,
    updatedAt: undefined,
    imageUrl: undefined, // Would need to be added to database or derived
    tags: [], // Would need to be fetched from article
    category: article.category || 'research',
    language: isZh ? 'zh' : 'en',
    readTime: Math.ceil((article.summary_en?.length || 0) / 200), // Estimate: 200 chars/min
    featured: article.translation_status === 'completed', // Use translated as featured
  }
}

// Fetch homepage articles
export async function getHomepageArticles(
  limit: number = 50,
  offset: number = 0
): Promise<FrontendArticle[]> {
  try {
    const { data, error } = await supabase.rpc('get_homepage_articles', {
      p_limit: limit,
      p_offset: offset,
    })

    if (error) {
      console.error('Error fetching homepage articles:', error)
      // Fallback to mock data if Supabase fails
      return await getMockArticles()
    }

    if (!data || data.length === 0) {
      console.warn('No articles found in database, using mock data')
      return await getMockArticles()
    }

    return data.map(transformArticle)
  } catch (error) {
    console.error('Failed to fetch homepage articles:', error)
    return await getMockArticles()
  }
}

// Fetch articles by category
export async function getArticlesByCategory(
  category: string,
  limit: number = 20,
  offset: number = 0
): Promise<FrontendArticle[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category', category)
      .eq('is_duplicate', false)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching articles by category:', error)
      return []
    }

    return (data || []).map((article: Record<string, unknown>) => transformArticle({
      id: article.id as string,
      title_en: article.title_en as string,
      title_zh: article.title_zh as string | null,
      summary_en: article.summary_en as string | null,
      summary_zh: article.summary_zh as string | null,
      source_type: article.source_type as string,
      source_name: article.source_name as string | null,
      category: article.category as string | null,
      published_at: article.published_at as string,
      arxiv_id: article.arxiv_id as string | null,
      translation_status: article.translation_status as string,
      view_count: (article.view_count as number) || 0,
    }))
  } catch (error) {
    console.error('Failed to fetch articles by category:', error)
    return []
  }
}

// Fetch single article by ID
export async function getArticleById(id: string): Promise<FrontendArticle | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching article:', error)
      return null
    }

    if (!data) return null

    return transformArticle({
      ...data,
      title_zh: null,
      summary_zh: null,
      source_type: data.source_type,
      source_name: data.source_name,
      translation_status: data.translation_status,
      view_count: data.view_count || 0,
    })
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return null
  }
}

// Search articles
export async function searchArticles(
  query: string,
  limit: number = 20
): Promise<FrontendArticle[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .or(`title_en.ilike.%${query}%,summary_en.ilike.%${query}%`)
      .eq('is_duplicate', false)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error searching articles:', error)
      return []
    }

    return (data || []).map((article: Record<string, unknown>) => transformArticle({
      id: article.id as string,
      title_en: article.title_en as string,
      title_zh: article.title_zh as string | null,
      summary_en: article.summary_en as string | null,
      summary_zh: article.summary_zh as string | null,
      source_type: article.source_type as string,
      source_name: article.source_name as string | null,
      category: article.category as string | null,
      published_at: article.published_at as string,
      arxiv_id: article.arxiv_id as string | null,
      translation_status: article.translation_status as string,
      view_count: (article.view_count as number) || 0,
    }))
  } catch (error) {
    console.error('Failed to search articles:', error)
    return []
  }
}

// Get categories with article counts
export async function getCategories(): Promise<Category[]> {
  try {
    // Get categories from articles table with counts
    const { data, error } = await supabase
      .from('articles')
      .select('category')
      .not('category', 'is', null)
      .eq('is_duplicate', false)

    if (error) {
      console.error('Error fetching categories:', error)
      return await getMockCategories()
    }

    // Count articles per category
    const categoryCounts: Record<string, number> = {}
    data?.forEach((article: { category: string | null }) => {
      if (article.category) {
        categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1
      }
    })

    // Transform to Category type
    const categories: Category[] = Object.entries(categoryCounts).map(([slug, count]) => ({
      slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      nameZh: getCategoryNameZh(slug),
      description: getCategoryDescription(slug),
      descriptionZh: getCategoryDescriptionZh(slug),
      articleCount: count,
    }))

    return categories.length > 0 ? categories : await getMockCategories()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return await getMockCategories()
  }
}

// Helper functions for Chinese category names
function getCategoryNameZh(slug: string): string {
  const names: Record<string, string> = {
    research: '研究',
    industry: '行业',
    startups: '初创公司',
    products: '产品',
    ethics: '伦理与安全',
    policy: '政策',
    tutorials: '教程',
    opinion: '观点',
    forum: '行业论坛',
    claw: 'Claw前沿科技',
  }
  return names[slug] || slug
}

function getCategoryDescription(slug: string): string {
  const descriptions: Record<string, string> = {
    research: 'Latest AI research papers and breakthroughs',
    industry: 'AI applications in enterprise and business',
    startups: 'AI startup news and funding rounds',
    products: 'New AI products and tools',
    ethics: 'AI safety, ethics, and governance',
    policy: 'AI regulations and government policies',
    tutorials: 'Learn AI development step by step',
    opinion: 'Expert opinions and analysis',
    forum: 'Latest AI industry news from forums, social media, and communities',
    claw: 'OpenClaw, QClaw, EasyClaw, Zhipu and other Claw products, skills, agents',
  }
  return descriptions[slug] || ''
}

function getCategoryDescriptionZh(slug: string): string {
  const descriptions: Record<string, string> = {
    research: '最新人工智能研究论文和突破',
    industry: '企业级人工智能应用',
    startups: '人工智能初创公司新闻和融资',
    products: '新人工智能产品和工具',
    ethics: '人工智能安全、伦理与治理',
    policy: '人工智能法规和政府政策',
    tutorials: '一步步学习人工智能开发',
    opinion: '专家观点和分析',
    forum: '来自论坛、社交媒体和社区的最新AI行业资讯',
    claw: 'OpenClaw、QClaw、EasyClaw、质谱等Claw产品，skills、agents前沿科技',
  }
  return descriptions[slug] || ''
}

// Mock data fallback (from lib/data.ts)
async function getMockArticles(): Promise<FrontendArticle[]> {
  // Dynamic import for mock data
  const data = await import('./data')
  return data.articles
}

async function getMockCategories(): Promise<Category[]> {
  const data = await import('./data')
  return data.categories
}