// Cloudinary configuration for cloud-based image storage
// Provides persistent storage that survives deployments and restarts
// Images are stored in Cloudinary CDN for fast, global delivery

import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Always use HTTPS
})

// Validate configuration on startup
export function validateCloudinaryConfig(): boolean {
  const { cloud_name, api_key, api_secret } = cloudinary.config()
  
  if (!cloud_name || !api_key || !api_secret) {
    console.warn('⚠️  Cloudinary not configured - falling back to local storage')
    console.warn('   Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET')
    return false
  }
  
  console.log('✓ Cloudinary configured:', cloud_name)
  return true
}

export default cloudinary
