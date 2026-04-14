'use client'

import { Editor } from '@tiptap/react'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Undo,
  Redo,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Terminal
} from 'lucide-react'

export function EditorToolbar({ editor, professional = false }: { editor: Editor | null; professional?: boolean }) {
  if (!editor) return null

  const addImage = () => {
    const url = window.prompt('Nhập URL hình ảnh:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className='flex flex-wrap items-center gap-0.5 p-1.5 bg-muted/20 border-b border-border'>
        {professional && (
          <div className='flex items-center gap-1 border-r border-border pr-1 mr-1'>
            <ToolbarToggle
              active={editor.isActive('heading', { level: 1 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              tooltip='Tiêu đề 1'
              icon={<Heading1 className='h-4 w-4' />}
            />
            <ToolbarToggle
              active={editor.isActive('heading', { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              tooltip='Tiêu đề 2'
              icon={<Heading2 className='h-4 w-4' />}
            />
          </div>
        )}

        <div className='flex items-center gap-1 border-r border-border pr-1 mr-1'>
          <ToolbarToggle
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            tooltip='In đậm'
            icon={<Bold className='h-4 w-4' />}
          />
          <ToolbarToggle
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            tooltip='In nghiêng'
            icon={<Italic className='h-4 w-4' />}
          />
          <ToolbarToggle
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            tooltip='Gạch chân'
            icon={<UnderlineIcon className='h-4 w-4' />}
          />
          <ToolbarToggle
            active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            tooltip='Gạch ngang'
            icon={<Strikethrough className='h-4 w-4' />}
          />
        </div>

        {professional && (
          <div className='flex items-center gap-1 border-r border-border pr-1 mr-1'>
            <ToolbarToggle
              active={editor.isActive({ textAlign: 'left' })}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              tooltip='Căn trái'
              icon={<AlignLeft className='h-4 w-4' />}
            />
            <ToolbarToggle
              active={editor.isActive({ textAlign: 'center' })}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              tooltip='Căn giữa'
              icon={<AlignCenter className='h-4 w-4' />}
            />
            <ToolbarToggle
              active={editor.isActive({ textAlign: 'right' })}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              tooltip='Căn phải'
              icon={<AlignRight className='h-4 w-4' />}
            />
            <ToolbarToggle
              active={editor.isActive({ textAlign: 'justify' })}
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              tooltip='Căn đều hai bên'
              icon={<AlignJustify className='h-4 w-4' />}
            />
          </div>
        )}

        <div className='flex items-center gap-1 border-r border-border pr-1 mr-1'>
          <ToolbarToggle
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            tooltip='Danh sách'
            icon={<List className='h-4 w-4' />}
          />
          {professional && (
            <>
              <ToolbarToggle
                active={editor.isActive('codeBlock')}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                tooltip='Khối mã'
                icon={<Terminal className='h-4 w-4' />}
              />
              <ToolbarToggle
                active={false}
                onClick={addImage}
                tooltip='Chèn ảnh'
                icon={<ImageIcon className='h-4 w-4' />}
              />
            </>
          )}
        </div>

        <div className='ml-auto flex items-center gap-0.5'>
          <ToolbarToggle
            active={false}
            onClick={() => editor.chain().focus().undo().run()}
            tooltip='Hoàn tác'
            icon={<Undo className='h-4 w-4' />}
          />
          <ToolbarToggle
            active={false}
            onClick={() => editor.chain().focus().redo().run()}
            tooltip='Làm lại'
            icon={<Redo className='h-4 w-4' />}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}

function ToolbarToggle({ active, onClick, icon, tooltip }: any) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          size='sm'
          pressed={active}
          onPressedChange={onClick}
          className='h-8 w-8 p-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted transition-all'
        >
          {icon}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent className='text-[10px] font-bold uppercase tracking-wider'>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
