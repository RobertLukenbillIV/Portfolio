import { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import ReactQuill from 'react-quill'
import { createPortal } from 'react-dom'
import 'react-quill/dist/quill.snow.css'

export function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editorValue, setEditorValue] = useState(value || '')
  const quillRef = useRef<ReactQuill>(null)

  // Portal state for the custom link input
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkPos, setLinkPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const [linkValue, setLinkValue] = useState('')
  const [savedRange, setSavedRange] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Portal state for the custom image input
  const [showImageInput, setShowImageInput] = useState(false)
  const [imagePos, setImagePos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const [imageValue, setImageValue] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [savedImageRange, setSavedImageRange] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'code-block'],
      ['clean'],
    ],
  }), [])

  // Normalize URL - add protocol if missing
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

  // Validate if URL is reasonable
  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return false
    
    try {
      // Try to create URL object for validation
      new URL(url)
      return true
    } catch {
      // If URL constructor fails, check for relative paths which are also valid
      return /^[/#?]/.test(url.trim())
    }
  }

  // Attach a custom toolbar handler for the link button that opens a portal-mounted input
  useEffect(() => {
    if (!quillRef.current) return
    const editor = quillRef.current.getEditor()

    // Handler that opens our portal input positioned under the toolbar button
    const openLinkInput = () => {
      const range = editor.getSelection(true)
      
      // Require text selection before showing link input
      if (!range || range.length === 0) {
        // Show brief visual feedback that text selection is required
        const editorContainer = quillRef.current?.editor?.container
        const toolbarEl = editorContainer?.querySelector('.ql-toolbar') as HTMLElement | null
        // Prefer the actual button element for precise bounds
        const linkButton = toolbarEl?.querySelector('button.ql-link') as HTMLElement | null
          || toolbarEl?.querySelector('.ql-link') as HTMLElement | null
        if (linkButton) {
          linkButton.style.background = 'rgba(239, 68, 68, 0.1)'
          linkButton.style.transition = 'background-color 0.2s ease'
          setTimeout(() => {
            linkButton.style.background = ''
          }, 300)
        }
        return
      }
      
      setSavedRange(range)

      // Find the specific toolbar link button for THIS editor instance
      const editorContainer = quillRef.current?.editor?.container
      
      // Try multiple ways to find the toolbar
      console.log('🔍 Debugging editor and toolbar structure:')
      console.log('Editor container:', editorContainer)
      console.log('Container children:', editorContainer?.children)
      
      // Try different toolbar selectors
      const toolbarSelectors = [
        '.ql-toolbar',
        '[class*="toolbar"]',
        '.quill-toolbar',
        'div[role="toolbar"]'
      ]
      
      let toolbarEl: HTMLElement | null = null
      for (const selector of toolbarSelectors) {
        toolbarEl = editorContainer?.querySelector(selector) as HTMLElement | null
        if (toolbarEl) {
          console.log(`✅ Found toolbar with selector: ${selector}`, toolbarEl)
          break
        }
      }
      
      // If still no toolbar, look in parent containers or siblings
      if (!toolbarEl && editorContainer) {
        console.log('🔍 Looking for toolbar in parent/sibling elements...')
        
        // Check siblings
        const parent = editorContainer.parentElement
        toolbarEl = parent?.querySelector('.ql-toolbar') as HTMLElement | null ||
                   parent?.querySelector('[class*="toolbar"]') as HTMLElement | null
        
        if (toolbarEl) {
          console.log('✅ Found toolbar in parent/sibling:', toolbarEl)
        } else {
          // Look for any element with toolbar-like buttons
          const potentialToolbars = document.querySelectorAll('div')
          for (const div of Array.from(potentialToolbars)) {
            const buttons = div.querySelectorAll('button')
            if (buttons.length >= 3) { // Likely a toolbar if it has multiple buttons
              console.log('🤔 Potential toolbar candidate:', div, 'buttons:', buttons.length)
              // Check if any button looks like formatting buttons
              const hasFormattingButtons = Array.from(buttons).some(btn => 
                btn.className.includes('ql-') || 
                btn.querySelector('svg') ||
                ['B', 'I', 'U'].includes(btn.textContent?.trim() || '')
              )
              if (hasFormattingButtons) {
                toolbarEl = div as HTMLElement
                console.log('✅ Found toolbar by button analysis:', toolbarEl)
                break
              }
            }
          }
        }
      }
      
      if (!toolbarEl) {
        console.log('❌ Could not find any toolbar element')
        // Fallback to document-wide search for Quill buttons
        toolbarEl = document.querySelector('.ql-toolbar') as HTMLElement | null ||
                   document.querySelector('[class*="toolbar"]') as HTMLElement | null
        if (toolbarEl) {
          console.log('✅ Found toolbar with document-wide search:', toolbarEl)
        }
      }
      
      // Debug: Let's understand the toolbar structure
      console.log('📊 Final toolbar analysis:')
      console.log('Toolbar element:', toolbarEl)
      console.log('All toolbar buttons:', Array.from(toolbarEl?.querySelectorAll('button') || []).map(btn => ({ 
        className: btn.className, 
        title: btn.title,
        textContent: btn.textContent?.trim(),
        rect: btn.getBoundingClientRect()
      })))
      
      // Try different selectors to find the link button
      const linkButtonSelectors = [
        'button.ql-link',
        '.ql-link',
        'button[title*="link" i]',
        'button[aria-label*="link" i]',
        '.ql-formats button:nth-child(2)', // Often link is second button after bold
        '.ql-formats button:nth-child(3)', // Sometimes third
      ]
      
      let linkButton: HTMLElement | null = null
      for (const selector of linkButtonSelectors) {
        linkButton = toolbarEl?.querySelector(selector) as HTMLElement | null
        if (linkButton) {
          console.log(`✅ Found link button with selector: ${selector}`, {
            element: linkButton,
            className: linkButton.className,
            title: linkButton.title,
            rect: linkButton.getBoundingClientRect()
          })
          break
        }
      }
      
      if (!linkButton) {
        console.log('❌ No link button found, trying to find by icon or content')
        // Look for SVG icons or specific content that might indicate link button
        const allButtons = Array.from(toolbarEl?.querySelectorAll('button') || [])
        linkButton = allButtons.find(btn => {
          const svg = btn.querySelector('svg')
          const hasLinkIcon = svg?.innerHTML.includes('path') && (
            svg.innerHTML.includes('M10 13') || // Common link icon path
            svg.innerHTML.includes('link') ||
            btn.title?.toLowerCase().includes('link') ||
            btn.getAttribute('aria-label')?.toLowerCase().includes('link')
          )
          return hasLinkIcon
        }) as HTMLElement || null
        
        if (linkButton) {
          console.log('✅ Found link button by icon analysis:', linkButton)
        } else {
          console.log('🔍 All buttons analysis for manual identification:')
          allButtons.forEach((btn, index) => {
            console.log(`Button ${index}:`, {
              element: btn,
              className: btn.className,
              innerHTML: btn.innerHTML,
              title: btn.title,
              textContent: btn.textContent?.trim(),
              rect: btn.getBoundingClientRect()
            })
          })
        }
      }
      
      if (linkButton) {
        const updatePosition = () => {
          const rect = linkButton.getBoundingClientRect()
          
          // Temporarily highlight the button we're targeting for visual confirmation
          linkButton.style.backgroundColor = 'red'
          linkButton.style.transition = 'background-color 0.3s ease'
          setTimeout(() => {
            linkButton.style.backgroundColor = ''
          }, 1000)
          
          console.log('📍 Link button positioning:', {
            rect,
            windowScroll: { x: window.scrollX, y: window.scrollY }
          })
          
          // Use absolute positioning with scroll offsets for proper tracking
          // Center the portal under the center of the link button
          const portalWidth = 320
          const portalHeight = 50
          let top = rect.bottom + window.scrollY + 2
          
          // Adjust centering calculation - use the button's actual center
          // and account for any potential border/padding differences
          let left = rect.left + window.scrollX + (rect.width / 2) - (portalWidth / 2)
          
          console.log('📍 Calculated portal position:', { 
            top, 
            left,
            buttonCenter: rect.left + (rect.width / 2),
            portalCenter: left + (portalWidth / 2),
            offset: (left + (portalWidth / 2)) - (rect.left + (rect.width / 2))
          })
          
          // If the portal appears slightly left, let's try a larger right adjustment
          // This accounts for any CSS styling or border differences
          left += 20 // Increased adjustment to make the change more visible
          
          console.log('📍 Portal moved right by 20px for testing')
          
          // Ensure the portal stays within viewport bounds
          if (left + portalWidth > window.innerWidth + window.scrollX) {
            left = window.innerWidth + window.scrollX - portalWidth - 10
          }
          if (left < window.scrollX + 10) {
            left = window.scrollX + 10
          }
          if (top + portalHeight > window.innerHeight + window.scrollY) {
            top = rect.top + window.scrollY - portalHeight - 6
          }
          
          console.log('📍 Final portal position (with adjustment):', { top, left })
          
          // Ensure the portal stays within viewport bounds
          if (left + portalWidth > window.innerWidth + window.scrollX) {
            left = window.innerWidth + window.scrollX - portalWidth - 10
          }
          if (left < window.scrollX + 10) {
            left = window.scrollX + 10
          }
          if (top + portalHeight > window.innerHeight + window.scrollY) {
            top = rect.top + window.scrollY - portalHeight - 6
          }
          
          setLinkPos({ top, left })
        }

        // Initial positioning
        updatePosition()

      } else {
        // Fallback to near top-left of editor
        const editorEl = quillRef.current?.editor?.container || (document.querySelector('.ql-editor') as HTMLElement)
        const rect = editorEl?.getBoundingClientRect()
        setLinkPos({ 
          top: (rect?.top ?? 100) + window.scrollY + 6, 
          left: (rect?.left ?? 100) + window.scrollX 
        })
      }

      // Pre-fill with existing link if selection has one
      const formats = editor.getFormat(range)
      const link = (formats as any)?.link
      if (link && typeof link === 'string') setLinkValue(link)
      else setLinkValue('')

      setShowLinkInput(true)
      // focus shortly after rendering
      setTimeout(() => inputRef.current?.focus(), 0)
    }

    // Handler for image button that opens our portal input
    const openImageInput = () => {
      const range = editor.getSelection(true)
      setSavedImageRange(range)

      // Find the specific toolbar image button for THIS editor instance
      const editorContainer = quillRef.current?.editor?.container
      const toolbarEl = editorContainer?.querySelector('.ql-toolbar') as HTMLElement | null
      const imageButton = toolbarEl?.querySelector('button.ql-image') as HTMLElement | null
        || toolbarEl?.querySelector('.ql-image') as HTMLElement | null
      
      if (imageButton) {
        const rect = imageButton.getBoundingClientRect()
        let top = rect.bottom + window.scrollY + 6
        let left = rect.left + window.scrollX
        
        // Ensure the portal stays within viewport bounds
        const portalWidth = 400
        const portalHeight = 150
        
        if (left + portalWidth > window.innerWidth + window.scrollX) {
          left = window.innerWidth + window.scrollX - portalWidth - 10
        }
        if (left < window.scrollX + 10) {
          left = window.scrollX + 10
        }
        if (top + portalHeight > window.innerHeight + window.scrollY) {
          top = rect.top + window.scrollY - portalHeight - 6
        }
        
        setImagePos({ top, left })
      } else {
        // Fallback to near top-left of editor
        const editorEl = quillRef.current?.editor?.container || (document.querySelector('.ql-editor') as HTMLElement)
        const rect = editorEl?.getBoundingClientRect()
        setImagePos({ 
          top: (rect?.top ?? 100) + window.scrollY + 6, 
          left: (rect?.left ?? 100) + window.scrollX 
        })
      }

      setImageValue('')
      setImageAlt('')
      setShowImageInput(true)
      // focus shortly after rendering
      setTimeout(() => imageInputRef.current?.focus(), 0)
    }

    // Install our handlers on the toolbar module
    try {
      const toolbar = editor.getModule('toolbar') as any
      if (toolbar && typeof toolbar.addHandler === 'function') {
        toolbar.addHandler('link', openLinkInput)
        toolbar.addHandler('image', openImageInput)
      }
    } catch (err) {
      // ignore if toolbar not available
    }

    // Close on escape or outside click
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLinkInput(false)
        setShowImageInput(false)
      }
    }
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node | null
      if (showLinkInput) {
        const portalEl = document.querySelector('.quill-link-portal')
        if (portalEl && target && !portalEl.contains(target)) {
          setShowLinkInput(false)
        }
      }
      if (showImageInput) {
        const portalEl = document.querySelector('.quill-image-portal')
        if (portalEl && target && !portalEl.contains(target)) {
          setShowImageInput(false)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onClick)

    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onClick)
    }
  }, [showLinkInput, showImageInput])

  // Handle scroll updates for link positioning
  useEffect(() => {
    if (!showLinkInput) return

    const updateLinkPosition = () => {
      const editorContainer = quillRef.current?.editor?.container
      const linkButton = editorContainer?.querySelector('.ql-toolbar .ql-link') as HTMLElement | null
      
      if (linkButton) {
        const rect = linkButton.getBoundingClientRect()
        let top = rect.bottom + window.scrollY + 2
        let left = rect.left + window.scrollX + (rect.width / 2) - 160 // Center 320px portal under link button
        
        const portalWidth = 320
        const portalHeight = 50
        
        if (left + portalWidth > window.innerWidth + window.scrollX) {
          left = window.innerWidth + window.scrollX - portalWidth - 10
        }
        if (left < window.scrollX + 10) {
          left = window.scrollX + 10
        }
        if (top + portalHeight > window.innerHeight + window.scrollY) {
          top = rect.top + window.scrollY - portalHeight - 6
        }
        
        setLinkPos({ top, left })
      }
    }

    const handleScroll = () => updateLinkPosition()
    const handleResize = () => updateLinkPosition()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [showLinkInput])

  // Handle scroll updates for image positioning
  useEffect(() => {
    if (!showImageInput) return

    const updateImagePosition = () => {
      const editorContainer = quillRef.current?.editor?.container
      const imageButton = editorContainer?.querySelector('.ql-toolbar .ql-image') as HTMLElement | null
      
      if (imageButton) {
        const rect = imageButton.getBoundingClientRect()
        let top = rect.bottom + window.scrollY + 6
        let left = rect.left + window.scrollX
        
        const portalWidth = 400
        const portalHeight = 150
        
        if (left + portalWidth > window.innerWidth + window.scrollX) {
          left = window.innerWidth + window.scrollX - portalWidth - 10
        }
        if (left < window.scrollX + 10) {
          left = window.scrollX + 10
        }
        if (top + portalHeight > window.innerHeight + window.scrollY) {
          top = rect.top + window.scrollY - portalHeight - 6
        }
        
        setImagePos({ top, left })
      }
    }

    const handleScroll = () => updateImagePosition()
    const handleResize = () => updateImagePosition()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [showImageInput])  // Sync with parent value when it changes (for loading existing content)
  useEffect(() => {
    if (value !== editorValue && value !== '') {
      setEditorValue(value)
      if (quillRef.current) {
        const editor = quillRef.current.getEditor()
        const currentContent = editor.root.innerHTML
        if (currentContent !== value && (editor.getText().trim() === '' || currentContent.length === 0)) {
          const delta = editor.clipboard.convert({ html: value })
          editor.setContents(delta, 'silent')
        }
      }
    }
  }, [value])

  const applyLink = () => {
    if (!quillRef.current) return
    const editor = quillRef.current.getEditor()
    const range = savedRange ?? editor.getSelection(true)
    if (!range) return setShowLinkInput(false)

    if (linkValue && linkValue.trim() !== '') {
      const normalizedUrl = normalizeUrl(linkValue)
      
      if (!isValidUrl(normalizedUrl)) {
        // Could show an error message here, but for now just ignore invalid URLs
        return
      }

      // Apply link formatting to the selected range. If length === 0, insert link text.
      if (range.length > 0) {
        editor.formatText(range.index, range.length, 'link', normalizedUrl, 'user')
      } else {
        // Insert the URL as text and link it
        editor.insertText(range.index, normalizedUrl, { link: normalizedUrl }, 'user')
      }
    }

    setShowLinkInput(false)
  }

  const removeLink = () => {
    if (!quillRef.current) return
    const editor = quillRef.current.getEditor()
    const range = savedRange ?? editor.getSelection(true)
    if (!range) return setShowLinkInput(false)
    if (range.length > 0) editor.formatText(range.index, range.length, 'link', false, 'user')
    setShowLinkInput(false)
  }

  // Image upload function
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Image upload error:', error)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  // Handle file selection for upload
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const url = await uploadImage(file)
    if (url) {
      setImageValue(url)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const applyImage = () => {
    if (!quillRef.current) return
    const editor = quillRef.current.getEditor()
    const range = savedImageRange ?? editor.getSelection(true)
    if (!range) return setShowImageInput(false)

    if (imageValue && imageValue.trim() !== '') {
      const normalizedUrl = normalizeUrl(imageValue)
      
      if (!isValidUrl(normalizedUrl)) {
        // Could show an error message here, but for now just ignore invalid URLs
        return
      }

      // Insert image at cursor position
      editor.insertEmbed(range.index, 'image', normalizedUrl, 'user')
      
      // If alt text is provided, we could set it as a title attribute
      // Note: Quill doesn't natively support alt text, but we could extend it
      if (imageAlt.trim()) {
        // For now, we'll just insert the image - alt text support would require custom Quill modules
        console.log('Alt text provided but not applied:', imageAlt)
      }

      // Move cursor after the image
      editor.setSelection(range.index + 1)
    }

    setShowImageInput(false)
  }

  const handleChange = (content: string) => {
    setEditorValue(content)
    onChange(content)
  }

  return (
    <>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        placeholder="Enter your content here..."
      />

      {showLinkInput && typeof document !== 'undefined' && createPortal(
        <div
          className="absolute bg-red-500 dark:bg-red-600 border-4 border-yellow-400 rounded-md shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 quill-link-portal"
          style={{ 
            top: linkPos.top, 
            left: linkPos.left, 
            zIndex: 2000001,
            position: 'absolute',
            backgroundColor: 'red',
            border: '4px solid yellow'
          }}
          role="dialog"
          aria-label="Insert link"
        >
          {/* Debug info overlay */}
          <div className="absolute -top-8 left-0 bg-black text-white text-xs p-1 rounded">
            L:{Math.round(linkPos.left)} T:{Math.round(linkPos.top)}
          </div>
          
          {/* Small arrow pointing up to the button - adjust for larger portal offset */}
          <div className="absolute -top-1 transform w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-yellow-400" 
               style={{ left: 'calc(50% - 20px)', transform: 'translateX(-50%)' }}></div>
          
          <div className="flex items-center gap-1 p-2">
            <input
              ref={inputRef}
              type="text"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  applyLink()
                } else if (e.key === 'Escape') {
                  e.preventDefault()
                  setShowLinkInput(false)
                }
              }}
              placeholder="Enter URL"
              className="w-48 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" onClick={applyLink} type="button">
              {linkValue ? 'Update' : 'Add'}
            </button>
            {linkValue && (
              <button className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors" onClick={removeLink} type="button">
                Remove
              </button>
            )}
            <button className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" onClick={() => setShowLinkInput(false)} type="button">×</button>
          </div>
        </div>,
        document.body
      )}

      {showImageInput && typeof document !== 'undefined' && createPortal(
        <div
          className="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 animate-in fade-in-0 zoom-in-95 duration-200 quill-image-portal"
          style={{ top: imagePos.top, left: imagePos.left, zIndex: 2000001 }}
          role="dialog"
          aria-label="Insert image"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-600 pb-2">
              <button 
                className={`px-3 py-1 rounded text-sm transition-colors ${!fileInputRef.current?.files?.length ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                onClick={() => imageInputRef.current?.focus()}
              >
                URL
              </button>
              <button 
                className={`px-3 py-1 rounded text-sm transition-colors ${fileInputRef.current?.files?.length ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              <input
                ref={imageInputRef}
                type="text"
                value={imageValue}
                onChange={(e) => setImageValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    applyImage()
                  } else if (e.key === 'Escape') {
                    e.preventDefault()
                    setShowImageInput(false)
                  }
                }}
                placeholder="Enter image URL"
                className="w-80 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Alt text (optional)"
                className="w-80 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <button 
                className="btn btn-primary" 
                onClick={applyImage} 
                disabled={isUploading || (!imageValue.trim())}
                type="button"
              >
                {isUploading ? 'Uploading...' : 'Insert'}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowImageInput(false)} type="button">Cancel</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
