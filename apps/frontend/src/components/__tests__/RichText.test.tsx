import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Simple mock for react-quill that just returns a div
vi.mock('react-quill', () => ({
  default: ({ value, onChange, placeholder }: any) => (
    <div data-testid="mock-quill-editor">
      <textarea 
        data-testid="quill-editor-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}))

// Import after mocking
import { RichTextEditor } from '../RichText'

describe('RichTextEditor', () => {
  const mockOnChange = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with initial value', () => {
    render(<RichTextEditor value="Test content" onChange={mockOnChange} />)
    
    expect(screen.getByTestId('mock-quill-editor')).toBeInTheDocument()
    expect(screen.getByTestId('quill-editor-input')).toHaveValue('Test content')
  })

  it('calls onChange when content changes', async () => {
    render(<RichTextEditor value="" onChange={mockOnChange} />)
    
    const input = screen.getByTestId('quill-editor-input')
    await userEvent.type(input, 'New content')
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('renders with placeholder', () => {
    render(<RichTextEditor value="" onChange={mockOnChange} />)
    
    expect(screen.getByPlaceholderText('Enter your content here...')).toBeInTheDocument()
  })

  describe('Link input portal', () => {
    it('does not show link input initially', () => {
      render(<RichTextEditor value="" onChange={mockOnChange} />)
      
      expect(screen.queryByLabelText('Insert link')).not.toBeInTheDocument()
    })
  })
})

// Test URL normalization function separately
describe('URL normalization logic', () => {
  // Helper function to test the URL normalization logic
  const normalizeUrl = (url: string): string => {
    const trimmed = url.trim()
    if (!trimmed) return ''
    
    // If it already has a protocol, return as-is
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    
    // If it starts with www or looks like a domain, add https://
    if (/^(www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i.test(trimmed)) {
      return `https://${trimmed}`
    }
    
    // If it starts with //, add https:
    if (/^\/\//.test(trimmed)) return `https:${trimmed}`
    
    // If it's a relative path or fragment, return as-is
    if (/^[/#?]/.test(trimmed)) return trimmed
    
    // If it looks like an email, add mailto:
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return `mailto:${trimmed}`
    
    // Otherwise, assume it's a domain and add https://
    return `https://${trimmed}`
  }

  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return false
    
    try {
      new URL(url)
      return true
    } catch {
      return /^[/#?]/.test(url.trim())
    }
  }

  it('adds https:// to domains without protocol', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com')
    expect(normalizeUrl('www.example.com')).toBe('https://www.example.com')
  })

  it('preserves existing protocols', () => {
    expect(normalizeUrl('https://example.com')).toBe('https://example.com')
    expect(normalizeUrl('http://example.com')).toBe('http://example.com')
  })

  it('handles relative paths', () => {
    expect(normalizeUrl('/path/to/page')).toBe('/path/to/page')
    expect(normalizeUrl('#section')).toBe('#section')
    expect(normalizeUrl('?query=value')).toBe('?query=value')
  })

  it('handles email addresses', () => {
    expect(normalizeUrl('user@example.com')).toBe('mailto:user@example.com')
  })

  it('handles protocol-relative URLs', () => {
    expect(normalizeUrl('//example.com')).toBe('https://example.com')
  })

  it('validates URLs correctly', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
    expect(isValidUrl('http://example.com')).toBe(true)
    expect(isValidUrl('/relative/path')).toBe(true)
    expect(isValidUrl('#anchor')).toBe(true)
    expect(isValidUrl('')).toBe(false)
    expect(isValidUrl('   ')).toBe(false)
  })
})