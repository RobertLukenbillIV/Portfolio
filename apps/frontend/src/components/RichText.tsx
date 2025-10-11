import { useMemo, useState, useEffect, useRef } from 'react'
import ReactQuill from 'react-quill'
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
