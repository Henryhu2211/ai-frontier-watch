#!/bin/bash

# AI Frontier Watch - Production Setup Script
# This script helps you set up the production environment

set -e

echo "🚀 AI Frontier Watch - Production Setup"
echo "========================================"

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the ai-frontier-watch directory"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo ""
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 20+"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm 10+"
    exit 1
fi

if ! command_exists git; then
    echo "❌ Git is not installed. Please install Git"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo "✅ Git: $(git --version)"

# Check environment variables
echo ""
echo "🔐 Checking environment variables..."

if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env.example .env.local
    echo "📝 Please edit .env.local with your actual values"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo ""
echo "🧪 Running tests..."
npm run test:unit -- --passWithNoTests

# Type check
echo ""
echo "📝 Running type check..."
npm run type-check

# Build
echo ""
echo "🏗️  Building application..."
npm run build

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Edit .env.local with your Supabase and DeepL credentials"
echo "2. Run database migrations: npm run db:migrate"
echo "3. Deploy to Vercel: npm run vercel:deploy"
echo "4. Test the deployment: curl https://your-domain.vercel.app/api/health"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_CHECKLIST.md"
echo ""
echo "🚀 Ready to deploy!"