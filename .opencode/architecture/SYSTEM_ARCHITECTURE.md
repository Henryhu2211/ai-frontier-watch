# AI Frontier Watch - 系统架构文档

## 1. 系统概述

**项目**: AI Frontier Watch  
**版本**: 1.0  
**日期**: 2026-03-22  
**架构师**: Nevin  
**目标用户**: 自我学习研究者  
**核心功能**: 实时采集 AI 前沿资讯 → 自动分类 → SSR 网站展示

---

## 2. 高层架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           用户层                                          │
├────────────────────────┬────────────────────────┬───────────────────────┤
│      Web Browser        │     Mobile Browser     │    RSS Reader         │
│    (Next.js SSR)        │     (PWA Ready)        │    (Feedly etc.)      │
└────────────────────────┴────────────────────────┴───────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Edge CDN Layer                                   │
│                    Vercel Edge / Cloudflare                              │
│               (Static Assets + HTML Shell)                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SSR Server Layer                                 │
│                        Next.js Application                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Pages/     │  │   API/       │  │  Components/ │  │   Lib/      │ │
│  │   index      │  │   articles   │  │   ArticleCard│  │   db        │ │
│  │   article    │  │   search     │  │   Header     │  │   supabase  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                        ┌───────────┴───────────┐
                        ▼                       ▼
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│         Data Layer               │  │      Data Collection Layer      │
├─────────────────────────────────┤  ├─────────────────────────────────┤
│  ┌───────────┐  ┌─────────────┐ │  │  ┌───────────┐  ┌─────────────┐ │
│  │ Supabase  │  │  Upstash    │ │  │  │ Scheduler │  │   Crawler  │ │
│  │ PostgreSQL│  │  Redis      │ │  │  │  (cron)   │  │  (Python)  │ │
│  │ (articles)│  │  (cache)    │ │  │  │ 30min cycle│ │ arXiv/HN   │ │
│  └───────────┘  └─────────────┘ │  │  └───────────┘  └─────────────┘ │
│  ┌───────────┐  ┌─────────────┐ │  │  ┌───────────┐  ┌─────────────┐ │
│  │ Translation│  │  Auth      │ │  │  │  Parser   │  │  Dedupe     │ │
│  │  (DeepL)  │  │  (optional) │ │  │  │  Service  │  │  Service    │ │
│  └───────────┘  └─────────────┘ │  │  └───────────┘  └─────────────┘ │
└─────────────────────────────────┘  └─────────────────────────────────┘
```

---

## 3. 技术栈

| 层级 | 技术 | 理由 |
|------|------|------|
| **前端框架** | Next.js 14 (App Router) | SSR + ISR, 零配置部署 |
| **样式** | Tailwind CSS | 快速开发,暗黑模式支持 |
| **数据库** | Supabase PostgreSQL | Free tier, 实时订阅 |
| **缓存** | Upstash Redis | Serverless, 按需计费 |
| **爬虫** | Python (BeautifulSoup/Playwright) | 灵活抓取各种网站 |
| **翻译** | DeepL API | 高质量中英翻译 |
| **部署** | Vercel | SSR 友好, 全球 CDN |
| **监控** | Vercel Analytics | 零配置 |

---

## 4. 数据模型

### 4.1 Articles 表

```sql
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en VARCHAR(500) NOT NULL,
    title_zh VARCHAR(500),
    summary_en TEXT,
    summary_zh TEXT,
    content_en TEXT,
    content_zh TEXT,
    source_url VARCHAR(1000) NOT NULL,
    source_name VARCHAR(100) NOT NULL,
    source_type VARCHAR(20) DEFAULT 'news',
    category VARCHAR(50) NOT NULL,
    tags TEXT[],
    impact_level VARCHAR(20) DEFAULT 'interesting',
    complexity VARCHAR(20) DEFAULT 'technical',
    contains_code BOOLEAN DEFAULT false,
    published_at TIMESTAMP NOT NULL,
    fetched_at TIMESTAMP DEFAULT NOW(),
    language VARCHAR(5) DEFAULT 'en',
    url_hash VARCHAR(64) UNIQUE,
    
    -- arXiv 特有字段
    arxiv_id VARCHAR(20),
    arxiv_subfield VARCHAR(20),          -- cs.AI, cs.LG, cs.CV
    authors TEXT[],                      -- 作者列表
    authors_ affiliations TEXT[],       -- 作者机构
    doi VARCHAR(100),                   -- DOI (如果有)
    pdf_url VARCHAR(1000),              -- PDF 直链
    citation_count INT DEFAULT 0,        -- 引用数
    read_time_minutes INT,              -- 预估阅读时间
    
    -- 翻译状态
    translation_status VARCHAR(20) DEFAULT 'pending',  -- pending/processing/completed/failed
    translation_retry_count INT DEFAULT 0,
    translation_error TEXT,
    
    -- 元数据
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published ON articles(published_at DESC);
CREATE INDEX idx_articles_language ON articles(language);
CREATE INDEX idx_articles_arxiv_id ON articles(arxiv_id) WHERE arxiv_id IS NOT NULL;
CREATE INDEX idx_articles_authors ON articles(authors) USING GIN;
```

### 4.1.1 翻译任务表 (Translation Jobs)

```sql
CREATE TABLE translation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id),
    field VARCHAR(20) NOT NULL,           -- title, summary, content
    source_lang VARCHAR(5) DEFAULT 'en',
    target_lang VARCHAR(5) DEFAULT 'zh',
    status VARCHAR(20) DEFAULT 'pending',  -- pending/processing/completed/failed
    retry_count INT DEFAULT 0,
    error TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_translation_status ON translation_jobs(status);
