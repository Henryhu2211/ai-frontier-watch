# AI Frontier Watch - 项目 TODO 任务追踪

## 项目概述
**项目名称**: AI Frontier Watch  
**创建日期**: 2026-03-22  
**产品愿景**: 实时采集、分类、生成 HTML 网站查阅 AI 前沿科技信息  
**目标用户**: 自我学习、研究为主 (Self-Learning Researcher)  
**技术选型**: SSR (Next.js) + Supabase (MVP省钱优先)

---

## 用户画像

| 角色 | 描述 | 核心需求 |
|------|------|----------|
| **Primary: 自主研究者** | PhD学生/独立研究员/技术爱好者 | 快速获取 AI 资讯、中英双语、历史上下文 |
| Secondary: 行业从业者 | 科技公司员工需要竞品情报 | 简洁日报、移动端友好、快速浏览 |
| Tertiary: 内容策展人 | 博客/Newsletter 作者 | 便捷分享、来源追溯、分类订阅 |

---

## 阶段 1: 需求确认 (P0)

| ID | 任务 | 状态 | 负责人 |
|----|------|------|--------|
| TODO-001 | 确认数据源列表 (arXiv + 新闻站) | ✅ 已确认 | Jamie |
| TODO-002 | 确认分类体系 (5分类 MVP / 8分类 完整) | ✅ 已确认 | Jamie |
| TODO-003 | 确认多语言策略 (EN/ZH 并行) | ✅ 已确认 | Jamie |
| TODO-004 | 确认 arXiv 特殊需求 (ID/PDF/作者/子领域) | ✅ 已确认 | Jamie |
| TODO-005 | 确认翻译重试机制 | ✅ 已确认 | Jamie |
| TODO-006 | 确认搜索排序算法 | ✅ 已确认 | Jamie |

---

## 阶段 1.5: 用户故事 (User Stories)

### Primary: 自主研究者
| ID | 故事 | 优先级 |
|----|------|--------|
| US-001 | 作为研究者，我希望按日期浏览 arXiv 论文，以便跟踪最新预印本 | P0 |
| US-002 | 作为研究者，我希望看到论文元数据 (作者/摘要)，以便评估相关性 | P0 |
| US-003 | 作为研究者，我希望一键跳转 PDF，以便阅读完整论文 | P0 |
| US-004 | 作为研究者，我希望有双语摘要，以便用偏好语言快速阅读 | P0 |
| US-005 | 作为研究者，我希望按难度筛选，以便找到适合水平的内容 | P0 |
| US-006 | 作为研究者，我希望暗黑模式，以便夜间舒适阅读 | P0 |
| US-007 | 作为研究者，我希望关键词搜索，以便找到特定主题 | P0 |
| US-008 | 作为研究者，我希望本地保存文章，以便离线阅读 | P1 |
| US-009 | 作为研究者，我希望 BibTeX 导出，以便快速引用 | P2 |
| US-010 | 作为研究者，我希望显示 arXiv ID，以便快速引用 | P0 |

### Secondary: 行业从业者
| ID | 故事 | 优先级 |
|----|------|--------|
| US-011 | 作为从业者，我希望简洁的日报，以便快速了解动态 | P1 |
| US-012 | 作为从业者，我希望按公司筛选，以便跟踪竞品 | P1 |
| US-013 | 作为从业者，我希望移动端适配，以便通勤时阅读 | P2 |

### Tertiary: 内容策展人
| ID | 故事 | 优先级 |
|----|------|--------|
| US-014 | 作为策展人，我希望便捷分享，以便分享到社交媒体 | P1 |
| US-015 | 作为策展人，我希望 RSS 订阅，以便集成到阅读器 | P2 |

---

## 阶段 2: 技术架构 (P0)

| ID | 任务 | 状态 | 负责人 |
|----|------|------|--------|
| TODO-010 | Next.js SSR 框架搭建 | 🔲 待开始 | Nevin |
| TODO-011 | Supabase PostgreSQL 数据建模 | 🔲 待开始 | Nevin |
| TODO-012 | Redis 缓存层设计 | 🔲 待开始 | Nevin |
| TODO-013 | 数据采集服务架构 | 🔲 待开始 | Nevin |
| TODO-014 | CI/CD 部署流水线 | 🔲 待开始 | Jack |

---

## 阶段 3: 数据采集 (P0)

