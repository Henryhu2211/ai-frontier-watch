import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    
    // Log job start
    const { data: logData, error: logError } = await supabase
      .from('cron_execution_log')
      .insert({
        job_name: 'retry-translations',
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
      // Get failed translations from queue
      const { data: failedTranslations, error: fetchError } = await supabase
        .from('translation_queue')
        .select('*, articles(*)')
        .eq('status', 'failed')
        .lt('retry_count', 3)
        .limit(50)

      if (fetchError) {
        throw new Error(`Failed to fetch failed translations: ${fetchError.message}`)
      }

      let processedCount = 0
      let successCount = 0
      let failedCount = 0

      // Process each failed translation
      for (const item of (failedTranslations || [])) {
        try {
          // Simulate translation retry
          // In production, you would call the DeepL API here
          const success = Math.random() > 0.3 // 70% success rate simulation
          
          if (success) {
            // Mark as completed
            await supabase
              .from('translation_queue')
              .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                retry_count: item.retry_count + 1
              })
              .eq('id', item.id)

            // Update article translation status
            await supabase
              .from('articles')
              .update({
                translation_status: 'completed',
                translated_at: new Date().toISOString(),
                retry_count: item.retry_count + 1
              })
              .eq('id', item.article_id)

            successCount++
          } else {
            // Mark for retry
            const nextRetry = new Date()
            nextRetry.setMinutes(nextRetry.getMinutes() + Math.pow(2, item.retry_count) * 5) // Exponential backoff
            
            await supabase
              .from('translation_queue')
              .update({
                status: 'failed',
                retry_count: item.retry_count + 1,
                next_retry_at: nextRetry.toISOString(),
                error_message: 'Translation failed - will retry'
              })
              .eq('id', item.id)

            failedCount++
          }
          
          processedCount++
        } catch (itemError) {
          console.error(`Failed to process translation ${item.id}:`, itemError)
          failedCount++
        }
      }

      // Update job log with success
      if (jobId) {
        await supabase
          .from('cron_execution_log')
          .update({
            completed_at: new Date().toISOString(),
            status: 'success',
            articles_processed: processedCount
          })
          .eq('id', jobId)
      }

      return NextResponse.json({
        success: true,
        message: 'Translation retry completed',
        processed: processedCount,
        successful: successCount,
        failed: failedCount,
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
    console.error('Translation retry failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}