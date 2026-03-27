# 🚀 Vercel 免费部署指南

## ⏱️ 预计时间: 5分钟

---

## 📋 前置条件
- GitHub 账号 (免费)
- Vercel 账号 (免费，用GitHub登录)

---

## 🎯 部署步骤

### **步骤 1: 创建 GitHub 仓库**
1. 访问 https://github.com/new
2. 仓库名称: `ai-frontier-watch`
3. 选择 **Public** (免费)
4. 点击 **Create repository**

### **步骤 2: 推送代码到 GitHub**
```bash
# 在项目目录执行
cd /home/opencoder/workspace

# 添加远程仓库 (替换 YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ai-frontier-watch.git
git branch -M main
git push -u origin main
```

### **步骤 3: 在 Vercel 导入项目**
1. 访问 https://vercel.com/new
2. 点击 **Import Git Repository**
3. 选择你的 `ai-frontier-watch` 仓库
4. 点击 **Deploy**

### **步骤 4: 配置环境变量**
在 Vercel 部署设置中，添加以下环境变量:

```
NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy-anon-key
SUPABASE_SERVICE_KEY=dummy-service-key
DEEPL_API_KEY=dummy-deepl-key
```

> 💡 **提示**: 先用虚拟值部署查看效果，后续配置真实的 Supabase

### **步骤 5: 完成部署**
1. 等待部署完成 (约1-2分钟)
2. 获得免费域名: `https://ai-frontier-watch-xxx.vercel.app`
3. 点击访问你的应用!

---

## 🎉 部署成功后

### **免费域名示例**
- `https://ai-frontier-watch.vercel.app`
- `https://ai-frontier-watch-git-main-xxx.vercel.app`

### **后续优化**
1. 配置自定义域名 (可选)
2. 连接真实的 Supabase 数据库
3. 配置 DeepL API Key

---

## 🔧 常见问题

### **Q: 部署失败怎么办?**
A: 检查 Build Logs，通常是环境变量问题

### **Q: 如何更新部署?**
A: 只需 `git push`，Vercel 会自动重新部署

### **Q: 免费额度够用吗?**
A: Vercel 免费层包含:
- 100GB 带宽/月
- 1000 构建分钟/月
- 无限部署

---

**需要帮助?** 查看 [Vercel 官方文档](https://vercel.com/docs)