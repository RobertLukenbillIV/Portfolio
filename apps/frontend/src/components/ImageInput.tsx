// Enhanced image input component with upload and URL support
// Allows users to either upload a file or enter a URL
// Provides image preview and upload progress feedback

import { useState, useRef } from 'react'
import { api } from '@/lib/api'

interface ImageInputProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  className?: string
}

export default function ImageInput({ 
  value, 
  onChange, 
  label = "Image", 
  placeholder = "Enter image URL or upload file",
  className = ""
}: ImageInputProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [mode, setMode] = useState<'url' | 'upload'>('url')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Update value with uploaded image URL
      onChange(response.data.url)
    } catch (error: any) {
      console.error('Upload error:', error)
      setUploadError(error.response?.data?.error || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // Handle URL input change
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
    setUploadError(null)
  }

  // Clear image
  const clearImage = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setUploadError(null)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block mb-1 font-medium" style={{ color: 'var(--text-primary, #2c3e50)' }}>
        {label}
      </label>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            mode === 'url'
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-200'
          }`}
          style={{
            backgroundColor: mode === 'url' ? 'var(--primary-color, #3498db)' : '#6b7280',
            color: mode === 'url' ? 'white' : '#6b7280'
          }}
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            mode === 'upload'
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-200'
          }`}
          style={{
            backgroundColor: mode === 'upload' ? 'var(--primary-color, #3498db)' : '#6b7280',
            color: mode === 'upload' ? 'white' : '#6b7280'
          }}
        >
          Upload
        </button>
      </div>

      {/* URL Input Mode */}
      {mode === 'url' && (
        <input
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder={placeholder}
          className="w-full rounded-lg border-2 px-3 py-2 focus:ring-2 focus:outline-none shadow-md"
          style={{
            backgroundColor: 'var(--card-background, #ffffff)',
            borderColor: 'var(--border-color, #ddd)',
            color: 'var(--text-primary, #2c3e50)',
            fontSize: '14px'
          }}
        />
      )}

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div className="space-y-2">
          <div 
            className="w-full rounded-lg border-2 px-3 py-2 shadow-md"
            style={{
              backgroundColor: 'var(--card-background, #ffffff)',
              borderColor: 'var(--border-color, #ddd)'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full bg-transparent disabled:opacity-50 disabled:cursor-not-allowed cursor-default"
              style={{
                color: 'var(--text-primary, #2c3e50)',
                fontSize: '14px'
              }}
            />
          </div>
          
          {uploading && (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary, #7f8c8d)' }}>
              <div 
                className="animate-spin rounded-full h-4 w-4 border-2 border-t-current"
                style={{ borderColor: 'var(--border-color, #ddd)' }}
              ></div>
              Uploading...
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {uploadError && (
        <div 
          className="text-sm rounded-md px-3 py-2 border"
          style={{
            color: 'var(--error-color, #e74c3c)',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            borderColor: 'var(--error-color, #e74c3c)'
          }}
        >
          {uploadError}
        </div>
      )}

      {/* Image Preview */}
      {value && (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="w-full max-w-md h-48 object-cover rounded-lg border"
            style={{ borderColor: 'var(--border-color, #ddd)' }}
            onError={() => setUploadError('Failed to load image')}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-opacity-80 transition-colors"
            style={{ backgroundColor: 'var(--error-color, #e74c3c)' }}
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs" style={{ color: 'var(--text-secondary, #7f8c8d)' }}>
        {mode === 'upload' 
          ? 'Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP, SVG'
          : 'Enter a direct link to an image file'
        }
      </p>
    </div>
  )
}