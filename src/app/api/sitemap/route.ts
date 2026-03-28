import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ai-frontier-watch.vercel.app'
    
    // Fetch articles for sitemap
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, published_at, updated_at')
      .eq('is_duplicate', false)
      .order('published_at', { ascending: false })
      .limit(1000)

    if (articlesError) {
      throw new Error(`Failed to fetch articles: ${articlesError.message}`)
    }

    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('articles')
      .select('category')
      .not('category', 'is', null)
      .eq('is_duplicate', false)

    const categories = Array.from(new Set((categoriesData || []).map(item => item.category))).filter(Boolean)

    // Generate sitemap XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/categories</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- Category Pages -->
  ${categories.map(category => `
  <url>
    <loc>${baseUrl}/category/${category}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
  
  <!-- Article Pages -->
  ${(articles || []).slice(0, 500).map(article => `
  <url>
    <loc>${baseUrl}/article/${article.id}</loc>
    <lastmod>${new Date(article.updated_at || article.published_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`

    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    })
  } catch (error) {
    console.error('Sitemap generation failed:', error)
    
    // Return basic sitemap on error
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ai-frontier-watch.vercel.app'
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/categories</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`

    return new NextResponse(errorXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    })
  }
}