// Supabase Database Types
// Generated based on supabase/schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          source_type: 'research' | 'news' | 'blog' | 'social'
          source_url: string
          source_name: string | null
          title_en: string
          title_zh: string | null
          summary_en: string | null
          summary_zh: string | null
          authors: string[] | null
          published_at: string
          created_at: string
          updated_at: string
          arxiv_id: string | null
          arxiv_pdf_url: string | null
          arxiv_categories: string[] | null
          category: string | null
          tags: string[] | null
          complexity: 'beginner' | 'technical' | 'expert' | null
          impact_level: 'breaking' | 'significant' | 'interesting' | null
          translation_status: 'pending' | 'processing' | 'completed' | 'failed'
          retry_count: number
          translated_at: string | null
          content_hash: string | null
          is_duplicate: boolean
          view_count: number
          like_count: number
        }
        Insert: {
          id?: string
          source_type: 'research' | 'news' | 'blog' | 'social'
          source_url: string
          source_name?: string | null
          title_en: string
          title_zh?: string | null
          summary_en?: string | null
          summary_zh?: string | null
          authors?: string[] | null
          published_at: string
          created_at?: string
          updated_at?: string
          arxiv_id?: string | null
          arxiv_pdf_url?: string | null
          arxiv_categories?: string[] | null
          category?: string | null
          tags?: string[] | null
          complexity?: 'beginner' | 'technical' | 'expert' | null
          impact_level?: 'breaking' | 'significant' | 'interesting' | null
          translation_status?: 'pending' | 'processing' | 'completed' | 'failed'
          retry_count?: number
          translated_at?: string | null
          content_hash?: string | null
          is_duplicate?: boolean
          view_count?: number
          like_count?: number
        }
        Update: {
          id?: string
          source_type?: 'research' | 'news' | 'blog' | 'social'
          source_url?: string
          source_name?: string | null
          title_en?: string
          title_zh?: string | null
          summary_en?: string | null
          summary_zh?: string | null
          authors?: string[] | null
          published_at?: string
          created_at?: string
          updated_at?: string
          arxiv_id?: string | null
          arxiv_pdf_url?: string | null
          arxiv_categories?: string[] | null
          category?: string | null
          tags?: string[] | null
          complexity?: 'beginner' | 'technical' | 'expert' | null
          impact_level?: 'breaking' | 'significant' | 'interesting' | null
          translation_status?: 'pending' | 'processing' | 'completed' | 'failed'
          retry_count?: number
          translated_at?: string | null
          content_hash?: string | null
          is_duplicate?: boolean
          view_count?: number
          like_count?: number
        }
      }
      authors: {
        Row: {
          id: string
          name: string
          affiliation: string | null
          arxiv_author_id: string | null
          total_articles: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          affiliation?: string | null
          arxiv_author_id?: string | null
          total_articles?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          affiliation?: string | null
          arxiv_author_id?: string | null
          total_articles?: number
          created_at?: string
          updated_at?: string
        }
      }
      translation_queue: {
        Row: {
          id: string
          article_id: string
          text_to_translate: string
          source_lang: string
          target_lang: string
          priority: number
          status: 'pending' | 'processing' | 'completed' | 'failed'
          retry_count: number
          next_retry_at: string | null
          error_message: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          article_id: string
          text_to_translate: string
          source_lang?: string
          target_lang?: string
          priority?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          retry_count?: number
          next_retry_at?: string | null
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          article_id?: string
          text_to_translate?: string
          source_lang?: string
          target_lang?: string
          priority?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          retry_count?: number
          next_retry_at?: string | null
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      data_source_health: {
        Row: {
          id: string
          source_name: string
          last_check_at: string
          status: 'healthy' | 'degraded' | 'down' | null
          response_time_ms: number | null
          articles_collected: number
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          source_name: string
          last_check_at: string
          status?: 'healthy' | 'degraded' | 'down' | null
          response_time_ms?: number | null
          articles_collected?: number
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          source_name?: string
          last_check_at?: string
          status?: 'healthy' | 'degraded' | 'down' | null
          response_time_ms?: number | null
          articles_collected?: number
          error_message?: string | null
          created_at?: string
        }
      }
      cron_execution_log: {
        Row: {
          id: string
          job_name: string
          started_at: string
          completed_at: string | null
          status: 'running' | 'success' | 'failed' | null
          articles_processed: number
          error_message: string | null
        }
        Insert: {
          id?: string
          job_name: string
          started_at: string
          completed_at?: string | null
          status?: 'running' | 'success' | 'failed' | null
          articles_processed?: number
          error_message?: string | null
        }
        Update: {
          id?: string
          job_name?: string
          started_at?: string
          completed_at?: string | null
          status?: 'running' | 'success' | 'failed' | null
          articles_processed?: number
          error_message?: string | null
        }
      }
    }
    Views: {
      daily_stats: {
        Row: {
          date: string | null
          source_type: string | null
          articles_count: number | null
          translated_count: number | null
          failed_count: number | null
          avg_translation_time_seconds: number | null
        }
      }
      data_source_health_summary: {
        Row: {
          source_name: string | null
          status: 'healthy' | 'degraded' | 'down' | null
          last_check_at: string | null
          response_time_ms: number | null
          articles_collected: number | null
          data_freshness: string | null
        }
      }
    }
    Functions: {
      get_homepage_articles: {
        Args: {
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: string
          title_en: string
          title_zh: string | null
          summary_en: string | null
          summary_zh: string | null
          source_type: string
          source_name: string | null
          category: string | null
          published_at: string
          arxiv_id: string | null
          translation_status: string
          view_count: number
        }[]
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      mark_duplicate_articles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
  }
}

// Helper types for frontend
export type Article = Database['public']['Tables']['articles']['Row']
export type ArticleInsert = Database['public']['Tables']['articles']['Insert']
export type Category = Database['public']['Views']['data_source_health_summary']['Row']

// Homepage article type (matches get_homepage_articles return)
export interface HomepageArticle {
  id: string
  title_en: string
  title_zh: string | null
  summary_en: string | null
  summary_zh: string | null
  source_type: string
  source_name: string | null
  category: string | null
  published_at: string
  arxiv_id: string | null
  translation_status: string
  view_count: number
}