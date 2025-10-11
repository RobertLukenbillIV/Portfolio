import { useMemo, useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],  
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image', 'code-block'],
      ['clean'],
    ],
  }), [])

  return (
    <ReactQuill 
      key={value} // Force re-initialization when value changes
      theme="snow" 
      value={value} 
      onChange={onChange} 
      modules={modules}
      placeholder="Enter your content here..."
    />
  )
}
