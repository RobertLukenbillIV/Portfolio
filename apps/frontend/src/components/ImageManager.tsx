// Comprehensive image manager component
// Combines upload/URL input with gallery browsing for complete image management

import { useState } from 'react'
import ImageInput from './ImageInput'
import ImageGallery from './ImageGallery'

interface ImageManagerProps {
  value: string
  onChange: (url: string) => void
  label?: string
  showGallery?: boolean
  className?: string
}

export default function ImageManager({ 
  value, 
  onChange, 
  label = "Image",
  showGallery = true,
  className = ""
}: ImageManagerProps) {
  const [showGalleryPanel, setShowGalleryPanel] = useState(false)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image Input */}
      <ImageInput
        value={value}
        onChange={onChange}
        label={label}
        placeholder="Enter image URL or upload a file"
      />

      {/* Gallery Toggle */}
      {showGallery && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGalleryPanel(!showGalleryPanel)}
            className="px-3 py-1 text-sm bg-brandGreen text-white rounded hover:opacity-90 transition-opacity"
          >
            {showGalleryPanel ? 'Hide' : 'Browse'} uploaded images
          </button>
          {showGalleryPanel && (
            <span className="text-xs text-brandText">
              Click an image to select it
            </span>
          )}
        </div>
      )}

      {/* Image Gallery Panel */}
      {showGallery && showGalleryPanel && (
        <div className="border border-brandSteel/30 rounded-lg p-4 bg-brandFoam/20">
          <ImageGallery
            onSelect={(url) => {
              onChange(url)
              setShowGalleryPanel(false) // Auto-close after selection
            }}
            selectedUrl={value}
          />
        </div>
      )}
    </div>
  )
}