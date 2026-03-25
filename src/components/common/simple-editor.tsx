'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { EditorToolbar } from './editor-toolbar'
import Placeholder from '@tiptap/extension-placeholder'

export function SimpleEditor({ value, onChange, placeholder, minHeight }: { value: string; onChange: (v: string) => void; placeholder?: string; minHeight?: string }) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [StarterKit, Underline, Placeholder.configure({ placeholder: placeholder ?? 'Viết vài dòng mô tả...' })],
        content: value,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    })

    // Sync editor content when `value` changes externally (e.g. form.reset() after API load)
    // Skip when editor is focused to avoid cursor jumps while the user is typing
    useEffect(() => {
        if (!editor) return
        if (editor.isFocused) return
        const currentHtml = editor.getHTML()
        if (currentHtml !== value) {
            editor.commands.setContent(value ?? '')
        }
    }, [editor, value])

    return (
        <div className="border border-input rounded-xl bg-card overflow-hidden focus-within:ring-2 focus-within:ring-border transition-all shadow-sm">
            <EditorToolbar editor={editor} professional={false} />
            <EditorContent
                editor={editor}
                className={`p-4 prose prose-sm prose-rose max-w-none focus:outline-none text-foreground ${minHeight ?? 'min-h-[120px]'}`}
            />
        </div>
    )
}