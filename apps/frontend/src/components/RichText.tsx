import { useMemo, useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editorValue, setEditorValue] = useState(value || '')
  
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],  
      ['list'],
      ['link', 'image', 'code-block'],
      ['clean'],
    ],
  }), [])

  // Update editor value when prop value changes (from API loading)
  useEffect(() => {
    if (value !== editorValue) {
      console.log('RichTextEditor: Updating content from', editorValue, 'to', value)
      setEditorValue(value || '')
    }
  }, [value, editorValue])

  const handleChange = (content: string) => {
    console.log('RichTextEditor: Content changed to', content)
    setEditorValue(content)
    onChange(content)
  }
  
  return (
    <ReactQuill 
      theme="snow" 
      value={editorValue} 
      onChange={handleChange} 
      modules={modules}
      placeholder="Enter your content here..."
    />
  )
}
