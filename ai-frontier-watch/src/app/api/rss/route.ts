import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    
    // Fetch recent articles for RSS feed
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_duplicate', false)
      .order('published_at', { ascending: false })
      .limit(50)

    if (error) {
      throw new Error(`Failed to fetch articles: ${error.message}`)
    }

    // Generate RSS XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Frontier Watch</title>
    <description>Latest AI research papers and news from the frontier of artificial intelligence</description>
    <link>${process.env.NEXT_PUBLIC_APP_URL || 'https://ai-frontier-watch.vercel.app'}</link>
    <atom:link href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ai-frontier-watch.vercel.app'}/feed" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>editor@ai-frontier-watch.com (AI Frontier Watch)</managingEditor>
    <webMaster>admin@ai-frontier-watch.com (AI Frontier Watch)</webMaster>
    
    ${(articles || []).map(article => `
    <item>
      <title><![CDATA[${article.title_en}]]></title>
      <description><![CDATA[${article.summary_en || ''}]]></description>
      <link>${article.source_url}</link>
      <guid isPermaLink="false">${article.id}</guid>
      <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
      <category>${article.category || 'AI News'}</category>
      <author>${article.source_name || 'AI Frontier Watch'}</author>
    </item>`).join('')}
  </channel>
</rss>`

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('RSS generation failed:', error)
    
    // Return empty RSS feed on error
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AI Frontier Watch</title>
    <description>Error loading feed</description>
    <link>${process.env.NEXT_PUBLIC_APP_URL || 'https://ai-frontier-watch.vercel.app'}</link>
    <item>
      <title>Feed Error</title>
      <description>Unable to load articles at this time. Please try again later.</description>
    </item>
  </channel>
</rss>`

    return new NextResponse(errorXml, {
      status: 503,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    })
  }
}