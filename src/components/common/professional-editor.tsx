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

import {
    Bold, Italic, Underline as UnderlineIcon,
    List, Heading1, Heading2
} from 'lucide-react'

export function ProfessionalEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                blockquote: false,
            }),
            Underline,
            Strike,
            Blockquote,
            CodeBlockLowlight.configure({ lowlight }),
            Link.configure({ openOnClick: false }),
            Image,
            TextAlign.configure({
                types: ['heading', 'paragraph'], // Cho phép căn lề tiêu đề và đoạn văn
                alignments: ['left', 'center', 'right', 'justify'],
            }),
            Placeholder.configure({
                placeholder: 'Bắt đầu soạn thảo nội dung bài học chuyên nghiệp...'
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) return null

    return (
        <div className="relative border-2 border-border rounded-3xl bg-card shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-primary/10 transition-all overflow-hidden group flex flex-col">

            {/* BUBBLE MENU GỘP TẤT CẢ - Chỉ hiện khi bôi đen */}
            <BubbleMenu
                editor={editor}
                options={{
                    placement: 'top', // Ép menu luôn nằm trên đoạn văn bản bôi đen
                    offset: 10,       // Tạo khoảng cách 10px để không dính sát chữ
                }}
                className="z-[100] flex items-center gap-0.5 p-1 bg-foreground text-background rounded-xl shadow-2xl border border-border/20 selection:bg-primary transition-all duration-150"
            >
                {/* Nhóm Heading */}
                <div className="flex items-center border-r border-background/20 pr-1 mr-1">
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

                {/* Nhóm Format chữ */}
                <div className="flex items-center border-r border-background/20 pr-1 mr-1">
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

                {/* Nhóm Danh sách */}
                <BubbleItem
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    icon={<List size={14} />}
                />
            </BubbleMenu>

            {/* Toolbar cố định */}
            <div className="shrink-0 border-b border-border">
                <EditorToolbar editor={editor} professional={true} />
            </div>

            <div className="flex-1 overflow-y-auto">
                <EditorContent
                    editor={editor}
                    className="p-10 min-h-[450px] prose prose-rose max-w-none focus:outline-none [&_.ProseMirror]:outline-none text-foreground leading-relaxed selection:bg-primary/30 prose-pre:bg-[#282c34] prose-pre:text-[#abb2bf] prose-pre:border prose-pre:border-border prose-pre:shadow-sm prose-code:text-rose-500 prose-code:bg-rose-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none"
                />
            </div>

            <div className="absolute bottom-4 right-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-20 pointer-events-none group-hover:opacity-100 transition-opacity">
                LearnProof Studio
            </div>
        </div>
    )
}

function BubbleItem({ onClick, active, icon }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`p-1.5 rounded-md transition-all ${active
                ? 'text-primary bg-background' // Rose Primary
                : 'hover:bg-background/20 text-background'
                }`}
        >
            {icon}
        </button>
    )
}