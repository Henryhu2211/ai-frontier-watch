# 🚀 AI Frontier Watch - 部署检查清单

## 📋 部署前检查

### **1. 环境变量配置** ✅
- [ ] 获取 Supabase 项目 URL
- [ ] 获取 Supabase anon key
- [ ] 获取 Supabase service role key
- [ ] 获取 DeepL API key
- [ ] 配置 `.env.local` 文件

### **2. 数据库准备** ✅
- [ ] 创建 Supabase 项目
- [ ] 运行数据库迁移: `npm run db:migrate`
- [ ] 验证表结构: `supabase db diff`
- [ ] 设置 RLS 策略

### **3. 代码质量检查** ✅
```bash
# 运行完整的测试套件
npm run test:all

# 运行类型检查
npm run type-check

# 运行代码检查
npm run lint

# 构建生产版本
npm run build
```

### **4. Vercel 配置** ✅
- [ ] 连接 GitHub 仓库到 Vercel
- [ ] 设置环境变量在 Vercel Dashboard
- [ ] 配置域名 (可选)
- [ ] 启用自动部署

---

## 🔄 部署流程

### **步骤 1: 推送到 GitHub**
```bash
# 确保所有更改已提交
git add .
git commit -m "feat: complete MVP integration"
git push origin main
```

### **步骤 2: 自动部署触发**
- GitHub Actions 将自动运行 CI/CD 流水线
- 检查 Actions 状态: `gh workflow run ci.yml`

### **步骤 3: 验证部署**
```bash
# 检查部署状态
npm run vercel:deploy

# 运行健康检查
curl https://your-domain.vercel.app/api/health

# 测试搜索功能
curl "https://your-domain.vercel.app/api/search?q=AI"
```

### **步骤 4: 数据收集测试**
```bash
# 手动触发 arXiv 收集
curl https://your-domain.vercel.app/api/cron/collect-arxiv

# 手动触发新闻收集
curl https://your-domain.vercel.app/api/cron/collect-news

# 检查翻译重试
curl https://your-domain.vercel.app/api/cron/retry-translations
```

---

## 📊 性能检查清单

### **Lighthouse 审计**
```bash
# 运行 Lighthouse 审计
npm run lighthouse

# 目标分数
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90
```

### **Core Web Vitals**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

---

## 🔐 安全检查清单

### **安全配置**
- [ ] Supabase RLS 策略已启用
- [ ] API 路由有适当的错误处理
- [ ] 环境变量未提交到代码库
- [ ] CORS 配置正确
- [ ] 速率限制已配置

### **敏感数据**
- [ ] 无硬编码的 API 密钥
- [ ] 无硬编码的密码
- [ ] 日志中无敏感信息

---

## 📈 监控设置

### **必需的监控**
- [ ] Vercel Analytics 已启用
- [ ] 错误追踪 (可选: Sentry)
- [ ] 正常运行时间监控 (Better Uptime/UptimeRobot)

### **告警配置**
- [ ] 部署失败告警
- [ ] API 错误率告警
- [ ] 数据库连接告警

---

## 🧪 测试验证

### **测试套件**
```bash
# 单元测试
npm run test:unit

# 集成测试
npm run test:integration

# 端到端测试
npm run test:e2e

# 测试覆盖率
npm run test:coverage
```

### **手动测试**
- [ ] 首页加载正常
- [ ] 文章详情页正常
- [ ] 搜索功能正常
- [ ] 分类筛选正常
- [ ] 暗黑模式切换正常
- [ ] 语言切换正常
- [ ] RSS Feed 正常
- [ ] 移动端响应式正常

---

## 🐛 故障排查

### **常见问题**

#### **构建失败**
```bash
# 清除缓存重新构建
rm -rf .next
npm run build
```

#### **环境变量未加载**
```bash
# 检查环境变量
echo $NEXT_PUBLIC_SUPABASE_URL

# 重启开发服务器
npm run dev
```

#### **数据库连接失败**
```bash
# 测试 Supabase 连接
npx supabase db ping

# 检查 RLS 策略
supabase db diff
```

#### **Cron Jobs 失败**
1. 检查 GitHub Actions 日志
2. 验证 secrets 配置
3. 检查 Supabase 项目状态

---

## 📞 紧急联系

| 角色 | 负责人 | 联系方式 |
|------|--------|----------|
| 技术架构 | Nevin | Slack: @nevin |
| 爬虫开发 | Lei | Slack: @lei |
| DevOps | Jack | Slack: @jack |
| QA | Henry | Slack: @henry |
| 产品 | Jamie | Slack: @jamie |

---

## 🎯 MVP 成功标准

### **功能性**
- [ ] 所有页面加载正常
- [ ] 数据实时更新
- [ ] 搜索功能正常
- [ ] 分类功能正常
- [ ] 翻译功能正常

### **性能**
- [ ] 首页加载 < 2s
- [ ] API 响应 < 500ms
- [ ] Lighthouse 分数 > 90

### **可靠性**
- [ ] 99.9% 正常运行时间
- [ ] 自动故障恢复
- [ ] 数据备份正常

---

**最后更新**: 2026-03-24
**MVP 状态**: 🚀 **准备就绪**
**预计上线**: 2026-03-27