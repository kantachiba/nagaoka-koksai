import { useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import type { RichDoc } from '../lib/blocks'

/**
 * 本文のブロックエディタ。
 *
 * 段落・見出し・画像・リスト・引用をブロックとして扱う。
 * 「## 」「- 」「> 」などの入力でその場でブロックが切り替わり（マークダウン変換）、
 * 文字を選ぶと太字・リンクのツールチップが出る。
 *
 * 日本語入力（IME）の扱いが難しいところなので、自前の contenteditable ではなく
 * ProseMirror ベースの TipTap を使っている。
 */

/** 写真は Firestore に持つため、画像ノードには photoId を持たせる */
const PhotoImage = Image.extend({
  name: 'image',
  addAttributes() {
    return {
      ...this.parent?.(),
      photoId: { default: null },
      caption: { default: '' },
    }
  },
})

const MAX_BASE64_BYTES = 700_000
const MAX_EDGE = 1600

async function compress(file: File): Promise<{ base64: string; width: number; height: number }> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height)

  for (const quality of [0.82, 0.7, 0.6, 0.5, 0.4]) {
    const base64 = canvas.toDataURL('image/jpeg', quality).split(',')[1] ?? ''
    if (base64.length <= MAX_BASE64_BYTES) return { base64, width, height }
  }
  throw new Error('画像を十分に小さくできませんでした。')
}

interface Props {
  /** 表示中の言語（切り替えると内容を入れ替える） */
  localeKey: string
  doc: RichDoc | undefined
  organizationId: string
  onChange: (doc: RichDoc) => void
}

export default function BlockEditor({ localeKey, doc, organizationId, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // 水平線と code block は今回の記事では使わない
        horizontalRule: false,
        codeBlock: false,
      }),
      Link.configure({ openOnClick: false, autolink: true }),
      PhotoImage,
    ],
    content: doc ?? { type: 'doc', content: [{ type: 'paragraph' }] },
    editorProps: {
      attributes: {
        class:
          'prose-editor min-h-64 rounded-lg border border-snow-300 bg-white px-4 py-3 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON() as RichDoc),
  })

  // 言語タブを切り替えたら、その言語の内容を読み込み直す
  useEffect(() => {
    if (!editor) return
    const next = doc ?? { type: 'doc', content: [{ type: 'paragraph' }] }
    // setContent は履歴を汚すので、内容が実際に違うときだけ
    if (JSON.stringify(editor.getJSON()) !== JSON.stringify(next)) {
      editor.commands.setContent(next, { emitUpdate: false })
    }
  }, [localeKey, editor])

  async function insertImage(file: File | undefined) {
    if (!file || !editor) return
    setUploading(true)
    setError('')
    try {
      const { base64, width, height } = await compress(file)
      const reference = await addDoc(collection(db(), 'photos'), {
        organizationId,
        data: base64,
        mimeType: 'image/jpeg',
        width,
        height,
        fileName: file.name,
        createdAt: serverTimestamp(),
      })
      editor
        .chain()
        .focus()
        .setImage({
          // 保存直後はまだ書き出されていないので、その場のプレビューは data URL
          src: `data:image/jpeg;base64,${base64}`,
          // @ts-expect-error 拡張した属性
          photoId: reference.id,
        })
        .run()
    } catch (e) {
      setError(e instanceof Error ? e.message : '画像を追加できませんでした。')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function setLink() {
    if (!editor) return
    const current = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('リンク先のURL（空にすると解除）', current ?? 'https://')
    if (url === null) return
    if (!url.trim()) return editor.chain().focus().unsetLink().run()
    editor.chain().focus().setLink({ href: url.trim() }).run()
  }

  if (!editor) return <p className="text-sm text-snow-500">エディタを準備しています…</p>

  const toolButton = (active: boolean) =>
    `rounded px-2.5 py-1 text-sm font-bold transition-colors ${
      active ? 'bg-brand-700 text-white' : 'text-snow-700 hover:bg-snow-100'
    }`

  return (
    <div>
      {/* ブロックを足すための操作 */}
      <div className="mb-2 flex flex-wrap items-center gap-1 rounded-lg bg-snow-100 p-1.5">
        <button type="button" onClick={() => editor.chain().focus().setParagraph().run()}
          className={toolButton(editor.isActive('paragraph'))}>本文</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={toolButton(editor.isActive('heading', { level: 2 }))}>見出し</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={toolButton(editor.isActive('heading', { level: 3 }))}>小見出し</button>
        <span className="mx-1 h-5 w-px bg-snow-300" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toolButton(editor.isActive('bulletList'))}>箇条書き</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={toolButton(editor.isActive('blockquote'))}>引用</button>
        <span className="mx-1 h-5 w-px bg-snow-300" />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className={toolButton(false)}>{uploading ? '追加中…' : '画像'}</button>
        <input ref={fileRef} type="file" accept="image/*" hidden
          onChange={(e) => void insertImage(e.target.files?.[0])} />
      </div>

      {/* 文字を選ぶと出るツールチップ */}
      <BubbleMenu editor={editor}
        className="flex items-center gap-0.5 rounded-lg bg-snow-900 p-1 shadow-lg">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded px-2.5 py-1 text-sm font-bold ${editor.isActive('bold') ? 'bg-white text-snow-900' : 'text-white hover:bg-snow-700'}`}>
          太字
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded px-2.5 py-1 text-sm italic ${editor.isActive('italic') ? 'bg-white text-snow-900' : 'text-white hover:bg-snow-700'}`}>
          斜体
        </button>
        <button type="button" onClick={setLink}
          className={`rounded px-2.5 py-1 text-sm font-bold ${editor.isActive('link') ? 'bg-white text-snow-900' : 'text-white hover:bg-snow-700'}`}>
          リンク
        </button>
      </BubbleMenu>

      <EditorContent editor={editor} />

      {error && (
        <p role="alert" className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>
      )}

      <p className="mt-2 text-xs leading-relaxed text-snow-500">
        行頭で <code className="rounded bg-snow-100 px-1">## </code> と打つと見出しに、
        <code className="rounded bg-snow-100 px-1">- </code> で箇条書きに、
        <code className="rounded bg-snow-100 px-1">&gt; </code> で引用になります。
        文字を選ぶと太字・リンクのメニューが出ます。
      </p>
    </div>
  )
}
