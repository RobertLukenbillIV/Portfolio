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
      <label className="block text-brandSteel/90 mb-1 font-medium">
        {label}
      </label>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            mode === 'url'
              ? 'bg-mocha text-dark'
              : 'bg-brandFoam/30 text-brandSteel/70 hover:bg-brandFoam/50'
          }`}
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            mode === 'upload'
              ? 'bg-mocha text-dark'
              : 'bg-brandFoam/30 text-brandSteel/70 hover:bg-brandFoam/50'
          }`}
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
          className="w-full rounded-lg bg-brandFoam/40 border border-brandSteel/30 px-3 py-2 text-mocha focus:border-mocha/50 focus:outline-none"
        />
      )}

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="w-full rounded-lg bg-brandFoam/40 border border-brandSteel/30 px-3 py-2 text-mocha file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:bg-mocha file:text-dark hover:file:bg-mocha/90 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-brandSteel/70">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-brandSteel/30 border-t-mocha"></div>
              Uploading...
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {uploadError && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {uploadError}
        </div>
      )}

      {/* Image Preview */}
      {value && (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="w-full max-w-md h-48 object-cover rounded-lg border border-brandSteel/30"
            onError={() => setUploadError('Failed to load image')}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-brandSteel/60">
        {mode === 'upload' 
          ? 'Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP, SVG'
          : 'Enter a direct link to an image file'
        }
      </p>
    </div>
  )
}