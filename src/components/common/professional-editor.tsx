'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Strike from '@tiptap/extension-strike'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { EditorToolbar } from './editor-toolbar'

const lowlight = createLowlight(common)

import { Bold, Italic, Underline as UnderlineIcon, List, Heading1, Heading2 } from 'lucide-react'

// ─── Heading Item Type (exported for TOC sidebar) ─────────────────────────────
export type HeadingItem = {
  id: string
  level: 1 | 2 | 3
  text: string
}

/** Extract headings from TipTap editor JSON content */
export function extractHeadings(editorJson: Record<string, unknown> | null | undefined): HeadingItem[] {
  if (!editorJson?.content) return []
  const content = editorJson.content as Array<Record<string, unknown>>
  const results: HeadingItem[] = []
  let counter = 0
  for (const node of content) {
    if (node.type === 'heading' && node.attrs && node.content) {
      const attrs = node.attrs as { level?: number }
      const children = node.content as Array<{ type: string; text?: string }>
      const text = children
        .filter((c) => c.type === 'text')
        .map((c) => c.text ?? '')
        .join('')
      if (text.trim() && attrs.level) {
        results.push({
          id: `heading-${counter++}`,
          level: attrs.level as 1 | 2 | 3,
          text: text.trim()
        })
      }
    }
  }
  return results
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface ProfessionalEditorProps {
  value: string
  onChange: (v: string) => void
  onHeadingsChange?: (headings: HeadingItem[]) => void
  minHeight?: string
}

export function ProfessionalEditor({ value, onChange, onHeadingsChange, minHeight = '450px' }: ProfessionalEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        blockquote: false
      }),
      Underline,
      Strike,
      Blockquote,
      CodeBlockLowlight.configure({ lowlight }),
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify']
      }),
      Placeholder.configure({
        placeholder: 'Bắt đầu soạn thảo nội dung bài học chuyên nghiệp...'
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
      if (onHeadingsChange) {
        onHeadingsChange(extractHeadings(editor.getJSON()))
      }
    }
  })

  if (!editor) return null

  return (
    <div className='relative border-2 border-border rounded-2xl bg-card shadow-sm hover:shadow-md focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/30 transition-all overflow-hidden group flex flex-col'>
      {/* BUBBLE MENU */}
      <BubbleMenu
        editor={editor}
        options={{ placement: 'top', offset: 10 }}
        className='z-[100] flex items-center gap-0.5 p-1 bg-foreground text-background rounded-xl shadow-2xl border border-border/20 selection:bg-primary transition-all duration-150'
      >
        <div className='flex items-center border-r border-background/20 pr-1 mr-1'>
          <BubbleItem
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            icon={<Heading1 size={14} />}
          />
          <BubbleItem
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            icon={<Heading2 size={14} />}
          />
        </div>

        <div className='flex items-center border-r border-background/20 pr-1 mr-1'>
          <BubbleItem
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            icon={<Bold size={14} />}
          />
          <BubbleItem
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            icon={<Italic size={14} />}
          />
          <BubbleItem
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            icon={<UnderlineIcon size={14} />}
          />
        </div>

        <BubbleItem
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon={<List size={14} />}
        />
      </BubbleMenu>

      {/* Toolbar cố định */}
      <div className='shrink-0 border-b border-border'>
        <EditorToolbar editor={editor} professional={true} />
      </div>

      <div className='flex-1 overflow-y-auto'>
        <EditorContent
          editor={editor}
          className={`p-10 prose prose-rose max-w-none focus:outline-none [&_.ProseMirror]:outline-none text-foreground leading-relaxed selection:bg-primary/30 prose-pre:bg-[#282c34] prose-pre:text-[#abb2bf] prose-pre:border prose-pre:border-border prose-pre:shadow-sm prose-code:text-rose-500 prose-code:bg-rose-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none`}
          style={{ minHeight }}
        />
      </div>

      <div className='absolute bottom-4 right-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-20 pointer-events-none group-hover:opacity-100 transition-opacity'>
        LearnProof Studio
      </div>
    </div>
  )
}

function BubbleItem({ onClick, active, icon }: { onClick: () => void; active: boolean; icon: React.ReactNode }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`p-1.5 rounded-md transition-all ${active ? 'text-primary bg-background' : 'hover:bg-background/20 text-background'}`}
    >
      {icon}
    </button>
  )
}
