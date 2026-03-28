# 🚀 Render.com 免费部署指南

## ✅ 代码已准备就绪！

**GitHub仓库**: https://github.com/Henryhu2211/ai-frontier-watch

---

## 🎯 一键部署到 Render.com (免费)

### **步骤 1: 访问 Render.com**
打开: https://render.com

### **步骤 2: 使用 GitHub 登录**
点击 **"Get Started for Free"** → 选择 **"Sign in with GitHub"**

### **步骤 3: 创建新 Web Service**
1. 点击 **"New"** → **"Web Service"**
2. 点击 **"Connect a repository"**
3. 选择: `Henryhu2211/ai-frontier-watch`
4. 点击 **"Connect"**

### **步骤 4: 配置服务**
Render 会自动检测 `render.yaml` 配置，确认以下设置:

- **Name**: ai-frontier-watch
- **Region**: Oregon (Free)
- **Branch**: main
- **Runtime**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### **步骤 5: 环境变量**
确认以下环境变量已配置:
```
NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy-anon-key
SUPABASE_SERVICE_KEY=dummy-service-key
DEEPL_API_KEY=dummy-api-key
```

### **步骤 6: 点击 "Create Web Service"**
等待 3-5 分钟部署完成

---

## 🎉 你的免费网址

部署完成后，你将获得:
```
https://ai-frontier-watch.onrender.com
```

---

## 📱 功能预览

### **首页**
- Breaking News 展示
- 分类浏览
- 热门话题
- 最新文章

### **其他功能**
- 🌓 暗黑模式
- 🌐 中英文切换
- 📡 RSS Feed
- 📱 移动端响应

---

## 🔧 后续配置 (可选)

### **连接真实数据库**
1. 访问 https://supabase.com
2. 创建免费项目
3. 更新 Render 环境变量

---

## 💡 Render.com 免费层特点

- ✅ 750 小时/月 (足够个人项目)
- ✅ 自动 SSL (HTTPS)
- ✅ 自动从 GitHub 部署
- ✅ 自定义域名支持

---

**🚀 MVP已准备就绪，立即部署!**