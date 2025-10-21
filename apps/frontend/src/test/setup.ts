import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock react-quill since it requires a DOM and has complex dependencies
vi.mock('react-quill', () => ({
  default: vi.fn((props: any) => {
    const { value, onChange, placeholder } = props
    return {
      type: 'div',
      props: {
        'data-testid': 'mock-quill-editor',
        children: {
          type: 'textarea',
          props: {
            'data-testid': 'quill-editor-input',
            value: value,
            onChange: (e: any) => onChange(e.target.value),
            placeholder: placeholder
          }
        }
      }
    }
  })
}))

// Mock Quill editor module
vi.mock('quill', () => ({
  default: vi.fn(() => ({
    getModule: vi.fn(() => ({
      addHandler: vi.fn()
    })),
    getSelection: vi.fn(() => ({ index: 0, length: 0 })),
    getFormat: vi.fn(() => ({})),
    formatText: vi.fn(),
    insertText: vi.fn(),
    clipboard: {
      convert: vi.fn(() => ({})),
    },
    setContents: vi.fn(),
    getText: vi.fn(() => ''),
    root: {
      innerHTML: ''
    },
    on: vi.fn(),
    off: vi.fn()
  }))
}))

// Mock portal for testing
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    createPortal: vi.fn((children) => children)
  }
})