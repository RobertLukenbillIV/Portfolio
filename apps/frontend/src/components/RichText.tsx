import { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editorValue, setEditorValue] = useState(value || '')
  const quillRef = useRef<ReactQuill>(null)
  
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],  
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image', 'code-block'],
      ['clean'],
    ],
  }), [])

  // Custom tooltip positioning function
  const positionTooltip = useCallback(() => {
    const tooltip = document.querySelector('.ql-tooltip') as HTMLElement
    const linkButton = document.querySelector('.ql-link') as HTMLElement
    
    if (tooltip && linkButton && tooltip.classList.contains('ql-editing')) {
      const buttonRect = linkButton.getBoundingClientRect()
      
      // Position tooltip directly below the link button
      tooltip.style.position = 'fixed'
      tooltip.style.top = `${buttonRect.bottom + 5}px`
      tooltip.style.left = `${buttonRect.left}px`
      tooltip.style.transform = 'none'
      tooltip.style.zIndex = '999999'
      
      // Ensure input has proper placeholder
      const input = tooltip.querySelector('input[type="text"]') as HTMLInputElement
      if (input && !input.placeholder) {
        input.placeholder = 'Enter link URL'
      }
    }
  }, [])

  // Set up tooltip positioning when editor is ready
  useEffect(() => {
    if (!quillRef.current) return
    
    const editor = quillRef.current.getEditor()
    
    // Function to handle link button click
    const handleLinkClick = () => {
      // Wait for tooltip to be created
      setTimeout(positionTooltip, 20)
      // Also check again after a longer delay
      setTimeout(positionTooltip, 100)
    }
    
    // Function to handle selection changes
    const handleSelectionChange = () => {
      setTimeout(positionTooltip, 20)
    }
    
    // Set up MutationObserver to watch for tooltip changes
    const observer = new MutationObserver(() => {
      positionTooltip()
    })
    
    // Observe the document for tooltip changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    })
    
    // Add event listeners
    const linkButton = document.querySelector('.ql-link')
    if (linkButton) {
      linkButton.addEventListener('click', handleLinkClick)
    }
    
    editor.on('selection-change', handleSelectionChange)
    
    return () => {
      observer.disconnect()
      if (linkButton) {
        linkButton.removeEventListener('click', handleLinkClick)
      }
      editor.off('selection-change', handleSelectionChange)
    }
  }, [positionTooltip])

  // Sync with parent value when it changes (for loading existing content)
  useEffect(() => {
    // Only update if the prop value is different from our current state
    // and the prop value is not empty (to avoid clearing on initial render)
    if (value !== editorValue && value !== '') {
      setEditorValue(value)
      
      // Force update the Quill editor using proper API
      if (quillRef.current) {
        const editor = quillRef.current.getEditor()
        const currentContent = editor.root.innerHTML
        if (currentContent !== value && (editor.getText().trim() === '' || currentContent.length === 0)) {
          // Use Quill's clipboard API to properly convert and set HTML content
          const delta = editor.clipboard.convert({ html: value })
          editor.setContents(delta, 'silent') // 'silent' prevents triggering change events
        }
      }
    }
  }, [value])

  const handleChange = (content: string) => {
    setEditorValue(content)
    onChange(content)
  }

  return (
    <ReactQuill 
      ref={quillRef}
      theme="snow" 
      value={editorValue} 
      onChange={handleChange} 
      modules={modules}
      placeholder="Enter your content here..."
    />
  )
}
