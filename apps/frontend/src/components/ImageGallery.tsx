// Image gallery component for browsing and selecting uploaded images
// Displays thumbnails of uploaded images with selection and deletion capabilities

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface UploadedImage {
  filename: string
  url: string
  size: number
  createdAt: string
  modifiedAt: string
}

interface ImageGalleryProps {
  onSelect?: (url: string) => void
  selectedUrl?: string
  className?: string
}

export default function ImageGallery({ onSelect, selectedUrl, className = "" }: ImageGalleryProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Load uploaded images
  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/upload/images')
      setImages(response.data.images || [])
    } catch (error: any) {
      console.error('Failed to load images:', error)
      setError(error.response?.data?.error || 'Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  // Delete an image
  const deleteImage = async (filename: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    try {
      setDeleting(filename)
      await api.delete(`/upload/image/${filename}`)
      
      // Remove from local state
      setImages(prev => prev.filter(img => img.filename !== filename))
      
      // Clear selection if deleted image was selected
      if (selectedUrl?.includes(filename) && onSelect) {
        onSelect('')
      }
    } catch (error: any) {
      console.error('Failed to delete image:', error)
      alert(error.response?.data?.error || 'Failed to delete image')
    } finally {
      setDeleting(null)
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brandSteel/30 border-t-mocha mx-auto mb-2"></div>
        <p className="text-brandSteel/70">Loading images...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadImages}
          className="px-4 py-2 bg-brandGreen text-white rounded-md hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-brandSteel/70 mb-4">No images uploaded yet</p>
        <p className="text-sm text-brandSteel/50">
          Upload images using the image input above or drag and drop files
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-mocha">Uploaded Images</h3>
        <button
          onClick={loadImages}
          className="px-2 py-1 text-sm bg-brandGreen text-white rounded hover:opacity-90 transition-opacity"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.filename}
            className={`relative group rounded-lg border-2 transition-all cursor-pointer ${
              selectedUrl?.includes(image.filename)
                ? 'border-mocha bg-mocha/10'
                : 'border-brandSteel/30 hover:border-brandSteel/50'
            }`}
            onClick={() => onSelect?.(image.url)}
          >
            <div className="aspect-square overflow-hidden rounded-md">
              <img
                src={image.url}
                alt={image.filename}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Image info overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex flex-col justify-end p-2">
              <div className="text-white text-xs space-y-1">
                <p className="font-medium truncate">{image.filename}</p>
                <p>{formatFileSize(image.size)}</p>
                <p>{formatDate(image.createdAt)}</p>
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteImage(image.filename)
              }}
              disabled={deleting === image.filename}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
              title="Delete image"
            >
              {deleting === image.filename ? (
                <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
              ) : (
                '×'
              )}
            </button>

            {/* Selection indicator */}
            {selectedUrl?.includes(image.filename) && (
              <div className="absolute top-1 left-1 bg-mocha text-dark rounded-full w-6 h-6 flex items-center justify-center text-sm">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}