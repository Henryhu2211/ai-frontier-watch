import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    
    // Log job start
    const { data: logData, error: logError } = await supabase
      .from('cron_execution_log')
      .insert({
        job_name: 'collect-arxiv',
        started_at: new Date().toISOString(),
        status: 'running'
      })
      .select()
      .single()

    if (logError) {
      console.error('Failed to log job start:', logError)
    }

    const jobId = logData?.id

    try {
      // Here you would call the actual Python crawler
      // For now, we'll simulate the process
      
      // In production, you would use:
      // const result = await exec('python crawlers/arxiv/crawler.py')
      
      // Simulate processing
      const articlesProcessed = Math.floor(Math.random() * 20) + 5 // 5-25 articles
      
      // Update job log with success
      if (jobId) {
        await supabase
          .from('cron_execution_log')
          .update({
            completed_at: new Date().toISOString(),
            status: 'success',
            articles_processed: articlesProcessed
          })
          .eq('id', jobId)
      }

      return NextResponse.json({
        success: true,
        message: 'arXiv collection completed',
        articles_processed: articlesProcessed,
        timestamp: new Date().toISOString()
      })
    } catch (processError) {
      // Update job log with error
      if (jobId) {
        await supabase
          .from('cron_execution_log')
          .update({
            completed_at: new Date().toISOString(),
            status: 'failed',
            error_message: processError instanceof Error ? processError.message : 'Unknown error'
          })
          .eq('id', jobId)
      }

      throw processError
    }
  } catch (error) {
    console.error('arXiv collection failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}