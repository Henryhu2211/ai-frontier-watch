# 架构决策记录 (ADR)

## ADR-001: Next.js SSR 框架

**状态**: 已接受  
**日期**: 2026-03-22  
**决策者**: Nevin

### 背景
需要快速开发一个实时更新的 AI 新闻网站，要求 SSR 支持动态内容、ISR 支持增量更新、部署简单。

### 决策
采用 Next.js 14 (App Router) 作为前端框架。

### 后果
**优点**:
- SSR + ISR 支持，兼顾实时性和性能
- Vercel 一键部署，零运维
- React 生态丰富，组件复用高
- API Routes 统一前后端

**缺点**:
- Node.js 环境限制
- 冷启动延迟 (Vercel Edge 缓解)

---

## ADR-002: Supabase PostgreSQL 数据库

**状态**: 已接受  
**日期**: 2026-03-22  
**决策者**: Nevin

### 背景
MVP 阶段需要低成本、高可用的数据库方案。

### 决策
使用 Supabase PostgreSQL:
- Free tier: 500MB 存储
- 内置 REST API (PostgREST)
- 实时订阅支持
- 简单认证可选

### 备选方案
- PlanetScale (MySQL) - 免费但无 PostgreSQL 特性
- MongoDB Atlas - 文档存储更灵活但关联查询弱

---

## ADR-003: Python 爬虫 + Node.js API 分离

**状态**: 已接受  
**日期**: 2026-03-22  
**决策者**: Nevin

### 背景
爬虫需要处理复杂 HTML 解析、JS 渲染、代理轮换；API 需要快速响应。

### 决策
```
┌─────────────────┐     ┌─────────────────┐
│  Python Crawler │────▶│  Supabase DB    │
│  (独立服务)       │     │                 │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │   Next.js API   │
                        │   (Node.js)     │
                        └─────────────────┘
```

**优点**:
- 爬虫独立，不影响主站性能
- Python 爬虫库更丰富 (BeautifulSoup, Playwright, Scrapy)
- 便于定时任务 (cron) 管理

**缺点**:
- 两套代码栈需要维护
- 需要额外服务器部署爬虫

### MVP 简化
初期可用 Node.js 爬虫，后续再拆分 Python 服务。

---

## ADR-004: DeepL API 翻译

**状态**: 已接受  
**日期**: 2026-03-22  
**决策者**: Nevin

### 背景
需要将英文内容翻译为中文，支持中英双语阅读。

### 决策
使用 DeepL API:
- Free tier: 50万字符/月
- 翻译质量高于 Google Translate
- 支持 20+ 语言

### 成本估算
| 月访问量 | 字符/篇 | 月字符 | 费用 |
|----------|---------|--------|------|
| 100篇 × 5篇/天 | 2000 | 600k | $0 (Free) |

超出免费额度后: $0.00002/字符 ≈ $12/月 (1000万字符)

### 重试机制
```typescript
interface TranslationJob {
  maxRetries: 3,
  backoffMs: [1000, 5000, 30000],  // 1s, 5s, 30s
  fallback: 'show_en_only',        // 翻译失败时显示英文
  queuePriority: 'normal'          // 普通队列
}

// 翻译失败处理流程
1. 首次失败 → 记录 + 重试 (1s 后)
2. 二次失败 → 重试 (5s 后)
3. 三次失败 → 重试 (30s 后)
4. 四次失败 → 标记 FAILED + 显示原文 + 发送告警
5. 每日凌晨 → 重新处理所有 FAILED 任务
```

---

## ADR-005: Redis 缓存层

**状态**: 已接受  
**日期**: 2026-03-22  
**决策者**: Nevin

### 背景
需要缓存热门查询结果，减少数据库压力。

### 决策
使用 Upstash Redis:
- Serverless pricing (按请求计费)
- HTTP API，无需维护连接
- 与 Vercel 集成良好

