import { DEFAULT_LOCALE, type Locale } from './index'

/**
 * コンテンツ（CMS）側の多言語テキスト。
 * Firestore では { ja: '…', en: '…' } のマップで保持している。
 */
export type LocalizedField = Partial<Record<Locale, string>>

export type ResolvedText = {
  text: string
  /** 実際に表示している言語 */
  locale: Locale
  /** 要求した言語の訳が無く、日本語で表示しているか */
  isFallback: boolean
}

const isBlank = (value: string | undefined): boolean => !value || value.trim() === ''

/**
 * 表示言語のテキストを取り出す。無ければ日本語へフォールバックする。
 * フォールバックしたことは UI 側で明示する（仕様 A-1）。
 */
export function resolveText(field: LocalizedField | undefined, locale: Locale): ResolvedText {
  const requested = field?.[locale]
  if (!isBlank(requested)) {
    return { text: requested!, locale, isFallback: false }
  }

  const fallbackText = field?.[DEFAULT_LOCALE] ?? ''
  return {
    text: fallbackText,
    locale: DEFAULT_LOCALE,
    // 中身が空なら、そもそも出すものが無いので断り書きも出さない
    isFallback: !isBlank(fallbackText) && locale !== DEFAULT_LOCALE,
  }
}

/** 断り書き（「この項目は日本語のみです」）を出すべきか */
export const needsFallbackNotice = (resolved: ResolvedText): boolean => resolved.isFallback
