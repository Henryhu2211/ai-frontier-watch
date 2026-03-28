import type { Article, Category } from '@/types'

/**
 * Mock Categories
 */
export const categories: Category[] = [
  {
    slug: 'research',
    name: 'Research',
    nameZh: '研究',
    description: 'Latest AI research papers and breakthroughs',
    descriptionZh: '最新人工智能研究论文和突破',
    articleCount: 156,
  },
  {
    slug: 'industry',
    name: 'Industry',
    nameZh: '行业',
    description: 'AI applications in enterprise and business',
    descriptionZh: '企业级人工智能应用',
    articleCount: 89,
  },
  {
    slug: 'startups',
    name: 'Startups',
    nameZh: '初创公司',
    description: 'AI startup news and funding rounds',
    descriptionZh: '人工智能初创公司新闻和融资',
    articleCount: 67,
  },
  {
    slug: 'products',
    name: 'Products',
    nameZh: '产品',
    description: 'New AI products and tools',
    descriptionZh: '新人工智能产品和工具',
    articleCount: 124,
  },
  {
    slug: 'ethics',
    name: 'Ethics & Safety',
    nameZh: '伦理与安全',
    description: 'AI safety, ethics, and governance',
    descriptionZh: '人工智能安全、伦理与治理',
    articleCount: 45,
  },
  {
    slug: 'policy',
    name: 'Policy',
    nameZh: '政策',
    description: 'AI regulations and government policies',
    descriptionZh: '人工智能法规和政府政策',
    articleCount: 38,
  },
  {
    slug: 'tutorials',
    name: 'Tutorials',
    nameZh: '教程',
    description: 'Learn AI development step by step',
    descriptionZh: '一步步学习人工智能开发',
    articleCount: 92,
  },
  {
    slug: 'opinion',
    name: 'Opinion',
    nameZh: '观点',
    description: 'Expert opinions and analysis',
    descriptionZh: '专家观点和分析',
    articleCount: 51,
  },
]

/**
 * Mock Articles
 */