### 缓存策略
```typescript
// 缓存键设计
article:${id}           → 文章详情 (TTL: 5min)
articles:list:${cat}   → 分类列表 (TTL: 1min)
articles:search:${hash} → 搜索结果 (TTL: 1min)
source:dedupe:${hash}   → 去重检查 (TTL: 24h)
```

---

## ADR-006: 分类系统设计

**状态**: 已接受  
**日期**: 2026-03-22  
**决策者**: Nevin

### 背景
需要将 AI 新闻自动分类到预定义分类中。

### 决策
采用规则 + NLP 混合分类:

```typescript
// 规则分类 (快速)
const rules = [
  { keywords: ['gpt', 'llm', 'claude', 'gemini', 'transformer'], category: 'llms' },
  { keywords: ['safety', 'alignment', 'rlhf', 'constitutional'], category: 'safety' },
  { keywords: ['vision', 'object detection', 'segmentation'], category: 'vision' },
  // ...
]

// 分类置信度阈值
if (confidence < 0.7) {
  category = 'research' // 默认分类
}
```

### 分类列表 (MVP: 5类, 完整: 8类)
| Slug | English | 中文 |
|------|---------|------|
| llms | Large Language Models | 大语言模型 |
| vision | Computer Vision | 计算机视觉 |
| safety | AI Safety & Alignment | AI 安全与对齐 |
| research | Research Breakthroughs | 研究突破 |
| industry | Industry & Business | 行业动态 |

---

## ADR-007: 去重策略

**状态**: 已接受  
**日期**: 2026-03-22  
**决策者**: Nevin

### 背景
同一新闻可能被多个来源报道，需要去重避免重复展示。

### 决策
三级去重:

```typescript
// Level 1: URL Hash (精确匹配)
const urlHash = crypto.createHash('md5').update(url).digest('hex')

// Level 2: Title Similarity (模糊匹配)
const titleSim = jaccardSimilarity(title1, title2)
if (titleSim > 0.8) duplicate = true

// Level 3: Published Time + Source Group
// 同一天同一来源组的相似标题 → 合并
```

### 存储
使用 Redis Set 存储 URL hash (24小时 TTL)，减少数据库查询。

---

## ADR-008: ISR vs SSR vs CSR

**状态**: 已接受  
**日期**: 2026-03-22  
**决策者**: Nevin

### 决策
| 页面 | 策略 | 理由 |
|------|------|------|
| 首页 | ISR (60s) | 内容更新频繁，需要 SEO |
| 分类页 | ISR (60s) | 同上 |
| 文章详情 | SSR + CDN | 内容相对稳定，缓存友好 |
| 搜索页 | CSR (client) | 动态内容，无缓存必要 |
| 用户收藏 | CSR (localStorage) | 纯本地，无需服务端 |

---

## ADR-009: 部署方案

**状态**: 已接受  
**日期**: 2026-03-22  
**决策者**: Nevin + Jack

### MVP 部署 (预算 $0)

```
Frontend: Vercel (Free)
├── SSR + ISR
├── Global CDN
└── 100GB bandwidth/month

Database: Supabase (Free)
├── PostgreSQL 500MB
├── REST API
└── 2GB transfer/month

Cache: Upstash (Free)
├── 10k commands/day
└── 1GB data

Crawler: Vercel Cron / Railway
├── Python script
└── 每30分钟触发
```

### 扩展路径
当流量增长时:
- Vercel Pro ($20/mo) - 更多带宽
- Supabase Pro ($25/mo) - 更多存储
- Railway/Render - 自托管爬虫

---

## ADR-010: 数据保留策略

**状态**: 已接受  
**日期**: 2026-03-22  
**决策者**: Nevin

### 决策
| 数据类型 | 保留期 | 存储 |
|----------|--------|------|
| 文章全文 | 12 个月 | PostgreSQL |
| 元数据 + 摘要 | 24 个月 | PostgreSQL |
| 去重 Hash | 24 小时 | Redis |
| 用户收藏 | 永久 | localStorage |

### 回填策略
- 按天回填，不保留小时级粒度
- 使用 GitHub Actions 定时任务
- 最多回填 30 天历史数据
