import type { LocalizedField } from '../i18n/text'
import type { Locale } from '../i18n'
import { stripRuby } from './ruby'

/**
 * 本文の保存形式。
 *
 * エディタ（TipTap / ProseMirror）が出す JSON をそのまま持つ。
 * 独自形式に変換しないのは、往復で情報が落ちるのを避けるため。
 * 公開側は下の型に沿って自前で描画するので、閲覧者に JS は要らない。
 *
 * 扱うノード：
 *   doc / paragraph / heading / bulletList / orderedList / listItem
 *   blockquote / image / hardBreak / text
 * 扱うマーク：
 *   bold / italic / link
 */

export type Mark =
  | { type: 'bold' }
  | { type: 'italic' }
  | { type: 'link'; attrs?: { href?: string } }

export type RichNode = {
  type: string
  text?: string
  marks?: Mark[]
  attrs?: Record<string, unknown>
  content?: RichNode[]
}

export type RichDoc = { type: 'doc'; content?: RichNode[] }

/** 言語ごとの本文 */
export type LocalizedDoc = Partial<Record<Locale, RichDoc>>

export const emptyDoc = (): RichDoc => ({
  type: 'doc',
  content: [{ type: 'paragraph' }],
})

export const isEmptyDoc = (doc: RichDoc | undefined): boolean =>
  !doc?.content?.length || docToPlainText(doc).trim() === ''

/**
 * 旧形式（段落ごとの多言語テキストの配列）を新形式へ寄せる。
 *
 * ブロックエディタ導入前に登録された記事を壊さないための橋渡し。
 * 保存し直すと新形式になる。
 */
export function legacyParagraphsToDoc(
  paragraphs: LocalizedField[] | undefined,
  locale: Locale,
): RichDoc {
  const content = (paragraphs ?? [])
    .map((paragraph) => paragraph[locale] ?? paragraph.ja ?? '')
    .filter((text) => text.trim())
    .map((text): RichNode => ({ type: 'paragraph', content: [{ type: 'text', text }] }))

  return { type: 'doc', content: content.length ? content : [{ type: 'paragraph' }] }
}

/** 本文の素のテキスト。抜粋や OGP の説明文に使う */
export function docToPlainText(doc: RichDoc | undefined): string {
  const walk = (nodes: RichNode[] | undefined): string =>
    (nodes ?? [])
      .map((node) => {
        if (node.type === 'text') return node.text ?? ''
        if (node.type === 'hardBreak') return '\n'
        const inner = walk(node.content)
        // 段落・見出し・リスト項目は改行で区切る
        return ['paragraph', 'heading', 'listItem', 'blockquote'].includes(node.type)
          ? `${inner}\n`
          : inner
      })
      .join('')

  return stripRuby(walk(doc?.content)).replace(/\n{2,}/g, '\n').trim()
}

/** 本文に含まれる写真IDを集める（ビルド時の書き出し対象を決めるのに使う） */
export function collectPhotoIds(doc: RichDoc | undefined): string[] {
  const ids: string[] = []
  const walk = (nodes: RichNode[] | undefined) => {
    for (const node of nodes ?? []) {
      if (node.type === 'image' && typeof node.attrs?.photoId === 'string') {
        ids.push(node.attrs.photoId)
      }
      walk(node.content)
    }
  }
  walk(doc?.content)
  return ids
}

/** 段落テキストの配列から、言語ごとの本文を組み立てる（初期データ・検証用） */
export function paragraphsToLocalizedDoc(paragraphs: LocalizedField[]): LocalizedDoc {
  const locales = ['ja', 'en'] as const
  return Object.fromEntries(
    locales.map((locale) => [locale, legacyParagraphsToDoc(paragraphs, locale)]),
  )
}

/**
 * 表示言語の本文を取り出す。無ければ日本語へフォールバックする。
 * 本文はマークアップを含むため、断り書きの出し分けは呼び出し側で行う。
 */
export function resolveDoc(
  body: LocalizedDoc | undefined,
  locale: Locale,
): { doc: RichDoc; isFallback: boolean } {
  const requested = body?.[locale]
  if (requested && !isEmptyDoc(requested)) return { doc: requested, isFallback: false }

  const japanese = body?.ja
  return {
    doc: japanese ?? emptyDoc(),
    isFallback: !!japanese && !isEmptyDoc(japanese) && locale !== 'ja',
  }
}

/**
 * 保存前の後始末。
 *
 * エディタ上の画像は、その場で見せるために data URL を持っている。
 * これをそのまま保存すると 1ドキュメント 1MiB の上限を簡単に超えるので、
 * 公開後の配信パスに置き換える（実体は photos コレクションにある）。
 */
export function prepareDocForSave(doc: RichDoc | undefined): RichDoc {
  const walk = (node: RichNode): RichNode => {
    const next: RichNode = { ...node }

    if (node.type === 'image') {
      const photoId = node.attrs?.photoId
      next.attrs = {
        ...node.attrs,
        src: typeof photoId === 'string' ? `/photos/${photoId}.jpg` : '',
      }
    }
    if (node.content) next.content = node.content.map(walk)
    return next
  }

  return { type: 'doc', content: (doc?.content ?? []).map(walk) }
}

/** 言語ごとの本文をまとめて保存用に整える */
export function prepareBodyForSave(body: LocalizedDoc): LocalizedDoc {
  return Object.fromEntries(
    Object.entries(body)
      .filter(([, doc]) => doc && !isEmptyDoc(doc))
      .map(([locale, doc]) => [locale, prepareDocForSave(doc)]),
  )
}
