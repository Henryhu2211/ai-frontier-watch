#!/bin/bash

# AI Frontier Watch - 一键部署到 Vercel
# 自动创建GitHub仓库并部署

set -e

echo "🚀 AI Frontier Watch - 一键部署"
echo "================================="
echo ""
echo "你的信息:"
echo "  GitHub: henryhu2211"
echo "  Email: henryhu2211@gmail.com"
echo ""

# 配置 Git
cd /home/opencoder/workspace
git config user.email "henryhu2211@gmail.com"
git config user.name "henryhu2211"

echo "✅ Git 配置完成"

# 检查 GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ 需要安装 GitHub CLI"
    echo "   访问: https://cli.github.com"
    exit 1
fi

echo "✅ GitHub CLI 已安装"

# 检查登录状态
if ! gh auth status &> /dev/null; then
    echo ""
    echo "🔐 需要登录 GitHub"
    echo "   1. 访问: https://github.com/settings/tokens/new"
    echo "   2. 创建 token (勾选 repo, workflow)"
    echo "   3. 复制 token"
    echo ""
    echo "然后运行: gh auth login"
    echo ""
    exit 1
fi

echo "✅ GitHub 已登录"

# 创建仓库
echo ""
echo "📦 创建 GitHub 仓库..."
gh repo create ai-frontier-watch --public --description "AI News Aggregator - Real-time AI research and news" --clone=false || echo "仓库可能已存在"

# 添加远程仓库
echo "🔗 配置远程仓库..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/henryhu2211/ai-frontier-watch.git

# 推送代码
echo "📤 推送代码到 GitHub..."
git push -u origin main --force

echo ""
echo "✅ 代码已推送到 GitHub!"
echo ""
echo "🌐 部署到 Vercel..."
echo ""
echo "下一步:"
echo "1. 访问: https://vercel.com/new"
echo "2. 点击 'Import Git Repository'"
echo "3. 选择 'ai-frontier-watch'"
echo "4. 点击 'Deploy'"
echo ""
echo "🎉 你的应用将在 2-3 分钟内部署完成!"
echo ""
echo "免费域名: https://ai-frontier-watch.vercel.app"