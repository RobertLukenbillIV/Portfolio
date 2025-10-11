import { useMemo, useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editorValue, setEditorValue] = useState(value || '')
  
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],  
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image', 'code-block'],
      ['clean'],
    ],
  }), [])

  // Update editor value when prop value changes (from API loading)
  useEffect(() => {
    console.log('RichTextEditor: value prop changed:', { value, length: value?.length })
    setEditorValue(value || '')
  }, [value])

  const handleChange = (content: string) => {
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
