import { useState } from 'react'
import { RichTextEditor } from '../components/RichText'

export default function QuillTest() {
  const [content, setContent] = useState('')

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl text-brandText font-bold mb-6">Quill List Button Test</h1>
      
      <div className="mb-6">
        <h2 className="text-xl text-brandText font-semibold mb-3">Instructions:</h2>
        <ol className="text-brandText space-y-2 list-decimal list-inside">
          <li>Click the <strong>first list button</strong> (should be bullet) and type some items</li>
          <li>Click the <strong>second list button</strong> (should be ordered) and type some items</li> 
          <li>Check the "Raw HTML Output" below to see what elements are actually created</li>
          <li>Check the "Rendered Preview" to see how they display</li>
        </ol>
      </div>

      <div className="mb-6">
        <h3 className="text-lg text-brandText font-semibold mb-2">Rich Text Editor:</h3>
        <RichTextEditor 
          value={content} 
          onChange={setContent}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg text-brandText font-semibold mb-2">Raw HTML Output:</h3>
        <pre className="bg-slate-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
          {content || '<empty>'}
        </pre>
      </div>

      <div className="mb-6">
        <h3 className="text-lg text-brandText font-semibold mb-2">Rendered Preview:</h3>
        <div 
          className="bg-slate-100 p-4 rounded-lg text-gray-900 min-h-[100px] ql-editor"
          dangerouslySetInnerHTML={{ __html: content || '<p><em>No content yet</em></p>' }}
        />
      </div>

      <div className="bg-blue-900/20 border border-blue-500 text-blue-300 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">What to look for:</h4>
        <ul className="space-y-1 text-sm">
          <li><strong>Bullet lists should create:</strong> <code>&lt;ul&gt;&lt;li&gt;...&lt;/li&gt;&lt;/ul&gt;</code></li>
          <li><strong>Ordered lists should create:</strong> <code>&lt;ol&gt;&lt;li&gt;...&lt;/li&gt;&lt;/ol&gt;</code></li>
          <li><strong>In preview:</strong> Bullets should show • and ordered should show 1. 2. 3.</li>
        </ul>
      </div>
    </div>
  )
}