### 3.1 核心数据源
| ID | 数据源 | 状态 | 负责人 |
|----|--------|------|--------|
| TODO-020 | arXiv (cs.AI, cs.LG) 爬虫 | ✅ 完成 | Lei |
| TODO-021 | VentureBeat AI 爬虫 | ✅ 完成 | Lei |
| TODO-022 | TechCrunch AI 爬虫 | ✅ 完成 | Lei |
| TODO-023 | The Verge AI 爬虫 | ✅ 完成 | Lei |

### 3.2 扩展数据源 (P1)
| ID | 数据源 | 状态 | 负责人 |
|----|--------|------|--------|
| TODO-030 | OpenAI Blog 监控 | 🔲 待开始 | Lei |
| TODO-031 | Anthropic Blog 监控 | 🔲 待开始 | Lei |
| TODO-032 | DeepMind Blog 监控 | 🔲 待开始 | Lei |
| TODO-033 | Hacker News AI 聚合 | 🔲 待开始 | Lei |
| TODO-034 | Reddit r/MachineLearning 聚合 | 🔲 待开始 | Lei |

### 3.3 数据处理
| ID | 任务 | 状态 | 负责人 |
|----|------|------|--------|
| TODO-040 | 重复内容去重 (URL hash + 相似度) | ✅ 完成 | Lei |
| TODO-041 | 元数据自动提取 (作者/日期/标签) | ✅ 完成 | Lei |
| TODO-042 | 英文文章中文翻译 (DeepL API) | ✅ 完成 | Lei |
| TODO-043 | 翻译失败重试队列 + 回退机制 | ✅ 完成 | Lei |
| TODO-044 | 数据回填机制 (按天) | 🔲 待开始 | Lei |

### 3.4 arXiv 特殊处理 (P0) ✅ Jamie 确认
| ID | 任务 | 状态 | 优先级 |
|----|------|------|--------|
| TODO-045 | arXiv ID 提取与存储 | ✅ 完成 | P0 |
| TODO-046 | arXiv 作者/机构信息提取 | ✅ 完成 | P0 |
| TODO-047 | arXiv PDF 链接保留 | ✅ 完成 | P0 |
| TODO-048 | arXiv 子领域筛选 (cs.AI/cs.LG/cs.CV) | ✅ 完成 | P0 |

### 3.5 BibTeX 导出 (P1)
| ID | 任务 | 状态 | 优先级 |
|----|------|------|--------|
| TODO-049 | BibTeX 格式生成 | 🔲 待开始 | P1 |
| TODO-050 | 一键复制功能 | 🔲 待开始 | P1 |

### 3.6 数据源健康监控 (P1)
| ID | 任务 | 状态 | 优先级 |
|----|------|------|--------|
| TODO-051 | 静默回退 + 日志 | 🔲 待开始 | P1 |
| TODO-052 | 数据源回退策略 | 🔲 待开始 | P1 |
| TODO-053 | 爬虫失败告警系统 | 🔲 待开始 | P2 |

### 3.7 搜索排序算法 (P1)
| ID | 任务 | 状态 | 优先级 |
|----|------|------|--------|
| TODO-054 | 定义搜索相关性权重 | 🔲 待开始 | P1 |
| TODO-055 | 时效性权重计算 | 🔲 待开始 | P1 |
| TODO-056 | 重要程度 (impact) 加权 | 🔲 待开始 | P1 |

### 3.8 翻译重试机制 (P1) ✅ Jamie 确认
| ID | 任务 | 状态 | 优先级 |
|----|------|------|--------|
| TODO-057 | 翻译重试队列 (3次, 1s/5s/30s) | 🔲 待开始 | P1 |
| TODO-058 | 失败回退 (显示原文 + pending 标识) | 🔲 待开始 | P1 |
| TODO-059 | 每日凌晨重新处理失败任务 | 🔲 待开始 | P1 |

---

## 阶段 4: 分类系统 (P0)

| ID | 分类 | 状态 | 说明 |
|----|------|------|------|
| TODO-050 | Large Language Models (LLMs) | 🔲 待开始 | P0 |
| TODO-051 | Computer Vision | 🔲 待开始 | P0 |
| TODO-052 | AI Safety & Alignment | 🔲 待开始 | P0 |
| TODO-053 | Research Breakthroughs | 🔲 待开始 | P0 |
| TODO-054 | Industry & Business News | 🔲 待开始 | P0 |
| TODO-055 | Robotics & Embodied AI | 🔲 待开始 | P1 |
| TODO-056 | Generative Media | 🔲 待开始 | P1 |
| TODO-057 | AI Infrastructure & Tools | 🔲 待开始 | P1 |

