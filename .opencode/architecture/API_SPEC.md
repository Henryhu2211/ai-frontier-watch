# API 接口规范

## 1. Articles API

### 1.1 获取文章列表

```
GET /api/articles
```

**Query Parameters:**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | number | 1 | 页码 |
| limit | number | 20 | 每页数量 (max 50) |
| category | string | - | 分类筛选 |
| language | string | en | 语言 (en/zh) |
| since | string | - | 开始日期 (YYYY-MM-DD) |
| until | string | - | 结束日期 (YYYY-MM-DD) |
| impact | string | - | 重要程度 (breaking/significant/interesting) |
| search | string | - | 关键词搜索 |

**响应:**
```json
{
  "articles": [
    {
      "id": "uuid",
      "title": "GPT-5 Released with Breakthrough Reasoning",
      "title_zh": "GPT-5 发布，推理能力突破",
      "summary": "OpenAI announces GPT-5...",
      "summary_zh": "OpenAI 发布 GPT-5...",
      "source": "OpenAI Blog",
      "source_type": "news",
      "category": "llms",
      "tags": ["gpt-5", "openai", "reasoning"],
      "impact": "breaking",
      "published_at": "2026-03-22T10:00:00Z",
      "url": "https://openai.com/blog/gpt-5"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  },
  "meta": {
    "last_updated": "2026-03-22T10:30:00Z"
  }
}
```

---

### 1.2 获取单个文章

```
GET /api/articles/[id]
```

**响应:**
```json
{
  "article": {
    "id": "uuid",
    "title": "GPT-5 Released with Breakthrough Reasoning",
    "title_zh": "GPT-5 发布，推理能力突破",
    "summary": "Full article summary...",
    "summary_zh": "全文摘要...",
    "content": "Full article content in English...",
    "content_zh": "全文内容中文翻译...",
    "source": "OpenAI Blog",
    "source_url": "https://openai.com/blog/gpt-5",
    "source_type": "news",
    "category": "llms",
    "tags": ["gpt-5", "openai"],
    "impact": "breaking",
    "complexity": "technical",
    "contains_code": false,
    "published_at": "2026-03-22T10:00:00Z",
    "fetched_at": "2026-03-22T10:15:00Z",
    "metadata": {
      "authors": ["Sam Altman"],
      "read_time_minutes": 8
    }
  },
  "related": [
    // 3-5 related articles
  ]
}
```

---

### 1.3 获取分类列表

```
GET /api/categories
```

**响应:**
```json
{
  "categories": [
    {
      "slug": "llms",
      "name": "Large Language Models",
      "name_zh": "大语言模型",
      "icon": "🤖",
      "count": 45
    },
    {
      "slug": "vision",
      "name": "Computer Vision",
      "name_zh": "计算机视觉",
      "icon": "👁️",
      "count": 23
    }
  ]
}
```

---

### 1.4 搜索文章

```
GET /api/search
```

**Query Parameters:**
| 参数 | 类型 | 说明 |
|------|------|------|
| q | string | 搜索关键词 (必填) |
| language | string | 语言 (en/zh/all) |
| limit | number | 结果数量 (max 20) |

**响应:**
```json
{
  "query": "GPT-5",
  "results": [
    {
      "id": "uuid",
      "title": "GPT-5 Released...",
      "title_zh": "GPT-5 发布...",
      "summary": "...",
      "highlight": "OpenAI announces <mark>GPT-5</mark>...",
      "score": 0.95
    }
  ],
  "total": 12
}
```

---

## 2. Sources API

### 2.1 获取数据源列表

```
GET /api/sources
```

**响应:**
```json
{
  "sources": [
    {
      "id": 1,
      "name": "arXiv",
      "url": "https://arxiv.org",
      "type": "research",
      "language": "en",
      "fetch_interval": 60,
      "is_active": true,
      "last_fetched": "2026-03-22T10:00:00Z"
    }
  ]
}
```

---

## 3. Stats API

### 3.1 获取统计信息

```
GET /api/stats
```

**响应:**
```json
{
  "total_articles": 1250,
  "today_articles": 25,
  "categories": {
    "llms": 450,
    "vision": 180,
    "safety": 120,
    "research": 280,
    "industry": 220
  },
  "sources": {
    "total": 12,
    "active": 10
  },
  "last_updated": "2026-03-22T10:30:00Z"
}
```

---

## 4. Internal APIs (爬虫使用)

### 4.1 创建文章

```
POST /api/internal/articles
```

**请求:**
```json
{
  "title": "Article Title",
  "summary": "Article summary...",
  "content": "Full content...",
  "source_url": "https://example.com/article",
  "source_name": "Example",
  "source_type": "news",
  "published_at": "2026-03-22T10:00:00Z",
  "metadata": {}
}
```

**响应:**
```json
{
  "success": true,
  "article_id": "uuid",
  "duplicated": false
}
```

---

## 5. 错误码

| 错误码 | HTTP 状态 | 描述 |
|--------|-----------|------|
| `INVALID_PARAMS` | 400 | 参数错误 |
| `NOT_FOUND` | 404 | 文章不存在 |
| `RATE_LIMITED` | 429 | 请求过于频繁 |
| `INTERNAL_ERROR` | 500 | 服务器错误 |
| `SERVICE_UNAVAILABLE` | 503 | 服务暂时不可用 |

---

## 6. 速率限制

| 端点 | 限制 |
|------|------|
| `GET /api/articles` | 100 req/min |
| `GET /api/search` | 30 req/min |
| `POST /api/internal/*` | 10 req/min |
