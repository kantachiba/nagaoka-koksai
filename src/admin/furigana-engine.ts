import { tokensToRuby, type Token } from '../lib/furigana'
import { FURIGANA_DICT_URL } from '../config/site'

/**
 * ふりがなの自動生成。
 *
 * 形態素解析（kuromoji）で読みを取り、src/lib/furigana.ts でルビ記法に組み立てる。
 * 辞書が約17MBあるので、**ボタンが押されたときに初めて**読み込む。
 * 一度読み込めば同じタブ内では使い回す。
 *
 * ⚠️ 自動生成はあくまで下書き。人名・地名・固有名詞は外しやすいので、
 *    生成後に人が直せることを前提にしている。
 */

type Tokenizer = { tokenize: (text: string) => Token[] }

let tokenizerPromise: Promise<Tokenizer> | null = null

/** 辞書の読み込み状況を画面に出すための通知 */
export type LoadState = 'idle' | 'loading' | 'ready' | 'failed'

async function loadTokenizer(): Promise<Tokenizer> {
  // 辞書は重いので、この時点まで読み込みを遅らせる
  const kuromoji = (await import('@sglkc/kuromoji')).default

  return new Promise<Tokenizer>((resolve, reject) => {
    kuromoji
      .builder({ dicPath: FURIGANA_DICT_URL })
      .build((error: Error | null, tokenizer: Tokenizer) => {
        if (error) reject(error)
        else resolve(tokenizer)
      })
  })
}

/** 辞書がすでに読み込まれているか（ボタンの文言を変えるため） */
export const isReady = (): boolean => tokenizerPromise !== null

/**
 * 日本語の文にふりがなを振る。
 * 既にルビ記法が含まれている場合も、いったん外してから振り直す。
 */
export async function generateFurigana(japanese: string): Promise<string> {
  const text = japanese.trim()
  if (!text) return ''

  tokenizerPromise ??= loadTokenizer()
  const tokenizer = await tokenizerPromise

  // 既存のルビ記法を外してから解析する（二重に振らないため）
  const plain = text.replace(/\{([^{}|]+)\|[^{}|]+\}/g, '$1')
  return tokensToRuby(tokenizer.tokenize(plain))
}

/**
 * 本文（ブロック）全体にふりがなを振る。
 *
 * 構造はそのままに、テキストノードだけを置き換える。
 * 見出し・リスト・引用の中身にも同じように振られる。
 */
export async function generateFuriganaDoc<T>(doc: T): Promise<T> {
  const walk = async (node: unknown): Promise<unknown> => {
    if (Array.isArray(node)) return Promise.all(node.map(walk))
    if (!node || typeof node !== 'object') return node

    const record = node as Record<string, unknown>
    const next: Record<string, unknown> = { ...record }

    if (record.type === 'text' && typeof record.text === 'string') {
      next.text = await generateFurigana(record.text)
    }
    if (Array.isArray(record.content)) {
      next.content = await walk(record.content)
    }
    // 画像のキャプションにも振る
    if (record.attrs && typeof record.attrs === 'object') {
      const attrs = record.attrs as Record<string, unknown>
      if (typeof attrs.caption === 'string' && attrs.caption.trim()) {
        next.attrs = { ...attrs, caption: await generateFurigana(attrs.caption) }
      }
    }
    return next
  }

  return (await walk(doc)) as T
}
