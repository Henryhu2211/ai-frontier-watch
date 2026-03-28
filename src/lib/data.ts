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
    slug: 'forum',
    name: 'AI Forum',
    nameZh: '行业论坛',
    description: 'Latest AI industry news from forums, TikTok, Instagram, YouTube and communities',
    descriptionZh: '来自论坛、TikTok、Instagram、YouTube等平台的最新AI行业资讯',
    articleCount: 234,
  },
  {
    slug: 'claw',
    name: 'Claw Tech',
    nameZh: 'Claw前沿科技',
    description: 'OpenClaw, QClaw, EasyClaw, Zhipu and other Claw products, skills, agents',
    descriptionZh: 'OpenClaw、QClaw、EasyClaw、质谱等Claw产品，skills、agents前沿科技',
    articleCount: 156,
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
  // Forum Articles - AI Industry News from Social Media & Forums
  {
    id: '11',
    title: 'TikTok AI内容创作者突破1000万，短视频AI生态爆发',
    summary: 'TikTok平台上的AI内容创作者数量突破1000万大关，AI生成内容、AI教程和AI工具评测成为最热门内容类型。',
    content: 'Full article content here...',
    source: 'TikTok',
    author: 'AI观察者',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    tags: ['TikTok', 'AI Creator', '短视频'],
    category: 'forum',
    language: 'zh',
    readTime: 5,
  },
  {
    id: '12',
    title: 'YouTube AI Tutorial Channels See 300% Growth in Subscribers',
    summary: 'AI-focused YouTube channels have experienced explosive growth, with top channels gaining millions of subscribers in just months.',
    content: 'Full article content here...',
    source: 'YouTube',
    author: 'Tech Analyst',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80',
    tags: ['YouTube', 'AI Education', 'Growth'],
    category: 'forum',
    language: 'en',
    readTime: 4,
  },
  {
    id: '13',
    title: 'Reddit r/artificial 讨论：2026年AI发展趋势预测',
    summary: 'Reddit人工智能社区热议2026年AI发展趋势，多模态AI、AI代理和AI安全成为最受关注话题。',
    content: 'Full article content here...',
    source: 'Reddit',
    author: 'AI Community',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80',
    tags: ['Reddit', 'Discussion', 'Trends'],
    category: 'forum',
    language: 'zh',
    readTime: 6,
  },
  {
    id: '14',
    title: 'Instagram AI艺术家作品拍卖价格突破$100K',
    summary: 'AI生成艺术在Instagram上持续升温，知名AI艺术家的作品在数字艺术拍卖中创下新纪录。',
    content: 'Full article content here...',
    source: 'Instagram',
    author: 'Art Weekly',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80',
    tags: ['Instagram', 'AI Art', 'NFT'],
    category: 'forum',
    language: 'en',
    readTime: 5,
  },
  // Claw Tech Articles - OpenClaw, QClaw, EasyClaw, etc.
  {
    id: '15',
    title: 'OpenClaw 2.0正式发布：全新架构支持多模态Agent协作',
    summary: 'OpenClaw发布重大更新，新增多模态处理能力、Agent间通信协议，以及分布式任务调度功能。',
    content: 'Full article content here...',
    source: 'OpenClaw Official',
    author: 'OpenClaw Team',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    tags: ['OpenClaw', 'Agent', 'Multi-modal'],
    category: 'claw',
    language: 'en',
    readTime: 8,
    featured: true,
  },
  {
    id: '16',
    title: 'QClaw vs EasyClaw：2026年最全Claw平台对比评测',
    summary: '深度对比分析QClaw、EasyClaw、OpenClaw等主流Claw平台的功能特性、易用性和生态系统。',
    content: 'Full article content here...',
    source: 'AI评测网',
    author: 'Tech Reviewer',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    tags: ['QClaw', 'EasyClaw', 'Comparison'],
    category: 'claw',
    language: 'zh',
    readTime: 12,
  },
  {
    id: '17',
    title: '质谱AI发布新一代Agent Framework，支持100+工具集成',
    summary: '质谱AI推出全新Agent框架，可无缝集成超过100种常用开发工具和API，大幅提升自动化效率。',
    content: 'Full article content here...',
    source: 'Zhipu AI',
    author: '质谱团队',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    tags: ['Zhipu', 'Agent', 'Tools'],
    category: 'claw',
    language: 'zh',
    readTime: 7,
  },
  {
    id: '18',
    title: 'Building Advanced Skills with OpenClaw: A Complete Guide',
    summary: 'Learn how to create custom skills for OpenClaw, including workflow design, tool integration, and optimization techniques.',
    content: 'Full article content here...',
    source: 'OpenClaw Docs',
    author: 'Developer Relations',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    tags: ['OpenClaw', 'Skills', 'Tutorial'],
    category: 'claw',
    language: 'en',
    readTime: 15,
  },
  {
    id: '19',
    title: 'Claw生态大会2026参会指南：AI Agent的未来',
    summary: '年度Claw生态大会即将召开，汇聚OpenClaw、QClaw、EasyClaw等平台开发者，探讨AI Agent发展趋势。',
    content: 'Full article content here...',
    source: 'Claw Summit',
    author: 'Event Team',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    tags: ['Claw Summit', 'Conference', 'Agent'],
    category: 'claw',
    language: 'zh',
    readTime: 5,
  },
  {
    id: '20',
    title: 'Multi-Agent Systems: The Next Frontier in AI Automation',
    summary: 'Exploring how multiple AI agents can collaborate to solve complex problems, with real-world implementation examples.',
    content: 'Full article content here...',
    source: 'AI Research Weekly',
    author: 'Dr. Sarah Chen',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    tags: ['Multi-Agent', 'Automation', 'Research'],
    category: 'claw',
    language: 'en',
    readTime: 10,
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
