'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { EditorToolbar } from './editor-toolbar'
import Placeholder from '@tiptap/extension-placeholder'

export function SimpleEditor({
  value,
  onChange,
  placeholder,
  minHeight
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  minHeight?: string
}) {
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        spellcheck: 'false'
      }
    },
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: placeholder ?? 'Viết vài dòng mô tả...' })
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML())
  })

  return (
    <div className='border border-input rounded-xl bg-card overflow-hidden focus-within:ring-2 focus-within:ring-border transition-all shadow-sm'>
      <EditorToolbar editor={editor} professional={false} />
      <EditorContent
        editor={editor}
        className={`p-4 prose prose-sm prose-rose max-w-none focus:outline-none text-foreground ${minHeight ?? 'min-h-[120px]'}`}
      />
    </div>
  )
}
