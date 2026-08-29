import { DEFAULT_LOCALE, getLocaleMeta, type Locale } from './index'

/**
 * コンテンツ（CMS）側の多言語テキスト。
 * microCMS では title_ja / title_furigana / title_en のように言語ごとの
 * フィールドを持たせ、取得層でこの形に詰め替える。
 */
export type LocalizedField = Partial<Record<Locale, string>>

export type FallbackKind =
  /** 要求した言語の翻訳が無く、日本語を出している */
  | 'translation'
  /** 同じ言語だがルビ版が無い（ふりがな版でふりがな未入力） */
  | 'ruby'
  | null

export type ResolvedText = {
  text: string
  /** 実際に表示している言語 */
  locale: Locale
  /** フォールバックの理由。null ならそのまま表示できている */
  fallback: FallbackKind
}

const isBlank = (value: string | undefined): boolean => !value || value.trim() === ''

/**
 * 表示言語のテキストを取り出す。無ければ日本語へフォールバックする。
 *
 * フォールバックの理由を2種類に分けているのは、UIでの見せ方が違うため。
 *  - translation … 英語版が無い等。「この項目は日本語のみです」と明示する
 *  - ruby        … ふりがな版が無いだけで、中身は同じ日本語。断り書きは出さない
 */
export function resolveText(field: LocalizedField | undefined, locale: Locale): ResolvedText {
  const requested = field?.[locale]
  if (!isBlank(requested)) {
    return { text: requested!, locale, fallback: null }
  }

  const fallbackText = field?.[DEFAULT_LOCALE] ?? ''
  const sameLanguage = getLocaleMeta(locale).htmlLang === getLocaleMeta(DEFAULT_LOCALE).htmlLang

  return {
    text: fallbackText,
    locale: DEFAULT_LOCALE,
    // 中身が空なら、そもそも出すものが無いのでフォールバック表示もしない
    fallback: isBlank(fallbackText) ? null : sameLanguage ? 'ruby' : 'translation',
  }
}

/** 断り書き（「この項目は日本語のみです」）を出すべきか */
export function needsFallbackNotice(resolved: ResolvedText): boolean {
  return resolved.fallback === 'translation'
}
