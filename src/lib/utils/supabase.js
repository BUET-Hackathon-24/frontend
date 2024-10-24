import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cghemaaztqssvxbmmzwq.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnaGVtYWF6dHFzc3Z4Ym1tendxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk2ODc0ODgsImV4cCI6MjA0NTI2MzQ4OH0.xjQXzVvEbig7NvSaU9Tw_RCswRMAhQbPeig8CfP8uXI'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const uploadToSupabase = async ({ file, bucketName = 'files' }) => {
  try {
    if (!file) {
      throw new Error('File is required')
    }

    // Create unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    // Upload file
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file)

    if (error) throw error

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(filePath)

    return {
      path: filePath,
      url: publicUrl,
      name: fileName,
    }
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }
}

export default uploadToSupabase
