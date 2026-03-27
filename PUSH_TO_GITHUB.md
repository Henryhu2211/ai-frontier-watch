# 📤 推送到 GitHub 并部署到 Vercel

## 🎯 快速开始 (5分钟)

---

### **步骤 1: 创建 GitHub 仓库**

1. 访问: https://github.com/new
2. 设置:
   - Repository name: `ai-frontier-watch`
   - 选择 **Public** (免费)
   - ❌ 不要勾选 "Add a README file"
   - ❌ 不要勾选任何其他选项
3. 点击 **Create repository**

---

### **步骤 2: 复制你的仓库 URL**

创建仓库后，复制 URL，格式如下:
```
https://github.com/YOUR_USERNAME/ai-frontier-watch.git
```

---

### **步骤 3: 执行以下命令**

```bash
# 进入项目目录
cd /home/opencoder/workspace

# 添加远程仓库 (替换 YOUR_USERNAME 为你的GitHub用户名)
git remote add origin https://github.com/YOUR_USERNAME/ai-frontier-watch.git

# 推送代码
git push -u origin main
```

---

### **步骤 4: 部署到 Vercel**

1. 访问: https://vercel.com/new
2. 点击 **Import Git Repository**
3. 选择你的 `ai-frontier-watch` 仓库
4. 点击 **Deploy**
5. 等待 1-2 分钟

---

### **步骤 5: 配置环境变量**

在 Vercel 部署页面，点击 **Environment Variables**，添加:

```
NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy-key
SUPABASE_SERVICE_KEY=dummy-key
DEEPL_API_KEY=dummy-key
```

---

## 🎉 完成!

你的免费网站将在:
```
https://ai-frontier-watch.vercel.app
```

---

## 💡 提示

- Vercel 免费层包含: 100GB 带宽/月
- 每次 `git push` 都会自动部署
- 可以在 Vercel Dashboard 查看部署状态

---

## 🆘 遇到问题?

1. **推送失败**: 检查是否已登录 GitHub
2. **部署失败**: 检查 Environment Variables 是否正确
3. **页面空白**: 等待 1-2 分钟，部署需要时间