### 分类标签
```yaml
source_type: [research | news | blog | social]
impact_level: [breaking | significant | interesting]
complexity: [beginner | technical | expert]
contains_code: [true | false]
```

---

## 阶段 5: 前端开发 (P0)

| ID | 任务 | 状态 | 负责人 |
|----|------|------|--------|
| TODO-060 | 首页布局 (Breaking + 分类) | 🔲 待开始 | Jason |
| TODO-061 | 文章卡片组件 | 🔲 待开始 | Jason |
| TODO-062 | 分类筛选功能 | 🔲 待开始 | Jason |
| TODO-063 | 暗黑模式切换 | 🔲 待开始 | Jason |
| TODO-064 | 搜索功能 | 🔲 待开始 | Jason |
| TODO-065 | 语言切换 (EN/ZH) | 🔲 待开始 | Jason |
| TODO-066 | 本地收藏夹 (localStorage) | 🔲 待开始 | Jason |

### 页面结构
```
Homepage
├── Header: Logo + Search + Language Toggle + Dark Mode
├── Breaking News: 最新 3-5 条重要新闻
├── Today's Research: arXiv 精选
├── Industry News: 公司动态
├── Tools & Releases: 新工具发布
├── Community: 社区讨论
└── Footer

Article Page
├── Original Link + Metadata
├── English Content
├── Chinese Summary (auto-translated)
├── Related Articles
└── Tags
```

---

## 阶段 6: SSR & 性能 (P0)

| ID | 指标 | 目标 | 状态 |
|----|------|------|------|
| TODO-070 | ISR 更新周期 | 60s | 🔲 |
| TODO-071 | 文章详情缓存 TTL | 5min | 🔲 |
| TODO-072 | 页面加载 (LCP) | <2s | 🔲 |
| TODO-073 | Lighthouse Score | >90 | 🔲 |

---

## 阶段 7: 安全 & 合规 (P1)

| ID | 任务 | 状态 | 负责人 |
|----|------|------|--------|
| TODO-080 | 来源可信度标识 | 🔲 待开始 | Baoan |
| TODO-081 | 速率限制 (防爬) | 🔲 待开始 | Baoan |
| TODO-082 | 隐私合规 (无追踪) | 🔲 待开始 | Baoan |

---

## 阶段 8: 测试 (P0)

| ID | 任务 | 状态 | 负责人 |
|----|------|------|--------|
| TODO-090 | 爬虫单元测试 | 🔲 待开始 | Henry |
| TODO-091 | 分类准确性验证 (>85%) | 🔲 待开始 | Henry |
| TODO-092 | E2E 测试 (用户流程) | 🔲 待开始 | Henry |
| TODO-093 | 性能测试 | 🔲 待开始 | Henry |

---

## 里程碑

| 里程碑 | 日期 | 交付物 |
|--------|------|--------|
| M1: 需求冻结 | 2026-03-25 | 经 Jamie 确认的需求文档 |
| M2: 技术栈确定 | 2026-03-26 | Next.js + Supabase 架构 |
| M3: MVP 数据采集 | 2026-04-01 | arXiv + 3新闻站上线 |
| M4: MVP 网站上线 | 2026-04-08 | 基础网站功能可用 |
| M5: 完整功能 | 2026-04-15 | 8分类 + 搜索 + 多语言 |

---

## 技术栈

| 层级 | 技术 | 理由 |
|------|------|------|
| 前端框架 | Next.js | SSR + ISR, Vercel 部署简单 |
| 数据库 | Supabase (PostgreSQL) | 免费额度,实时能力 |
| 缓存 | Redis (Upstash) | Serverless, 按需计费 |
| 爬虫 | Python/Node.js | 灵活抓取 |
| 翻译 | DeepL API | 高质量中英翻译 |
| 部署 | Vercel | SSR 友好, 免费 CDN |
| 监控 | Vercel Analytics | 零配置 |

---

## 成本预估 (MVP)

| 服务 | 方案 | 月费用 |
|------|------|--------|
| Vercel | Free Tier | $0 |
| Supabase | Free Tier (500MB) | $0 |
| Upstash Redis | Free Tier | $0 |
| DeepL | Free API | $0 (50万字符/月) |
| **总计** | | **$0** |

---

## 图例
- ✅ 完成
- ⏳ 进行中
- 🔲 待开始
- ❌ 阻塞