CREATE INDEX idx_translation_article ON translation_jobs(article_id);
```

### 4.1.2 数据源健康状态表

```sql
CREATE TABLE source_health (
    id SERIAL PRIMARY KEY,
    source_id INT REFERENCES sources(id),
    status VARCHAR(20) DEFAULT 'healthy',  -- healthy/degraded/down/unknown
    last_success_at TIMESTAMP,
    last_failure_at TIMESTAMP,
    failure_count INT DEFAULT 0,
    error_message TEXT,
    is_overridden BOOLEAN DEFAULT false,
    override_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Categories 分类表

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_zh VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    sort_order INT DEFAULT 0
);

INSERT INTO categories (slug, name_en, name_zh, icon, sort_order) VALUES
('llms', 'Large Language Models', '大语言模型', '🤖', 1),
('vision', 'Computer Vision', '计算机视觉', '👁️', 2),
('safety', 'AI Safety & Alignment', 'AI 安全与对齐', '🛡️', 3),
('research', 'Research Breakthroughs', '研究突破', '🔬', 4),
('industry', 'Industry & Business', '行业动态', '🏢', 5),
('robotics', 'Robotics & Embodied AI', '机器人与具身智能', '🦾', 6),
('generative', 'Generative Media', '生成式媒体', '🎨', 7),
('infrastructure', 'AI Infrastructure', 'AI 基础设施', '⚙️', 8);
```

### 4.3 Sources 数据源表

```sql
CREATE TABLE sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    type VARCHAR(20) NOT NULL,
    language VARCHAR(5) DEFAULT 'en',
    fetch_interval_minutes INT DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    last_fetched_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. 数据采集流程

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Data Collection Flow                             │
└─────────────────────────────────────────────────────────────────────────┘

  Scheduler (每30分钟)
        │
        ▼
  ┌─────────────────┐
  │  Source Reader   │ ← 读取配置的数据源列表
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │   Crawler Job    │ ← 并行抓取多个数据源
  │  (Python/Node)  │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  Content Parser  │ ← 提取标题/内容/日期/作者
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │   Dedupe Check   │ ← URL hash 去重
  │   (Redis cache)  │
  └────────┬────────┘
           │
     ┌─────┴─────┐
     │ Duplicate?│
     └─────┬─────┘
       Yes │    No
           ▼         ▼
      [Skip]   ┌─────────────────┐
               │  Classifier     │ ← 分类 + 打标签
               │  (Rule + NLP)   │
               └────────┬────────┘
                        │
                        ▼
               ┌─────────────────┐
               │  Translator     │ ← DeepL 英→中
               │  (async)         │
               └────────┬────────┘
                        │
                        ▼
               ┌─────────────────┐
               │  Supabase DB    │ ← 存储文章
               └────────┬────────┘
                        │
                        ▼
               ┌─────────────────┐
               │  ISR Revalidate  │ ← 触发 Next.js 增量静态再生
               └─────────────────┘
```

---

## 6. SSR 策略

| 页面 | 渲染策略 | 缓存时间 |
|------|----------|----------|
| 首页 | ISR | revalidate: 60s |
| 分类页 | ISR | revalidate: 60s |
| 文章详情 | SSR + Cached | s-maxage: 300 |
| 搜索结果 | SSR | no-cache |
| API 列表 | API Route | Redis cache 60s |

---

## 7. 性能指标

| 指标 | 目标 |
|------|------|
| LCP (Largest Contentful Paint) | < 2s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Lighthouse Score | > 90 |
| 更新周期 | 30 分钟 |
| 内容覆盖率 | 95% (2小时内) |

---

## 8. 多语言支持

```typescript
// i18n 配置
const locales = ['en', 'zh']
const defaultLocale = 'en'

// 文章内容模型
interface Article {
  title_en: string      // 英文标题
  title_zh?: string     // 中文翻译
  summary_en: string    // 英文摘要
  summary_zh?: string   // 中文摘要
  content_en: string    // 英文正文
  content_zh?: string   // 中文翻译
}

// UI 翻译使用 next-i18next
// 内容翻译使用 DeepL API (异步)
```

---

## 9. 部署架构 (MVP)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Vercel                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Next.js Application                            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │ Edge Middle │  │  ISR Pages  │  │   API Routes            │  │   │
│  │  │ ware        │  │  (60s)      │  │   /api/articles         │  │   │
│  │  └─────────────┘  └─────────────┘  │   /api/search           │  │   │
│  │                                     └─────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
         │                      │                      │
         ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Supabase      │    │   Upstash      │    │   Vercel       │
│   PostgreSQL    │    │   Redis        │    │   Blob Storage │
│   (articles)    │    │   (cache)      │    │   (images)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**成本**: $0 (都在免费额度内)

---

## 10. 未来扩展

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 向量搜索 | P2 | Supabase pgvector 支持语义搜索 |
| RSS 输出 | P2 | 生成 RSS/Atom feed |
| 周报生成 | P2 | AI 总结本周要闻 |
| PWA 支持 | P2 | 离线阅读 + 推送通知 |
| 用户系统 | P3 | 个性化推荐 + 收藏同步 |
