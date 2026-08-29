/** 対応言語コード。`easy` = やさしい日本語 */
export const LANGUAGES = ['ja', 'en', 'easy'] as const

export type Lang = (typeof LANGUAGES)[number]

/** 3言語ぶんのテキストを持つ多言語文字列 */
export type LocalizedText = {
  ja: string
  en: string
  easy: string
}

/** 言語切替UIに表示するラベル（それぞれの言語自身で表記する） */
export const LANGUAGE_LABELS: Record<Lang, { short: string; full: string; htmlLang: string }> = {
  ja: { short: '日本語', full: '日本語', htmlLang: 'ja' },
  en: { short: 'EN', full: 'English', htmlLang: 'en' },
  easy: { short: 'やさしい', full: 'やさしい にほんご', htmlLang: 'ja' },
}

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value)
}
