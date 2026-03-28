import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Query parameter "q" is required'
      }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Build query
    let dbQuery = supabase
      .from('articles')
      .select('*')
      .eq('is_duplicate', false)

    // Add search filter
    dbQuery = dbQuery.or(`title_en.ilike.%${query}%,summary_en.ilike.%${query}%`)

    // Add category filter if provided
    if (category && category !== 'all') {
      dbQuery = dbQuery.eq('category', category)
    }

    // Add pagination
    dbQuery = dbQuery
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: articles, error, count } = await dbQuery

    if (error) {
      throw new Error(`Search failed: ${error.message}`)
    }

    // Transform articles for response
    const transformedArticles = (articles || []).map(article => ({
      id: article.id,
      title: article.title_en,
      summary: article.summary_en,
      source: article.source_name,
      category: article.category,
      published_at: article.published_at,
      arxiv_id: article.arxiv_id,
      tags: article.tags || [],
      translation_status: article.translation_status
    }))

    return NextResponse.json({
      success: true,
      query: query,
      category: category || 'all',
      total: count || transformedArticles.length,
      limit,
      offset,
      articles: transformedArticles,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Search failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}