export const articles: Article[] = [
  {
    id: '1',
    title: 'OpenAI Announces GPT-5 with Revolutionary Reasoning Capabilities',
    summary: 'OpenAI has unveiled GPT-5, featuring advanced reasoning abilities that surpass previous models in mathematical proof solving and code generation benchmarks.',
    content: 'Full article content here...',
    source: 'AI News',
    author: 'Sarah Chen',
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    tags: ['GPT-5', 'OpenAI', 'LLM'],
    category: 'research',
    language: 'en',
    readTime: 8,
    featured: true,
  },
  {
    id: '2',
    title: 'Google DeepMind Achieves Breakthrough in Protein Folding Prediction',
    summary: 'DeepMind\'s latest AlphaFold model can now predict protein structures with 99% accuracy, potentially accelerating drug discovery by years.',
    content: 'Full article content here...',
    source: 'Nature Tech',
    author: 'Dr. James Liu',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    imageUrl: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800&q=80',
    tags: ['DeepMind', 'Protein', 'AlphaFold'],
    category: 'research',
    language: 'en',
    readTime: 12,
  },
  {
    id: '3',
    title: 'Anthropic Raises $2.5B to Advance Constitutional AI Development',
    summary: 'The AI safety company secures massive funding to expand its research into alignment and safety protocols for frontier models.',
    content: 'Full article content here...',
    source: 'Tech Crunch',
    author: 'Michael Park',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    tags: ['Anthropic', 'Funding', 'AI Safety'],
    category: 'startups',
    language: 'en',
    readTime: 6,
  },
  {
    id: '4',
    title: 'EU Passes Comprehensive AI Act: What It Means for Tech Companies',
    summary: 'The European Union has finalized its landmark AI regulation, establishing strict rules for high-risk AI systems and foundation models.',
    content: 'Full article content here...',
    source: 'Reuters',
    author: 'Emma Weber',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    tags: ['EU', 'Regulation', 'AI Act'],
    category: 'policy',
    language: 'en',
    readTime: 10,
  },
  {
    id: '5',
    title: 'Microsoft Copilot Gets Major Upgrade with Real-Time Code Generation',
    summary: 'Microsoft\'s AI-powered coding assistant now features real-time collaboration and multi-language support across 50+ programming languages.',
    content: 'Full article content here...',
    source: 'Microsoft Blog',
    author: 'David Zhang',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    tags: ['Microsoft', 'Copilot', 'Code Generation'],
    category: 'products',
    language: 'en',
    readTime: 7,
  },
  {
    id: '6',
    title: 'Meta Releases Open-Source LLM that Rivals GPT-4 Performance',
    summary: 'Meta AI announces LLaMA 3, an open-source large language model achieving state-of-the-art results on multiple benchmarks.',
    content: 'Full article content here...',
    source: 'Meta Research',
    author: 'Lisa Wang',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    tags: ['Meta', 'LLaMA', 'Open Source'],
    category: 'research',
    language: 'en',
    readTime: 9,
  },
  {
    id: '7',
    title: 'AI-Powered Medical Diagnostics Startup Secures FDA Breakthrough Status',
    summary: 'PathAI receives FDA designation for its AI system that detects early-stage cancer with 97% accuracy.',
    content: 'Full article content here...',
    source: 'Healthcare AI',
    author: 'Dr. Rachel Kim',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    tags: ['Healthcare', 'FDA', 'Cancer Detection'],
    category: 'industry',
    language: 'en',
    readTime: 11,
  },
  {
    id: '8',
    title: 'Stanford Report: AI Could Transform Education Within 5 Years',
    summary: 'New research from Stanford suggests AI tutors could personalize learning at scale, potentially reducing achievement gaps significantly.',
    content: 'Full article content here...',
    source: 'Stanford HAI',
    author: 'Prof. Andrew Ng',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80',
    tags: ['Education', 'Stanford', 'AI Tutors'],
    category: 'research',
    language: 'en',
    readTime: 8,
  },
  {
    id: '9',
    title: 'Chinese AI Lab Releases Multimodal Model Surpassing GPT-4V',
    summary: 'Baidu\'s ERNIE 4.0 Vision demonstrates superior performance in image understanding and video analysis tasks.',
    content: 'Full article content here...',
    source: 'Baidu AI',
    author: 'Wei Chen',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    imageUrl: 'https://images.unsplash.com/photo-1684391729462-63ef8c3f7f5e?w=800&q=80',
    tags: ['Baidu', 'Multimodal', 'Vision'],
    category: 'research',
    language: 'en',
    readTime: 7,
  },
  {
    id: '10',
    title: 'NVIDIA Unveils Next-Gen AI Chips with 3x Performance Boost',
    summary: 'The new H200 GPU promises to dramatically reduce training time and costs for large language models.',
    content: 'Full article content here...',
    source: 'NVIDIA',
    author: 'Jensen Huang',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    imageUrl: 'https://images.unsplash.com/photo-1591238372338-22d30c883a86?w=800&q=80',
    tags: ['NVIDIA', 'GPU', 'Hardware'],
    category: 'products',
    language: 'en',
    readTime: 6,
  },
]

/**
 * Get featured article
 */
export function getFeaturedArticle(): Article | undefined {
  return articles.find(article => article.featured)
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter(article => article.category === categorySlug)
}

/**
 * Get article by ID
 */
export function getArticleById(id: string): Article | undefined {
  return articles.find(article => article.id === id)
}

/**
 * Search articles
 */
export function searchArticles(query: string): Article[] {
  const lowerQuery = query.toLowerCase()
  return articles.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) ||
    article.summary.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Get related articles
 */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return articles
    .filter(a => a.id !== article.id && (
      a.category === article.category ||
      a.tags.some(tag => article.tags.includes(tag))
    ))
    .slice(0, limit)
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(category => category.slug === slug)
}
