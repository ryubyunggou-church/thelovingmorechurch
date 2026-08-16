import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface Props {
  value: string
  onChange: (html: string) => void
}

/**
 * 일반 텍스트 입력 + 툴바 버튼으로 서식을 입히는 WYSIWYG 에디터.
 * 마크다운 문법(**bold**, <br> 등)을 직접 타이핑할 필요 없음 — 선택 후 버튼을
 * 누르면 그 자리에서 바로 굵게/기울임 등으로 보인다. 저장 시 HTML로 변환되어
 * saveDocument()가 자동으로 DOMPurify sanitize 한다(News와 동일한 파이프라인).
 */
export default function PopupRichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) {
    return <div className="h-40 rounded-md border border-paper-line bg-paper" />
  }

  const setLink = () => {
    const url = window.prompt('링크 URL을 입력하세요 (비우면 링크 해제)')
    if (url === null) return
    if (url.trim() === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().setLink({ href: url.trim() }).run()
  }

  const buttons: {
    label: string
    icon: React.ReactNode
    active?: boolean
    onClick: () => void
  }[] = [
    {
      label: '굵게',
      icon: <Bold className="h-4 w-4" />,
      active: editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: '기울임',
      icon: <Italic className="h-4 w-4" />,
      active: editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: '취소선',
      icon: <Strikethrough className="h-4 w-4" />,
      active: editor.isActive('strike'),
      onClick: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: '소제목',
      icon: <Heading2 className="h-4 w-4" />,
      active: editor.isActive('heading', { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: '글머리 목록',
      icon: <List className="h-4 w-4" />,
      active: editor.isActive('bulletList'),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: '번호 목록',
      icon: <ListOrdered className="h-4 w-4" />,
      active: editor.isActive('orderedList'),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: '인용구',
      icon: <Quote className="h-4 w-4" />,
      active: editor.isActive('blockquote'),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: '링크',
      icon: <LinkIcon className="h-4 w-4" />,
      active: editor.isActive('link'),
      onClick: setLink,
    },
    {
      label: '실행 취소',
      icon: <Undo className="h-4 w-4" />,
      onClick: () => editor.chain().focus().undo().run(),
    },
    {
      label: '다시 실행',
      icon: <Redo className="h-4 w-4" />,
      onClick: () => editor.chain().focus().redo().run(),
    },
  ]

  return (
    <div className="rounded-md border border-paper-line bg-paper">
      <div className="flex flex-wrap items-center gap-1 border-b border-paper-line px-2 py-1.5">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            title={btn.label}
            aria-label={btn.label}
            aria-pressed={btn.active}
            onClick={btn.onClick}
            className={cn(
              'inline-flex h-7 w-7 items-center justify-center rounded transition',
              btn.active ? 'bg-gold/15 text-gold-deep' : 'text-paper-muted hover:bg-paper-dim',
            )}
          >
            {btn.icon}
          </button>
        ))}
      </div>
      <EditorContent
        editor={editor}
        className={cn(
          'px-3 py-2 text-sm leading-relaxed text-paper-text',
          '[&_.ProseMirror]:min-h-[140px] [&_.ProseMirror]:outline-none',
          '[&_.ProseMirror_a]:text-gold [&_.ProseMirror_a]:underline',
          '[&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-gold/40 [&_.ProseMirror_blockquote]:pl-3 [&_.ProseMirror_blockquote]:text-paper-muted',
          '[&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-semibold',
          '[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5',
          '[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5',
        )}
      />
    </div>
  )
}
