-- ===========================================
-- AI Frontier Watch - Database Schema
-- ===========================================
-- Last updated: 2026-03-22

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- Tables
-- ===========================================

-- Articles table (main content)
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('research', 'news', 'blog', 'social')),
    source_url TEXT NOT NULL UNIQUE,
    source_name VARCHAR(100),
    
    -- Content
    title_en TEXT NOT NULL,
    title_zh TEXT,
    summary_en TEXT,
    summary_zh TEXT,
    
    -- Metadata
    authors TEXT[],
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- arXiv specific
    arxiv_id VARCHAR(20),
    arxiv_pdf_url TEXT,
    arxiv_categories TEXT[],
    
    -- Classification
    category VARCHAR(100),
    tags TEXT[],
    complexity VARCHAR(20) CHECK (complexity IN ('beginner', 'technical', 'expert')),
    impact_level VARCHAR(20) CHECK (impact_level IN ('breaking', 'significant', 'interesting')),
    
    -- Translation status
    translation_status VARCHAR(20) DEFAULT 'pending' CHECK (translation_status IN ('pending', 'processing', 'completed', 'failed')),
    retry_count INTEGER DEFAULT 0,
    translated_at TIMESTAMPTZ,
    
    -- Deduplication
    content_hash VARCHAR(64),
    is_duplicate BOOLEAN DEFAULT FALSE,
    
    -- Stats
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0
);

-- Authors table
CREATE TABLE authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    affiliation TEXT,
    arxiv_author_id VARCHAR(20),
    total_articles INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Article-Author junction table
CREATE TABLE article_authors (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
    author_order INTEGER,
    PRIMARY KEY (article_id, author_id)
);

-- Translation jobs queue
CREATE TABLE translation_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    text_to_translate TEXT NOT NULL,
    source_lang VARCHAR(10) DEFAULT 'EN',
    target_lang VARCHAR(10) DEFAULT 'ZH',
    priority INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    retry_count INTEGER DEFAULT 0,
    next_retry_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Data source health monitoring
CREATE TABLE data_source_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_name VARCHAR(100) NOT NULL,
    last_check_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) CHECK (status IN ('healthy', 'degraded', 'down')),
    response_time_ms INTEGER,
    articles_collected INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cron job execution log
CREATE TABLE cron_execution_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_name VARCHAR(100) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    status VARCHAR(20) CHECK (status IN ('running', 'success', 'failed')),
    articles_processed INTEGER DEFAULT 0,
    error_message TEXT
);

-- ===========================================
-- Indexes
-- ===========================================

CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_source_type ON articles(source_type);
CREATE INDEX idx_articles_translation_status ON articles(translation_status);
CREATE INDEX idx_articles_arxiv_id ON articles(arxiv_id) WHERE arxiv_id IS NOT NULL;
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);

CREATE INDEX idx_translation_queue_status ON translation_queue(status) WHERE status = 'pending';
CREATE INDEX idx_translation_queue_next_retry ON translation_queue(next_retry_at) WHERE next_retry_at IS NOT NULL;

CREATE INDEX idx_data_source_health_source ON data_source_health(source_name);
CREATE INDEX idx_data_source_health_check_time ON data_source_health(last_check_at DESC);

CREATE INDEX idx_cron_log_job_time ON cron_execution_log(job_name, started_at DESC);

-- Full-text search index
CREATE INDEX idx_articles_fts ON articles USING GIN (
    to_tsvector('english', COALESCE(title_en, '') || ' ' || COALESCE(summary_en, ''))
);

-- ===========================================
-- Row Level Security (RLS)
-- ===========================================

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_source_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE cron_execution_log ENABLE ROW LEVEL SECURITY;

-- Public read access for articles
CREATE POLICY "Public can read articles" ON articles
    FOR SELECT USING (true);

-- Service role can do everything
CREATE POLICY "Service role can manage articles" ON articles
    FOR ALL USING (auth.role() = 'service_role');

-- Public read access for authors
CREATE POLICY "Public can read authors" ON authors
    FOR SELECT USING (true);

-- Service role can manage authors
CREATE POLICY "Service role can manage authors" ON authors
    FOR ALL USING (auth.role() = 'service_role');

-- No public access to internal tables
CREATE POLICY "Service role only for translation queue" ON translation_queue
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only for health logs" ON data_source_health
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only for cron logs" ON cron_execution_log
    FOR ALL USING (auth.role() = 'service_role');

-- ===========================================
-- Functions
-- ===========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_authors_updated_at
    BEFORE UPDATE ON authors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to mark duplicate articles
CREATE OR REPLACE FUNCTION mark_duplicate_articles()
RETURNS void AS $$
BEGIN
    UPDATE articles
    SET is_duplicate = true
    WHERE id IN (
        SELECT id FROM (
            SELECT id, content_hash,
                ROW_NUMBER() OVER (PARTITION BY content_hash ORDER BY created_at) as rn
            FROM articles
            WHERE content_hash IS NOT NULL
        ) sub
        WHERE rn > 1
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get articles for homepage
CREATE OR REPLACE FUNCTION get_homepage_articles(
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title_en TEXT,
    title_zh TEXT,
    summary_en TEXT,
    summary_zh TEXT,
    source_type VARCHAR,
    source_name VARCHAR,
    category VARCHAR,
    published_at TIMESTAMPTZ,
    arxiv_id VARCHAR,
    translation_status VARCHAR,
    view_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title_en,
        a.title_zh,
        a.summary_en,
        a.summary_zh,
        a.source_type,
        a.source_name,
        a.category,
        a.published_at,
        a.arxiv_id,
        a.translation_status,
        a.view_count
    FROM articles a
    WHERE a.is_duplicate = false
    ORDER BY 
        CASE WHEN a.impact_level = 'breaking' THEN 0 ELSE 1 END,
        a.published_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- Views
-- ===========================================

-- Daily statistics view
CREATE OR REPLACE VIEW daily_stats AS
SELECT 
    DATE(created_at) as date,
    source_type,
    COUNT(*) as articles_count,
    COUNT(*) FILTER (WHERE translation_status = 'completed') as translated_count,
    COUNT(*) FILTER (WHERE translation_status = 'failed') as failed_count,
    AVG(EXTRACT(EPOCH FROM (translated_at - created_at))) FILTER (WHERE translated_at IS NOT NULL) as avg_translation_time_seconds
FROM articles
GROUP BY DATE(created_at), source_type
ORDER BY date DESC;

-- Data source health summary
CREATE OR REPLACE VIEW data_source_health_summary AS
SELECT 
    source_name,
    status,
    last_check_at,
    response_time_ms,
    articles_collected,
    CASE 
        WHEN NOW() - last_check_at > INTERVAL '1 hour' THEN 'stale'
        ELSE 'current'
    END as data_freshness
FROM data_source_health
WHERE (source_name, last_check_at) IN (
    SELECT source_name, MAX(last_check_at)
    FROM data_source_health
    GROUP BY source_name
);

-- ===========================================
-- Grant Permissions
-- ===========================================

-- Grant read access to authenticated users
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION get_homepage_articles TO anon, authenticated;
