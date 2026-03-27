# AI Frontier Watch - Deployment Guide

## Overview

This document covers the deployment process, CI/CD pipeline, and operational procedures for AI Frontier Watch.

**Tech Stack:**
- Frontend: Next.js (SSR)
- Database: Supabase (PostgreSQL)
- Deployment: Vercel
- CI/CD: GitHub Actions

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Deployment Pipeline](#deployment-pipeline)
5. [Cron Jobs](#cron-jobs)
6. [Monitoring & Alerts](#monitoring--alerts)
7. [Database Management](#database-management)
8. [Backup & Recovery](#backup--recovery)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Git
- Vercel CLI (`npm install -g vercel`)
- Supabase CLI (`npm install -g supabase`)

### First-Time Setup

```bash
# Clone the repository
git clone https://github.com/your-org/ai-frontier-watch.git
cd ai-frontier-watch

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start local development
npm run dev
```

---

## Environment Setup

### Required Secrets (GitHub Actions)

| Secret Name | Description | Where to Get |
|-------------|-------------|--------------|
| `VERCEL_TOKEN` | Vercel API token | Vercel Dashboard → Settings → Tokens |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Supabase Dashboard → Settings → API |
| `SUPABASE_PROJECT_REF` | Supabase project reference | Supabase Dashboard → Settings → API |
| `SUPABASE_ACCESS_TOKEN` | Supabase personal access token | Supabase Dashboard → Account |
| `DEEPL_API_KEY` | DeepL translation API | DeepL API Dashboard |
| `SLACK_WEBHOOK_URL` | Slack webhook for alerts | Slack App Settings |
| `CODECOV_TOKEN` | Codecov upload token | Codecov Dashboard |

### Environment Variables

Create `.env.local` for local development:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# DeepL
DEEPL_API_KEY=your-deepl-api-key

# Optional
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

---

## Local Development

### Commands

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test
npm run test:unit
npm run test:integration
npm run test:e2e

# Build for production
npm run build

# Start production server
npm run start
```

### Database Migrations

```bash
# Apply migrations
npm run db:migrate

# Generate migration
npm run db:generate

# Reset database
npm run db:reset

# Open SQL editor
npm run db:studio
```

---

## Deployment Pipeline

### CI/CD Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   PR Push   │────▶│  CI Pipeline │────▶│   Preview   │
└─────────────┘     └──────────────┘     │  Deployment │
                           │            └─────────────┘
                           │
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Main Push  │────▶│  CI Pipeline │────▶│ Production  │
└─────────────┘     └──────────────┘     │  Deployment │
                           │            └─────────────┘
                           ▼
                    ┌──────────────┐
                    │  Lighthouse  │
                    │    Audit     │
                    └──────────────┘
```

### Pipeline Stages

| Stage | Trigger | Description |
|-------|---------|-------------|
| Lint & Type Check | Every push | ESLint, TypeScript, Prettier |
| Unit Tests | After lint | Jest unit & integration tests |
| Build | After tests | Next.js production build |
| Preview Deploy | PR only | Deploy to Vercel preview URL |
| Production Deploy | Main merge | Deploy to production |
| E2E Tests | PR only | Playwright end-to-end tests |
| Lighthouse | Main merge | Performance audit |

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Pull environment
vercel pull --yes --environment=production

# Build
vercel build --prod

# Deploy
vercel deploy --prebuilt
```

### Rollback

```bash
# List recent deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

---

## Cron Jobs

### Vercel Cron (Primary)

Configured in `vercel.json`:

| Job | Schedule | Description |
|-----|----------|-------------|
| `/api/cron/collect-arxiv` | Daily 06:00 UTC | Fetch latest arXiv papers |
| `/api/cron/collect-news` | Every 4 hours | Collect news articles |
| `/api/cron/retry-translations` | Daily 03:00 UTC | Retry failed translations |

### GitHub Actions Cron (Backup)

Configured in `.github/workflows/cron.yml`:

```yaml
schedule:
  - cron: '0 6 * * *'      # arXiv collection
  - cron: '0 */4 * * *'    # News collection
  - cron: '0 3 * * *'      # Translation retry
  - cron: '0 */6 * * *'    # Health check
```

### Manual Cron Trigger

1. Go to GitHub Actions → "Data Collection Cron Jobs"
2. Click "Run workflow"
3. Select job type and run

---

## Monitoring & Alerts

### Vercel Analytics

- **Built-in**: Enabled automatically for Vercel deployments
- **Dashboard**: https://vercel.com/dashboard → Project → Analytics

### Error Tracking (Optional - Sentry)

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx sentry-wizard -i nextjs
```

### Health Checks

```bash
# Run health check
curl https://your-domain.vercel.app/api/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2026-03-22T12:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "cache": "connected"
  }
}
```

### Uptime Monitoring

Recommended external monitors:
- [Better Uptime](https://betteruptime.com)
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)

---

## Database Management

### Supabase Dashboard

Access: https://app.supabase.com → Your Project

### Common Operations

```bash
# Connect to Supabase
supabase login
supabase link --project-ref your-project-ref

# View tables
supabase db psql

# Backup
supabase db dump > backup.sql

# Restore
psql -h db.your-project.supabase.co -U postgres -d postgres -f backup.sql
```

### Table Schema

See `supabase/schema.sql` for full schema.

### Analytics Queries

```sql
-- Daily article count
SELECT DATE(created_at) as date, COUNT(*) 
FROM articles 
GROUP BY DATE(created_at) 
ORDER BY date DESC;

-- Translation success rate
SELECT 
  COUNT(*) FILTER (WHERE translated_at IS NOT NULL) as success,
  COUNT(*) FILTER (WHERE translated_at IS NULL AND retry_count > 0) as failed
FROM articles;
```

---

## Backup & Recovery

### Supabase Backup Schedule

| Type | Frequency | Retention | Location |
|------|-----------|-----------|----------|
| Automated | Daily | 7 days | Supabase managed |
| Point-in-time | Continuous | 30 days | Supabase managed |
| Manual export | On-demand | Variable | Local/S3 |

### Manual Backup

```bash
# Export entire database
PGPASSWORD=your-password pg_dump -h db.your-project.supabase.co \
  -U postgres -d postgres > backup_$(date +%Y%m%d).sql

# Export specific tables
pg_dump -h db.your-project.supabase.co \
  -U postgres -d postgres \
  -t articles -t authors > tables_backup.sql
```

### Recovery Procedures

1. **Supabase PITR Recovery** (for recent data):
   ```
   Dashboard → Database → Backups → Point in Time → Select timestamp → Restore
   ```

2. **Manual SQL Restore**:
   ```bash
   psql -h db.your-project.supabase.co -U postgres -d postgres -f backup.sql
   ```

### Backup Verification

```bash
# Verify backup integrity
pg_restore --dbname=postgres --list backup.sql

# Test restore to new database
createdb test_restore
pg_restore --dbname=test_restore backup.sql
```

---

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

#### Database Connection Issues

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test connection
npx supabase db ping
```

#### Cron Job Failures

1. Check GitHub Actions logs
2. Verify secrets are set in repo settings
3. Check Supabase project status

#### Deployment Issues

```bash
# Redeploy with clean build
vercel --force

# Check deployment status
vercel ls
```

### Support Contacts

| Issue | Contact |
|-------|---------|
| Infrastructure | @Jack |
| Database | @Nevin |
| Frontend | @Jason |
| Data Collection | @Lei |
| QA/Testing | @Henry |

---

## Appendix

### Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

### Security Checklist

- [ ] All secrets stored in GitHub Actions secrets
- [ ] Supabase RLS policies configured
- [ ] Rate limiting enabled on API routes
- [ ] CORS configured correctly
- [ ] No sensitive data in client-side code

### Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| Lighthouse Score | > 90 |
| Uptime | > 99.9% |

---

*Last updated: 2026-03-22*
*Maintained by: @Jack (DevOps)*
